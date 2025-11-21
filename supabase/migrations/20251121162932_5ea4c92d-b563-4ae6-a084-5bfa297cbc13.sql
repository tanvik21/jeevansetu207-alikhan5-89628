-- Add new status values and audit logs table
-- Update ai_reports to support new workflow
ALTER TABLE ai_reports 
  ADD COLUMN IF NOT EXISTS assigned_intern_id uuid REFERENCES profiles(id),
  ADD COLUMN IF NOT EXISTS assigned_doctor_id uuid REFERENCES profiles(id),
  ADD COLUMN IF NOT EXISTS claimed_at timestamptz,
  ADD COLUMN IF NOT EXISTS claim_expires_at timestamptz;

-- Update status to use new values
-- Note: existing 'generated' maps to 'pending_intern', 'intern_verified' maps to 'pending_doctor'

-- Create case_audit_logs table
CREATE TABLE IF NOT EXISTS case_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES ai_reports(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id),
  action text NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_case_id ON case_audit_logs(case_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_reports_status ON ai_reports(status);
CREATE INDEX IF NOT EXISTS idx_ai_reports_assigned_intern ON ai_reports(assigned_intern_id) WHERE assigned_intern_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ai_reports_assigned_doctor ON ai_reports(assigned_doctor_id) WHERE assigned_doctor_id IS NOT NULL;

-- Update intern_reviews to include status
ALTER TABLE intern_reviews 
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft' CHECK (status IN ('draft', 'submitted'));

-- Update doctor_verifications to include prescription
ALTER TABLE doctor_verifications
  ADD COLUMN IF NOT EXISTS prescription text,
  ADD COLUMN IF NOT EXISTS final_conclusion text;

-- Enable RLS on case_audit_logs
ALTER TABLE case_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for case_audit_logs
CREATE POLICY "Users can view audit logs for their cases"
  ON case_audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM ai_reports
      WHERE ai_reports.id = case_audit_logs.case_id
      AND (
        ai_reports.patient_id = auth.uid()
        OR ai_reports.assigned_intern_id = auth.uid()
        OR ai_reports.assigned_doctor_id = auth.uid()
        OR has_role(auth.uid(), 'admin'::app_role)
      )
    )
  );

CREATE POLICY "System can insert audit logs"
  ON case_audit_logs FOR INSERT
  WITH CHECK (true);

-- Atomic claim function for interns
CREATE OR REPLACE FUNCTION atomic_claim_case_intern(
  p_case_id uuid,
  p_intern_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_case RECORD;
  v_intern_name text;
BEGIN
  -- Lock the row for update
  SELECT * INTO v_case
  FROM ai_reports
  WHERE id = p_case_id
  FOR UPDATE NOWAIT;
  
  -- Check if case exists
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'case_not_found',
      'message', 'Case does not exist'
    );
  END IF;
  
  -- Check if already claimed
  IF v_case.status != 'pending_intern' AND v_case.status != 'generated' THEN
    -- Get current owner name
    SELECT full_name INTO v_intern_name
    FROM profiles
    WHERE id = v_case.assigned_intern_id;
    
    RETURN jsonb_build_object(
      'success', false,
      'error', 'already_claimed',
      'message', 'This case has already been claimed',
      'current_owner', jsonb_build_object(
        'id', v_case.assigned_intern_id,
        'name', v_intern_name,
        'claimed_at', v_case.claimed_at
      ),
      'current_status', v_case.status
    );
  END IF;
  
  -- Claim the case
  UPDATE ai_reports
  SET status = 'assigned_intern',
      assigned_intern_id = p_intern_id,
      claimed_at = now(),
      claim_expires_at = now() + interval '60 minutes',
      updated_at = now()
  WHERE id = p_case_id;
  
  -- Insert audit log
  INSERT INTO case_audit_logs (case_id, user_id, action, details)
  VALUES (
    p_case_id, 
    p_intern_id, 
    'claimed_by_intern',
    jsonb_build_object('timestamp', now())
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Case claimed successfully'
  );
EXCEPTION
  WHEN lock_not_available THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'lock_timeout',
      'message', 'Another user is claiming this case. Please try again.'
    );
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'unknown_error',
      'message', SQLERRM
    );
END;
$$;

