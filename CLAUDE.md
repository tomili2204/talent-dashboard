# CLAUDE.md — Talent Dashboard (LPI Roudlotut Tholibin)

> **File ini dibuat khusus agar AI assistant (Claude, Gemini, dll) langsung memahami konteks, struktur, dan spesifikasi proyek ini tanpa perlu eksplorasi manual.**

---

## 🏫 Tentang Proyek

**Talent Dashboard** adalah aplikasi web manajemen talenta siswa untuk **LPI Roudlotut Tholibin** (Lembaga Pendidikan Islam). Aplikasi ini membantu sekolah memantau, merekam, dan menganalisis prestasi akademik dan non-akademik siswa.

- **Database**: Supabase (PostgreSQL)
- **Bahasa UI**: Bahasa Indonesia sepenuhnya

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui (Radix UI) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage (untuk sertifikat) |
| Deployment | Vercel |
| Icons | lucide-react |

### Struktur Folder Utama
```
talent-dashboard/
├── src/
│   ├── app/
│   │   ├── dashboard/           ← Semua halaman dashboard
│   │   │   ├── layout.tsx       ← Layout utama (sidebar + header)
│   │   │   ├── page.tsx         ← Executive Dashboard
│   │   │   ├── achievements/    ← Manajemen Prestasi
│   │   │   ├── competitions/    ← Event & Lomba
│   │   │   ├── students/        ← Data Siswa
│   │   │   ├── teachers/        ← Data Guru
│   │   │   ├── classes/         ← Data Kelas
│   │   │   ├── talents/         ← Pemetaan Talenta
│   │   │   ├── incubation/      ← Program Inkubasi
│   │   │   ├── admin/users      ← Role Management
│   │   │   └── guide/           ← Panduan Penggunaan
│   │   └── login/               ← Halaman Login
│   ├── actions/                 ← Server Actions (Next.js)
│   ├── components/
│   │   ├── ui/                  ← shadcn/ui base components
│   │   ├── layout/              ← Sidebar (responsive)
│   │   ├── achievements/        ← Achievement dialog & forms
│   │   ├── competitions/        ← Competition dialog & forms
│   │   └── ...
│   ├── lib/
│   │   └── supabase/            ← Supabase client (server & browser)
│   └── types/                   ← TypeScript type definitions
```

---

## 👥 Role & Hak Akses

| Role | Akses |
|------|-------|
| **Admin** | Akses penuh semua fitur: data guru, siswa, kelas, event lomba, prestasi, talenta, inkubasi, role management |
| **Wali Kelas** | Manajemen Prestasi (Daftar Prestasi), Pemetaan Talenta |
| **Guru** | Manajemen Prestasi (Daftar Prestasi), Pemetaan Talenta |
| **Orang Tua** | Lihat profil anak, event lomba anak, talenta anak, riwayat prestasi anak, program inkubasi anak |
| **Siswa** | (belum diimplementasi) |

Role disimpan di tabel `user_roles` (Supabase Auth + custom roles).

---

## 📄 Halaman & Fitur

### 1. Executive Dashboard (`/dashboard`)
- Statistik ringkasan: total prestasi, siswa aktif, guru, event lomba
- Grafik tren prestasi per bulan
- Top 5 siswa berprestasi
- Top 5 guru pembimbing
- Ringkasan per kategori (Akademik, Olahraga, Seni, dll)

### 2. Event / Lomba (`/dashboard/competitions`)
Daftar semua event/lomba.

**Filter:**
- Pencarian (nama event / penyelenggara)
- Status: Semua / Akan Berlangsung / Sedang Berlangsung / Selesai
- Bulan (Januari–Desember, berdasarkan tanggal pelaksanaan)
- Tahun (auto dari data)
- Jenjang (Sekolah / Kecamatan / Kabupaten / Provinsi / Nasional / Internasional)
- Tombol "✕ Reset" untuk reset semua filter sekaligus

**Summary chips di atas daftar:** Akan Berlangsung, Sedang Berlangsung, Selesai, Total.

