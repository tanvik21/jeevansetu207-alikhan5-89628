-- Add additional profile fields for all user types
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS specialty TEXT,
ADD COLUMN IF NOT EXISTS hospital TEXT,
ADD COLUMN IF NOT EXISTS years_experience INTEGER,
ADD COLUMN IF NOT EXISTS education TEXT[],
ADD COLUMN IF NOT EXISTS availability TEXT[],
ADD COLUMN IF NOT EXISTS free_community_hours INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS certifications TEXT[],
ADD COLUMN IF NOT EXISTS skills TEXT[],
ADD COLUMN IF NOT EXISTS learning_goals TEXT[],
ADD COLUMN IF NOT EXISTS supervisor_id UUID REFERENCES public.profiles(id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_supervisor ON public.profiles(supervisor_id);

-- Update RLS policies to allow users to update their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);