-- =====================================================
-- MIGRATION: Multi-Cabang Lomba & Perbaikan RLS Competitions
-- Jalankan file ini di Supabase Dashboard > SQL Editor
-- =====================================================

-- 1. Buat tabel competition_branches
CREATE TABLE IF NOT EXISTS public.competition_branches (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  competition_id uuid NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
  name text NOT NULL,
  category varchar(50) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Mengaktifkan RLS & Grant Privileges
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competition_branches ENABLE ROW LEVEL SECURITY;

-- Reset kebijakan RLS lama untuk competitions & competition_branches
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.competitions;
DROP POLICY IF EXISTS "Enable all access for admins and teachers" ON public.competitions;
DROP POLICY IF EXISTS "Enable write access for admins and teachers" ON public.competitions;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.competitions;

DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON public.competition_branches;
DROP POLICY IF EXISTS "Enable all access for admins and teachers" ON public.competition_branches;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.competition_branches;

-- Kebijakan RLS Baru untuk pengguna terautentikasi
CREATE POLICY "Enable all access for authenticated users" ON public.competitions
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all access for authenticated users" ON public.competition_branches
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Grant Privileges
GRANT ALL ON TABLE public.competitions TO authenticated, anon, service_role;
GRANT ALL ON TABLE public.competition_branches TO authenticated, anon, service_role;

-- 3. Trigger updated_at
DROP TRIGGER IF EXISTS update_competition_branches_updated_at ON public.competition_branches;
CREATE TRIGGER update_competition_branches_updated_at
  BEFORE UPDATE ON public.competition_branches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. Ubah kolom category di competitions menjadi nullable & tambah execution_date
ALTER TABLE public.competitions ALTER COLUMN category DROP NOT NULL;
ALTER TABLE public.competitions ADD COLUMN IF NOT EXISTS execution_date date;

-- 5. Tambah kolom branch_id di achievements & competition_interests
ALTER TABLE public.achievements ADD COLUMN IF NOT EXISTS branch_id uuid REFERENCES public.competition_branches(id) ON DELETE SET NULL;
ALTER TABLE public.competition_interests ADD COLUMN IF NOT EXISTS branch_id uuid REFERENCES public.competition_branches(id) ON DELETE CASCADE;
