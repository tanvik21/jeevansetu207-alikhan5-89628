-- Create enum for app roles (if not exists)
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'doctor', 'intern', 'patient');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create user_roles table for secure role management
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create ai_reports table
CREATE TABLE public.ai_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  symptoms TEXT NOT NULL,
  ai_prediction TEXT NOT NULL,
  confidence_score NUMERIC(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  documents TEXT[],
  status TEXT NOT NULL DEFAULT 'generated' CHECK (status IN ('generated', 'intern_verified', 'doctor_verified', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create intern_reviews table
CREATE TABLE public.intern_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES public.ai_reports(id) ON DELETE CASCADE NOT NULL,
  intern_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  notes TEXT,
  corrections TEXT,
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  forwarded_to_doctor BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create doctor_verifications table
CREATE TABLE public.doctor_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES public.ai_reports(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('approve', 'feedback', 'escalate')),
  feedback TEXT,
  verified_summary TEXT,
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.ai_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intern_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_verifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_reports
CREATE POLICY "Patients can view their own reports"
  ON public.ai_reports FOR SELECT
  USING (auth.uid() = patient_id);

CREATE POLICY "Patients can create their own reports"
  ON public.ai_reports FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Interns can view all reports"
  ON public.ai_reports FOR SELECT
  USING (public.has_role(auth.uid(), 'intern'));

CREATE POLICY "Doctors can view all reports"
  ON public.ai_reports FOR SELECT
  USING (public.has_role(auth.uid(), 'doctor'));

CREATE POLICY "Interns can update report status"
  ON public.ai_reports FOR UPDATE
  USING (public.has_role(auth.uid(), 'intern'));

CREATE POLICY "Doctors can update report status"
  ON public.ai_reports FOR UPDATE
  USING (public.has_role(auth.uid(), 'doctor'));

-- RLS Policies for intern_reviews
CREATE POLICY "Interns can create reviews"
  ON public.intern_reviews FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'intern') AND auth.uid() = intern_id);

CREATE POLICY "Interns can view their own reviews"
  ON public.intern_reviews FOR SELECT
  USING (auth.uid() = intern_id);

CREATE POLICY "Doctors can view all reviews"
  ON public.intern_reviews FOR SELECT
  USING (public.has_role(auth.uid(), 'doctor'));

CREATE POLICY "Patients can view reviews of their reports"
  ON public.intern_reviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.ai_reports
      WHERE ai_reports.id = intern_reviews.report_id
      AND ai_reports.patient_id = auth.uid()
    )
  );

-- RLS Policies for doctor_verifications
CREATE POLICY "Doctors can create verifications"
  ON public.doctor_verifications FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'doctor') AND auth.uid() = doctor_id);

CREATE POLICY "Doctors can view their own verifications"
  ON public.doctor_verifications FOR SELECT
  USING (auth.uid() = doctor_id);

CREATE POLICY "Patients can view verifications of their reports"
  ON public.doctor_verifications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.ai_reports
      WHERE ai_reports.id = doctor_verifications.report_id
      AND ai_reports.patient_id = auth.uid()
    )
  );

CREATE POLICY "Interns can view verifications"
  ON public.doctor_verifications FOR SELECT
  USING (public.has_role(auth.uid(), 'intern'));

-- Trigger to update ai_reports updated_at
CREATE TRIGGER update_ai_reports_updated_at
  BEFORE UPDATE ON public.ai_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Migrate existing roles from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, role::app_role FROM public.profiles
WHERE role IN ('admin', 'doctor', 'intern', 'patient')
ON CONFLICT (user_id, role) DO NOTHING;