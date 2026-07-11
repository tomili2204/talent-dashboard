-- Berikan izin akses (Grant) ke peran authenticated, anon, dan service_role
GRANT ALL ON public.parent_student TO authenticated, anon, service_role;
GRANT ALL ON public.talent_indicators TO authenticated, anon, service_role;
GRANT ALL ON public.parent_observations TO authenticated, anon, service_role;
GRANT ALL ON public.teacher_observations TO authenticated, anon, service_role;
GRANT ALL ON public.talent_scores TO authenticated, anon, service_role;
GRANT ALL ON public.talent_recommendations TO authenticated, anon, service_role;

-- Pastikan RLS diaktifkan
ALTER TABLE public.talent_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talent_recommendations ENABLE ROW LEVEL SECURITY;

-- Pastikan Policy untuk membaca data (SELECT) tersedia
DROP POLICY IF EXISTS "Anyone can view talent_scores" ON public.talent_scores;
CREATE POLICY "Anyone can view talent_scores" ON public.talent_scores FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Anyone can view talent_recommendations" ON public.talent_recommendations;
CREATE POLICY "Anyone can view talent_recommendations" ON public.talent_recommendations FOR SELECT TO authenticated USING (true);