**Per item event:**
- Nama event, badge status, penyelenggara, jenjang, tahun
- Tanggal Pendaftaran: [dari] – [sampai] (biru)
- Tanggal Pelaksanaan: [tanggal] (oranye)
- Cabang lomba (badge hijau, misal: "Olimpiade Matematika (Akademik)")

**Logika Status:** Pakai `execution_date` utama, fallback ke `end_date`.

#### Form Tambah/Edit Lomba (`CompetitionDialog`)
- Nama Event, Penyelenggara, Jenjang/Tingkat, Tahun
- Tanggal Pendaftaran: dari … sampai … (opsional)
- Tanggal Pelaksanaan (opsional)
- Cabang Perlombaan: multiple, masing-masing punya Nama Cabang + Kategori

#### Detail Event (`/dashboard/competitions/[id]`)
- Info lengkap event + daftar cabang lomba
- Daftar Peserta / Prestasi dengan dua tombol terpisah:
  - **"+ Daftarkan Peserta"** (hijau): form simpel pilih Siswa + Cabang Lomba
  - **"+ Catat Juara"** (oranye): form lengkap dengan Peringkat + Upload Sertifikat

### 3. Data Siswa (`/dashboard/students`)
Tabel siswa. Di mobile, kolom NIS & L/P disembunyikan (`hidden sm:table-cell`).

Sub-halaman per siswa:
- `/students/[id]` — Profil + edit data siswa
- `/students/[id]/achievements` — Riwayat Prestasi siswa
- `/students/[id]/competitions` — Event lomba yang diikuti
- `/students/[id]/incubation` — Program inkubasi yang diikuti
- `/students/import` — Import massal dari CSV
- `/students/new` — Tambah siswa manual

### 4. Manajemen Prestasi

#### Dasbor Prestasi (`/dashboard/achievements`)
- Stat cards: Total, Terverifikasi, Menunggu, Ditolak
- Top 5 Siswa, Top 5 Guru Pembimbing, Breakdown per kategori

#### Daftar Prestasi (`/dashboard/achievements/records`)
Tabel dengan `overflow-x-auto`. Filter: Kelas, Kategori, Jenjang, Tahun, Status.

#### Form Catat Prestasi (`AchievementDialog`)
- Pilih Event Lomba dari data competitions ATAU input manual
- Pilih Cabang Lomba (dari branches event)
- Pilih Siswa (combobox search), Guru Pembimbing, atau Pembimbing Eksternal
- Kategori + Tingkat (1 kolom mobile, 2 kolom ≥ sm)
- Peringkat/Juara (lihat ACHIEVEMENT_RANKS di bawah)
- Tanggal, Upload Sertifikat (opsional), Status verifikasi

### 5. Pemetaan Talenta

#### Dasbor Talenta (`/dashboard/talents`)
- Stat cards: Total Diasesmen, Rata-rata Skor, Skor Tertinggi, Belum Diasesmen
- Top 5 Ranking, Talenta per Kelas, Breakdown per Domain

#### Asesmen & Ranking (`/dashboard/talents/assessments`)
Tabel semua siswa + skor talenta.

#### Detail Asesmen (`/dashboard/talents/assessments/[studentId]`)
- **Instrumen Observasi Orang Tua** (skor per indikator, role_type='Parent')
- **Instrumen Observasi Guru** (skor per indikator, role_type='Teacher')
- Radar chart hasil asesmen per domain

### 6. Data Guru (`/dashboard/teachers`)
- Daftar + form tambah/edit + detail guru

### 7. Data Kelas (`/dashboard/classes`)
- Daftar + form tambah/edit kelas

### 8. Program Inkubasi (`/dashboard/incubation`)
- Dasbor + Daftar Program + Detail Program

### 9. Role Management (`/dashboard/admin/users`)
- Hanya Admin — kelola role setiap user

### 10. Panduan Penggunaan (`/dashboard/guide`)
- Dokumentasi cara pakai per role

---

## 🗄️ Database Schema (Supabase / PostgreSQL)

