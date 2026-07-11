-- Eksekusi di SQL Editor Supabase

CREATE TABLE IF NOT EXISTS public.talent_assessments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE UNIQUE NOT NULL,
  academic_score numeric DEFAULT 0 CHECK (academic_score >= 0 AND academic_score <= 100),
  achievement_score numeric DEFAULT 0 CHECK (achievement_score >= 0 AND achievement_score <= 100),
  character_score numeric DEFAULT 0 CHECK (character_score >= 0 AND character_score <= 100),
  assessment_score numeric DEFAULT 0 CHECK (assessment_score >= 0 AND assessment_score <= 100),
  organization_score numeric DEFAULT 0 CHECK (organization_score >= 0 AND organization_score <= 100),
  final_score numeric DEFAULT 0,
  talent_domain varchar(50) NOT NULL,
  talent_specific_type varchar(200),
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE public.talent_assessments ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.talent_assessments TO authenticated;
GRANT SELECT ON TABLE public.talent_assessments TO anon;

CREATE POLICY "Authenticated users can view talent_assessments" ON public.talent_assessments
  FOR SELECT TO authenticated USING (true);

-- Hanya Admin atau Guru (nantinya bisa disesuaikan, saat ini disamakan dengan Admin / is_admin)
CREATE POLICY "Admins can insert talent_assessments" ON public.talent_assessments
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update talent_assessments" ON public.talent_assessments
  FOR UPDATE TO authenticated USING (public.is_admin());

CREATE POLICY "Admins can delete talent_assessments" ON public.talent_assessments
  FOR DELETE TO authenticated USING (public.is_admin());

-- ==========================================
-- TRIGGERS
-- ==========================================

-- Trigger update waktu
DROP TRIGGER IF EXISTS set_talent_assessments_updated_at ON public.talent_assessments;
CREATE TRIGGER set_talent_assessments_updated_at
  BEFORE UPDATE ON public.talent_assessments
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();

-- Trigger kalkulasi Final Score otomatis
CREATE OR REPLACE FUNCTION public.calculate_final_talent_score()
RETURNS TRIGGER AS $$
BEGIN
  -- Formula: Akademik 35%, Prestasi 25%, Karakter 20%, Asesmen 15%, Organisasi 5%
  NEW.final_score = (NEW.academic_score * 0.35) + 
                    (NEW.achievement_score * 0.25) + 
                    (NEW.character_score * 0.20) + 
                    (NEW.assessment_score * 0.15) + 
                    (NEW.organization_score * 0.05);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_calculate_final_talent_score ON public.talent_assessments;
CREATE TRIGGER trigger_calculate_final_talent_score
  BEFORE INSERT OR UPDATE ON public.talent_assessments
  FOR EACH ROW
  EXECUTE PROCEDURE public.calculate_final_talent_score();
