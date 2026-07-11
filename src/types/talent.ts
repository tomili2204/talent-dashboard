import { Student } from "./student";

export const TALENT_DOMAINS = [
  'AKD', // Akademik
  'BHS', // Bahasa dan Komunikasi
  'THF', // Tahfidz dan Keagamaan
  'TEK', // Teknologi Digital dan Komputasi
  'SNI', // Seni dan Kreativitas
  'ORG', // Olahraga
  'KPM'  // Kepemimpinan dan Sosial
] as const;

export type TalentDomain = typeof TALENT_DOMAINS[number];

export const TALENT_DOMAIN_LABELS: Record<TalentDomain, string> = {
  AKD: 'Akademik',
  BHS: 'Bahasa dan Komunikasi',
  THF: 'Tahfidz dan Keagamaan',
  TEK: 'Teknologi Digital dan Komputasi',
  SNI: 'Seni dan Kreativitas',
  ORG: 'Olahraga',
  KPM: 'Kepemimpinan dan Sosial'
};

export const DOMAIN_TO_CATEGORY: Record<TalentDomain, string> = {
  AKD: 'Akademik',
  BHS: 'Bahasa',
  THF: 'Keagamaan',
  TEK: 'Teknologi',
  SNI: 'Seni',
  ORG: 'Olahraga',
  KPM: 'Kepemimpinan'
};


export interface TalentIndicator {
  id: string;
  domain: TalentDomain;
  role_type: 'Parent' | 'Teacher';
  indicator_text: string;
}

export interface ParentObservation {
  id: string;
  student_id: string;
  parent_id: string;
  indicator_id: string;
  score: number; // 1-5
  created_at?: string;
  updated_at?: string;
}

export interface TeacherObservation {
  id: string;
  student_id: string;
  teacher_id: string;
  indicator_id: string;
  score: number; // 1-5
  created_at?: string;
  updated_at?: string;
}

export interface TalentScore {
  student_id: string;
  domain: TalentDomain;
  parent_score: number;
  teacher_score: number;
  achievement_score: number;
  final_score: number;
  created_at?: string;
  updated_at?: string;
  
  student?: Student;
}

export interface TalentRecommendation {
  student_id: string;
  dominant_domain?: TalentDomain;
  secondary_domain?: TalentDomain | null;
  recommendation_text?: string;
  specializations?: string[];
  created_at?: string;
}

export interface ObservationNote {
  id: string;
  student_id: string;
  assessor_id: string;
  role_type: 'Parent' | 'Teacher';
  notes: string;
  created_at?: string;
}

