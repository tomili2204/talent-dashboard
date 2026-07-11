CREATE OR REPLACE FUNCTION public.handle_user_role_update()
RETURNS trigger 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.role = 'Orang Tua' AND OLD.role != 'Orang Tua' THEN
    -- Masukkan ke parent_student
    INSERT INTO public.parent_student (parent_id, student_id)
    SELECT p.id, p.student_id FROM public.pending_registrations p WHERE p.id = NEW.id
    ON CONFLICT (parent_id, student_id) DO NOTHING;
    
    -- Hapus dari pending_registrations karena sudah diproses
    DELETE FROM public.pending_registrations WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;
