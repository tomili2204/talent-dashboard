-- 1. Buat tabel pending_registrations
CREATE TABLE IF NOT EXISTS public.pending_registrations (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  requested_role VARCHAR(50) NOT NULL,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.pending_registrations ENABLE ROW LEVEL SECURITY;
-- User yang baru mendaftar bisa memasukkan data (auth.uid() = id)
CREATE POLICY "Users can insert their own registration" ON public.pending_registrations FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
-- Admin bisa melihat
CREATE POLICY "Admins can view and manage" ON public.pending_registrations TO authenticated USING (public.is_admin());

-- 2. Update fungsi get_all_users() untuk admin
DROP FUNCTION IF EXISTS public.get_all_users();
CREATE OR REPLACE FUNCTION public.get_all_users()
RETURNS TABLE (
  id uuid,
  email varchar,
  role text,
  created_at timestamp with time zone,
  requested_role varchar,
  student_name varchar
) 
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    u.id, 
    u.email::varchar, 
    r.role, 
    r.created_at,
    p.requested_role::varchar,
    s.full_name::varchar as student_name
  FROM auth.users u
  JOIN public.user_roles r ON u.id = r.id
  LEFT JOIN public.pending_registrations p ON u.id = p.id
  LEFT JOIN public.students s ON p.student_id = s.id
  WHERE public.is_admin();
$$;

-- 3. Trigger otomatis menghubungkan Ortu dengan Anak jika disetujui Admin
CREATE OR REPLACE FUNCTION public.handle_user_role_update()
RETURNS trigger 
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.role = 'Orang Tua' AND OLD.role != 'Orang Tua' THEN
    -- Masukkan ke parent_student
    INSERT INTO public.parent_student (parent_id, student_id)
    SELECT p.id, p.student_id FROM public.pending_registrations p WHERE p.id = NEW.id
    ON CONFLICT (parent_id, student_id) DO NOTHING;
    
    -- Hapus dari pending_registrations karena sudah diproses
    DELETE FROM public.pending_registrations WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_user_role_update ON public.user_roles;
CREATE TRIGGER trigger_user_role_update
AFTER UPDATE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.handle_user_role_update();
