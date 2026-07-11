-- Jalankan script ini di SQL Editor Supabase untuk otomatis meng-input 30 data dummy siswa
DO $$
DECLARE
  v_class_id uuid;
BEGIN
  -- Mengambil 1 ID kelas yang pertama kali ditemukan di database
  SELECT id INTO v_class_id FROM public.classes LIMIT 1;
  
  IF v_class_id IS NULL THEN
    RAISE EXCEPTION 'Belum ada data kelas. Harap buat minimal 1 kelas di menu Master Kelas terlebih dahulu!';
  END IF;

  INSERT INTO public.students (nis, nisn, full_name, gender, birth_place, birth_date, religion, address, class_id)
  VALUES 
  ('10001', '0012345001', 'Budi Santoso', 'Laki-laki', 'Surabaya', '2005-01-15', 'Islam', 'Jl. Merdeka No. 1', v_class_id),
  ('10002', '0012345002', 'Siti Wijaya', 'Perempuan', 'Jakarta', '2005-02-20', 'Islam', 'Jl. Merdeka No. 2', v_class_id),
  ('10003', '0012345003', 'Agus Kurniawan', 'Laki-laki', 'Bandung', '2005-03-10', 'Islam', 'Jl. Merdeka No. 3', v_class_id),
  ('10004', '0012345004', 'Ayu Setiawan', 'Perempuan', 'Semarang', '2005-04-05', 'Islam', 'Jl. Merdeka No. 4', v_class_id),
  ('10005', '0012345005', 'Rudi Pratama', 'Laki-laki', 'Yogyakarta', '2005-05-12', 'Islam', 'Jl. Merdeka No. 5', v_class_id),
  ('10006', '0012345006', 'Dina Putra', 'Perempuan', 'Malang', '2005-06-18', 'Islam', 'Jl. Merdeka No. 6', v_class_id),
  ('10007', '0012345007', 'Eko Saputra', 'Laki-laki', 'Surabaya', '2005-07-22', 'Islam', 'Jl. Merdeka No. 7', v_class_id),
  ('10008', '0012345008', 'Rini Nugroho', 'Perempuan', 'Jakarta', '2005-08-30', 'Islam', 'Jl. Merdeka No. 8', v_class_id),
  ('10009', '0012345009', 'Hadi Hidayat', 'Laki-laki', 'Bandung', '2005-09-08', 'Islam', 'Jl. Merdeka No. 9', v_class_id),
  ('10010', '0012345010', 'Maya Wahyudi', 'Perempuan', 'Semarang', '2005-10-14', 'Islam', 'Jl. Merdeka No. 10', v_class_id),
  ('10011', '0012345011', 'Joko Pangestu', 'Laki-laki', 'Yogyakarta', '2005-11-25', 'Islam', 'Jl. Merdeka No. 11', v_class_id),
  ('10012', '0012345012', 'Nina Siregar', 'Perempuan', 'Medan', '2005-12-03', 'Islam', 'Jl. Merdeka No. 12', v_class_id),
  ('10013', '0012345013', 'Tono Harahap', 'Laki-laki', 'Medan', '2005-01-28', 'Islam', 'Jl. Merdeka No. 13', v_class_id),
  ('10014', '0012345014', 'Lina Suryono', 'Perempuan', 'Surabaya', '2005-02-14', 'Islam', 'Jl. Merdeka No. 14', v_class_id),
  ('10015', '0012345015', 'Arif Wibowo', 'Laki-laki', 'Jakarta', '2005-03-09', 'Islam', 'Jl. Merdeka No. 15', v_class_id),
  ('10016', '0012345016', 'Dewi Kusuma', 'Perempuan', 'Bandung', '2005-04-17', 'Islam', 'Jl. Merdeka No. 16', v_class_id),
  ('10017', '0012345017', 'Yudi Lestari', 'Laki-laki', 'Semarang', '2005-05-21', 'Islam', 'Jl. Merdeka No. 17', v_class_id),
  ('10018', '0012345018', 'Sari Rahayu', 'Perempuan', 'Yogyakarta', '2005-06-26', 'Islam', 'Jl. Merdeka No. 18', v_class_id),
  ('10019', '0012345019', 'Iwan Sari', 'Laki-laki', 'Malang', '2005-07-31', 'Islam', 'Jl. Merdeka No. 19', v_class_id),
  ('10020', '0012345020', 'Rika Utami', 'Perempuan', 'Surabaya', '2005-08-04', 'Islam', 'Jl. Merdeka No. 20', v_class_id),
  ('10021', '0012345021', 'Andi Santoso', 'Laki-laki', 'Jakarta', '2005-09-11', 'Islam', 'Jl. Merdeka No. 21', v_class_id),
  ('10022', '0012345022', 'Fitri Wijaya', 'Perempuan', 'Bandung', '2005-10-19', 'Islam', 'Jl. Merdeka No. 22', v_class_id),
  ('10023', '0012345023', 'Hendra Kurniawan', 'Laki-laki', 'Semarang', '2005-11-23', 'Islam', 'Jl. Merdeka No. 23', v_class_id),
  ('10024', '0012345024', 'Nita Setiawan', 'Perempuan', 'Yogyakarta', '2005-12-07', 'Islam', 'Jl. Merdeka No. 24', v_class_id),
  ('10025', '0012345025', 'Doni Pratama', 'Laki-laki', 'Surabaya', '2005-01-02', 'Islam', 'Jl. Merdeka No. 25', v_class_id),
  ('10026', '0012345026', 'Ratna Putra', 'Perempuan', 'Jakarta', '2005-02-09', 'Islam', 'Jl. Merdeka No. 26', v_class_id),
  ('10027', '0012345027', 'Fajar Saputra', 'Laki-laki', 'Bandung', '2005-03-16', 'Islam', 'Jl. Merdeka No. 27', v_class_id),
  ('10028', '0012345028', 'Wati Nugroho', 'Perempuan', 'Semarang', '2005-04-24', 'Islam', 'Jl. Merdeka No. 28', v_class_id),
  ('10029', '0012345029', 'Hasan Hidayat', 'Laki-laki', 'Yogyakarta', '2005-05-29', 'Islam', 'Jl. Merdeka No. 29', v_class_id),
  ('10030', '0012345030', 'Yanti Wahyudi', 'Perempuan', 'Malang', '2005-06-05', 'Islam', 'Jl. Merdeka No. 30', v_class_id)
  ON CONFLICT (nis) DO NOTHING;
END $$;
