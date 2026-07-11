-- Jalankan skrip ini di SQL Editor Supabase untuk memperbaiki hak akses (RLS)

-- 1. Perbarui fungsi is_admin agar tidak case-sensitive ('Admin' atau 'admin' tetap valid)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles WHERE id = auth.uid() AND role ILIKE 'admin'
  );
$$;

-- 2. Hapus semua policy lama pada tabel classes agar tidak bentrok
DROP POLICY IF EXISTS "Authenticated users can view classes" ON public.classes;
DROP POLICY IF EXISTS "Admins can insert classes" ON public.classes;
DROP POLICY IF EXISTS "Admins can update classes" ON public.classes;
DROP POLICY IF EXISTS "Admins can delete classes" ON public.classes;

-- 3. Buat policy baru yang lebih stabil
-- Izinkan semua user yang login untuk membaca (SELECT)
CREATE POLICY "Enable read access for all authenticated users" 
ON public.classes FOR SELECT TO authenticated USING (true);

-- Izinkan Admin untuk menambah, mengubah, dan menghapus
CREATE POLICY "Admins can insert classes" 
ON public.classes FOR INSERT TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update classes" 
ON public.classes FOR UPDATE TO authenticated USING (public.is_admin());

CREATE POLICY "Admins can delete classes" 
ON public.classes FOR DELETE TO authenticated USING (public.is_admin());

-- (Opsional) Lakukan hal yang sama untuk tabel students
DROP POLICY IF EXISTS "Authenticated users can view students" ON public.students;
CREATE POLICY "Enable read access for all authenticated students" 
ON public.students FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins can insert students" ON public.students;
CREATE POLICY "Admins can insert students" 
ON public.students FOR INSERT TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update students" ON public.students;
CREATE POLICY "Admins can update students" 
ON public.students FOR UPDATE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete students" ON public.students;
CREATE POLICY "Admins can delete students" 
ON public.students FOR DELETE TO authenticated USING (public.is_admin());
