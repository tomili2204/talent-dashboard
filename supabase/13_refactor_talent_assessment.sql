-- 1. Tambahkan kategori 'Bahasa' ke tabel achievements
ALTER TABLE public.achievements DROP CONSTRAINT IF EXISTS achievements_category_check;
ALTER TABLE public.achievements ADD CONSTRAINT achievements_category_check 
  CHECK (category IN ('Akademik', 'Keagamaan', 'Kepemimpinan', 'Seni', 'Olahraga', 'Teknologi', 'Bahasa'));

-- 2. Buat tabel parent_student
CREATE TABLE IF NOT EXISTS public.parent_student (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(parent_id, student_id)
);

ALTER TABLE public.parent_student ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents can view their own connections" ON public.parent_student FOR SELECT TO authenticated USING (auth.uid() = parent_id);
CREATE POLICY "Admins can manage parent_student" ON public.parent_student TO authenticated USING (public.is_admin());

-- 3. Buat tabel talent_indicators
CREATE TABLE IF NOT EXISTS public.talent_indicators (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    domain VARCHAR(5) NOT NULL CHECK (domain IN ('AKD', 'BHS', 'THF', 'TEK', 'SNI', 'ORG', 'KPM')),
    role_type VARCHAR(20) NOT NULL CHECK (role_type IN ('Parent', 'Teacher')),
    indicator_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.talent_indicators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can view indicators" ON public.talent_indicators FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage indicators" ON public.talent_indicators TO authenticated USING (public.is_admin());

-- 4. Buat tabel parent_observations
CREATE TABLE IF NOT EXISTS public.parent_observations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    indicator_id UUID NOT NULL REFERENCES public.talent_indicators(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
    assessor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(student_id, indicator_id, assessor_id)
);

ALTER TABLE public.parent_observations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents can manage their observations" ON public.parent_observations TO authenticated USING (auth.uid() = assessor_id);
CREATE POLICY "Admins and Teachers can view parent_observations" ON public.parent_observations FOR SELECT TO authenticated USING (public.is_admin());

-- 5. Buat tabel teacher_observations
CREATE TABLE IF NOT EXISTS public.teacher_observations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    indicator_id UUID NOT NULL REFERENCES public.talent_indicators(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
    assessor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(student_id, indicator_id, assessor_id)
);

ALTER TABLE public.teacher_observations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers can manage their observations" ON public.teacher_observations TO authenticated USING (auth.uid() = assessor_id);
CREATE POLICY "Admins and Parents can view teacher_observations" ON public.teacher_observations FOR SELECT TO authenticated USING (public.is_admin());

-- 6. Buat tabel talent_scores
CREATE TABLE IF NOT EXISTS public.talent_scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    domain VARCHAR(5) NOT NULL CHECK (domain IN ('AKD', 'BHS', 'THF', 'TEK', 'SNI', 'ORG', 'KPM')),
    parent_score NUMERIC DEFAULT 0,
    teacher_score NUMERIC DEFAULT 0,
    achievement_score NUMERIC DEFAULT 0,
    final_score NUMERIC DEFAULT 0,
    explainable_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(student_id, domain)
);

ALTER TABLE public.talent_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view talent_scores" ON public.talent_scores FOR SELECT TO authenticated USING (true);
CREATE POLICY "System can manage talent_scores" ON public.talent_scores TO authenticated USING (true);

-- 7. Buat tabel talent_recommendations
CREATE TABLE IF NOT EXISTS public.talent_recommendations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE UNIQUE,
    primary_talent VARCHAR(50),
    secondary_talent VARCHAR(50),
    strengths TEXT[],
    development_areas TEXT[],
    recommended_programs TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.talent_recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view talent_recommendations" ON public.talent_recommendations FOR SELECT TO authenticated USING (true);
CREATE POLICY "System can manage talent_recommendations" ON public.talent_recommendations TO authenticated USING (true);

-- Kosongkan data talent_assessments lama
DELETE FROM public.talent_assessments;

-- Masukkan Data Master talent_indicators
INSERT INTO public.talent_indicators (domain, role_type, indicator_text) VALUES
('AKD', 'Parent', 'Anak suka membaca buku'),
('AKD', 'Parent', 'Anak suka berhitung'),
('AKD', 'Parent', 'Anak suka teka-teki logika'),
('AKD', 'Parent', 'Anak suka bertanya tentang berbagai hal'),
('AKD', 'Parent', 'Anak cepat memahami pelajaran'),
('AKD', 'Parent', 'Anak teliti saat mengerjakan tugas'),
('AKD', 'Parent', 'Anak memiliki rasa ingin tahu tinggi'),
('AKD', 'Teacher', 'Cepat memahami konsep'),
('AKD', 'Teacher', 'Aktif bertanya di kelas'),
('AKD', 'Teacher', 'Menunjukkan kemampuan analitis'),
('AKD', 'Teacher', 'Mampu menyelesaikan soal menantang'),
('AKD', 'Teacher', 'Nilai akademik konsisten baik'),

