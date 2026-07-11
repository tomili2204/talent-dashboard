-- 1. Pastikan tabel bisa diakses oleh authenticated
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.talent_assessments TO authenticated;
GRANT SELECT ON TABLE public.talent_assessments TO anon;

-- 2. Hapus RLS policy lama yang mungkin bermasalah dengan fungsi is_admin()
DROP POLICY IF EXISTS "Admins can insert talent_assessments" ON public.talent_assessments;
DROP POLICY IF EXISTS "Admins can update talent_assessments" ON public.talent_assessments;
DROP POLICY IF EXISTS "Admins can delete talent_assessments" ON public.talent_assessments;

-- 3. Buat RLS policy baru yang lebih longgar (authenticated users can insert/update)
CREATE POLICY "Admins can insert talent_assessments" ON public.talent_assessments
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admins can update talent_assessments" ON public.talent_assessments
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Admins can delete talent_assessments" ON public.talent_assessments
  FOR DELETE TO authenticated USING (true);
