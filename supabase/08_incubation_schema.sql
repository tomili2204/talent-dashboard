-- Eksekusi di SQL Editor Supabase

-- 1. Buat tabel Incubation Programs
CREATE TABLE IF NOT EXISTS public.incubation_programs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name varchar(255) NOT NULL,
  description text,
  target_domain varchar(50) NOT NULL,
  start_date date NOT NULL,
  end_date date,
  status varchar(50) DEFAULT 'Draft', -- Draft, Active, Completed
  mentor_id uuid REFERENCES public.teachers(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Buat tabel Incubation Participants
CREATE TABLE IF NOT EXISTS public.incubation_participants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id uuid REFERENCES public.incubation_programs(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  status varchar(50) DEFAULT 'Active', -- Active, Dropped, Graduated
  progress_score numeric DEFAULT 0 CHECK (progress_score >= 0 AND progress_score <= 100),
  evaluation_notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(program_id, student_id)
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE public.incubation_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incubation_participants ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.incubation_programs TO authenticated;
GRANT SELECT ON TABLE public.incubation_programs TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.incubation_participants TO authenticated;
GRANT SELECT ON TABLE public.incubation_participants TO anon;

-- Policies for programs
CREATE POLICY "Authenticated users can view incubation_programs" ON public.incubation_programs
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can insert incubation_programs" ON public.incubation_programs
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update incubation_programs" ON public.incubation_programs
  FOR UPDATE TO authenticated USING (public.is_admin());

CREATE POLICY "Admins can delete incubation_programs" ON public.incubation_programs
  FOR DELETE TO authenticated USING (public.is_admin());

-- Policies for participants
CREATE POLICY "Authenticated users can view incubation_participants" ON public.incubation_participants
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can insert incubation_participants" ON public.incubation_participants
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update incubation_participants" ON public.incubation_participants
  FOR UPDATE TO authenticated USING (public.is_admin());

CREATE POLICY "Admins can delete incubation_participants" ON public.incubation_participants
  FOR DELETE TO authenticated USING (public.is_admin());

-- ==========================================
-- TRIGGERS
-- ==========================================

-- Trigger updated_at untuk incubation_programs
CREATE TRIGGER handle_updated_at_incubation_programs
  BEFORE UPDATE ON public.incubation_programs
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();

-- Trigger updated_at untuk incubation_participants
CREATE TRIGGER handle_updated_at_incubation_participants
  BEFORE UPDATE ON public.incubation_participants
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();
