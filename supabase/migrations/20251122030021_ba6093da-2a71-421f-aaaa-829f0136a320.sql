-- Drop old status check constraint
ALTER TABLE ai_reports DROP CONSTRAINT IF EXISTS ai_reports_status_check;

-- Update all existing status values to new workflow statuses
UPDATE ai_reports SET status = 'pending_intern' WHERE status = 'generated';
UPDATE ai_reports SET status = 'finalized' WHERE status = 'doctor_verified';
UPDATE ai_reports SET status = 'finalized' WHERE status = 'completed';

-- Add new status check constraint with correct workflow statuses
ALTER TABLE ai_reports ADD CONSTRAINT ai_reports_status_check 
  CHECK (status IN (
    'pending_intern', 
    'assigned_intern', 
    'intern_verified',
    'pending_doctor', 
    'assigned_doctor', 
    'finalized',
    'reopened',
    'rejected'
  ));