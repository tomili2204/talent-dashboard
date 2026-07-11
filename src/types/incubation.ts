export type IncubationStatus = 'Draft' | 'Active' | 'Completed';
export type ParticipantStatus = 'Active' | 'Dropped' | 'Graduated';

export interface IncubationProgram {
  id: string;
  name: string;
  description: string | null;
  target_domain: string;
  start_date: string;
  end_date: string | null;
  status: IncubationStatus;
  mentor_id: string | null;
  created_at: string;
  updated_at: string;
  
  // Relations
  mentor?: {
    id: string;
    full_name: string;
  };
  _count?: {
    participants: number;
  };
}

export interface IncubationParticipant {
  id: string;
  program_id: string;
  student_id: string;
  status: ParticipantStatus;
  progress_score: number;
  evaluation_notes: string | null;
  created_at: string;
  updated_at: string;

  // Relations
  student?: {
    id: string;
    full_name: string;
    nis: string;
    classes?: {
      name: string;
    };
  };
}
