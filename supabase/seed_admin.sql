-- Pastikan ekstensi pgcrypto aktif untuk enkripsi password
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
BEGIN
  -- 1. Insert ke auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    'admin@lpirt.sch.id', -- Kita gunakan format email karena Supabase butuh format email
    crypt('admin', gen_salt('bf')), -- Password: admin
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  );

  -- 2. Pastikan role-nya adalah 'Admin'
  -- Catatan: Jika Trigger schema.sql sebelumnya berjalan, baris ini mungkin akan mengubah 
  -- role yang tadinya 'Siswa' menjadi 'Admin'. Jika trigger gagal/belum ada, kita lakukan UPSERT.
  
  INSERT INTO public.user_roles (id, role)
  VALUES (new_user_id, 'Admin')
  ON CONFLICT (id) DO UPDATE SET role = 'Admin';

END $$;
