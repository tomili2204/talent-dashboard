-- Perbarui fungsi kalkulasi untuk menormalisasi final_score berdasarkan data yang sudah masuk
CREATE OR REPLACE FUNCTION public.calculate_domain_score()
RETURNS TRIGGER AS $$
DECLARE
    v_student_id UUID;
    v_indicator_id UUID;
    v_domain VARCHAR(5);
    v_role_type VARCHAR(20);
    v_total_score NUMERIC;
    v_max_possible_score NUMERIC;
    v_final_percentage NUMERIC;
    
    -- Variables for final calculation
    curr_parent_score NUMERIC;
    curr_teacher_score NUMERIC;
    curr_achievement_score NUMERIC;
    total_weight NUMERIC := 0;
    weighted_sum NUMERIC := 0;
BEGIN
    -- Tentukan baris mana yang diproses
    IF TG_OP = 'DELETE' THEN
        v_student_id := OLD.student_id;
        v_indicator_id := OLD.indicator_id;
    ELSE
        v_student_id := NEW.student_id;
        v_indicator_id := NEW.indicator_id;
    END IF;

    -- Dapatkan domain dari indikator
    SELECT domain, role_type INTO v_domain, v_role_type
    FROM public.talent_indicators
    WHERE id = v_indicator_id;

    -- Kalkulasi berdasarkan Role
    IF v_role_type = 'Parent' THEN
        SELECT COALESCE(SUM(po.score), 0), COUNT(po.score) * 5.0
        INTO v_total_score, v_max_possible_score
        FROM public.parent_observations po
        JOIN public.talent_indicators ti ON ti.id = po.indicator_id
        WHERE po.student_id = v_student_id AND ti.domain = v_domain AND ti.role_type = 'Parent';
        
        IF v_max_possible_score > 0 THEN
            v_final_percentage := (v_total_score / v_max_possible_score) * 100.0;
        ELSE
            v_final_percentage := 0;
        END IF;

        INSERT INTO public.talent_scores (student_id, domain, parent_score)
        VALUES (v_student_id, v_domain, v_final_percentage)
        ON CONFLICT (student_id, domain)
        DO UPDATE SET parent_score = EXCLUDED.parent_score, updated_at = timezone('utc'::text, now());
        
    ELSIF v_role_type = 'Teacher' THEN
        SELECT COALESCE(SUM(to_obs.score), 0), COUNT(to_obs.score) * 5.0
        INTO v_total_score, v_max_possible_score
        FROM public.teacher_observations to_obs
        JOIN public.talent_indicators ti ON ti.id = to_obs.indicator_id
        WHERE to_obs.student_id = v_student_id AND ti.domain = v_domain AND ti.role_type = 'Teacher';
        
        IF v_max_possible_score > 0 THEN
            v_final_percentage := (v_total_score / v_max_possible_score) * 100.0;
        ELSE
            v_final_percentage := 0;
        END IF;

        INSERT INTO public.talent_scores (student_id, domain, teacher_score)
        VALUES (v_student_id, v_domain, v_final_percentage)
        ON CONFLICT (student_id, domain)
        DO UPDATE SET teacher_score = EXCLUDED.teacher_score, updated_at = timezone('utc'::text, now());
    END IF;

    -- Dapatkan nilai terbaru dari talent_scores untuk dikalkulasi finalnya
    SELECT COALESCE(parent_score, 0), COALESCE(teacher_score, 0), COALESCE(achievement_score, 0)
    INTO curr_parent_score, curr_teacher_score, curr_achievement_score
    FROM public.talent_scores
    WHERE student_id = v_student_id AND domain = v_domain;

    -- Normalisasi Bobot (Hanya hitung bobot jika data ada/lebih dari 0)
    -- Asumsi: skor minimum jika diisi semua adalah 20 (karena skala 1-5). Jadi jika > 0 berarti sudah diisi.
    IF curr_parent_score > 0 THEN
        weighted_sum := weighted_sum + (curr_parent_score * 0.4);
        total_weight := total_weight + 0.4;
    END IF;
    
    IF curr_teacher_score > 0 THEN
        weighted_sum := weighted_sum + (curr_teacher_score * 0.4);
        total_weight := total_weight + 0.4;
    END IF;
    
    IF curr_achievement_score > 0 THEN
        weighted_sum := weighted_sum + (curr_achievement_score * 0.2);
        total_weight := total_weight + 0.2;
    END IF;

    -- Hitung Final Score
    IF total_weight > 0 THEN
        UPDATE public.talent_scores
        SET final_score = weighted_sum / total_weight
        WHERE student_id = v_student_id AND domain = v_domain;
    ELSE
        UPDATE public.talent_scores
        SET final_score = 0
        WHERE student_id = v_student_id AND domain = v_domain;
    END IF;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Paksa penghitungan ulang untuk menormalkan data yang ada
UPDATE public.parent_observations SET score = score;
UPDATE public.teacher_observations SET score = score;
