-- Fungsi untuk mengambil nama dan nomor HP guru/wali kelas
CREATE OR REPLACE FUNCTION public.get_teacher_contact(teacher_id UUID)
RETURNS TABLE (
    full_name TEXT,
    phone TEXT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    COALESCE(u.raw_user_meta_data->>'full_name', u.email)::TEXT AS full_name,
    COALESCE(u.phone, u.raw_user_meta_data->>'phone', '-')::TEXT AS phone
  FROM auth.users u
  WHERE u.id = teacher_id;
$$;
