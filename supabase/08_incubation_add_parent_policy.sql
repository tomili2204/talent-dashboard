-- Memberikan izin kepada Orang Tua (Pengguna terautentikasi) untuk melakukan pengajuan (insert) ke tabel incubation_participants
-- Silakan jalankan script ini di SQL Editor pada Supabase Dashboard Anda.

CREATE POLICY "Authenticated users can insert incubation_participants" 
ON public.incubation_participants
FOR INSERT TO authenticated 
WITH CHECK (true);
