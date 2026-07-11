export interface Teacher {
  id: string;
  nik: string;
  full_name: string;
  position: string | null;
  phone: string | null;
  email: string | null;
  created_at?: string;
  updated_at?: string;
}
