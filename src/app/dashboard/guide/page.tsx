'use client';

import { useState } from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  GraduationCap, 
  Users, 
  ShieldAlert, 
  Trophy, 
  Lightbulb, 
  CheckCircle2, 
  AlertTriangle, 
  Key, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

type TabType = 'umum' | 'guru' | 'ortu' | 'admin' | 'keamanan';

export default function UserGuidePage() {
  const [activeTab, setActiveTab] = useState<TabType>('umum');

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-[#125B34]" />
            Panduan Penggunaan Sistem
          </h1>
          <p className="text-gray-500">
            Panduan lengkap untuk mengoptimalkan penggunaan Talent Dashboard LPI Roudlotut Tholibin.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-px">
        <button
          onClick={() => setActiveTab('umum')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-all ${
            activeTab === 'umum'
              ? 'border-[#125B34] text-[#125B34] bg-green-50/50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Users className="w-4 h-4" />
          Umum & Peran
        </button>
        <button
          onClick={() => setActiveTab('guru')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-all ${
            activeTab === 'guru'
              ? 'border-[#125B34] text-[#125B34] bg-green-50/50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          Panduan Guru
        </button>
        <button
          onClick={() => setActiveTab('ortu')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-all ${
            activeTab === 'ortu'
              ? 'border-[#125B34] text-[#125B34] bg-green-50/50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Users className="w-4 h-4" />
          Panduan Orang Tua
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-all ${
            activeTab === 'admin'
              ? 'border-[#125B34] text-[#125B34] bg-green-50/50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Panduan Admin
        </button>
        <button
          onClick={() => setActiveTab('keamanan')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 transition-all ${
            activeTab === 'keamanan'
              ? 'border-[#125B34] text-[#125B34] bg-green-50/50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Tips & Keamanan
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
        
        {/* TAB 1: UMUM & PERAN */}
        {activeTab === 'umum' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#125B34]" />
              Pembagian Hak Akses (Role Pengguna)
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Talent Dashboard adalah sistem pemantauan dan pengelolaan minat, bakat, serta prestasi siswa LPI Roudlotut Tholibin. Sistem ini membagi hak akses menjadi 3 peran utama dengan tugas masing-masing:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="p-5 rounded-xl border border-gray-100 bg-gray-50/50 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-700 font-bold">A</div>
                <h3 className="font-bold text-gray-900">1. Admin (Penuh)</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Mengelola data induk (Siswa, Guru, Kelas, Lomba), menyetujui pendaftaran akun Guru/Orang Tua, serta memverifikasi data prestasi siswa.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-gray-100 bg-gray-50/50 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-700 font-bold">G</div>
                <h3 className="font-bold text-gray-900">2. Guru / Wali Kelas</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Melihat profil siswa, mencatat skor observasi minat/bakat, menginput nilai prestasi kelas, serta memonitor perkembangan belajar anak didiknya.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-gray-100 bg-gray-50/50 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-700 font-bold">O</div>
                <h3 className="font-bold text-gray-900">3. Orang Tua / Wali</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Melihat grafik bakat anaknya, memantau program inkubasi yang diikuti anak, serta melaporkan prestasi yang dicapai anak di luar sekolah.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PANDUAN GURU */}
        {activeTab === 'guru' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#125B34]" />
              Panduan Guru & Wali Kelas
            </h2>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-50 text-[#125B34] flex items-center justify-center font-bold">1</span>
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900">Melakukan Observasi Talenta Siswa</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Masuk ke menu <b>Pemetaan Talenta &gt; Asesmen &amp; Ranking</b>. Klik nama siswa yang ingin diobservasi, lalu isi form catatan observasi perilaku atau kecenderungan bakat anak. Catatan ini akan diolah oleh sistem menjadi peta minat.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-50 text-[#125B34] flex items-center justify-center font-bold">2</span>
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900">Pencatatan Prestasi Kelas</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Jika siswa Anda memenangkan lomba di tingkat kelas/sekolah, silakan masuk ke menu <b>Daftar Prestasi &gt; Tambah Prestasi</b>. Isi data lomba dan unggah sertifikat jika ada. Prestasi yang diinput guru otomatis berstatus <b>Diverifikasi</b>.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-50 text-[#125B34] flex items-center justify-center font-bold">3</span>
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900">Memantau Program Inkubasi</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Guru yang ditugaskan sebagai mentor/pembina ekstrakurikuler dapat melihat daftar siswa binaannya di menu <b>Program Inkubasi &gt; Program Saya</b> untuk memberikan skor penilaian progres mingguan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PANDUAN ORANG TUA */}
        {activeTab === 'ortu' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#125B34]" />
              Panduan Orang Tua / Wali Murid
            </h2>

            <div className="space-y-4">
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-50 text-orange-700 flex items-center justify-center font-bold">1</span>
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900">Menghubungkan Akun dengan Anak</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Saat pendaftaran, Anda diwajibkan mengisi <b>NIS (Nomor Induk Siswa)</b> dan <b>Tanggal Lahir</b> anak Anda secara tepat. Akun Anda otomatis terhubung jika data tersebut cocok dengan database sekolah. Tunggu persetujuan dari Admin sebelum Anda dapat masuk ke dasbor.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-50 text-orange-700 flex items-center justify-center font-bold">2</span>
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900">Melihat Rekomendasi Karir Anak</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Pada menu <b>Talenta Anak</b>, Anda dapat melihat grafik radar yang menampilkan potensi bakat anak (misal: Linguistik, Logika, atau Kinestetik). Di bagian bawah grafik terdapat analisis AI rekomendasi jurusan sekolah/kuliah serta pekerjaan yang cocok untuk masa depannya.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-50 text-orange-700 flex items-center justify-center font-bold">3</span>
                <div className="space-y-1">
                  <h4 className="font-bold text-gray-900">Melaporkan Prestasi Luar Sekolah</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Jika anak berprestasi di luar lingkungan sekolah (contoh: Juara lomba mengaji tingkat desa/kecamatan), klik menu <b>Riwayat Prestasi Anak &gt; Laporkan Prestasi</b>. Isi form dan unggah foto piagam/sertifikat anak. Admin akan segera memverifikasi laporan tersebut.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PANDUAN ADMIN */}
        {activeTab === 'admin' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#125B34]" />
              Panduan Admin (Penuh)
            </h2>

            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#125B34]" />
                  Mengimpor Data Siswa Secara Massal (Bulk Import)
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed pl-6">
                  Masuk ke menu <b>Data Siswa &gt; Import Excel</b>. Unduh file template Excel yang disediakan terlebih dahulu. Masukkan data siswa baru di sana, pastikan kolom NIS dan Tanggal Lahir berformat teks standard (format tanggal lahir wajib: `YYYY-MM-DD` seperti `2012-05-24`). Unggah file tersebut, dan sistem akan memproses data ratusan siswa dalam beberapa detik.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#125B34]" />
                  Persetujuan Akun (Role Management)
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed pl-6">
                  Ketika guru atau orang tua mendaftar baru, status mereka tidak aktif secara langsung. Admin harus membuka menu <b>Role Management</b> (di bawah label <i>Sistem</i>). Cari akun yang berstatus "Mendaftar Sebagai", cek kelayakan datanya, lalu pada kolom Aksi ubah pilihan dropdown ke peran yang sesuai (misal: "Orang Tua" atau "Guru"), lalu sistem akan menyetujui akun tersebut.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#125B34]" />
                  Verifikasi Pengajuan Prestasi Orang Tua
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed pl-6">
                  Masuk ke menu <b>Daftar Prestasi</b>. Cari baris yang berstatus <b>"Menunggu Verifikasi"</b> (berwarna oranye). Klik untuk memeriksa detail deskripsi, keabsahan foto piagam, lalu klik tombol <b>Setujui</b> untuk memverifikasi atau <b>Tolak</b> jika datanya terbukti tidak valid.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: TIPS & KEAMANAN */}
        {activeTab === 'keamanan' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#125B34]" />
              Tips Kelancaran & Keamanan Sistem
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-green-50 border border-green-100 space-y-2">
                <div className="flex items-center gap-2 text-green-800 font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                  Best Practices (Tips Sukses)
                </div>
                <ul className="text-xs text-green-700 space-y-2 list-disc list-inside leading-relaxed">
                  <li>Gunakan browser modern Google Chrome, Edge, atau Safari versi terbaru untuk pengalaman visual terbaik.</li>
                  <li>Lakukan kompresi/pengecilan file gambar piagam penghargaan sebelum diunggah (maksimal 1 MB per gambar) agar hemat kuota database.</li>
                  <li>Manfaatkan kolom pencarian di setiap tabel data untuk mempercepat pencarian nama siswa atau NIS.</li>
                </ul>
              </div>

              <div className="p-5 rounded-xl bg-amber-50 border border-amber-100 space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-bold">
                  <AlertTriangle className="w-5 h-5" />
                  Peringatan Keamanan
                </div>
                <ul className="text-xs text-amber-700 space-y-2 list-disc list-inside leading-relaxed">
                  <li>Jangan pernah membagikan password login Anda kepada siapa pun, termasuk administrator sekolah.</li>
                  <li>Apabila database dalam kondisi jeda (akibat libur panjang), administrator sekolah cukup membuka dashboard Supabase lalu klik 'Restore Project'.</li>
                  <li>Pastikan NIS anak dirahasiakan, karena NIS digunakan sebagai kunci verifikasi ganda saat orang tua mendaftar.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
