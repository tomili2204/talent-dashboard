-- Eksekusi di SQL Editor Supabase

-- 1. Create missing auth.users for existing teachers
DO $$
DECLARE
    t RECORD;
    new_email TEXT;
    pw_hash TEXT;
BEGIN
    pw_hash := crypt('123456', gen_salt('bf'));
    
    FOR t IN SELECT * FROM public.teachers
    LOOP
        IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = t.id) THEN
            -- Generate a fallback email if email is null
            new_email := COALESCE(t.email, 'guru_' || replace(t.id::text, '-', '') || '@sekolah.com');
            
            -- If the fallback email already exists in auth.users, append random string
            IF EXISTS (SELECT 1 FROM auth.users WHERE email = new_email) THEN
                new_email := 'guru_' || encode(gen_random_bytes(4), 'hex') || '@sekolah.com';
            END IF;

            INSERT INTO auth.users (
                instance_id, id, aud, role, email, encrypted_password, 
                email_confirmed_at, recovery_sent_at, last_sign_in_at, 
                raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
                confirmation_token, email_change, email_change_token_new, recovery_token
            ) VALUES (
                '00000000-0000-0000-0000-000000000000', t.id, 'authenticated', 'authenticated', new_email, pw_hash, 
                now(), now(), now(), 
                '{"provider":"email","providers":["email"]}', 
                json_build_object('full_name', t.full_name, 'phone', t.phone, 'nik', t.nik), 
                now(), now(), '', '', '', ''
            );

            INSERT INTO public.user_roles (id, role, created_at, updated_at)
            VALUES (t.id, 'Guru', now(), now())
            ON CONFLICT (id) DO UPDATE SET role = 'Guru';
        END IF;
    END LOOP;
END;
$$;

-- 2. Create RPC for creating a new teacher from Dashboard
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

    INSERT INTO public.user_roles (id, role, created_at, updated_at)
    VALUES (new_user_id, 'Guru', now(), now());

    INSERT INTO public.teachers (id, nik, full_name, position, phone, email, created_at, updated_at)
    VALUES (new_user_id, p_nik, p_full_name, p_position, p_phone, p_email, now(), now());

    RETURN new_user_id;
END;
$$;

-- 3. Create RPC to safely delete a teacher user
CREATE OR REPLACE FUNCTION public.delete_teacher_user(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM public.teachers WHERE id = p_user_id;
    DELETE FROM auth.users WHERE id = p_user_id;
    RETURN true;
END;
$$;

-- 4. Trigger to sync auth.users -> teachers when role is assigned
CREATE OR REPLACE FUNCTION public.sync_teacher_on_role_change()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role IN ('Guru', 'Wali Kelas') THEN
        INSERT INTO public.teachers (id, full_name, email, created_at, updated_at)
        SELECT u.id, COALESCE(u.raw_user_meta_data->>'full_name', u.email), u.email, now(), now()
        FROM auth.users u WHERE u.id = NEW.id
        ON CONFLICT (id) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_sync_teacher_on_role_change ON public.user_roles;
CREATE TRIGGER trigger_sync_teacher_on_role_change
AFTER INSERT OR UPDATE OF role ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.sync_teacher_on_role_change();
