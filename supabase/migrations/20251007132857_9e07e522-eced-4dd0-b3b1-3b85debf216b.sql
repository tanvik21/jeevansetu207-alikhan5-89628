-- Enable realtime for profiles table to sync name changes
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- Enable realtime for ai_reports table to sync new reports
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_reports;