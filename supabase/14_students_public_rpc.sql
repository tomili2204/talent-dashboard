-- Membuat fungsi untuk mengambil daftar siswa secara aman untuk form pendaftaran (tanpa mem-bypass RLS tabel students secara keseluruhan)
CREATE OR REPLACE FUNCTION public.get_students_for_registration()
RETURNS TABLE (id UUID, full_name VARCHAR, nis VARCHAR)
LANGUAGE plpgsql
SECURITY DEFINER -- Menjalankan fungsi ini dengan hak akses pembuatnya (bypass RLS)
AS $$
BEGIN
  RETURN QUERY SELECT s.id, s.full_name, s.nis FROM public.students s ORDER BY s.full_name ASC;
END;
$$;

-- Memberikan izin kepada anon (pengguna belum login) dan authenticated untuk mengeksekusi fungsi ini
GRANT EXECUTE ON FUNCTION public.get_students_for_registration() TO anon, authenticated;
