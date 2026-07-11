-- Eksekusi di SQL Editor Supabase

-- 1. Buat tabel Teachers (Data Guru)
CREATE TABLE IF NOT EXISTS public.teachers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nik varchar(50) UNIQUE NOT NULL,
  full_name text NOT NULL,
  position varchar(100),
  phone varchar(20),
  email varchar(100),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Aktifkan RLS untuk tabel
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- Semua user yang login (authenticated) bisa melihat data guru
CREATE POLICY "Authenticated users can view teachers" ON public.teachers
  FOR SELECT TO authenticated USING (true);

-- Hanya Admin yang bisa menambah, mengubah, atau menghapus guru
CREATE POLICY "Admins can insert teachers" ON public.teachers
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update teachers" ON public.teachers
  FOR UPDATE TO authenticated USING (public.is_admin());

CREATE POLICY "Admins can delete teachers" ON public.teachers
  FOR DELETE TO authenticated USING (public.is_admin());

-- ==========================================
-- TRIGGER UNTUK UPDATE WAKTU
-- ==========================================

-- Trigger untuk tabel teachers
DROP TRIGGER IF EXISTS set_teachers_updated_at ON public.teachers;
CREATE TRIGGER set_teachers_updated_at
  BEFORE UPDATE ON public.teachers
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();
