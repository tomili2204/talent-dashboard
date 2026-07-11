-- Tabel Achievements (Prestasi)
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Akademik', 'Keagamaan', 'Kepemimpinan', 'Seni', 'Olahraga', 'Teknologi')),
    level TEXT NOT NULL CHECK (level IN ('Sekolah', 'Kecamatan', 'Kabupaten', 'Provinsi', 'Nasional', 'Internasional')),
    date DATE NOT NULL,
    description TEXT,
    certificate_url TEXT,
    status TEXT NOT NULL DEFAULT 'Menunggu Verifikasi' CHECK (status IN ('Menunggu Verifikasi', 'Diverifikasi', 'Ditolak')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger updated_at
CREATE TRIGGER handle_updated_at_achievements
    BEFORE UPDATE ON public.achievements
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

-- RLS untuk tabel achievements
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Semua authenticated user bisa melihat data prestasi
CREATE POLICY "Authenticated users can view achievements" 
  ON public.achievements FOR SELECT 
  TO authenticated USING (true);

-- Authenticated users bisa insert (baik Admin maupun Guru)
CREATE POLICY "Authenticated users can insert achievements" 
  ON public.achievements FOR INSERT 
  TO authenticated WITH CHECK (true);

-- Authenticated users bisa update (misal edit jika status masih Menunggu Verifikasi, atau Admin verifikasi)
CREATE POLICY "Authenticated users can update achievements" 
  ON public.achievements FOR UPDATE 
  TO authenticated USING (true);

-- Authenticated users bisa delete
CREATE POLICY "Authenticated users can delete achievements" 
  ON public.achievements FOR DELETE 
  TO authenticated USING (true);

-- Berikan akses dasar
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.achievements TO authenticated;
GRANT SELECT ON TABLE public.achievements TO anon;

-- SETUP STORAGE BUCKET 'certificates'
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- RLS untuk Storage certificates
-- 1. Semua bisa melihat sertifikat (public bucket juga biasanya open, tapi kita pastikan select open)
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'certificates' );

-- 2. Authenticated users bisa upload
CREATE POLICY "Authenticated users can upload certificates"
  ON storage.objects FOR INSERT
  TO authenticated WITH CHECK ( bucket_id = 'certificates' );

-- 3. Authenticated users bisa delete/update sertifikat (replace)
CREATE POLICY "Authenticated users can update certificates"
  ON storage.objects FOR UPDATE
  TO authenticated USING ( bucket_id = 'certificates' );

CREATE POLICY "Authenticated users can delete certificates"
  ON storage.objects FOR DELETE
  TO authenticated USING ( bucket_id = 'certificates' );
