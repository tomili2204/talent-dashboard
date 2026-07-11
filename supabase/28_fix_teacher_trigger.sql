-- Update trigger sync untuk menyertakan NIK default jika tidak ada,
-- untuk mencegah eror 'null value in column nik violates not-null constraint'.
CREATE OR REPLACE FUNCTION public.sync_teacher_on_role_change()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role IN ('Guru', 'Wali Kelas') THEN
        INSERT INTO public.teachers (id, nik, full_name, email, created_at, updated_at)
        SELECT 
            u.id, 
            COALESCE(u.raw_user_meta_data->>'nik', 'AUTO-' || left(u.id::text, 12)),
            COALESCE(u.raw_user_meta_data->>'full_name', u.email), 
            u.email, 
            now(), now()
        FROM auth.users u WHERE u.id = NEW.id
        ON CONFLICT (id) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
