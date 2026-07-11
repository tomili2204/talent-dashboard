-- Jalankan skrip ini di SQL Editor Supabase untuk memperbaiki hak akses (RLS) pada user_roles

-- 1. Pastikan fungsi is_admin sudah ada dan merupakan SECURITY DEFINER
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

-- 2. Hapus policy lama di user_roles yang menyebabkan error rekursi (infinite loop)
DROP POLICY IF EXISTS "Admins can read all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;

-- 3. Ganti dengan policy yang memanggil fungsi is_admin() (SECURITY DEFINER)
-- Ini mencegah error "permission denied" yang diakibatkan rekursi pembacaan tabel
CREATE POLICY "Admins can read all roles" 
ON public.user_roles FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "Admins can update roles" 
ON public.user_roles FOR UPDATE TO authenticated USING (public.is_admin());
