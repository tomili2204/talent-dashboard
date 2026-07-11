-- 1. Buat fungsi SECURITY DEFINER untuk mengecek role tanpa memicu RLS loop
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles WHERE id = auth.uid() AND role = 'Admin'
  );
$$;

-- 2. Hapus policy lama yang menyebabkan infinite recursion
DROP POLICY IF EXISTS "Admins can read all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;

-- 3. Buat policy baru menggunakan fungsi yang aman dari loop
CREATE POLICY "Admins can read all roles" ON public.user_roles
  FOR SELECT
  USING ( public.is_admin() );

CREATE POLICY "Admins can update roles" ON public.user_roles
  FOR UPDATE
  USING ( public.is_admin() );
