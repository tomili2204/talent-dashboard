import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lhlxteabiaffcbjvshja.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_NcgPfTYS1jr5LhMIOFkTUw_jFDEvbDk';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Data master indikator talenta
const INDICATORS = [
  // === AKADEMIK (AKD) ===
  // Parent
  { domain: 'AKD', role_type: 'Parent', indicator_text: 'Anak sering menunjukkan rasa ingin tahu yang tinggi terhadap pelajaran di sekolah' },
  { domain: 'AKD', role_type: 'Parent', indicator_text: 'Anak senang membaca buku pengetahuan atau ensiklopedia di rumah' },
  { domain: 'AKD', role_type: 'Parent', indicator_text: 'Anak sering bertanya atau berdiskusi tentang topik akademik di luar jam sekolah' },
  // Teacher
  { domain: 'AKD', role_type: 'Teacher', indicator_text: 'Siswa menunjukkan pemahaman yang mendalam terhadap materi pelajaran' },
  { domain: 'AKD', role_type: 'Teacher', indicator_text: 'Siswa aktif bertanya dan berdiskusi di kelas' },
  { domain: 'AKD', role_type: 'Teacher', indicator_text: 'Siswa mampu menyelesaikan tugas akademik dengan hasil di atas rata-rata' },

  // === BAHASA DAN KOMUNIKASI (BHS) ===
  // Parent
  { domain: 'BHS', role_type: 'Parent', indicator_text: 'Anak senang bercerita, menulis, atau membuat karangan di rumah' },
  { domain: 'BHS', role_type: 'Parent', indicator_text: 'Anak mudah menghafal kosakata baru dalam bahasa asing' },
  { domain: 'BHS', role_type: 'Parent', indicator_text: 'Anak percaya diri saat berbicara di depan keluarga atau tamu' },
  // Teacher
  { domain: 'BHS', role_type: 'Teacher', indicator_text: 'Siswa memiliki kemampuan berbicara dan presentasi yang baik di kelas' },
  { domain: 'BHS', role_type: 'Teacher', indicator_text: 'Siswa menunjukkan kemampuan menulis yang kreatif dan terstruktur' },
  { domain: 'BHS', role_type: 'Teacher', indicator_text: 'Siswa aktif dalam kegiatan debat, pidato, atau literasi' },

  // === TAHFIDZ DAN KEAGAMAAN (THF) ===
  // Parent
  { domain: 'THF', role_type: 'Parent', indicator_text: 'Anak rajin mengaji dan menghafal Al-Quran di rumah' },
  { domain: 'THF', role_type: 'Parent', indicator_text: 'Anak menunjukkan minat belajar ilmu agama secara mandiri' },
  { domain: 'THF', role_type: 'Parent', indicator_text: 'Anak disiplin menjalankan ibadah harian (sholat, dzikir, doa)' },
  // Teacher
  { domain: 'THF', role_type: 'Teacher', indicator_text: 'Siswa memiliki hafalan Al-Quran yang baik dan bertambah secara konsisten' },
  { domain: 'THF', role_type: 'Teacher', indicator_text: 'Siswa menunjukkan pemahaman yang baik dalam pelajaran agama Islam' },
  { domain: 'THF', role_type: 'Teacher', indicator_text: 'Siswa aktif dalam kegiatan keagamaan di sekolah (MTQ, khataman, dll)' },

  // === TEKNOLOGI DIGITAL DAN KOMPUTASI (TEK) ===
  // Parent
  { domain: 'TEK', role_type: 'Parent', indicator_text: 'Anak senang bereksperimen dengan komputer, gadget, atau aplikasi' },
  { domain: 'TEK', role_type: 'Parent', indicator_text: 'Anak tertarik belajar coding, robotik, atau teknologi baru' },
  { domain: 'TEK', role_type: 'Parent', indicator_text: 'Anak sering membuat konten digital (video, desain, animasi)' },
  // Teacher
  { domain: 'TEK', role_type: 'Teacher', indicator_text: 'Siswa cepat memahami konsep teknologi dan komputasi' },
  { domain: 'TEK', role_type: 'Teacher', indicator_text: 'Siswa menunjukkan kemampuan problem-solving menggunakan pendekatan logis' },
  { domain: 'TEK', role_type: 'Teacher', indicator_text: 'Siswa aktif dan menonjol dalam kegiatan TIK atau robotik di sekolah' },

  // === SENI DAN KREATIVITAS (SNI) ===
  // Parent
  { domain: 'SNI', role_type: 'Parent', indicator_text: 'Anak senang menggambar, melukis, atau membuat kerajinan tangan' },
  { domain: 'SNI', role_type: 'Parent', indicator_text: 'Anak menunjukkan bakat dalam musik (bernyanyi, bermain alat musik)' },
  { domain: 'SNI', role_type: 'Parent', indicator_text: 'Anak memiliki imajinasi tinggi dan sering menciptakan karya kreatif' },
  // Teacher
  { domain: 'SNI', role_type: 'Teacher', indicator_text: 'Siswa menunjukkan kemampuan seni visual atau pertunjukan yang menonjol' },
  { domain: 'SNI', role_type: 'Teacher', indicator_text: 'Siswa kreatif dalam menyelesaikan tugas dan proyek sekolah' },
  { domain: 'SNI', role_type: 'Teacher', indicator_text: 'Siswa aktif berpartisipasi dalam kegiatan seni dan budaya di sekolah' },

  // === OLAHRAGA (ORG) ===
  // Parent
  { domain: 'ORG', role_type: 'Parent', indicator_text: 'Anak aktif berolahraga dan menyukai aktivitas fisik di luar sekolah' },
  { domain: 'ORG', role_type: 'Parent', indicator_text: 'Anak menunjukkan koordinasi tubuh dan ketangkasan yang baik' },
  { domain: 'ORG', role_type: 'Parent', indicator_text: 'Anak memiliki semangat kompetisi dan sportivitas yang tinggi' },
  // Teacher
  { domain: 'ORG', role_type: 'Teacher', indicator_text: 'Siswa menunjukkan performa fisik dan ketahanan yang baik dalam olahraga' },
  { domain: 'ORG', role_type: 'Teacher', indicator_text: 'Siswa menonjol dalam salah satu cabang olahraga di sekolah' },
  { domain: 'ORG', role_type: 'Teacher', indicator_text: 'Siswa menunjukkan disiplin dan semangat tinggi dalam kegiatan olahraga' },

  // === KEPEMIMPINAN DAN SOSIAL (KPM) ===
  // Parent
  { domain: 'KPM', role_type: 'Parent', indicator_text: 'Anak sering mengambil inisiatif dan memimpin aktivitas bersama teman-teman' },
  { domain: 'KPM', role_type: 'Parent', indicator_text: 'Anak menunjukkan empati dan kepedulian terhadap orang lain' },
  { domain: 'KPM', role_type: 'Parent', indicator_text: 'Anak mampu menyelesaikan konflik dan bekerja sama dalam kelompok' },
  // Teacher
  { domain: 'KPM', role_type: 'Teacher', indicator_text: 'Siswa sering dipercaya menjadi ketua kelas atau koordinator kegiatan' },
  { domain: 'KPM', role_type: 'Teacher', indicator_text: 'Siswa mampu mengorganisir teman-teman dalam tugas kelompok' },
  { domain: 'KPM', role_type: 'Teacher', indicator_text: 'Siswa menunjukkan sikap tanggung jawab dan kepedulian sosial yang tinggi' },
];

