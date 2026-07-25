-- =====================================================
-- SEED DATA: Talent Indicators (Instrumen Observasi)
-- Jalankan SQL ini di Supabase Dashboard > SQL Editor
-- =====================================================

-- Bersihkan data lama (jika ada)
TRUNCATE TABLE talent_indicators CASCADE;

-- Insert 42 indikator (7 domain × 3 pertanyaan × 2 role)

-- === AKADEMIK (AKD) ===
INSERT INTO talent_indicators (domain, role_type, indicator_text) VALUES
('AKD', 'Parent', 'Anak sering menunjukkan rasa ingin tahu yang tinggi terhadap pelajaran di sekolah'),
('AKD', 'Parent', 'Anak senang membaca buku pengetahuan atau ensiklopedia di rumah'),
('AKD', 'Parent', 'Anak sering bertanya atau berdiskusi tentang topik akademik di luar jam sekolah'),
('AKD', 'Teacher', 'Siswa menunjukkan pemahaman yang mendalam terhadap materi pelajaran'),
('AKD', 'Teacher', 'Siswa aktif bertanya dan berdiskusi di kelas'),
('AKD', 'Teacher', 'Siswa mampu menyelesaikan tugas akademik dengan hasil di atas rata-rata');

-- === BAHASA DAN KOMUNIKASI (BHS) ===
INSERT INTO talent_indicators (domain, role_type, indicator_text) VALUES
('BHS', 'Parent', 'Anak senang bercerita, menulis, atau membuat karangan di rumah'),
('BHS', 'Parent', 'Anak mudah menghafal kosakata baru dalam bahasa asing'),
('BHS', 'Parent', 'Anak percaya diri saat berbicara di depan keluarga atau tamu'),
('BHS', 'Teacher', 'Siswa memiliki kemampuan berbicara dan presentasi yang baik di kelas'),
('BHS', 'Teacher', 'Siswa menunjukkan kemampuan menulis yang kreatif dan terstruktur'),
('BHS', 'Teacher', 'Siswa aktif dalam kegiatan debat, pidato, atau literasi');

-- === TAHFIDZ DAN KEAGAMAAN (THF) ===
INSERT INTO talent_indicators (domain, role_type, indicator_text) VALUES
('THF', 'Parent', 'Anak rajin mengaji dan menghafal Al-Quran di rumah'),
('THF', 'Parent', 'Anak menunjukkan minat belajar ilmu agama secara mandiri'),
('THF', 'Parent', 'Anak disiplin menjalankan ibadah harian (sholat, dzikir, doa)'),
('THF', 'Teacher', 'Siswa memiliki hafalan Al-Quran yang baik dan bertambah secara konsisten'),
('THF', 'Teacher', 'Siswa menunjukkan pemahaman yang baik dalam pelajaran agama Islam'),
('THF', 'Teacher', 'Siswa aktif dalam kegiatan keagamaan di sekolah (MTQ, khataman, dll)');

-- === TEKNOLOGI DIGITAL DAN KOMPUTASI (TEK) ===
INSERT INTO talent_indicators (domain, role_type, indicator_text) VALUES
('TEK', 'Parent', 'Anak senang bereksperimen dengan komputer, gadget, atau aplikasi'),
('TEK', 'Parent', 'Anak tertarik belajar coding, robotik, atau teknologi baru'),
('TEK', 'Parent', 'Anak sering membuat konten digital (video, desain, animasi)'),
('TEK', 'Teacher', 'Siswa cepat memahami konsep teknologi dan komputasi'),
('TEK', 'Teacher', 'Siswa menunjukkan kemampuan problem-solving menggunakan pendekatan logis'),
('TEK', 'Teacher', 'Siswa aktif dan menonjol dalam kegiatan TIK atau robotik di sekolah');

-- === SENI DAN KREATIVITAS (SNI) ===
INSERT INTO talent_indicators (domain, role_type, indicator_text) VALUES
('SNI', 'Parent', 'Anak senang menggambar, melukis, atau membuat kerajinan tangan'),
('SNI', 'Parent', 'Anak menunjukkan bakat dalam musik (bernyanyi, bermain alat musik)'),
('SNI', 'Parent', 'Anak memiliki imajinasi tinggi dan sering menciptakan karya kreatif'),
('SNI', 'Teacher', 'Siswa menunjukkan kemampuan seni visual atau pertunjukan yang menonjol'),
('SNI', 'Teacher', 'Siswa kreatif dalam menyelesaikan tugas dan proyek sekolah'),
('SNI', 'Teacher', 'Siswa aktif berpartisipasi dalam kegiatan seni dan budaya di sekolah');

-- === OLAHRAGA (ORG) ===
INSERT INTO talent_indicators (domain, role_type, indicator_text) VALUES
('ORG', 'Parent', 'Anak aktif berolahraga dan menyukai aktivitas fisik di luar sekolah'),
('ORG', 'Parent', 'Anak menunjukkan koordinasi tubuh dan ketangkasan yang baik'),
('ORG', 'Parent', 'Anak memiliki semangat kompetisi dan sportivitas yang tinggi'),
('ORG', 'Teacher', 'Siswa menunjukkan performa fisik dan ketahanan yang baik dalam olahraga'),
('ORG', 'Teacher', 'Siswa menonjol dalam salah satu cabang olahraga di sekolah'),
('ORG', 'Teacher', 'Siswa menunjukkan disiplin dan semangat tinggi dalam kegiatan olahraga');

-- === KEPEMIMPINAN DAN SOSIAL (KPM) ===
INSERT INTO talent_indicators (domain, role_type, indicator_text) VALUES
('KPM', 'Parent', 'Anak sering mengambil inisiatif dan memimpin aktivitas bersama teman-teman'),
('KPM', 'Parent', 'Anak menunjukkan empati dan kepedulian terhadap orang lain'),
('KPM', 'Parent', 'Anak mampu menyelesaikan konflik dan bekerja sama dalam kelompok'),
('KPM', 'Teacher', 'Siswa sering dipercaya menjadi ketua kelas atau koordinator kegiatan'),
('KPM', 'Teacher', 'Siswa mampu mengorganisir teman-teman dalam tugas kelompok'),
('KPM', 'Teacher', 'Siswa menunjukkan sikap tanggung jawab dan kepedulian sosial yang tinggi');

-- Verifikasi
SELECT domain, role_type, COUNT(*) as jumlah
FROM talent_indicators
GROUP BY domain, role_type
ORDER BY domain, role_type;
