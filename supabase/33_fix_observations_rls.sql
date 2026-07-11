-- 33_fix_observations_rls.sql
-- Memperbaiki masalah RLS dimana Guru/Wali Kelas tidak bisa membaca data observasi orang tua
-- dan Orang Tua tidak bisa membaca data observasi guru,
-- yang menyebabkan sistem mengira data observasi belum diisi (karena query SELECT mengembalikan kosong).

DROP POLICY IF EXISTS "Admins and Teachers can view parent_observations" ON public.parent_observations;
CREATE POLICY "Anyone can view parent_observations" 
ON public.parent_observations FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins and Parents can view teacher_observations" ON public.teacher_observations;
CREATE POLICY "Anyone can view teacher_observations" 
ON public.teacher_observations FOR SELECT TO authenticated USING (true);
