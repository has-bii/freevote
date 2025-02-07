ALTER TABLE public.sessions ALTER COLUMN session_start_at DROP NOT NULL;
ALTER TABLE public.sessions ALTER COLUMN session_end_at DROP NOT NULL;