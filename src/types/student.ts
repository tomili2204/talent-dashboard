import { ClassData } from './class';

export type StudentStatus = 'Aktif' | 'Lulus' | 'Pindah' | 'Keluar';
export type Gender = 'Laki-laki' | 'Perempuan';

export type Student = {
  id: string;
  nis: string | null;
  nisn: string | null;
  full_name: string;
  gender: Gender | null;
  date_of_birth: string | null;
  class_id: string | null;
  parent_name: string | null;
  parent_phone: string | null;
  address: string | null;
  status: StudentStatus;
  created_at?: string;
  updated_at?: string;
  classes?: ClassData | null; // For joined data
};

export type StudentHistory = {
  id: string;
  student_id: string;
  academic_year: string;
  event: string;
  description: string;
  created_at?: string;
};
