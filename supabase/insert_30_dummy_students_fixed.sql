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

  INSERT INTO public.students (nis, nisn, full_name, gender, date_of_birth, address, class_id)
  VALUES 
  ('10001', '0012345001', 'Budi Santoso', 'Laki-laki', '2005-01-15', 'Jl. Merdeka No. 1', v_class_id),
  ('10002', '0012345002', 'Siti Wijaya', 'Perempuan', '2005-02-20', 'Jl. Merdeka No. 2', v_class_id),
  ('10003', '0012345003', 'Agus Kurniawan', 'Laki-laki', '2005-03-10', 'Jl. Merdeka No. 3', v_class_id),
  ('10004', '0012345004', 'Ayu Setiawan', 'Perempuan', '2005-04-05', 'Jl. Merdeka No. 4', v_class_id),
  ('10005', '0012345005', 'Rudi Pratama', 'Laki-laki', '2005-05-12', 'Jl. Merdeka No. 5', v_class_id),
  ('10006', '0012345006', 'Dina Putra', 'Perempuan', '2005-06-18', 'Jl. Merdeka No. 6', v_class_id),
  ('10007', '0012345007', 'Eko Saputra', 'Laki-laki', '2005-07-22', 'Jl. Merdeka No. 7', v_class_id),
  ('10008', '0012345008', 'Rini Nugroho', 'Perempuan', '2005-08-30', 'Jl. Merdeka No. 8', v_class_id),
  ('10009', '0012345009', 'Hadi Hidayat', 'Laki-laki', '2005-09-08', 'Jl. Merdeka No. 9', v_class_id),
  ('10010', '0012345010', 'Maya Wahyudi', 'Perempuan', '2005-10-14', 'Jl. Merdeka No. 10', v_class_id),
  ('10011', '0012345011', 'Joko Pangestu', 'Laki-laki', '2005-11-25', 'Jl. Merdeka No. 11', v_class_id),
  ('10012', '0012345012', 'Nina Siregar', 'Perempuan', '2005-12-03', 'Jl. Merdeka No. 12', v_class_id),
  ('10013', '0012345013', 'Tono Harahap', 'Laki-laki', '2005-01-28', 'Jl. Merdeka No. 13', v_class_id),
  ('10014', '0012345014', 'Lina Suryono', 'Perempuan', '2005-02-14', 'Jl. Merdeka No. 14', v_class_id),
  ('10015', '0012345015', 'Arif Wibowo', 'Laki-laki', '2005-03-09', 'Jl. Merdeka No. 15', v_class_id),
  ('10016', '0012345016', 'Dewi Kusuma', 'Perempuan', '2005-04-17', 'Jl. Merdeka No. 16', v_class_id),
  ('10017', '0012345017', 'Yudi Lestari', 'Laki-laki', '2005-05-21', 'Jl. Merdeka No. 17', v_class_id),
  ('10018', '0012345018', 'Sari Rahayu', 'Perempuan', '2005-06-26', 'Jl. Merdeka No. 18', v_class_id),
  ('10019', '0012345019', 'Iwan Sari', 'Laki-laki', '2005-07-31', 'Jl. Merdeka No. 19', v_class_id),
  ('10020', '0012345020', 'Rika Utami', 'Perempuan', '2005-08-04', 'Jl. Merdeka No. 20', v_class_id),
  ('10021', '0012345021', 'Andi Santoso', 'Laki-laki', '2005-09-11', 'Jl. Merdeka No. 21', v_class_id),
  ('10022', '0012345022', 'Fitri Wijaya', 'Perempuan', '2005-10-19', 'Jl. Merdeka No. 22', v_class_id),
  ('10023', '0012345023', 'Hendra Kurniawan', 'Laki-laki', '2005-11-23', 'Jl. Merdeka No. 23', v_class_id),
  ('10024', '0012345024', 'Nita Setiawan', 'Perempuan', '2005-12-07', 'Jl. Merdeka No. 24', v_class_id),
  ('10025', '0012345025', 'Doni Pratama', 'Laki-laki', '2005-01-02', 'Jl. Merdeka No. 25', v_class_id),
  ('10026', '0012345026', 'Ratna Putra', 'Perempuan', '2005-02-09', 'Jl. Merdeka No. 26', v_class_id),
  ('10027', '0012345027', 'Fajar Saputra', 'Laki-laki', '2005-03-16', 'Jl. Merdeka No. 27', v_class_id),
  ('10028', '0012345028', 'Wati Nugroho', 'Perempuan', '2005-04-24', 'Jl. Merdeka No. 28', v_class_id),
  ('10029', '0012345029', 'Hasan Hidayat', 'Laki-laki', '2005-05-29', 'Jl. Merdeka No. 29', v_class_id),
  ('10030', '0012345030', 'Yanti Wahyudi', 'Perempuan', '2005-06-05', 'Jl. Merdeka No. 30', v_class_id)
  ON CONFLICT (nis) DO NOTHING;
END $$;
