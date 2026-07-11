-- Eksekusi di SQL Editor Supabase

ALTER TABLE public.achievements
ADD COLUMN IF NOT EXISTS teacher_id uuid REFERENCES public.teachers(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS external_mentor text;
