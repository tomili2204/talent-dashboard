-- Eksekusi di SQL Editor Supabase

ALTER TABLE public.achievements
ADD COLUMN IF NOT EXISTS rank varchar(100);
