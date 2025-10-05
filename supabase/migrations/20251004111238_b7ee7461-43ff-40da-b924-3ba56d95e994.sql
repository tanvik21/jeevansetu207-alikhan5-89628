-- Trigger type regeneration by adding helpful comments to existing tables
COMMENT ON TABLE public.profiles IS 'User profile information linked to auth.users';
COMMENT ON TABLE public.ai_chat_messages IS 'AI health assistant conversation history';
COMMENT ON TABLE public.health_records IS 'Patient health records and medical history';

-- Verify all tables have proper indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_user_id ON public.ai_chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_created_at ON public.ai_chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_health_records_user_id ON public.health_records(user_id);
CREATE INDEX IF NOT EXISTS idx_health_records_record_date ON public.health_records(record_date DESC);