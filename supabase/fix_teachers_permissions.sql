-- Buka Supabase SQL Editor, Copy-Paste semua kode di bawah ini, lalu klik "Run"

-- 1. Berikan akses tabel (table-level permissions) ke user yang login (authenticated)
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.teachers TO authenticated;
GRANT SELECT ON TABLE public.teachers TO anon;

-- 2. Pastikan RLS sudah benar (berjaga-jaga)
DROP POLICY IF EXISTS "Admins can insert teachers" ON public.teachers;
DROP POLICY IF EXISTS "Admins can update teachers" ON public.teachers;
DROP POLICY IF EXISTS "Admins can delete teachers" ON public.teachers;
DROP POLICY IF EXISTS "Authenticated users can view teachers" ON public.teachers;

CREATE POLICY "Authenticated users can view teachers" ON public.teachers
  FOR SELECT TO authenticated USING (true);

-- Karena role admin mungkin belum teraplikasi sempurna di DB lokal saat pengecekan awal,
-- kita pakai logika sederhana: user yang login boleh melakukan insert/update/delete.
-- Jika ingin sangat ketat: (public.is_admin())
CREATE POLICY "Admins can insert teachers" ON public.teachers
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update teachers" ON public.teachers
  FOR UPDATE TO authenticated USING (public.is_admin());

CREATE POLICY "Admins can delete teachers" ON public.teachers
  FOR DELETE TO authenticated USING (public.is_admin());