('BHS', 'Parent', 'Suka bercerita'),
('BHS', 'Parent', 'Mudah mengungkapkan pendapat'),
('BHS', 'Parent', 'Suka membaca cerita'),
('BHS', 'Parent', 'Menyukai Bahasa Inggris'),
('BHS', 'Parent', 'Senang berbicara di depan orang lain'),
('BHS', 'Teacher', 'Aktif berbicara di kelas'),
('BHS', 'Teacher', 'Menonjol dalam presentasi'),
('BHS', 'Teacher', 'Menunjukkan kemampuan public speaking'),
('BHS', 'Teacher', 'Menonjol dalam story telling'),
('BHS', 'Teacher', 'Menunjukkan kemampuan bahasa asing'),

('THF', 'Parent', 'Mudah menghafal'),
('THF', 'Parent', 'Senang mengaji'),
('THF', 'Parent', 'Senang mendengarkan kisah Islami'),
('THF', 'Parent', 'Memiliki kebiasaan ibadah yang baik'),
('THF', 'Parent', 'Tertarik pada kegiatan keagamaan'),
('THF', 'Teacher', 'Cepat menghafal Al-Quran'),
('THF', 'Teacher', 'Bacaan Al-Quran baik'),
('THF', 'Teacher', 'Aktif dalam kegiatan keagamaan'),
('THF', 'Teacher', 'Menunjukkan pemahaman materi agama'),
('THF', 'Teacher', 'Menjadi teladan dalam ibadah'),

('TEK', 'Parent', 'Suka LEGO atau balok konstruksi'),
('TEK', 'Parent', 'Suka merakit atau membongkar pasang benda'),
('TEK', 'Parent', 'Suka Coding/AI'),
('TEK', 'Parent', 'Suka Robotik'),
('TEK', 'Parent', 'Suka bermain komputer (bukan game)'),
('TEK', 'Parent', 'Familiar dengan aplikasi-aplikasi komputer'),
('TEK', 'Parent', 'Suka mencoba teknologi baru'),
('TEK', 'Parent', 'Suka menyelesaikan tantangan logika'),
('TEK', 'Teacher', 'Cepat memahami aplikasi baru'),
('TEK', 'Teacher', 'Menunjukkan kemampuan berpikir logis'),
('TEK', 'Teacher', 'Tertarik pada coding atau robotik'),
('TEK', 'Teacher', 'Kreatif menggunakan teknologi'),
('TEK', 'Teacher', 'Mampu menyelesaikan tugas berbasis komputer secara mandiri'),

('SNI', 'Parent', 'Suka menggambar'),
('SNI', 'Parent', 'Suka mewarnai'),
('SNI', 'Parent', 'Suka melukis'),
('SNI', 'Parent', 'Suka bernyanyi'),
('SNI', 'Parent', 'Suka menari'),
('SNI', 'Parent', 'Suka membuat kerajinan'),
('SNI', 'Parent', 'Memiliki imajinasi tinggi'),
('SNI', 'Teacher', 'Menunjukkan kreativitas tinggi'),
('SNI', 'Teacher', 'Menonjol dalam kegiatan seni'),
('SNI', 'Teacher', 'Menghasilkan karya unik'),
('SNI', 'Teacher', 'Memiliki ekspresi artistik yang baik'),

('ORG', 'Parent', 'Menyukai aktivitas fisik'),
('ORG', 'Parent', 'Menyukai olahraga'),
('ORG', 'Parent', 'Aktif bergerak'),
('ORG', 'Parent', 'Memiliki stamina baik'),
('ORG', 'Parent', 'Menyukai kompetisi olahraga'),
('ORG', 'Teacher', 'Menonjol pada pelajaran PJOK'),
('ORG', 'Teacher', 'Memiliki koordinasi gerak yang baik'),
('ORG', 'Teacher', 'Aktif dalam kegiatan olahraga'),
('ORG', 'Teacher', 'Menunjukkan bakat olahraga tertentu'),

('KPM', 'Parent', 'Percaya diri'),
('KPM', 'Parent', 'Sering memimpin teman'),
('KPM', 'Parent', 'Mudah bergaul'),
('KPM', 'Parent', 'Bertanggung jawab'),
('KPM', 'Parent', 'Suka membantu orang lain'),
('KPM', 'Parent', 'Berani mengambil keputusan'),
('KPM', 'Teacher', 'Menjadi penggerak kelompok'),
('KPM', 'Teacher', 'Berani menyampaikan pendapat'),
('KPM', 'Teacher', 'Menunjukkan tanggung jawab tinggi'),
('KPM', 'Teacher', 'Mampu bekerja sama dengan baik'),
('KPM', 'Teacher', 'Menjadi teladan bagi teman');
