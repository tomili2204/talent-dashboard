-- 1. Perbaiki fungsi create_teacher_user untuk menyertakan auth.identities dengan provider_id
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

    -- 1. Insert ke auth.users
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

    -- 2. Insert ke auth.identities dengan provider_id = new_user_id
    INSERT INTO auth.identities (
        id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
        gen_random_uuid(), new_user_id::text, new_user_id, format('{"sub":"%s","email":"%s"}', new_user_id::text, p_email)::jsonb, 'email', now(), now(), now()
    );

    -- 3. Update user_roles
    INSERT INTO public.user_roles (id, role, created_at, updated_at)
    VALUES (new_user_id, 'Guru', now(), now())
    ON CONFLICT (id) DO UPDATE SET role = 'Guru', updated_at = now();

    -- 4. Insert/Update teachers
    INSERT INTO public.teachers (id, nik, full_name, position, phone, email, created_at, updated_at)
    VALUES (new_user_id, p_nik, p_full_name, p_position, p_phone, p_email, now(), now())
    ON CONFLICT (id) DO UPDATE SET 
        nik = EXCLUDED.nik,
        full_name = EXCLUDED.full_name,
        position = EXCLUDED.position,
        phone = EXCLUDED.phone,
        email = EXCLUDED.email,
        updated_at = EXCLUDED.updated_at;

    RETURN new_user_id;
END;
$$;

-- 2. Tambahkan auth.identities untuk user yang mungkin terlewat (dengan provider_id = user_id::text)
INSERT INTO auth.identities (id, provider_id, user_id, identity_data, provider, created_at, updated_at)
SELECT 
    gen_random_uuid(), 
    u.id::text,
    u.id, 
    format('{"sub":"%s","email":"%s"}', u.id::text, u.email)::jsonb, 
    'email', 
    now(), 
    now()
FROM auth.users u
WHERE NOT EXISTS (
    SELECT 1 FROM auth.identities i WHERE i.user_id = u.id
);
