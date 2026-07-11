-- Fungsi untuk menghapus pengguna secara permanen dari Supabase Auth
CREATE OR REPLACE FUNCTION public.delete_user(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Pastikan hanya admin yang bisa memanggil fungsi ini
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Akses ditolak: Hanya admin yang dapat menghapus pengguna';
  END IF;

  -- Hapus user dari auth.users
  -- (Data terkait di tabel public akan terhapus otomatis karena ON DELETE CASCADE)
  DELETE FROM auth.users WHERE id = user_id;
END;
$$;
