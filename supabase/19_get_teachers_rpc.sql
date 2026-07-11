-- Fungsi untuk mendapatkan daftar guru (Wali Kelas)
CREATE OR REPLACE FUNCTION public.get_teachers()
RETURNS TABLE (
    id UUID,
    full_name TEXT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    u.id, 
    COALESCE(u.raw_user_meta_data->>'full_name', u.email)::TEXT AS full_name
  FROM auth.users u
  JOIN public.user_roles r ON u.id = r.id
  WHERE r.role = 'Guru';
$$;