```sql
students        (id, nis, full_name, gender, birth_date, class_id, status)
teachers        (id, nip, full_name, gender, subject, position)
classes         (id, name, level, year, homeroom_teacher_id)

competitions    (id, name, organizer, level, year, category,
                 start_date,       -- mulai pendaftaran
                 end_date,         -- tutup pendaftaran
                 execution_date)   -- tanggal lomba dilaksanakan

competition_branches  (id, competition_id, name, category)

achievements    (id, student_id, competition_id, branch_id,
                 title, category, level, rank, date,
                 description, certificate_url,
                 status,           -- 'Menunggu Verifikasi'|'Diverifikasi'|'Ditolak'
                 teacher_id, external_mentor)

interests       (id, student_id, competition_id, branch_id)
                -- keikutsertaan/pendaftaran peserta ke event

talent_indicators     (id, name, domain, description, role_type)
                      -- role_type: 'Parent' | 'Teacher'
parent_observations   (id, student_id, assessor_id, indicator_id, score)
teacher_observations  (id, student_id, assessor_id, indicator_id, score)
talent_scores         (id, student_id, domain, score)
talent_recommendations (id, student_id, recommendation)

parent_student  (parent_id, student_id)
user_roles      (id, role)

incubation_programs     (id, name, description, category, start_date, end_date, status)
incubation_participants (id, program_id, student_id, joined_at)
```

---

## 🎨 Desain & UI Guidelines

- **Warna Primer**: `#125B34` (hijau tua) — aksen, tombol utama, link aktif sidebar
- **Background App**: `#F8FAFC`
- **Komponen**: shadcn/ui
- **Responsif**:
  - Mobile: drawer sidebar geser (hamburger ☰ di top bar 56px)
  - Desktop (≥ lg): sidebar fixed `w-64`, header full
  - Dialog: `max-h-[90vh] overflow-y-auto`, `sm:max-w-[550px]`
  - Stat cards: `grid gap-4 sm:grid-cols-2 md:grid-cols-4`
  - Tabel: selalu bungkus dengan `overflow-x-auto`

---

## ⚙️ Cara Menjalankan Lokal

```bash
npm install
npm run dev       # dev server
npm run build     # production build
```

**`.env.local`:**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxx
```

---

## 📦 Konstanta Penting

```typescript
ACHIEVEMENT_CATEGORIES = ['Akademik', 'Bahasa', 'Keagamaan', 'Kepemimpinan', 'Seni', 'Olahraga', 'Teknologi']
ACHIEVEMENT_LEVELS     = ['Sekolah', 'Kecamatan', 'Kabupaten', 'Provinsi', 'Nasional', 'Internasional']
ACHIEVEMENT_RANKS      = ['Juara 1', 'Juara 2', 'Juara 3', 'Juara Harapan 1', 'Juara Harapan 2',
                           'Juara Harapan 3', 'Gold Medals/Award', 'Silver Medals/Award',
                           'Bronze Medals/Award', 'Peserta']
ACHIEVEMENT_STATUS     = ['Menunggu Verifikasi', 'Diverifikasi', 'Ditolak']
STUDENT_STATUS         = ['Aktif', 'Lulus', 'Keluar']
TALENT_DOMAINS         = ['Musikal', 'Kinestetik', 'Linguistik', 'Logis-Matematis',
                           'Spasial', 'Interpersonal', 'Intrapersonal', 'Naturalis']
USER_ROLES             = ['Admin', 'Guru', 'Wali Kelas', 'Orang Tua', 'Siswa']
```

---

## 🔑 Pola Kode

```typescript
// Server Actions — selalu gunakan ini untuk operasi database
'use server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Halaman — Server Component dengan dynamic rendering
export const dynamic = 'force-dynamic';
export default async function PageName() { ... }

// Form/Dialog — Client Component
'use client';

// shadcn Select di server component — wajib pakai key prop
<Select key={`filter-${value}`} defaultValue={value}>
```

---

## 🚧 Catatan Penting

1. **`competition_branches`** mungkin belum ada di DB lama — ada fallback graceful ke kolom `category`
2. **Kolom tanggal** di `competitions` (`start_date`, `end_date`, `execution_date`) mungkin belum ada di semua environment — gunakan optional chaining
3. **Semua teks UI dalam Bahasa Indonesia** — pertahankan konsistensi ini
4. **Sertifikat** disimpan di Supabase Storage bucket `certificates`
