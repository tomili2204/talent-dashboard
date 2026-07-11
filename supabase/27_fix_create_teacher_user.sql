-- Update create_teacher_user RPC untuk menghindari duplikasi di user_roles
CREATE OR REPLACE FUNCTION public.create_teacher_user(
    p_full_name TEXT,
    p_email TEXT,
    p_password TEXT,
    p_nik TEXT,
    p_position TEXT,
    p_phone TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_user_id UUID;
    pw_hash TEXT;
BEGIN
    new_user_id := gen_random_uuid();
    pw_hash := crypt(p_password, gen_salt('bf'));

    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password, 
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
        created_at, updated_at
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated', 'authenticated', p_email, pw_hash, 
        now(), '{"provider":"email","providers":["email"]}', 
        json_build_object('full_name', p_full_name, 'phone', p_phone, 'nik', p_nik), 
        now(), now()
    );

    -- Gunakan ON CONFLICT DO UPDATE karena trigger auth.users mungkin sudah membuatkan role 'Siswa'
    INSERT INTO public.user_roles (id, role, created_at, updated_at)
    VALUES (new_user_id, 'Guru', now(), now())
    ON CONFLICT (id) DO UPDATE SET role = 'Guru', updated_at = now();

    INSERT INTO public.teachers (id, nik, full_name, position, phone, email, created_at, updated_at)
    VALUES (new_user_id, p_nik, p_full_name, p_position, p_phone, p_email, now(), now());

    RETURN new_user_id;
END;
$$;
