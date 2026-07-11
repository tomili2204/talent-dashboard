-- Jalankan skrip ini di SQL Editor Supabase untuk mengembalikan akses Admin Anda

UPDATE public.user_roles 
SET role = 'Admin' 
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'admin@lpirt.sch.id' LIMIT 1
);
