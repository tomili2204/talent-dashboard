-- 1. Create the function to calculate 1-100 scale scores for domains
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
BEGIN
    -- Tentukan baris mana yang diproses (OLD atau NEW)
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

        -- Simpan ke talent_scores
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

        -- Simpan ke talent_scores
        INSERT INTO public.talent_scores (student_id, domain, teacher_score)
        VALUES (v_student_id, v_domain, v_final_percentage)
        ON CONFLICT (student_id, domain)
        DO UPDATE SET teacher_score = EXCLUDED.teacher_score, updated_at = timezone('utc'::text, now());
    END IF;

    -- Kalkulasi final score sementara (Pembobotan 40% Ortu, 40% Guru, 20% Prestasi)
    UPDATE public.talent_scores
    SET final_score = (parent_score * 0.4) + (teacher_score * 0.4) + (achievement_score * 0.2)
    WHERE student_id = v_student_id AND domain = v_domain;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Attach triggers
DROP TRIGGER IF EXISTS trigger_calc_parent_domain_score ON public.parent_observations;
CREATE TRIGGER trigger_calc_parent_domain_score
AFTER INSERT OR UPDATE OR DELETE ON public.parent_observations
FOR EACH ROW EXECUTE FUNCTION public.calculate_domain_score();

DROP TRIGGER IF EXISTS trigger_calc_teacher_domain_score ON public.teacher_observations;
CREATE TRIGGER trigger_calc_teacher_domain_score
AFTER INSERT OR UPDATE OR DELETE ON public.teacher_observations
FOR EACH ROW EXECUTE FUNCTION public.calculate_domain_score();
