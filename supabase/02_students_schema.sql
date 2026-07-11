-- Eksekusi di SQL Editor Supabase

-- 1. Buat tabel Classes (Data Kelas)
CREATE TABLE IF NOT EXISTS public.classes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  homeroom_teacher_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Buat tabel Students (Data Siswa)
CREATE TABLE IF NOT EXISTS public.students (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nis varchar(50) UNIQUE,
  nisn varchar(50) UNIQUE,
  full_name text NOT NULL,
  gender varchar(15) CHECK (gender IN ('Laki-laki', 'Perempuan')),
  date_of_birth date,
  class_id uuid REFERENCES public.classes(id) ON DELETE SET NULL,
  parent_name text,
  parent_phone varchar(20),
  address text,
  status varchar(20) DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Lulus', 'Pindah', 'Keluar')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Buat tabel Student Histories (Riwayat Siswa)
CREATE TABLE IF NOT EXISTS public.student_histories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  academic_year varchar(20) NOT NULL,
  event varchar(100) NOT NULL,
  description text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Aktifkan RLS untuk semua tabel
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_histories ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------
-- Policies untuk Classes
-- ------------------------------------------
-- Semua user yang login (authenticated) bisa melihat daftar kelas
CREATE POLICY "Authenticated users can view classes" ON public.classes
  FOR SELECT USING (auth.role() = 'authenticated');

-- Hanya Admin yang bisa menambah, mengubah, atau menghapus kelas
CREATE POLICY "Admins can insert classes" ON public.classes
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update classes" ON public.classes
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete classes" ON public.classes
  FOR DELETE USING (public.is_admin());

-- ------------------------------------------
-- Policies untuk Students
-- ------------------------------------------
-- Semua user yang login bisa melihat data siswa
CREATE POLICY "Authenticated users can view students" ON public.students
  FOR SELECT USING (auth.role() = 'authenticated');

-- Hanya Admin dan Role tertentu (misal Wali Kelas) yang bisa mengubah, 
-- namun untuk sementara kita batasi untuk Admin dulu demi keamanan dasar
CREATE POLICY "Admins can insert students" ON public.students
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update students" ON public.students
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete students" ON public.students
  FOR DELETE USING (public.is_admin());

-- ------------------------------------------
-- Policies untuk Student Histories
-- ------------------------------------------
CREATE POLICY "Authenticated users can view student histories" ON public.student_histories
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert student histories" ON public.student_histories
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update student histories" ON public.student_histories
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete student histories" ON public.student_histories
  FOR DELETE USING (public.is_admin());

-- ==========================================
-- FUNGSI & TRIGGER UNTUK UPDATE WAKTU
-- ==========================================

-- Fungsi untuk mengupdate kolom updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger untuk tabel classes
DROP TRIGGER IF EXISTS set_classes_updated_at ON public.classes;
CREATE TRIGGER set_classes_updated_at
  BEFORE UPDATE ON public.classes
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();

-- Trigger untuk tabel students
DROP TRIGGER IF EXISTS set_students_updated_at ON public.students;
CREATE TRIGGER set_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();