async function main() {
  console.log('📋 Memasukkan data master Talent Indicators...\n');

  // Check existing data
  const { data: existing, error: checkErr } = await supabase
    .from('talent_indicators')
    .select('id')
    .limit(1);

  if (existing && existing.length > 0) {
    console.log('⚠️  Data indikator sudah ada. Menghapus data lama terlebih dahulu...');
    const { data: allIds } = await supabase.from('talent_indicators').select('id').limit(1000);
    if (allIds && allIds.length > 0) {
      await supabase.from('talent_indicators').delete().in('id', allIds.map(r => r.id));
      console.log(`  ✅ ${allIds.length} indikator lama dihapus`);
    }
  }

  // Insert new indicators
  const { data, error } = await supabase
    .from('talent_indicators')
    .insert(INDICATORS)
    .select();

  if (error) {
    console.log(`❌ Gagal: ${error.message}`);
    return;
  }

  console.log(`✅ ${data.length} indikator berhasil dimasukkan!\n`);

  // Summary
  const parentCount = INDICATORS.filter(i => i.role_type === 'Parent').length;
  const teacherCount = INDICATORS.filter(i => i.role_type === 'Teacher').length;
  const domains = [...new Set(INDICATORS.map(i => i.domain))];

  console.log('📊 Ringkasan:');
  console.log(`  • ${domains.length} domain talenta`);
  console.log(`  • ${parentCount} indikator Orang Tua`);
  console.log(`  • ${teacherCount} indikator Guru`);
  console.log(`  • Total: ${INDICATORS.length} indikator`);
}

main().catch(console.error);
