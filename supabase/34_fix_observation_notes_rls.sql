-- 34_fix_observation_notes_rls.sql
-- Memperbaiki masalah RLS dimana Guru/Wali Kelas tidak bisa membaca catatan observasi orang tua
-- dan Orang Tua tidak bisa membaca catatan observasi guru.

DROP POLICY IF EXISTS "Admins can view all observation notes" ON public.observation_notes;
CREATE POLICY "Anyone can view all observation notes" 
ON public.observation_notes FOR SELECT TO authenticated USING (true);
