-- 1. Tambahkan kolom score ke tabel achievements (jika belum ada)
ALTER TABLE public.achievements ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0;

-- 2. Buat fungsi untuk mengkalkulasi ulang achievement_score di talent_scores menggunakan MAX(score)
CREATE OR REPLACE FUNCTION public.calculate_achievement_max_score()
RETURNS TRIGGER AS $$
DECLARE
    v_student_id UUID;
    v_ach_category TEXT;
    v_domain VARCHAR(5);
    v_max_score NUMERIC;
    
    curr_parent_score NUMERIC;
    curr_teacher_score NUMERIC;
    total_weight NUMERIC := 0;
    weighted_sum NUMERIC := 0;
BEGIN
    -- Tentukan student_id dan category prestasi
    IF TG_OP = 'DELETE' THEN
        v_student_id := OLD.student_id;
        v_ach_category := OLD.category;
    ELSE
        v_student_id := NEW.student_id;
        v_ach_category := NEW.category;
    END IF;

    -- Mapping category prestasi ke domain talent_scores
    CASE v_ach_category
        WHEN 'Akademik' THEN v_domain := 'AKD';
        WHEN 'Bahasa' THEN v_domain := 'BHS';
        WHEN 'Keagamaan' THEN v_domain := 'THF';
        WHEN 'Kepemimpinan' THEN v_domain := 'KPM';
        WHEN 'Seni' THEN v_domain := 'SNI';
        WHEN 'Olahraga' THEN v_domain := 'ORG';
        WHEN 'Teknologi' THEN v_domain := 'TEK';
        ELSE v_domain := 'AKD'; -- Fallback
    END CASE;

    -- Ambil nilai MAX(score) dari prestasi siswa di kategori ini yang statusnya Diverifikasi
    SELECT COALESCE(MAX(score), 0) INTO v_max_score
    FROM public.achievements
    WHERE student_id = v_student_id AND category = v_ach_category AND status = 'Diverifikasi';

    -- Upsert ke talent_scores
    INSERT INTO public.talent_scores (student_id, domain, achievement_score)
    VALUES (v_student_id, v_domain, v_max_score)
    ON CONFLICT (student_id, domain)
    DO UPDATE SET achievement_score = EXCLUDED.achievement_score, updated_at = timezone('utc'::text, now());

    -- Dapatkan nilai terbaru dari talent_scores untuk dikalkulasi finalnya
    SELECT COALESCE(parent_score, 0), COALESCE(teacher_score, 0)
    INTO curr_parent_score, curr_teacher_score
    FROM public.talent_scores
    WHERE student_id = v_student_id AND domain = v_domain;
    
    IF curr_parent_score > 0 THEN
        weighted_sum := weighted_sum + (curr_parent_score * 0.4);
        total_weight := total_weight + 0.4;
    END IF;
    
    IF curr_teacher_score > 0 THEN
        weighted_sum := weighted_sum + (curr_teacher_score * 0.4);
        total_weight := total_weight + 0.4;
    END IF;
    
    IF v_max_score > 0 THEN
        weighted_sum := weighted_sum + (v_max_score * 0.2);
        total_weight := total_weight + 0.2;
    END IF;

    IF total_weight > 0 THEN
        UPDATE public.talent_scores
        SET final_score = weighted_sum / total_weight
        WHERE student_id = v_student_id AND domain = v_domain;
    ELSE
        UPDATE public.talent_scores
        SET final_score = 0
        WHERE student_id = v_student_id AND domain = v_domain;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Buat trigger di tabel achievements
DROP TRIGGER IF EXISTS trigger_calc_achievement_max_score ON public.achievements;
CREATE TRIGGER trigger_calc_achievement_max_score
AFTER INSERT OR UPDATE OR DELETE ON public.achievements
FOR EACH ROW EXECUTE FUNCTION public.calculate_achievement_max_score();
