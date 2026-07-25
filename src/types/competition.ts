import { AchievementCategory, AchievementLevel } from './achievement';

export interface CompetitionBranch {
  id?: string;
  competition_id?: string;
  name: string;
  category: AchievementCategory;
  created_at?: string;
  updated_at?: string;
}

export interface Competition {
  id: string;
  name: string;
  organizer: string;
  level: AchievementLevel;
  category?: AchievementCategory | null;
  year: string;
  start_date: string | null;
  end_date: string | null;
  execution_date?: string | null;
  created_at: string;
  updated_at: string;
  branches?: CompetitionBranch[];
}
