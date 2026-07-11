import { AchievementCategory, AchievementLevel } from './achievement';

export interface Competition {
  id: string;
  name: string;
  organizer: string;
  level: AchievementLevel;
  category: AchievementCategory;
  year: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}
