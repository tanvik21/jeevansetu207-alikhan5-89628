-- Add study_year field to profiles table for MBBS year tracking
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS study_year integer;