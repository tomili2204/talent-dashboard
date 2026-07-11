-- Buka Supabase SQL Editor, Copy-Paste semua kode di bawah ini, lalu klik "Run"

-- 1. Berikan akses tabel ke user yang login (berjaga-jaga jika hilang)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.user_roles TO authenticated;

-- 2. Hapus SEMUA policy lama agar tidak ada aturan yang tumpang tindih
DROP POLICY IF EXISTS "Users can read own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can read all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;

-- 3. Pastikan fungsi is_admin aman (SECURITY DEFINER)
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

-- 4. Buat ulang policy dengan benar
-- Semua user boleh melihat role miliknya sendiri
CREATE POLICY "Users can read own role" 
ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = id);

-- Admin boleh melihat semua role
CREATE POLICY "Admins can read all roles" 
ON public.user_roles FOR SELECT TO authenticated USING (public.is_admin());

-- Admin boleh mengubah semua role
CREATE POLICY "Admins can update roles" 
ON public.user_roles FOR UPDATE TO authenticated USING (public.is_admin());

-- 5. KEMBALIKAN ROLE ANDA JADI ADMIN (Anti-gagal)
UPDATE public.user_roles 
SET role = 'Admin' 
WHERE id IN (
  SELECT id FROM auth.users WHERE email ILIKE 'admin@lpirt.sch.id'
);
