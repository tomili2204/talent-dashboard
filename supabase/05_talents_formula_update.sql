-- Eksekusi di SQL Editor Supabase untuk mengubah formula dan struktur kolom

ALTER TABLE public.talent_assessments 
  DROP COLUMN IF EXISTS achievement_score,
  DROP COLUMN IF EXISTS character_score,
  DROP COLUMN IF EXISTS assessment_score,
  DROP COLUMN IF EXISTS organization_score;

ALTER TABLE public.talent_assessments
  ADD COLUMN IF NOT EXISTS religion_score numeric DEFAULT 0 CHECK (religion_score >= 0 AND religion_score <= 100),
  ADD COLUMN IF NOT EXISTS leadership_score numeric DEFAULT 0 CHECK (leadership_score >= 0 AND leadership_score <= 100),
  ADD COLUMN IF NOT EXISTS arts_score numeric DEFAULT 0 CHECK (arts_score >= 0 AND arts_score <= 100),
  ADD COLUMN IF NOT EXISTS sports_score numeric DEFAULT 0 CHECK (sports_score >= 0 AND sports_score <= 100),
  ADD COLUMN IF NOT EXISTS technology_score numeric DEFAULT 0 CHECK (technology_score >= 0 AND technology_score <= 100);

-- Trigger kalkulasi Final Score otomatis (Bobot rata dibagi 6)
CREATE OR REPLACE FUNCTION public.calculate_final_talent_score()
RETURNS TRIGGER AS $$
BEGIN
  -- Formula: Akademik, Keagamaan, Kepemimpinan, Seni, Olahraga, Teknologi dibagi 6
  NEW.final_score = (
    COALESCE(NEW.academic_score, 0) + 
    COALESCE(NEW.religion_score, 0) + 
    COALESCE(NEW.leadership_score, 0) + 
    COALESCE(NEW.arts_score, 0) + 
    COALESCE(NEW.sports_score, 0) + 
    COALESCE(NEW.technology_score, 0)
  ) / 6.0;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
