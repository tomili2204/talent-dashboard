-- Eksekusi di SQL Editor Supabase

CREATE OR REPLACE FUNCTION public.update_teacher_user(
    p_teacher_id UUID,
    p_full_name TEXT,
    p_email TEXT,
    p_password TEXT,
    p_nik TEXT,
    p_position TEXT,
    p_phone TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    pw_hash TEXT;
BEGIN
    -- Pastikan pemanggil adalah Admin
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Akses ditolak: Hanya Admin yang dapat merubah data login.';
    END IF;

    -- 1. Update data profil di tabel teachers
    UPDATE public.teachers 
    SET 
        nik = p_nik,
        full_name = p_full_name,
        position = p_position,
        phone = p_phone,
        email = p_email,
        updated_at = now()
    WHERE id = p_teacher_id;

    -- 2. Update atau Buat akun di auth.users (Brankas Keamanan)
    IF EXISTS (SELECT 1 FROM auth.users WHERE id = p_teacher_id) THEN
        IF p_password IS NOT NULL AND p_password != '' THEN
            pw_hash := crypt(p_password, gen_salt('bf'));
            UPDATE auth.users 
            SET email = p_email, encrypted_password = pw_hash, updated_at = now()
            WHERE id = p_teacher_id;
        ELSE
            UPDATE auth.users 
            SET email = p_email, updated_at = now()
            WHERE id = p_teacher_id;
        END IF;
    ELSE
        -- Akun login belum ada (kasus guru dimasukkan manual via Tabel Supabase)
        pw_hash := crypt(COALESCE(NULLIF(p_password, ''), '123456'), gen_salt('bf'));
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, 
            email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
            created_at, updated_at,
            confirmation_token, recovery_token, email_change_token_new, email_change
        ) VALUES (
            '00000000-0000-0000-0000-000000000000', p_teacher_id, 'authenticated', 'authenticated', p_email, pw_hash, 
            now(), '{"provider":"email","providers":["email"]}', 
            json_build_object('full_name', p_full_name, 'phone', p_phone, 'nik', p_nik), 
            now(), now(),
            '', '', '', ''
        );
        
        -- Pastikan rolenya ada
        INSERT INTO public.user_roles (id, role, created_at, updated_at)
        VALUES (p_teacher_id, 'Guru', now(), now())
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- 3. Update auth.identities (SANGAT PENTING AGAR BISA LOGIN)
    -- Hapus identitas lama jika ada agar tidak bentrok
    DELETE FROM auth.identities WHERE user_id = p_teacher_id AND provider = 'email';
    
    -- Masukkan identitas baru yang fresh
    INSERT INTO auth.identities (
        id, user_id, identity_data, provider, provider_id, created_at, updated_at, last_sign_in_at
    ) VALUES (
        gen_random_uuid(), 
        p_teacher_id, 
        format('{"sub":"%s","email":"%s"}', p_teacher_id::text, p_email)::jsonb, 
        'email', 
        p_teacher_id::text, 
        now(), 
        now(),
        now()
    );

    RETURN true;
END;
$$;
