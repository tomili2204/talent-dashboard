-- Eksekusi di SQL Editor Supabase

ALTER TABLE public.achievements
ADD COLUMN IF NOT EXISTS competition_id uuid REFERENCES public.competitions(id) ON DELETE SET NULL;