-- Atomic claim function for doctors
CREATE OR REPLACE FUNCTION atomic_claim_case_doctor(
  p_case_id uuid,
  p_doctor_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_case RECORD;
  v_doctor_name text;
BEGIN
  -- Lock the row for update
  SELECT * INTO v_case
  FROM ai_reports
  WHERE id = p_case_id
  FOR UPDATE NOWAIT;
  
  -- Check if case exists
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'case_not_found',
      'message', 'Case does not exist'
    );
  END IF;
  
  -- Check if in correct status
  IF v_case.status != 'pending_doctor' AND v_case.status != 'intern_verified' THEN
    -- Get current owner name if assigned
    IF v_case.assigned_doctor_id IS NOT NULL THEN
      SELECT full_name INTO v_doctor_name
      FROM profiles
      WHERE id = v_case.assigned_doctor_id;
    END IF;
    
    RETURN jsonb_build_object(
      'success', false,
      'error', 'invalid_status',
      'message', 'Case is not available for doctor review',
      'current_owner', CASE 
        WHEN v_case.assigned_doctor_id IS NOT NULL THEN
          jsonb_build_object(
            'id', v_case.assigned_doctor_id,
            'name', v_doctor_name,
            'claimed_at', v_case.claimed_at
          )
        ELSE NULL
      END,
      'current_status', v_case.status
    );
  END IF;
  
  -- Claim the case
  UPDATE ai_reports
  SET status = 'assigned_doctor',
      assigned_doctor_id = p_doctor_id,
      claimed_at = now(),
      claim_expires_at = now() + interval '60 minutes',
      updated_at = now()
  WHERE id = p_case_id;
  
  -- Insert audit log
  INSERT INTO case_audit_logs (case_id, user_id, action, details)
  VALUES (
    p_case_id,
    p_doctor_id,
    'claimed_by_doctor',
    jsonb_build_object('timestamp', now())
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Case claimed successfully'
  );
EXCEPTION
  WHEN lock_not_available THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'lock_timeout',
      'message', 'Another user is claiming this case. Please try again.'
    );
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'unknown_error',
      'message', SQLERRM
    );
END;
$$;

-- Function to auto-release expired claims
CREATE OR REPLACE FUNCTION release_expired_claims()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Release expired intern claims
  UPDATE ai_reports
  SET status = 'pending_intern',
      assigned_intern_id = NULL,
      claimed_at = NULL,
      claim_expires_at = NULL
  WHERE status = 'assigned_intern'
    AND claim_expires_at < now();
  
  -- Release expired doctor claims
  UPDATE ai_reports
  SET status = 'pending_doctor',
      assigned_doctor_id = NULL,
      claimed_at = NULL,
      claim_expires_at = NULL
  WHERE status = 'assigned_doctor'
    AND claim_expires_at < now();
  
  -- Insert audit logs for released claims
  INSERT INTO case_audit_logs (case_id, action, details)
  SELECT id, 'claim_released', jsonb_build_object('reason', 'timeout', 'timestamp', now())
  FROM ai_reports
  WHERE (status = 'pending_intern' OR status = 'pending_doctor')
    AND updated_at = now();
END;
$$;

-- Update RLS policies for new statuses
DROP POLICY IF EXISTS "Interns can view all reports" ON ai_reports;
CREATE POLICY "Interns can view pending and assigned reports"
  ON ai_reports FOR SELECT
  USING (
    has_role(auth.uid(), 'intern'::app_role)
    AND status IN ('pending_intern', 'assigned_intern', 'intern_verified', 'pending_doctor')
  );

DROP POLICY IF EXISTS "Doctors can view all reports" ON ai_reports;
CREATE POLICY "Doctors can view pending doctor and finalized reports"
  ON ai_reports FOR SELECT
  USING (
    has_role(auth.uid(), 'doctor'::app_role)
    AND status IN ('pending_doctor', 'intern_verified', 'assigned_doctor', 'finalized')
  );

-- Allow interns to update only their assigned cases
DROP POLICY IF EXISTS "Interns can update report status" ON ai_reports;
CREATE POLICY "Interns can update their assigned cases"
  ON ai_reports FOR UPDATE
  USING (
    has_role(auth.uid(), 'intern'::app_role)
    AND assigned_intern_id = auth.uid()
  );

-- Allow doctors to update only their assigned cases
DROP POLICY IF EXISTS "Doctors can update report status" ON ai_reports;
CREATE POLICY "Doctors can update their assigned cases"
  ON ai_reports FOR UPDATE
  USING (
    has_role(auth.uid(), 'doctor'::app_role)
    AND assigned_doctor_id = auth.uid()
  );