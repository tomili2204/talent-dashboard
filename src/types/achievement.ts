export type AchievementCategory = 'Akademik' | 'Keagamaan' | 'Kepemimpinan' | 'Seni' | 'Olahraga' | 'Teknologi' | 'Bahasa';
export type AchievementLevel = 'Sekolah' | 'Kecamatan' | 'Kabupaten' | 'Provinsi' | 'Nasional' | 'Internasional';
export type AchievementStatus = 'Menunggu Verifikasi' | 'Diverifikasi' | 'Ditolak';

export interface Achievement {
  id: string;
  student_id: string;
  title: string;
  category: AchievementCategory;
  level: AchievementLevel;
  date: string;
  description: string | null;
  certificate_url: string | null;
  status: AchievementStatus;
  rank: string | null;
  competition_id: string | null;
  teacher_id: string | null;
  external_mentor: string | null;
  created_at: string;
  updated_at: string;
  // relations
  student?: {
    full_name: string;
    nis: string;
    class_id: string;
    class?: {
      name: string;
    };
  };
  teacher?: {
    full_name: string;
  };
}

export const ACHIEVEMENT_CATEGORIES: AchievementCategory[] = [
  'Akademik',
  'Bahasa',
  'Keagamaan',
  'Kepemimpinan',
  'Seni',
  'Olahraga',
  'Teknologi'
];

export const ACHIEVEMENT_LEVELS: AchievementLevel[] = [
  'Sekolah',
  'Kecamatan',
  'Kabupaten',
  'Provinsi',
  'Nasional',
  'Internasional'
];

export const ACHIEVEMENT_RANKS: string[] = [
  'Juara 1',
  'Juara 2',
  'Juara 3',
  'Juara Harapan 1',
  'Juara Harapan 2',
  'Juara Harapan 3',
  'Gold Medals/Award',
  'Silver Medals/Award',
  'Bronze Medals/Award',
  'Peserta'
];
