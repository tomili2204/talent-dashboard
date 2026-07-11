-- Jalankan di SQL Editor Supabase untuk membuat fungsi pengambilan data user & email

CREATE OR REPLACE FUNCTION public.get_all_users()
RETURNS TABLE (
  id uuid,
  email varchar,
  role text,
  created_at timestamp with time zone
) 
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    u.id, 
    u.email::varchar, 
    r.role, 
    r.created_at
  FROM auth.users u
  JOIN public.user_roles r ON u.id = r.id
  WHERE public.is_admin(); -- Pastikan hanya Admin yang bisa melihat ini
$$;
