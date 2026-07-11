
-- Script Seed Realistic Data
DO $$
DECLARE
    -- Arrays for storage
    teacher_ids uuid[] := ARRAY[]::uuid[];
    class_ids uuid[] := ARRAY[]::uuid[];
    student_ids uuid[] := ARRAY[]::uuid[];
    comp_ids uuid[] := ARRAY[]::uuid[];
    prog_ids uuid[] := ARRAY[]::uuid[];
    admin_id uuid;
    
    -- Temp vars
    v_id uuid;
    i int;
    j int;
    dom text;
    
    -- Indicators
    parent_inds RECORD;
    teacher_inds RECORD;
BEGIN
    -- 1. DELETE OLD DATA
    DELETE FROM public.talent_recommendations WHERE student_id != '00000000-0000-0000-0000-000000000000';
    DELETE FROM public.observation_notes WHERE student_id != '00000000-0000-0000-0000-000000000000';
    DELETE FROM public.teacher_observations WHERE student_id != '00000000-0000-0000-0000-000000000000';
    DELETE FROM public.parent_observations WHERE student_id != '00000000-0000-0000-0000-000000000000';
    DELETE FROM public.talent_scores WHERE student_id != '00000000-0000-0000-0000-000000000000';
    DELETE FROM public.achievements WHERE id != '00000000-0000-0000-0000-000000000000';
    DELETE FROM public.incubation_participants WHERE id != '00000000-0000-0000-0000-000000000000';
    DELETE FROM public.incubation_programs WHERE id != '00000000-0000-0000-0000-000000000000';
    DELETE FROM public.competitions WHERE id != '00000000-0000-0000-0000-000000000000';
    DELETE FROM public.students WHERE id != '00000000-0000-0000-0000-000000000000';
    DELETE FROM public.classes WHERE id != '00000000-0000-0000-0000-000000000000';
    DELETE FROM public.teachers WHERE id != '00000000-0000-0000-0000-000000000000';

    SELECT id INTO admin_id FROM public.user_roles WHERE role = 'Admin' LIMIT 1;
    IF admin_id IS NULL THEN
       admin_id := gen_random_uuid();
    END IF;

    -- 2. INSERT TEACHERS

    v_id := gen_random_uuid();
    teacher_ids := teacher_ids || v_id;
    INSERT INTO public.teachers (id, nik, full_name, position, phone) VALUES (v_id, '19800101000001', 'Fitri Manurung', 'Guru Mapel 1', '08123456001');

    v_id := gen_random_uuid();
    teacher_ids := teacher_ids || v_id;
    INSERT INTO public.teachers (id, nik, full_name, position, phone) VALUES (v_id, '19800101000002', 'Sri Manurung', 'Guru Mapel 2', '08123456002');

    v_id := gen_random_uuid();
    teacher_ids := teacher_ids || v_id;
    INSERT INTO public.teachers (id, nik, full_name, position, phone) VALUES (v_id, '19800101000003', 'Saputra Putra', 'Guru Mapel 3', '08123456003');

    v_id := gen_random_uuid();
    teacher_ids := teacher_ids || v_id;
    INSERT INTO public.teachers (id, nik, full_name, position, phone) VALUES (v_id, '19800101000004', 'Rani Nababan', 'Guru Mapel 4', '08123456004');

    v_id := gen_random_uuid();
    teacher_ids := teacher_ids || v_id;
    INSERT INTO public.teachers (id, nik, full_name, position, phone) VALUES (v_id, '19800101000005', 'Eko Maulana', 'Guru Mapel 5', '08123456005');

    v_id := gen_random_uuid();
    teacher_ids := teacher_ids || v_id;
    INSERT INTO public.teachers (id, nik, full_name, position, phone) VALUES (v_id, '19800101000006', 'Dimas Siregar', 'Guru Mapel 6', '08123456006');

    v_id := gen_random_uuid();
    teacher_ids := teacher_ids || v_id;
    INSERT INTO public.teachers (id, nik, full_name, position, phone) VALUES (v_id, '19800101000007', 'Dimas Kusuma', 'Guru Mapel 7', '08123456007');

    v_id := gen_random_uuid();
    teacher_ids := teacher_ids || v_id;
    INSERT INTO public.teachers (id, nik, full_name, position, phone) VALUES (v_id, '19800101000008', 'Wahyuni Gunawan', 'Guru Mapel 8', '08123456008');

    v_id := gen_random_uuid();
    teacher_ids := teacher_ids || v_id;
    INSERT INTO public.teachers (id, nik, full_name, position, phone) VALUES (v_id, '19800101000009', 'Eko Hutagalung', 'Guru Mapel 9', '08123456009');

    v_id := gen_random_uuid();
    teacher_ids := teacher_ids || v_id;
    INSERT INTO public.teachers (id, nik, full_name, position, phone) VALUES (v_id, '19800101000010', 'Bayu Sinaga', 'Guru Mapel 10', '08123456010');

    v_id := gen_random_uuid();
    teacher_ids := teacher_ids || v_id;
    INSERT INTO public.teachers (id, nik, full_name, position, phone) VALUES (v_id, '19800101000011', 'Indah Pratama', 'Guru Mapel 11', '08123456011');

    v_id := gen_random_uuid();
    teacher_ids := teacher_ids || v_id;
    INSERT INTO public.teachers (id, nik, full_name, position, phone) VALUES (v_id, '19800101000012', 'Dwi Pratama', 'Guru Mapel 12', '08123456012');

    v_id := gen_random_uuid();
    teacher_ids := teacher_ids || v_id;
    INSERT INTO public.teachers (id, nik, full_name, position, phone) VALUES (v_id, '19800101000013', 'Yudi Putra', 'Guru Mapel 13', '08123456013');

    v_id := gen_random_uuid();
    teacher_ids := teacher_ids || v_id;
    INSERT INTO public.teachers (id, nik, full_name, position, phone) VALUES (v_id, '19800101000014', 'Siti Manurung', 'Guru Mapel 14', '08123456014');

    v_id := gen_random_uuid();
    teacher_ids := teacher_ids || v_id;
    INSERT INTO public.teachers (id, nik, full_name, position, phone) VALUES (v_id, '19800101000015', 'Dwi Hidayat', 'Guru Mapel 15', '08123456015');

    v_id := gen_random_uuid();
    teacher_ids := teacher_ids || v_id;
    INSERT INTO public.teachers (id, nik, full_name, position, phone) VALUES (v_id, '19800101000016', 'Putri Sinaga', 'Guru Mapel 16', '08123456016');

    v_id := gen_random_uuid();
    teacher_ids := teacher_ids || v_id;
    INSERT INTO public.teachers (id, nik, full_name, position, phone) VALUES (v_id, '19800101000017', 'Susanti Hasibuan', 'Guru Mapel 17', '08123456017');

    v_id := gen_random_uuid();
    teacher_ids := teacher_ids || v_id;
    INSERT INTO public.teachers (id, nik, full_name, position, phone) VALUES (v_id, '19800101000018', 'Arif Pratama', 'Guru Mapel 18', '08123456018');

    v_id := gen_random_uuid();
    teacher_ids := teacher_ids || v_id;
    INSERT INTO public.teachers (id, nik, full_name, position, phone) VALUES (v_id, '19800101000019', 'Rina Kusuma', 'Guru Mapel 19', '08123456019');

    v_id := gen_random_uuid();
    teacher_ids := teacher_ids || v_id;
    INSERT INTO public.teachers (id, nik, full_name, position, phone) VALUES (v_id, '19800101000020', 'Dwi Putra', 'Guru Mapel 20', '08123456020');

    v_id := gen_random_uuid();
    teacher_ids := teacher_ids || v_id;
    INSERT INTO public.teachers (id, nik, full_name, position, phone) VALUES (v_id, '19800101000021', 'Sri Lubis', 'Guru Mapel 21', '08123456021');

    v_id := gen_random_uuid();
    teacher_ids := teacher_ids || v_id;
    INSERT INTO public.teachers (id, nik, full_name, position, phone) VALUES (v_id, '19800101000022', 'Fajar Sihombing', 'Guru Mapel 22', '08123456022');

    v_id := gen_random_uuid();
    teacher_ids := teacher_ids || v_id;
    INSERT INTO public.teachers (id, nik, full_name, position, phone) VALUES (v_id, '19800101000023', 'Arif Sinaga', 'Guru Mapel 23', '08123456023');

    v_id := gen_random_uuid();
    teacher_ids := teacher_ids || v_id;
    INSERT INTO public.teachers (id, nik, full_name, position, phone) VALUES (v_id, '19800101000024', 'Haryanto Gunawan', 'Guru Mapel 24', '08123456024');

    v_id := gen_random_uuid();
    teacher_ids := teacher_ids || v_id;
    INSERT INTO public.teachers (id, nik, full_name, position, phone) VALUES (v_id, '19800101000025', 'Maya Nababan', 'Guru Mapel 25', '08123456025');

    v_id := gen_random_uuid();
    teacher_ids := teacher_ids || v_id;
    INSERT INTO public.teachers (id, nik, full_name, position, phone) VALUES (v_id, '19800101000026', 'Dewi Kusuma', 'Guru Mapel 26', '08123456026');

    v_id := gen_random_uuid();
    teacher_ids := teacher_ids || v_id;
    INSERT INTO public.teachers (id, nik, full_name, position, phone) VALUES (v_id, '19800101000027', 'Susanti Simanjuntak', 'Guru Mapel 27', '08123456027');

    v_id := gen_random_uuid();
    teacher_ids := teacher_ids || v_id;
    INSERT INTO public.teachers (id, nik, full_name, position, phone) VALUES (v_id, '19800101000028', 'Setiawan Setiawan', 'Guru Mapel 28', '08123456028');

    v_id := gen_random_uuid();
    teacher_ids := teacher_ids || v_id;
    INSERT INTO public.teachers (id, nik, full_name, position, phone) VALUES (v_id, '19800101000029', 'Wati Nababan', 'Guru Mapel 29', '08123456029');

    v_id := gen_random_uuid();
    teacher_ids := teacher_ids || v_id;
    INSERT INTO public.teachers (id, nik, full_name, position, phone) VALUES (v_id, '19800101000030', 'Rizki Kusuma', 'Guru Mapel 30', '08123456030');

    -- 3. INSERT CLASSES

    v_id := gen_random_uuid();
    class_ids := class_ids || v_id;
    INSERT INTO public.classes (id, name, homeroom_teacher_id) VALUES (v_id, '1A', teacher_ids[1]);

    v_id := gen_random_uuid();
    class_ids := class_ids || v_id;
    INSERT INTO public.classes (id, name, homeroom_teacher_id) VALUES (v_id, '1B', teacher_ids[2]);

    v_id := gen_random_uuid();
    class_ids := class_ids || v_id;
    INSERT INTO public.classes (id, name, homeroom_teacher_id) VALUES (v_id, '2A', teacher_ids[3]);

    v_id := gen_random_uuid();
    class_ids := class_ids || v_id;
    INSERT INTO public.classes (id, name, homeroom_teacher_id) VALUES (v_id, '2B', teacher_ids[4]);

    v_id := gen_random_uuid();
    class_ids := class_ids || v_id;
    INSERT INTO public.classes (id, name, homeroom_teacher_id) VALUES (v_id, '3A', teacher_ids[5]);

    v_id := gen_random_uuid();
    class_ids := class_ids || v_id;
    INSERT INTO public.classes (id, name, homeroom_teacher_id) VALUES (v_id, '3B', teacher_ids[6]);

    v_id := gen_random_uuid();
    class_ids := class_ids || v_id;
    INSERT INTO public.classes (id, name, homeroom_teacher_id) VALUES (v_id, '4A', teacher_ids[7]);

    v_id := gen_random_uuid();
    class_ids := class_ids || v_id;
    INSERT INTO public.classes (id, name, homeroom_teacher_id) VALUES (v_id, '4B', teacher_ids[8]);

    v_id := gen_random_uuid();
    class_ids := class_ids || v_id;
    INSERT INTO public.classes (id, name, homeroom_teacher_id) VALUES (v_id, '5A', teacher_ids[9]);

    v_id := gen_random_uuid();
    class_ids := class_ids || v_id;
    INSERT INTO public.classes (id, name, homeroom_teacher_id) VALUES (v_id, '5B', teacher_ids[10]);

    v_id := gen_random_uuid();
    class_ids := class_ids || v_id;
    INSERT INTO public.classes (id, name, homeroom_teacher_id) VALUES (v_id, '6A', teacher_ids[11]);

    v_id := gen_random_uuid();
    class_ids := class_ids || v_id;
    INSERT INTO public.classes (id, name, homeroom_teacher_id) VALUES (v_id, '6B', teacher_ids[12]);

    -- 4. INSERT STUDENTS

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240001', '0050000001', 'Fitri Tarihoran', 'Perempuan', '2010-01-01', class_ids[2], 'Susanti Santoso', '085200000001', 'Jl. Merdeka No. 1', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240002', '0050000002', 'Hasan Saputra', 'Perempuan', '2010-01-01', class_ids[3], 'Indah Hasibuan', '085200000002', 'Jl. Merdeka No. 2', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240003', '0050000003', 'Hendra Nababan', 'Perempuan', '2010-01-01', class_ids[4], 'Putri Hasibuan', '085200000003', 'Jl. Merdeka No. 3', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240004', '0050000004', 'Nugroho Sitorus', 'Perempuan', '2010-01-01', class_ids[5], 'Dwi Sihombing', '085200000004', 'Jl. Merdeka No. 4', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240005', '0050000005', 'Nisa Pangestu', 'Laki-laki', '2010-01-01', class_ids[6], 'Rahayu Sitompul', '085200000005', 'Jl. Merdeka No. 5', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240006', '0050000006', 'Haryanto Gunawan', 'Perempuan', '2010-01-01', class_ids[7], 'Wahyuni Siregar', '085200000006', 'Jl. Merdeka No. 6', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240007', '0050000007', 'Wahyu Siregar', 'Perempuan', '2010-01-01', class_ids[8], 'Tri Manurung', '085200000007', 'Jl. Merdeka No. 7', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240008', '0050000008', 'Dewi Aditya', 'Laki-laki', '2010-01-01', class_ids[9], 'Sri Tarihoran', '085200000008', 'Jl. Merdeka No. 8', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240009', '0050000009', 'Yudi Panjaitan', 'Perempuan', '2010-01-01', class_ids[10], 'Ahmad Sitompul', '085200000009', 'Jl. Merdeka No. 9', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240010', '0050000010', 'Wahyuni Sihombing', 'Perempuan', '2010-01-01', class_ids[11], 'Ratna Sitompul', '085200000010', 'Jl. Merdeka No. 10', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240011', '0050000011', 'Hendra Pratama', 'Perempuan', '2010-01-01', class_ids[12], 'Rahmawati Setiawan', '085200000011', 'Jl. Merdeka No. 11', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240012', '0050000012', 'Bayu Manurung', 'Laki-laki', '2010-01-01', class_ids[1], 'Agus Sinaga', '085200000012', 'Jl. Merdeka No. 12', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240013', '0050000013', 'Eko Tarihoran', 'Perempuan', '2010-01-01', class_ids[2], 'Dimas Simanjuntak', '085200000013', 'Jl. Merdeka No. 13', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240014', '0050000014', 'Rahmawati Manurung', 'Perempuan', '2010-01-01', class_ids[3], 'Agus Tarihoran', '085200000014', 'Jl. Merdeka No. 14', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240015', '0050000015', 'Lestari Dalimunthe', 'Laki-laki', '2010-01-01', class_ids[4], 'Tari Maulana', '085200000015', 'Jl. Merdeka No. 15', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240016', '0050000016', 'Andi Santoso', 'Perempuan', '2010-01-01', class_ids[5], 'Rina Saputra', '085200000016', 'Jl. Merdeka No. 16', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240017', '0050000017', 'Budi Sitorus', 'Perempuan', '2010-01-01', class_ids[6], 'Bagus Hidayat', '085200000017', 'Jl. Merdeka No. 17', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240018', '0050000018', 'Ahmad Dalimunthe', 'Laki-laki', '2010-01-01', class_ids[7], 'Ahmad Sitorus', '085200000018', 'Jl. Merdeka No. 18', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240019', '0050000019', 'Sri Pratama', 'Perempuan', '2010-01-01', class_ids[8], 'Indah Gunawan', '085200000019', 'Jl. Merdeka No. 19', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240020', '0050000020', 'Ayu Setiawan', 'Laki-laki', '2010-01-01', class_ids[9], 'Tri Dalimunthe', '085200000020', 'Jl. Merdeka No. 20', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240021', '0050000021', 'Andi Manurung', 'Perempuan', '2010-01-01', class_ids[10], 'Budi Sitompul', '085200000021', 'Jl. Merdeka No. 21', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240022', '0050000022', 'Hasan Saputra', 'Perempuan', '2010-01-01', class_ids[11], 'Yudi Dalimunthe', '085200000022', 'Jl. Merdeka No. 22', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240023', '0050000023', 'Lina Nugroho', 'Perempuan', '2010-01-01', class_ids[12], 'Kurniawan Maulana', '085200000023', 'Jl. Merdeka No. 23', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240024', '0050000024', 'Bagus Lubis', 'Perempuan', '2010-01-01', class_ids[1], 'Siti Santoso', '085200000024', 'Jl. Merdeka No. 24', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240025', '0050000025', 'Ratna Kusuma', 'Laki-laki', '2010-01-01', class_ids[2], 'Wahyuni Aditya', '085200000025', 'Jl. Merdeka No. 25', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240026', '0050000026', 'Rizki Panjaitan', 'Perempuan', '2010-01-01', class_ids[3], 'Hendra Sinaga', '085200000026', 'Jl. Merdeka No. 26', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240027', '0050000027', 'Putri Simanjuntak', 'Perempuan', '2010-01-01', class_ids[4], 'Wahyu Dalimunthe', '085200000027', 'Jl. Merdeka No. 27', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240028', '0050000028', 'Rina Sitompul', 'Perempuan', '2010-01-01', class_ids[5], 'Hendra Aditya', '085200000028', 'Jl. Merdeka No. 28', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240029', '0050000029', 'Agus Manurung', 'Laki-laki', '2010-01-01', class_ids[6], 'Dewi Lubis', '085200000029', 'Jl. Merdeka No. 29', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240030', '0050000030', 'Sari Hidayat', 'Laki-laki', '2010-01-01', class_ids[7], 'Ratna Firmansyah', '085200000030', 'Jl. Merdeka No. 30', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240031', '0050000031', 'Fajar Sitompul', 'Laki-laki', '2010-01-01', class_ids[8], 'Rahmawati Nasution', '085200000031', 'Jl. Merdeka No. 31', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240032', '0050000032', 'Rizki Setiawan', 'Perempuan', '2010-01-01', class_ids[9], 'Ayu Nababan', '085200000032', 'Jl. Merdeka No. 32', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240033', '0050000033', 'Dimas Kusuma', 'Laki-laki', '2010-01-01', class_ids[10], 'Andi Putra', '085200000033', 'Jl. Merdeka No. 33', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240034', '0050000034', 'Saputra Harahap', 'Laki-laki', '2010-01-01', class_ids[11], 'Ahmad Hidayat', '085200000034', 'Jl. Merdeka No. 34', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240035', '0050000035', 'Indah Pangestu', 'Perempuan', '2010-01-01', class_ids[12], 'Saputra Pratama', '085200000035', 'Jl. Merdeka No. 35', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240036', '0050000036', 'Lestari Harahap', 'Perempuan', '2010-01-01', class_ids[1], 'Tri Nababan', '085200000036', 'Jl. Merdeka No. 36', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240037', '0050000037', 'Sri Santoso', 'Laki-laki', '2010-01-01', class_ids[2], 'Sari Maulana', '085200000037', 'Jl. Merdeka No. 37', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240038', '0050000038', 'Lina Hutagalung', 'Laki-laki', '2010-01-01', class_ids[3], 'Hidayat Manurung', '085200000038', 'Jl. Merdeka No. 38', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240039', '0050000039', 'Maya Sitompul', 'Perempuan', '2010-01-01', class_ids[4], 'Rahmawati Aditya', '085200000039', 'Jl. Merdeka No. 39', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240040', '0050000040', 'Maya Sitorus', 'Laki-laki', '2010-01-01', class_ids[5], 'Bagus Panjaitan', '085200000040', 'Jl. Merdeka No. 40', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240041', '0050000041', 'Dwi Hasibuan', 'Perempuan', '2010-01-01', class_ids[6], 'Kurnia Manurung', '085200000041', 'Jl. Merdeka No. 41', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240042', '0050000042', 'Ratna Hasibuan', 'Laki-laki', '2010-01-01', class_ids[7], 'Andi Simanjuntak', '085200000042', 'Jl. Merdeka No. 42', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240043', '0050000043', 'Kurnia Hasibuan', 'Laki-laki', '2010-01-01', class_ids[8], 'Bagus Santoso', '085200000043', 'Jl. Merdeka No. 43', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240044', '0050000044', 'Putri Wijaya', 'Perempuan', '2010-01-01', class_ids[9], 'Haryanto Setiawan', '085200000044', 'Jl. Merdeka No. 44', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240045', '0050000045', 'Lestari Nasution', 'Laki-laki', '2010-01-01', class_ids[10], 'Sri Santoso', '085200000045', 'Jl. Merdeka No. 45', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240046', '0050000046', 'Arif Sitompul', 'Perempuan', '2010-01-01', class_ids[11], 'Lestari Kusuma', '085200000046', 'Jl. Merdeka No. 46', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240047', '0050000047', 'Dwi Nasution', 'Perempuan', '2010-01-01', class_ids[12], 'Rahayu Saputra', '085200000047', 'Jl. Merdeka No. 47', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240048', '0050000048', 'Rani Aditya', 'Laki-laki', '2010-01-01', class_ids[1], 'Fajar Hasibuan', '085200000048', 'Jl. Merdeka No. 48', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240049', '0050000049', 'Setiawan Maulana', 'Perempuan', '2010-01-01', class_ids[2], 'Haryanto Firmansyah', '085200000049', 'Jl. Merdeka No. 49', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240050', '0050000050', 'Lestari Nasution', 'Perempuan', '2010-01-01', class_ids[3], 'Sari Pratama', '085200000050', 'Jl. Merdeka No. 50', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240051', '0050000051', 'Rizki Hidayat', 'Laki-laki', '2010-01-01', class_ids[4], 'Lina Sihombing', '085200000051', 'Jl. Merdeka No. 51', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240052', '0050000052', 'Hidayat Putra', 'Perempuan', '2010-01-01', class_ids[5], 'Tari Nasution', '085200000052', 'Jl. Merdeka No. 52', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240053', '0050000053', 'Haryanto Sinaga', 'Laki-laki', '2010-01-01', class_ids[6], 'Ratna Hutagalung', '085200000053', 'Jl. Merdeka No. 53', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240054', '0050000054', 'Sri Kusuma', 'Perempuan', '2010-01-01', class_ids[7], 'Rani Harahap', '085200000054', 'Jl. Merdeka No. 54', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240055', '0050000055', 'Rizki Nasution', 'Perempuan', '2010-01-01', class_ids[8], 'Putri Kusuma', '085200000055', 'Jl. Merdeka No. 55', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240056', '0050000056', 'Eko Kusuma', 'Laki-laki', '2010-01-01', class_ids[9], 'Rina Nababan', '085200000056', 'Jl. Merdeka No. 56', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240057', '0050000057', 'Bagus Nugroho', 'Perempuan', '2010-01-01', class_ids[10], 'Rani Nasution', '085200000057', 'Jl. Merdeka No. 57', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240058', '0050000058', 'Ayu Hidayat', 'Laki-laki', '2010-01-01', class_ids[11], 'Rina Maulana', '085200000058', 'Jl. Merdeka No. 58', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240059', '0050000059', 'Ayu Panjaitan', 'Perempuan', '2010-01-01', class_ids[12], 'Siti Hidayat', '085200000059', 'Jl. Merdeka No. 59', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240060', '0050000060', 'Syahputra Nugroho', 'Perempuan', '2010-01-01', class_ids[1], 'Dewi Sitorus', '085200000060', 'Jl. Merdeka No. 60', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240061', '0050000061', 'Setiawan Hasibuan', 'Laki-laki', '2010-01-01', class_ids[2], 'Wahyu Lubis', '085200000061', 'Jl. Merdeka No. 61', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240062', '0050000062', 'Nugroho Harahap', 'Perempuan', '2010-01-01', class_ids[3], 'Lestari Gunawan', '085200000062', 'Jl. Merdeka No. 62', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240063', '0050000063', 'Arif Sihombing', 'Laki-laki', '2010-01-01', class_ids[4], 'Bagus Sihombing', '085200000063', 'Jl. Merdeka No. 63', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240064', '0050000064', 'Andi Sitompul', 'Perempuan', '2010-01-01', class_ids[5], 'Haryanto Hidayat', '085200000064', 'Jl. Merdeka No. 64', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240065', '0050000065', 'Saputra Hasibuan', 'Laki-laki', '2010-01-01', class_ids[6], 'Sari Nugroho', '085200000065', 'Jl. Merdeka No. 65', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240066', '0050000066', 'Yudi Pratama', 'Laki-laki', '2010-01-01', class_ids[7], 'Rina Lubis', '085200000066', 'Jl. Merdeka No. 66', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240067', '0050000067', 'Kurniawan Hutagalung', 'Perempuan', '2010-01-01', class_ids[8], 'Wati Kusuma', '085200000067', 'Jl. Merdeka No. 67', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240068', '0050000068', 'Wahyuni Gunawan', 'Laki-laki', '2010-01-01', class_ids[9], 'Syahputra Panjaitan', '085200000068', 'Jl. Merdeka No. 68', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240069', '0050000069', 'Kurnia Saputra', 'Perempuan', '2010-01-01', class_ids[10], 'Dewi Pratama', '085200000069', 'Jl. Merdeka No. 69', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240070', '0050000070', 'Bagus Nugroho', 'Perempuan', '2010-01-01', class_ids[11], 'Sari Santoso', '085200000070', 'Jl. Merdeka No. 70', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240071', '0050000071', 'Tari Sitorus', 'Perempuan', '2010-01-01', class_ids[12], 'Siti Pangestu', '085200000071', 'Jl. Merdeka No. 71', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240072', '0050000072', 'Kurniawan Hasibuan', 'Laki-laki', '2010-01-01', class_ids[1], 'Siti Panjaitan', '085200000072', 'Jl. Merdeka No. 72', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240073', '0050000073', 'Dwi Wijaya', 'Perempuan', '2010-01-01', class_ids[2], 'Faisal Setiawan', '085200000073', 'Jl. Merdeka No. 73', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240074', '0050000074', 'Bagus Sinaga', 'Perempuan', '2010-01-01', class_ids[3], 'Arif Gunawan', '085200000074', 'Jl. Merdeka No. 74', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240075', '0050000075', 'Wulandari Sihombing', 'Laki-laki', '2010-01-01', class_ids[4], 'Kurnia Siregar', '085200000075', 'Jl. Merdeka No. 75', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240076', '0050000076', 'Tri Nasution', 'Laki-laki', '2010-01-01', class_ids[5], 'Ayu Sitompul', '085200000076', 'Jl. Merdeka No. 76', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240077', '0050000077', 'Arif Santoso', 'Laki-laki', '2010-01-01', class_ids[6], 'Rahayu Sitompul', '085200000077', 'Jl. Merdeka No. 77', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240078', '0050000078', 'Siti Maulana', 'Perempuan', '2010-01-01', class_ids[7], 'Rahmawati Hutagalung', '085200000078', 'Jl. Merdeka No. 78', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240079', '0050000079', 'Arif Siregar', 'Laki-laki', '2010-01-01', class_ids[8], 'Maya Setiawan', '085200000079', 'Jl. Merdeka No. 79', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240080', '0050000080', 'Wati Lubis', 'Laki-laki', '2010-01-01', class_ids[9], 'Rina Tarihoran', '085200000080', 'Jl. Merdeka No. 80', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240081', '0050000081', 'Rahayu Sihombing', 'Laki-laki', '2010-01-01', class_ids[10], 'Indah Putra', '085200000081', 'Jl. Merdeka No. 81', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240082', '0050000082', 'Lestari Sihombing', 'Laki-laki', '2010-01-01', class_ids[11], 'Arif Santoso', '085200000082', 'Jl. Merdeka No. 82', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240083', '0050000083', 'Pratama Nababan', 'Laki-laki', '2010-01-01', class_ids[12], 'Tri Maulana', '085200000083', 'Jl. Merdeka No. 83', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240084', '0050000084', 'Dimas Kusuma', 'Perempuan', '2010-01-01', class_ids[1], 'Eko Nugroho', '085200000084', 'Jl. Merdeka No. 84', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240085', '0050000085', 'Agus Santoso', 'Laki-laki', '2010-01-01', class_ids[2], 'Ratna Hidayat', '085200000085', 'Jl. Merdeka No. 85', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240086', '0050000086', 'Ayu Manurung', 'Laki-laki', '2010-01-01', class_ids[3], 'Budi Pratama', '085200000086', 'Jl. Merdeka No. 86', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240087', '0050000087', 'Maya Pangestu', 'Laki-laki', '2010-01-01', class_ids[4], 'Pratama Sihombing', '085200000087', 'Jl. Merdeka No. 87', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240088', '0050000088', 'Agus Nababan', 'Laki-laki', '2010-01-01', class_ids[5], 'Ahmad Hidayat', '085200000088', 'Jl. Merdeka No. 88', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240089', '0050000089', 'Eko Hutagalung', 'Laki-laki', '2010-01-01', class_ids[6], 'Saputra Saputra', '085200000089', 'Jl. Merdeka No. 89', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240090', '0050000090', 'Ahmad Hidayat', 'Perempuan', '2010-01-01', class_ids[7], 'Hasan Tarihoran', '085200000090', 'Jl. Merdeka No. 90', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240091', '0050000091', 'Putri Saputra', 'Perempuan', '2010-01-01', class_ids[8], 'Sri Sitompul', '085200000091', 'Jl. Merdeka No. 91', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240092', '0050000092', 'Tri Nugroho', 'Perempuan', '2010-01-01', class_ids[9], 'Andi Sinaga', '085200000092', 'Jl. Merdeka No. 92', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240093', '0050000093', 'Indah Setiawan', 'Perempuan', '2010-01-01', class_ids[10], 'Nugroho Kusuma', '085200000093', 'Jl. Merdeka No. 93', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240094', '0050000094', 'Tari Sihombing', 'Laki-laki', '2010-01-01', class_ids[11], 'Dimas Saputra', '085200000094', 'Jl. Merdeka No. 94', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240095', '0050000095', 'Rani Hidayat', 'Laki-laki', '2010-01-01', class_ids[12], 'Nisa Lubis', '085200000095', 'Jl. Merdeka No. 95', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240096', '0050000096', 'Lina Pratama', 'Laki-laki', '2010-01-01', class_ids[1], 'Ratna Sinaga', '085200000096', 'Jl. Merdeka No. 96', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240097', '0050000097', 'Dewi Lubis', 'Laki-laki', '2010-01-01', class_ids[2], 'Hidayat Aditya', '085200000097', 'Jl. Merdeka No. 97', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240098', '0050000098', 'Rani Panjaitan', 'Perempuan', '2010-01-01', class_ids[3], 'Nisa Hasibuan', '085200000098', 'Jl. Merdeka No. 98', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240099', '0050000099', 'Sri Santoso', 'Perempuan', '2010-01-01', class_ids[4], 'Dwi Panjaitan', '085200000099', 'Jl. Merdeka No. 99', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240100', '0050000100', 'Bayu Pangestu', 'Perempuan', '2010-01-01', class_ids[5], 'Siti Saputra', '085200000100', 'Jl. Merdeka No. 100', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240101', '0050000101', 'Wulandari Tarihoran', 'Perempuan', '2010-01-01', class_ids[6], 'Hidayat Firmansyah', '085200000101', 'Jl. Merdeka No. 101', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240102', '0050000102', 'Rina Sitompul', 'Laki-laki', '2010-01-01', class_ids[7], 'Hendra Kusuma', '085200000102', 'Jl. Merdeka No. 102', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240103', '0050000103', 'Dewi Kusuma', 'Perempuan', '2010-01-01', class_ids[8], 'Siti Sinaga', '085200000103', 'Jl. Merdeka No. 103', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240104', '0050000104', 'Fitri Maulana', 'Laki-laki', '2010-01-01', class_ids[9], 'Budi Panjaitan', '085200000104', 'Jl. Merdeka No. 104', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240105', '0050000105', 'Budi Gunawan', 'Perempuan', '2010-01-01', class_ids[10], 'Ratna Setiawan', '085200000105', 'Jl. Merdeka No. 105', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240106', '0050000106', 'Yudi Tarihoran', 'Laki-laki', '2010-01-01', class_ids[11], 'Faisal Maulana', '085200000106', 'Jl. Merdeka No. 106', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240107', '0050000107', 'Ayu Nugroho', 'Laki-laki', '2010-01-01', class_ids[12], 'Eko Firmansyah', '085200000107', 'Jl. Merdeka No. 107', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240108', '0050000108', 'Ratna Santoso', 'Laki-laki', '2010-01-01', class_ids[1], 'Agus Maulana', '085200000108', 'Jl. Merdeka No. 108', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240109', '0050000109', 'Dewi Kusuma', 'Perempuan', '2010-01-01', class_ids[2], 'Dimas Maulana', '085200000109', 'Jl. Merdeka No. 109', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240110', '0050000110', 'Siti Simanjuntak', 'Perempuan', '2010-01-01', class_ids[3], 'Lina Sitompul', '085200000110', 'Jl. Merdeka No. 110', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240111', '0050000111', 'Bagus Aditya', 'Laki-laki', '2010-01-01', class_ids[4], 'Budi Saputra', '085200000111', 'Jl. Merdeka No. 111', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240112', '0050000112', 'Wahyuni Pangestu', 'Perempuan', '2010-01-01', class_ids[5], 'Eko Hutagalung', '085200000112', 'Jl. Merdeka No. 112', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240113', '0050000113', 'Yudi Harahap', 'Perempuan', '2010-01-01', class_ids[6], 'Setiawan Nugroho', '085200000113', 'Jl. Merdeka No. 113', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240114', '0050000114', 'Saputra Sinaga', 'Laki-laki', '2010-01-01', class_ids[7], 'Sri Sihombing', '085200000114', 'Jl. Merdeka No. 114', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240115', '0050000115', 'Maya Aditya', 'Laki-laki', '2010-01-01', class_ids[8], 'Sri Sinaga', '085200000115', 'Jl. Merdeka No. 115', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240116', '0050000116', 'Hendra Panjaitan', 'Laki-laki', '2010-01-01', class_ids[9], 'Budi Sinaga', '085200000116', 'Jl. Merdeka No. 116', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240117', '0050000117', 'Budi Manurung', 'Perempuan', '2010-01-01', class_ids[10], 'Susanti Putra', '085200000117', 'Jl. Merdeka No. 117', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240118', '0050000118', 'Budi Manurung', 'Perempuan', '2010-01-01', class_ids[11], 'Bayu Putra', '085200000118', 'Jl. Merdeka No. 118', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240119', '0050000119', 'Dewi Tarihoran', 'Perempuan', '2010-01-01', class_ids[12], 'Kurniawan Tarihoran', '085200000119', 'Jl. Merdeka No. 119', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240120', '0050000120', 'Kurnia Sitompul', 'Laki-laki', '2010-01-01', class_ids[1], 'Saputra Sinaga', '085200000120', 'Jl. Merdeka No. 120', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240121', '0050000121', 'Kurniawan Tarihoran', 'Laki-laki', '2010-01-01', class_ids[2], 'Dian Santoso', '085200000121', 'Jl. Merdeka No. 121', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240122', '0050000122', 'Indah Kusuma', 'Laki-laki', '2010-01-01', class_ids[3], 'Sri Putra', '085200000122', 'Jl. Merdeka No. 122', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240123', '0050000123', 'Susanti Sitompul', 'Perempuan', '2010-01-01', class_ids[4], 'Rani Lubis', '085200000123', 'Jl. Merdeka No. 123', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240124', '0050000124', 'Maya Pangestu', 'Laki-laki', '2010-01-01', class_ids[5], 'Bagus Nasution', '085200000124', 'Jl. Merdeka No. 124', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240125', '0050000125', 'Sari Kusuma', 'Laki-laki', '2010-01-01', class_ids[6], 'Lestari Hutagalung', '085200000125', 'Jl. Merdeka No. 125', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240126', '0050000126', 'Dwi Dalimunthe', 'Laki-laki', '2010-01-01', class_ids[7], 'Dian Wijaya', '085200000126', 'Jl. Merdeka No. 126', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240127', '0050000127', 'Agus Siregar', 'Perempuan', '2010-01-01', class_ids[8], 'Fitri Santoso', '085200000127', 'Jl. Merdeka No. 127', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240128', '0050000128', 'Lestari Kusuma', 'Laki-laki', '2010-01-01', class_ids[9], 'Dewi Firmansyah', '085200000128', 'Jl. Merdeka No. 128', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240129', '0050000129', 'Hasan Sinaga', 'Perempuan', '2010-01-01', class_ids[10], 'Tri Sihombing', '085200000129', 'Jl. Merdeka No. 129', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240130', '0050000130', 'Tari Dalimunthe', 'Perempuan', '2010-01-01', class_ids[11], 'Rahayu Gunawan', '085200000130', 'Jl. Merdeka No. 130', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240131', '0050000131', 'Budi Sitorus', 'Laki-laki', '2010-01-01', class_ids[12], 'Sri Sitorus', '085200000131', 'Jl. Merdeka No. 131', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240132', '0050000132', 'Arif Siregar', 'Perempuan', '2010-01-01', class_ids[1], 'Eko Hidayat', '085200000132', 'Jl. Merdeka No. 132', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240133', '0050000133', 'Bayu Tarihoran', 'Perempuan', '2010-01-01', class_ids[2], 'Susanti Sitorus', '085200000133', 'Jl. Merdeka No. 133', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240134', '0050000134', 'Saputra Setiawan', 'Laki-laki', '2010-01-01', class_ids[3], 'Rahayu Wijaya', '085200000134', 'Jl. Merdeka No. 134', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240135', '0050000135', 'Rahmawati Santoso', 'Laki-laki', '2010-01-01', class_ids[4], 'Dimas Hutagalung', '085200000135', 'Jl. Merdeka No. 135', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240136', '0050000136', 'Tri Sihombing', 'Laki-laki', '2010-01-01', class_ids[5], 'Bagus Hidayat', '085200000136', 'Jl. Merdeka No. 136', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240137', '0050000137', 'Indah Setiawan', 'Laki-laki', '2010-01-01', class_ids[6], 'Rani Firmansyah', '085200000137', 'Jl. Merdeka No. 137', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240138', '0050000138', 'Lestari Dalimunthe', 'Perempuan', '2010-01-01', class_ids[7], 'Arif Hidayat', '085200000138', 'Jl. Merdeka No. 138', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240139', '0050000139', 'Eko Putra', 'Laki-laki', '2010-01-01', class_ids[8], 'Bayu Firmansyah', '085200000139', 'Jl. Merdeka No. 139', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240140', '0050000140', 'Sari Harahap', 'Laki-laki', '2010-01-01', class_ids[9], 'Hidayat Maulana', '085200000140', 'Jl. Merdeka No. 140', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240141', '0050000141', 'Dian Manurung', 'Perempuan', '2010-01-01', class_ids[10], 'Wahyuni Harahap', '085200000141', 'Jl. Merdeka No. 141', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240142', '0050000142', 'Lestari Hasibuan', 'Perempuan', '2010-01-01', class_ids[11], 'Tri Setiawan', '085200000142', 'Jl. Merdeka No. 142', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240143', '0050000143', 'Tri Hidayat', 'Perempuan', '2010-01-01', class_ids[12], 'Sari Sihombing', '085200000143', 'Jl. Merdeka No. 143', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240144', '0050000144', 'Eko Simanjuntak', 'Perempuan', '2010-01-01', class_ids[1], 'Susanti Nasution', '085200000144', 'Jl. Merdeka No. 144', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240145', '0050000145', 'Tari Wijaya', 'Perempuan', '2010-01-01', class_ids[2], 'Faisal Santoso', '085200000145', 'Jl. Merdeka No. 145', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240146', '0050000146', 'Yudi Siregar', 'Perempuan', '2010-01-01', class_ids[3], 'Faisal Siregar', '085200000146', 'Jl. Merdeka No. 146', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240147', '0050000147', 'Kurniawan Setiawan', 'Perempuan', '2010-01-01', class_ids[4], 'Tri Dalimunthe', '085200000147', 'Jl. Merdeka No. 147', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240148', '0050000148', 'Agus Nababan', 'Perempuan', '2010-01-01', class_ids[5], 'Agus Simanjuntak', '085200000148', 'Jl. Merdeka No. 148', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240149', '0050000149', 'Arif Gunawan', 'Laki-laki', '2010-01-01', class_ids[6], 'Rizki Siregar', '085200000149', 'Jl. Merdeka No. 149', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240150', '0050000150', 'Arif Nasution', 'Laki-laki', '2010-01-01', class_ids[7], 'Pratama Nugroho', '085200000150', 'Jl. Merdeka No. 150', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240151', '0050000151', 'Lestari Nasution', 'Laki-laki', '2010-01-01', class_ids[8], 'Rahayu Lubis', '085200000151', 'Jl. Merdeka No. 151', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240152', '0050000152', 'Eko Wijaya', 'Laki-laki', '2010-01-01', class_ids[9], 'Andi Dalimunthe', '085200000152', 'Jl. Merdeka No. 152', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240153', '0050000153', 'Wulandari Nasution', 'Laki-laki', '2010-01-01', class_ids[10], 'Fitri Hasibuan', '085200000153', 'Jl. Merdeka No. 153', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240154', '0050000154', 'Rizki Tarihoran', 'Perempuan', '2010-01-01', class_ids[11], 'Rizki Nababan', '085200000154', 'Jl. Merdeka No. 154', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240155', '0050000155', 'Susanti Manurung', 'Laki-laki', '2010-01-01', class_ids[12], 'Dwi Nababan', '085200000155', 'Jl. Merdeka No. 155', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240156', '0050000156', 'Agus Hidayat', 'Laki-laki', '2010-01-01', class_ids[1], 'Rizki Putra', '085200000156', 'Jl. Merdeka No. 156', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240157', '0050000157', 'Pratama Pangestu', 'Laki-laki', '2010-01-01', class_ids[2], 'Yudi Simanjuntak', '085200000157', 'Jl. Merdeka No. 157', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240158', '0050000158', 'Dian Putra', 'Perempuan', '2010-01-01', class_ids[3], 'Dimas Hutagalung', '085200000158', 'Jl. Merdeka No. 158', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240159', '0050000159', 'Wati Hidayat', 'Laki-laki', '2010-01-01', class_ids[4], 'Wahyuni Dalimunthe', '085200000159', 'Jl. Merdeka No. 159', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240160', '0050000160', 'Sri Dalimunthe', 'Perempuan', '2010-01-01', class_ids[5], 'Wahyuni Lubis', '085200000160', 'Jl. Merdeka No. 160', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240161', '0050000161', 'Nugroho Pratama', 'Perempuan', '2010-01-01', class_ids[6], 'Rizki Panjaitan', '085200000161', 'Jl. Merdeka No. 161', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240162', '0050000162', 'Dimas Gunawan', 'Perempuan', '2010-01-01', class_ids[7], 'Agus Pangestu', '085200000162', 'Jl. Merdeka No. 162', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240163', '0050000163', 'Tri Sihombing', 'Perempuan', '2010-01-01', class_ids[8], 'Rahayu Lubis', '085200000163', 'Jl. Merdeka No. 163', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240164', '0050000164', 'Indah Dalimunthe', 'Laki-laki', '2010-01-01', class_ids[9], 'Budi Hasibuan', '085200000164', 'Jl. Merdeka No. 164', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240165', '0050000165', 'Budi Harahap', 'Perempuan', '2010-01-01', class_ids[10], 'Fajar Nasution', '085200000165', 'Jl. Merdeka No. 165', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240166', '0050000166', 'Agus Maulana', 'Perempuan', '2010-01-01', class_ids[11], 'Ratna Hidayat', '085200000166', 'Jl. Merdeka No. 166', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240167', '0050000167', 'Nisa Hutagalung', 'Perempuan', '2010-01-01', class_ids[12], 'Fajar Pratama', '085200000167', 'Jl. Merdeka No. 167', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240168', '0050000168', 'Bayu Hasibuan', 'Laki-laki', '2010-01-01', class_ids[1], 'Andi Firmansyah', '085200000168', 'Jl. Merdeka No. 168', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240169', '0050000169', 'Tari Panjaitan', 'Laki-laki', '2010-01-01', class_ids[2], 'Siti Sihombing', '085200000169', 'Jl. Merdeka No. 169', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240170', '0050000170', 'Hidayat Setiawan', 'Laki-laki', '2010-01-01', class_ids[3], 'Yudi Hasibuan', '085200000170', 'Jl. Merdeka No. 170', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240171', '0050000171', 'Maya Nugroho', 'Laki-laki', '2010-01-01', class_ids[4], 'Rizki Aditya', '085200000171', 'Jl. Merdeka No. 171', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240172', '0050000172', 'Wati Siregar', 'Laki-laki', '2010-01-01', class_ids[5], 'Wulandari Siregar', '085200000172', 'Jl. Merdeka No. 172', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240173', '0050000173', 'Siti Hasibuan', 'Perempuan', '2010-01-01', class_ids[6], 'Saputra Gunawan', '085200000173', 'Jl. Merdeka No. 173', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240174', '0050000174', 'Kurniawan Siregar', 'Perempuan', '2010-01-01', class_ids[7], 'Hasan Simanjuntak', '085200000174', 'Jl. Merdeka No. 174', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240175', '0050000175', 'Putri Sihombing', 'Laki-laki', '2010-01-01', class_ids[8], 'Fitri Hutagalung', '085200000175', 'Jl. Merdeka No. 175', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240176', '0050000176', 'Putri Setiawan', 'Laki-laki', '2010-01-01', class_ids[9], 'Sari Sitompul', '085200000176', 'Jl. Merdeka No. 176', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240177', '0050000177', 'Wahyuni Simanjuntak', 'Laki-laki', '2010-01-01', class_ids[10], 'Saputra Dalimunthe', '085200000177', 'Jl. Merdeka No. 177', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240178', '0050000178', 'Setiawan Hasibuan', 'Laki-laki', '2010-01-01', class_ids[11], 'Kurniawan Wijaya', '085200000178', 'Jl. Merdeka No. 178', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240179', '0050000179', 'Wati Nababan', 'Laki-laki', '2010-01-01', class_ids[12], 'Siti Firmansyah', '085200000179', 'Jl. Merdeka No. 179', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240180', '0050000180', 'Hasan Dalimunthe', 'Perempuan', '2010-01-01', class_ids[1], 'Ahmad Sitorus', '085200000180', 'Jl. Merdeka No. 180', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240181', '0050000181', 'Hidayat Lubis', 'Laki-laki', '2010-01-01', class_ids[2], 'Ratna Siregar', '085200000181', 'Jl. Merdeka No. 181', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240182', '0050000182', 'Lina Firmansyah', 'Perempuan', '2010-01-01', class_ids[3], 'Ayu Sitorus', '085200000182', 'Jl. Merdeka No. 182', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240183', '0050000183', 'Dwi Sihombing', 'Laki-laki', '2010-01-01', class_ids[4], 'Ratna Hutagalung', '085200000183', 'Jl. Merdeka No. 183', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240184', '0050000184', 'Saputra Hutagalung', 'Perempuan', '2010-01-01', class_ids[5], 'Andi Sitompul', '085200000184', 'Jl. Merdeka No. 184', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240185', '0050000185', 'Ayu Aditya', 'Perempuan', '2010-01-01', class_ids[6], 'Bayu Nasution', '085200000185', 'Jl. Merdeka No. 185', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240186', '0050000186', 'Arif Harahap', 'Laki-laki', '2010-01-01', class_ids[7], 'Hidayat Pratama', '085200000186', 'Jl. Merdeka No. 186', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240187', '0050000187', 'Ayu Dalimunthe', 'Perempuan', '2010-01-01', class_ids[8], 'Dian Santoso', '085200000187', 'Jl. Merdeka No. 187', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240188', '0050000188', 'Siti Wijaya', 'Laki-laki', '2010-01-01', class_ids[9], 'Sari Maulana', '085200000188', 'Jl. Merdeka No. 188', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240189', '0050000189', 'Wati Maulana', 'Laki-laki', '2010-01-01', class_ids[10], 'Rina Manurung', '085200000189', 'Jl. Merdeka No. 189', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240190', '0050000190', 'Ratna Santoso', 'Perempuan', '2010-01-01', class_ids[11], 'Wahyuni Sinaga', '085200000190', 'Jl. Merdeka No. 190', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240191', '0050000191', 'Faisal Santoso', 'Perempuan', '2010-01-01', class_ids[12], 'Sari Sitompul', '085200000191', 'Jl. Merdeka No. 191', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240192', '0050000192', 'Wati Sinaga', 'Perempuan', '2010-01-01', class_ids[1], 'Hasan Aditya', '085200000192', 'Jl. Merdeka No. 192', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240193', '0050000193', 'Bagus Tarihoran', 'Perempuan', '2010-01-01', class_ids[2], 'Tari Pratama', '085200000193', 'Jl. Merdeka No. 193', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240194', '0050000194', 'Ayu Panjaitan', 'Perempuan', '2010-01-01', class_ids[3], 'Rina Setiawan', '085200000194', 'Jl. Merdeka No. 194', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240195', '0050000195', 'Rahmawati Simanjuntak', 'Laki-laki', '2010-01-01', class_ids[4], 'Hendra Firmansyah', '085200000195', 'Jl. Merdeka No. 195', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240196', '0050000196', 'Arif Nasution', 'Laki-laki', '2010-01-01', class_ids[5], 'Wulandari Nababan', '085200000196', 'Jl. Merdeka No. 196', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240197', '0050000197', 'Fitri Hutagalung', 'Laki-laki', '2010-01-01', class_ids[6], 'Arif Setiawan', '085200000197', 'Jl. Merdeka No. 197', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240198', '0050000198', 'Rizki Panjaitan', 'Perempuan', '2010-01-01', class_ids[7], 'Faisal Sitompul', '085200000198', 'Jl. Merdeka No. 198', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240199', '0050000199', 'Kurniawan Dalimunthe', 'Laki-laki', '2010-01-01', class_ids[8], 'Rahayu Sitompul', '085200000199', 'Jl. Merdeka No. 199', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240200', '0050000200', 'Kurniawan Firmansyah', 'Laki-laki', '2010-01-01', class_ids[9], 'Wahyuni Sitompul', '085200000200', 'Jl. Merdeka No. 200', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240201', '0050000201', 'Dewi Sinaga', 'Perempuan', '2010-01-01', class_ids[10], 'Rahmawati Santoso', '085200000201', 'Jl. Merdeka No. 201', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240202', '0050000202', 'Siti Sitompul', 'Perempuan', '2010-01-01', class_ids[11], 'Rahayu Manurung', '085200000202', 'Jl. Merdeka No. 202', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240203', '0050000203', 'Dimas Pangestu', 'Perempuan', '2010-01-01', class_ids[12], 'Siti Nugroho', '085200000203', 'Jl. Merdeka No. 203', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240204', '0050000204', 'Wati Gunawan', 'Perempuan', '2010-01-01', class_ids[1], 'Lina Hutagalung', '085200000204', 'Jl. Merdeka No. 204', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240205', '0050000205', 'Eko Sinaga', 'Perempuan', '2010-01-01', class_ids[2], 'Budi Dalimunthe', '085200000205', 'Jl. Merdeka No. 205', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240206', '0050000206', 'Ayu Pangestu', 'Perempuan', '2010-01-01', class_ids[3], 'Hidayat Wijaya', '085200000206', 'Jl. Merdeka No. 206', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240207', '0050000207', 'Kurnia Simanjuntak', 'Perempuan', '2010-01-01', class_ids[4], 'Dian Firmansyah', '085200000207', 'Jl. Merdeka No. 207', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240208', '0050000208', 'Dian Harahap', 'Perempuan', '2010-01-01', class_ids[5], 'Tri Hutagalung', '085200000208', 'Jl. Merdeka No. 208', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240209', '0050000209', 'Andi Hidayat', 'Laki-laki', '2010-01-01', class_ids[6], 'Budi Panjaitan', '085200000209', 'Jl. Merdeka No. 209', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240210', '0050000210', 'Saputra Nababan', 'Perempuan', '2010-01-01', class_ids[7], 'Rahmawati Tarihoran', '085200000210', 'Jl. Merdeka No. 210', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240211', '0050000211', 'Andi Kusuma', 'Perempuan', '2010-01-01', class_ids[8], 'Wahyuni Kusuma', '085200000211', 'Jl. Merdeka No. 211', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240212', '0050000212', 'Budi Manurung', 'Perempuan', '2010-01-01', class_ids[9], 'Dewi Saputra', '085200000212', 'Jl. Merdeka No. 212', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240213', '0050000213', 'Eko Nasution', 'Laki-laki', '2010-01-01', class_ids[10], 'Dimas Santoso', '085200000213', 'Jl. Merdeka No. 213', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240214', '0050000214', 'Pratama Sihombing', 'Laki-laki', '2010-01-01', class_ids[11], 'Saputra Gunawan', '085200000214', 'Jl. Merdeka No. 214', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240215', '0050000215', 'Hidayat Dalimunthe', 'Laki-laki', '2010-01-01', class_ids[12], 'Budi Wijaya', '085200000215', 'Jl. Merdeka No. 215', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240216', '0050000216', 'Indah Lubis', 'Laki-laki', '2010-01-01', class_ids[1], 'Rina Santoso', '085200000216', 'Jl. Merdeka No. 216', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240217', '0050000217', 'Rahmawati Hasibuan', 'Perempuan', '2010-01-01', class_ids[2], 'Indah Sitorus', '085200000217', 'Jl. Merdeka No. 217', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240218', '0050000218', 'Dwi Sihombing', 'Perempuan', '2010-01-01', class_ids[3], 'Syahputra Wijaya', '085200000218', 'Jl. Merdeka No. 218', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240219', '0050000219', 'Hasan Nasution', 'Laki-laki', '2010-01-01', class_ids[4], 'Wahyuni Pratama', '085200000219', 'Jl. Merdeka No. 219', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240220', '0050000220', 'Wulandari Putra', 'Perempuan', '2010-01-01', class_ids[5], 'Ratna Firmansyah', '085200000220', 'Jl. Merdeka No. 220', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240221', '0050000221', 'Bagus Nasution', 'Perempuan', '2010-01-01', class_ids[6], 'Rina Aditya', '085200000221', 'Jl. Merdeka No. 221', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240222', '0050000222', 'Sri Simanjuntak', 'Perempuan', '2010-01-01', class_ids[7], 'Susanti Sitorus', '085200000222', 'Jl. Merdeka No. 222', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240223', '0050000223', 'Kurniawan Dalimunthe', 'Perempuan', '2010-01-01', class_ids[8], 'Haryanto Sitorus', '085200000223', 'Jl. Merdeka No. 223', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240224', '0050000224', 'Sari Firmansyah', 'Perempuan', '2010-01-01', class_ids[9], 'Rina Kusuma', '085200000224', 'Jl. Merdeka No. 224', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240225', '0050000225', 'Ratna Firmansyah', 'Laki-laki', '2010-01-01', class_ids[10], 'Lina Simanjuntak', '085200000225', 'Jl. Merdeka No. 225', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240226', '0050000226', 'Lestari Nasution', 'Perempuan', '2010-01-01', class_ids[11], 'Haryanto Sitorus', '085200000226', 'Jl. Merdeka No. 226', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240227', '0050000227', 'Pratama Hidayat', 'Perempuan', '2010-01-01', class_ids[12], 'Saputra Pangestu', '085200000227', 'Jl. Merdeka No. 227', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240228', '0050000228', 'Rani Siregar', 'Laki-laki', '2010-01-01', class_ids[1], 'Siti Dalimunthe', '085200000228', 'Jl. Merdeka No. 228', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240229', '0050000229', 'Saputra Panjaitan', 'Perempuan', '2010-01-01', class_ids[2], 'Rani Pangestu', '085200000229', 'Jl. Merdeka No. 229', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240230', '0050000230', 'Fajar Saputra', 'Perempuan', '2010-01-01', class_ids[3], 'Wahyu Tarihoran', '085200000230', 'Jl. Merdeka No. 230', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240231', '0050000231', 'Wahyuni Putra', 'Laki-laki', '2010-01-01', class_ids[4], 'Agus Putra', '085200000231', 'Jl. Merdeka No. 231', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240232', '0050000232', 'Sri Maulana', 'Laki-laki', '2010-01-01', class_ids[5], 'Haryanto Sitompul', '085200000232', 'Jl. Merdeka No. 232', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240233', '0050000233', 'Kurnia Sitorus', 'Perempuan', '2010-01-01', class_ids[6], 'Susanti Simanjuntak', '085200000233', 'Jl. Merdeka No. 233', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240234', '0050000234', 'Fitri Hidayat', 'Perempuan', '2010-01-01', class_ids[7], 'Pratama Sihombing', '085200000234', 'Jl. Merdeka No. 234', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240235', '0050000235', 'Sari Wijaya', 'Laki-laki', '2010-01-01', class_ids[8], 'Sri Tarihoran', '085200000235', 'Jl. Merdeka No. 235', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240236', '0050000236', 'Nisa Manurung', 'Perempuan', '2010-01-01', class_ids[9], 'Agus Lubis', '085200000236', 'Jl. Merdeka No. 236', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240237', '0050000237', 'Dwi Sihombing', 'Perempuan', '2010-01-01', class_ids[10], 'Agus Lubis', '085200000237', 'Jl. Merdeka No. 237', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240238', '0050000238', 'Ayu Hidayat', 'Laki-laki', '2010-01-01', class_ids[11], 'Dimas Sihombing', '085200000238', 'Jl. Merdeka No. 238', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240239', '0050000239', 'Arif Nababan', 'Laki-laki', '2010-01-01', class_ids[12], 'Dian Kusuma', '085200000239', 'Jl. Merdeka No. 239', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240240', '0050000240', 'Ahmad Nugroho', 'Perempuan', '2010-01-01', class_ids[1], 'Pratama Nugroho', '085200000240', 'Jl. Merdeka No. 240', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240241', '0050000241', 'Ayu Manurung', 'Perempuan', '2010-01-01', class_ids[2], 'Wahyuni Firmansyah', '085200000241', 'Jl. Merdeka No. 241', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240242', '0050000242', 'Dimas Harahap', 'Laki-laki', '2010-01-01', class_ids[3], 'Ayu Sitompul', '085200000242', 'Jl. Merdeka No. 242', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240243', '0050000243', 'Lina Simanjuntak', 'Laki-laki', '2010-01-01', class_ids[4], 'Dwi Sinaga', '085200000243', 'Jl. Merdeka No. 243', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240244', '0050000244', 'Ahmad Panjaitan', 'Laki-laki', '2010-01-01', class_ids[5], 'Dewi Putra', '085200000244', 'Jl. Merdeka No. 244', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240245', '0050000245', 'Ahmad Simanjuntak', 'Perempuan', '2010-01-01', class_ids[6], 'Haryanto Panjaitan', '085200000245', 'Jl. Merdeka No. 245', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240246', '0050000246', 'Ayu Hutagalung', 'Perempuan', '2010-01-01', class_ids[7], 'Dwi Sinaga', '085200000246', 'Jl. Merdeka No. 246', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240247', '0050000247', 'Bagus Sihombing', 'Perempuan', '2010-01-01', class_ids[8], 'Kurnia Harahap', '085200000247', 'Jl. Merdeka No. 247', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240248', '0050000248', 'Agus Kusuma', 'Laki-laki', '2010-01-01', class_ids[9], 'Bayu Nugroho', '085200000248', 'Jl. Merdeka No. 248', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240249', '0050000249', 'Lina Sitompul', 'Laki-laki', '2010-01-01', class_ids[10], 'Wahyuni Lubis', '085200000249', 'Jl. Merdeka No. 249', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240250', '0050000250', 'Pratama Simanjuntak', 'Laki-laki', '2010-01-01', class_ids[11], 'Yudi Firmansyah', '085200000250', 'Jl. Merdeka No. 250', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240251', '0050000251', 'Dian Panjaitan', 'Laki-laki', '2010-01-01', class_ids[12], 'Dimas Harahap', '085200000251', 'Jl. Merdeka No. 251', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240252', '0050000252', 'Bayu Kusuma', 'Laki-laki', '2010-01-01', class_ids[1], 'Sri Nasution', '085200000252', 'Jl. Merdeka No. 252', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240253', '0050000253', 'Fajar Sinaga', 'Laki-laki', '2010-01-01', class_ids[2], 'Dwi Aditya', '085200000253', 'Jl. Merdeka No. 253', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240254', '0050000254', 'Bayu Pratama', 'Laki-laki', '2010-01-01', class_ids[3], 'Sari Putra', '085200000254', 'Jl. Merdeka No. 254', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240255', '0050000255', 'Tri Sitorus', 'Laki-laki', '2010-01-01', class_ids[4], 'Pratama Sinaga', '085200000255', 'Jl. Merdeka No. 255', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240256', '0050000256', 'Nisa Nugroho', 'Laki-laki', '2010-01-01', class_ids[5], 'Haryanto Maulana', '085200000256', 'Jl. Merdeka No. 256', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240257', '0050000257', 'Indah Siregar', 'Laki-laki', '2010-01-01', class_ids[6], 'Hidayat Setiawan', '085200000257', 'Jl. Merdeka No. 257', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240258', '0050000258', 'Ayu Hutagalung', 'Laki-laki', '2010-01-01', class_ids[7], 'Saputra Sitorus', '085200000258', 'Jl. Merdeka No. 258', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240259', '0050000259', 'Lina Harahap', 'Laki-laki', '2010-01-01', class_ids[8], 'Wulandari Gunawan', '085200000259', 'Jl. Merdeka No. 259', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240260', '0050000260', 'Arif Gunawan', 'Perempuan', '2010-01-01', class_ids[9], 'Bayu Gunawan', '085200000260', 'Jl. Merdeka No. 260', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240261', '0050000261', 'Lina Lubis', 'Laki-laki', '2010-01-01', class_ids[10], 'Ratna Wijaya', '085200000261', 'Jl. Merdeka No. 261', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240262', '0050000262', 'Arif Gunawan', 'Perempuan', '2010-01-01', class_ids[11], 'Wulandari Manurung', '085200000262', 'Jl. Merdeka No. 262', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240263', '0050000263', 'Sari Pratama', 'Laki-laki', '2010-01-01', class_ids[12], 'Eko Nasution', '085200000263', 'Jl. Merdeka No. 263', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240264', '0050000264', 'Yudi Sinaga', 'Laki-laki', '2010-01-01', class_ids[1], 'Indah Hidayat', '085200000264', 'Jl. Merdeka No. 264', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240265', '0050000265', 'Haryanto Nugroho', 'Perempuan', '2010-01-01', class_ids[2], 'Hendra Tarihoran', '085200000265', 'Jl. Merdeka No. 265', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240266', '0050000266', 'Wati Putra', 'Perempuan', '2010-01-01', class_ids[3], 'Dian Firmansyah', '085200000266', 'Jl. Merdeka No. 266', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240267', '0050000267', 'Saputra Tarihoran', 'Perempuan', '2010-01-01', class_ids[4], 'Bayu Sitorus', '085200000267', 'Jl. Merdeka No. 267', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240268', '0050000268', 'Kurniawan Saputra', 'Perempuan', '2010-01-01', class_ids[5], 'Rizki Manurung', '085200000268', 'Jl. Merdeka No. 268', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240269', '0050000269', 'Rizki Wijaya', 'Perempuan', '2010-01-01', class_ids[6], 'Saputra Kusuma', '085200000269', 'Jl. Merdeka No. 269', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240270', '0050000270', 'Rani Sitorus', 'Laki-laki', '2010-01-01', class_ids[7], 'Rani Sihombing', '085200000270', 'Jl. Merdeka No. 270', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240271', '0050000271', 'Siti Simanjuntak', 'Laki-laki', '2010-01-01', class_ids[8], 'Hidayat Setiawan', '085200000271', 'Jl. Merdeka No. 271', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240272', '0050000272', 'Tari Hidayat', 'Laki-laki', '2010-01-01', class_ids[9], 'Putri Nasution', '085200000272', 'Jl. Merdeka No. 272', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240273', '0050000273', 'Fitri Manurung', 'Laki-laki', '2010-01-01', class_ids[10], 'Sari Gunawan', '085200000273', 'Jl. Merdeka No. 273', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240274', '0050000274', 'Syahputra Simanjuntak', 'Laki-laki', '2010-01-01', class_ids[11], 'Agus Manurung', '085200000274', 'Jl. Merdeka No. 274', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240275', '0050000275', 'Hendra Firmansyah', 'Laki-laki', '2010-01-01', class_ids[12], 'Eko Wijaya', '085200000275', 'Jl. Merdeka No. 275', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240276', '0050000276', 'Faisal Hutagalung', 'Perempuan', '2010-01-01', class_ids[1], 'Rina Pratama', '085200000276', 'Jl. Merdeka No. 276', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240277', '0050000277', 'Susanti Siregar', 'Laki-laki', '2010-01-01', class_ids[2], 'Dimas Sinaga', '085200000277', 'Jl. Merdeka No. 277', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240278', '0050000278', 'Rani Kusuma', 'Laki-laki', '2010-01-01', class_ids[3], 'Wahyu Hutagalung', '085200000278', 'Jl. Merdeka No. 278', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240279', '0050000279', 'Putri Simanjuntak', 'Laki-laki', '2010-01-01', class_ids[4], 'Budi Kusuma', '085200000279', 'Jl. Merdeka No. 279', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240280', '0050000280', 'Dewi Tarihoran', 'Perempuan', '2010-01-01', class_ids[5], 'Lestari Kusuma', '085200000280', 'Jl. Merdeka No. 280', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240281', '0050000281', 'Andi Tarihoran', 'Laki-laki', '2010-01-01', class_ids[6], 'Maya Aditya', '085200000281', 'Jl. Merdeka No. 281', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240282', '0050000282', 'Wulandari Firmansyah', 'Perempuan', '2010-01-01', class_ids[7], 'Sari Siregar', '085200000282', 'Jl. Merdeka No. 282', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240283', '0050000283', 'Eko Harahap', 'Perempuan', '2010-01-01', class_ids[8], 'Rahayu Setiawan', '085200000283', 'Jl. Merdeka No. 283', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240284', '0050000284', 'Tari Manurung', 'Laki-laki', '2010-01-01', class_ids[9], 'Rina Maulana', '085200000284', 'Jl. Merdeka No. 284', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240285', '0050000285', 'Maya Tarihoran', 'Perempuan', '2010-01-01', class_ids[10], 'Ahmad Pangestu', '085200000285', 'Jl. Merdeka No. 285', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240286', '0050000286', 'Hendra Kusuma', 'Laki-laki', '2010-01-01', class_ids[11], 'Rahmawati Nababan', '085200000286', 'Jl. Merdeka No. 286', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240287', '0050000287', 'Fitri Siregar', 'Laki-laki', '2010-01-01', class_ids[12], 'Rani Kusuma', '085200000287', 'Jl. Merdeka No. 287', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240288', '0050000288', 'Rahmawati Putra', 'Laki-laki', '2010-01-01', class_ids[1], 'Lestari Saputra', '085200000288', 'Jl. Merdeka No. 288', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240289', '0050000289', 'Sari Santoso', 'Perempuan', '2010-01-01', class_ids[2], 'Sri Hasibuan', '085200000289', 'Jl. Merdeka No. 289', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240290', '0050000290', 'Syahputra Aditya', 'Laki-laki', '2010-01-01', class_ids[3], 'Yudi Panjaitan', '085200000290', 'Jl. Merdeka No. 290', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240291', '0050000291', 'Budi Siregar', 'Laki-laki', '2010-01-01', class_ids[4], 'Hendra Aditya', '085200000291', 'Jl. Merdeka No. 291', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240292', '0050000292', 'Budi Manurung', 'Perempuan', '2010-01-01', class_ids[5], 'Syahputra Maulana', '085200000292', 'Jl. Merdeka No. 292', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240293', '0050000293', 'Eko Hidayat', 'Laki-laki', '2010-01-01', class_ids[6], 'Agus Setiawan', '085200000293', 'Jl. Merdeka No. 293', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240294', '0050000294', 'Dian Dalimunthe', 'Perempuan', '2010-01-01', class_ids[7], 'Wulandari Maulana', '085200000294', 'Jl. Merdeka No. 294', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240295', '0050000295', 'Lina Saputra', 'Perempuan', '2010-01-01', class_ids[8], 'Lina Simanjuntak', '085200000295', 'Jl. Merdeka No. 295', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240296', '0050000296', 'Bayu Nugroho', 'Laki-laki', '2010-01-01', class_ids[9], 'Saputra Sitompul', '085200000296', 'Jl. Merdeka No. 296', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240297', '0050000297', 'Andi Gunawan', 'Laki-laki', '2010-01-01', class_ids[10], 'Rahmawati Putra', '085200000297', 'Jl. Merdeka No. 297', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240298', '0050000298', 'Rahayu Pratama', 'Perempuan', '2010-01-01', class_ids[11], 'Wahyu Nasution', '085200000298', 'Jl. Merdeka No. 298', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240299', '0050000299', 'Rahmawati Nasution', 'Perempuan', '2010-01-01', class_ids[12], 'Dimas Sitompul', '085200000299', 'Jl. Merdeka No. 299', 'Aktif');

    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '20240300', '0050000300', 'Ratna Nababan', 'Laki-laki', '2010-01-01', class_ids[1], 'Haryanto Saputra', '085200000300', 'Jl. Merdeka No. 300', 'Aktif');

    -- 5. INSERT COMPETITIONS

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Olimpiade Sains Nasional (OSN)', 'Pemerintah Provinsi', 'Kecamatan', 'Akademik', '2023', '2023-06-01', '2023-06-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Festival Lomba Seni Siswa Nasional (FLS2N)', 'Universitas Indonesia', 'Provinsi', 'Seni', '2025', '2025-03-01', '2025-03-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Olimpiade Olahraga Siswa Nasional (O2SN)', 'Universitas Indonesia', 'Kecamatan', 'Olahraga', '2024', '2024-08-01', '2024-08-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Lomba Cerdas Cermat', 'Universitas Indonesia', 'Internasional', 'Akademik', '2022', '2022-08-01', '2022-08-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Lomba Karya Tulis Ilmiah', 'Dinas Pendidikan', 'Kabupaten', 'Akademik', '2022', '2022-11-01', '2022-11-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Kompetisi Robotik Nasional', 'Pusat Prestasi Nasional', 'Provinsi', 'Teknologi', '2024', '2024-09-01', '2024-09-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Pentas Pendidikan Agama Islam', 'Dinas Pendidikan', 'Internasional', 'Keagamaan', '2023', '2023-01-01', '2023-01-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Kompetisi Sains Madrasah (KSM)', 'Kementerian Agama', 'Internasional', 'Akademik', '2023', '2023-04-01', '2023-04-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Lomba Debat Bahasa Indonesia', 'Dinas Pendidikan', 'Kabupaten', 'Bahasa', '2025', '2025-08-01', '2025-08-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Lomba Debat Bahasa Inggris', 'Dinas Pendidikan', 'Kabupaten', 'Bahasa', '2022', '2022-04-01', '2022-04-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Musabaqah Tilawatil Quran (MTQ)', 'Pusat Prestasi Nasional', 'Provinsi', 'Keagamaan', '2022', '2022-05-01', '2022-05-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Lomba Pidato', 'Dinas Pendidikan', 'Internasional', 'Bahasa', '2025', '2025-07-01', '2025-07-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Lomba Menulis Puisi', 'Pemerintah Provinsi', 'Kabupaten', 'Bahasa', '2024', '2024-11-01', '2024-11-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Lomba Menyanyi Solo', 'Dinas Pendidikan', 'Internasional', 'Seni', '2023', '2023-02-01', '2023-02-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Lomba Tari Tradisional', 'Dinas Pendidikan', 'Provinsi', 'Seni', '2024', '2024-08-01', '2024-08-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Lomba Melukis', 'Universitas Indonesia', 'Internasional', 'Seni', '2023', '2023-03-01', '2023-03-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Lomba Desain Grafis', 'Dinas Pendidikan', 'Sekolah', 'Teknologi', '2023', '2023-02-01', '2023-02-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Lomba Pemrograman Web', 'Pusat Prestasi Nasional', 'Provinsi', 'Teknologi', '2025', '2025-07-01', '2025-07-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Lomba Cipta Game Edukasi', 'Kementerian Agama', 'Provinsi', 'Teknologi', '2024', '2024-05-01', '2024-05-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Lomba Fotografi', 'Dinas Pendidikan', 'Kecamatan', 'Seni', '2024', '2024-02-01', '2024-02-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Lomba Film Pendek', 'Dinas Pendidikan', 'Provinsi', 'Seni', '2024', '2024-10-01', '2024-10-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Lomba Jurnalistik', 'Dinas Pendidikan', 'Internasional', 'Bahasa', '2025', '2025-05-01', '2025-05-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Kejuaraan Pencak Silat', 'Kementerian Agama', 'Internasional', 'Olahraga', '2022', '2022-09-01', '2022-09-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Kejuaraan Karate', 'Dinas Pendidikan', 'Kecamatan', 'Olahraga', '2022', '2022-08-01', '2022-08-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Kejuaraan Taekwondo', 'Pusat Prestasi Nasional', 'Sekolah', 'Olahraga', '2025', '2025-08-01', '2025-08-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Turnamen Futsal', 'Pusat Prestasi Nasional', 'Kecamatan', 'Olahraga', '2024', '2024-11-01', '2024-11-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Turnamen Bola Voli', 'Dinas Pendidikan', 'Internasional', 'Olahraga', '2023', '2023-11-01', '2023-11-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Turnamen Bola Basket', 'Dinas Pendidikan', 'Provinsi', 'Olahraga', '2025', '2025-02-01', '2025-02-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Turnamen Bulu Tangkis', 'Kementerian Agama', 'Nasional', 'Olahraga', '2024', '2024-03-01', '2024-03-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Turnamen Tenis Meja', 'Dinas Pendidikan', 'Provinsi', 'Olahraga', '2023', '2023-06-01', '2023-06-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Turnamen Catur', 'Pemerintah Provinsi', 'Sekolah', 'Olahraga', '2024', '2024-11-01', '2024-11-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Lomba Senam SKJ', 'Universitas Indonesia', 'Kabupaten', 'Olahraga', '2023', '2023-04-01', '2023-04-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Lomba Baris Berbaris', 'Pemerintah Provinsi', 'Internasional', 'Kepemimpinan', '2025', '2025-10-01', '2025-10-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Lomba Palang Merah Remaja', 'Pemerintah Provinsi', 'Nasional', 'Kepemimpinan', '2025', '2025-10-01', '2025-10-05');

    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, 'Lomba Pramuka', 'Universitas Indonesia', 'Provinsi', 'Kepemimpinan', '2022', '2022-07-01', '2022-07-05');

    -- 6. INSERT ACHIEVEMENTS

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[43], comp_ids[17], 'Lomba Desain Grafis', 'Teknologi', 'Sekolah', 'Juara 3', '2023-02-15', 'Diverifikasi', 81);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[185], comp_ids[33], 'Lomba Baris Berbaris', 'Kepemimpinan', 'Internasional', 'Juara 3', '2025-10-15', 'Diverifikasi', 96);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[63], comp_ids[16], 'Lomba Melukis', 'Seni', 'Internasional', 'Harapan 1', '2023-03-15', 'Diverifikasi', 94);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[126], comp_ids[18], 'Lomba Pemrograman Web', 'Teknologi', 'Provinsi', 'Juara 3', '2025-07-15', 'Diverifikasi', 94);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[10], comp_ids[30], 'Turnamen Tenis Meja', 'Olahraga', 'Provinsi', 'Juara 1', '2023-06-15', 'Diverifikasi', 99);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[282], comp_ids[34], 'Lomba Palang Merah Remaja', 'Kepemimpinan', 'Nasional', 'Juara 2', '2025-10-15', 'Diverifikasi', 83);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[122], comp_ids[26], 'Turnamen Futsal', 'Olahraga', 'Kecamatan', 'Juara 2', '2024-11-15', 'Diverifikasi', 99);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[284], comp_ids[11], 'Musabaqah Tilawatil Quran (MTQ)', 'Keagamaan', 'Provinsi', 'Juara 2', '2022-05-15', 'Diverifikasi', 96);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[121], comp_ids[29], 'Turnamen Bulu Tangkis', 'Olahraga', 'Nasional', 'Juara 3', '2024-03-15', 'Diverifikasi', 91);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[184], comp_ids[4], 'Lomba Cerdas Cermat', 'Akademik', 'Internasional', 'Juara 2', '2022-08-15', 'Diverifikasi', 89);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[264], comp_ids[26], 'Turnamen Futsal', 'Olahraga', 'Kecamatan', 'Harapan 1', '2024-11-15', 'Diverifikasi', 80);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[100], comp_ids[24], 'Kejuaraan Karate', 'Olahraga', 'Kecamatan', 'Harapan 1', '2022-08-15', 'Diverifikasi', 88);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[255], comp_ids[24], 'Kejuaraan Karate', 'Olahraga', 'Kecamatan', 'Juara 3', '2022-08-15', 'Diverifikasi', 91);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[75], comp_ids[7], 'Pentas Pendidikan Agama Islam', 'Keagamaan', 'Internasional', 'Juara 1', '2023-01-15', 'Diverifikasi', 98);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[136], comp_ids[30], 'Turnamen Tenis Meja', 'Olahraga', 'Provinsi', 'Harapan 1', '2023-06-15', 'Diverifikasi', 91);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[35], comp_ids[1], 'Olimpiade Sains Nasional (OSN)', 'Akademik', 'Kecamatan', 'Juara 3', '2023-06-15', 'Diverifikasi', 90);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[186], comp_ids[9], 'Lomba Debat Bahasa Indonesia', 'Bahasa', 'Kabupaten', 'Harapan 1', '2025-08-15', 'Diverifikasi', 87);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[98], comp_ids[13], 'Lomba Menulis Puisi', 'Bahasa', 'Kabupaten', 'Juara 1', '2024-11-15', 'Diverifikasi', 87);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[84], comp_ids[21], 'Lomba Film Pendek', 'Seni', 'Provinsi', 'Juara 1', '2024-10-15', 'Diverifikasi', 92);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[187], comp_ids[35], 'Lomba Pramuka', 'Kepemimpinan', 'Provinsi', 'Juara 3', '2022-07-15', 'Diverifikasi', 91);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[240], comp_ids[3], 'Olimpiade Olahraga Siswa Nasional (O2SN)', 'Olahraga', 'Kecamatan', 'Juara 1', '2024-08-15', 'Diverifikasi', 82);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[117], comp_ids[35], 'Lomba Pramuka', 'Kepemimpinan', 'Provinsi', 'Juara 1', '2022-07-15', 'Diverifikasi', 94);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[32], comp_ids[3], 'Olimpiade Olahraga Siswa Nasional (O2SN)', 'Olahraga', 'Kecamatan', 'Juara 3', '2024-08-15', 'Diverifikasi', 81);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[79], comp_ids[16], 'Lomba Melukis', 'Seni', 'Internasional', 'Juara 2', '2023-03-15', 'Diverifikasi', 92);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[30], comp_ids[21], 'Lomba Film Pendek', 'Seni', 'Provinsi', 'Juara 3', '2024-10-15', 'Diverifikasi', 90);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[127], comp_ids[1], 'Olimpiade Sains Nasional (OSN)', 'Akademik', 'Kecamatan', 'Juara 1', '2023-06-15', 'Diverifikasi', 80);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[102], comp_ids[21], 'Lomba Film Pendek', 'Seni', 'Provinsi', 'Juara 1', '2024-10-15', 'Diverifikasi', 88);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[38], comp_ids[23], 'Kejuaraan Pencak Silat', 'Olahraga', 'Internasional', 'Juara 1', '2022-09-15', 'Diverifikasi', 87);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[160], comp_ids[4], 'Lomba Cerdas Cermat', 'Akademik', 'Internasional', 'Juara 3', '2022-08-15', 'Diverifikasi', 92);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[276], comp_ids[11], 'Musabaqah Tilawatil Quran (MTQ)', 'Keagamaan', 'Provinsi', 'Juara 3', '2022-05-15', 'Diverifikasi', 98);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[221], comp_ids[16], 'Lomba Melukis', 'Seni', 'Internasional', 'Harapan 1', '2023-03-15', 'Diverifikasi', 86);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[128], comp_ids[35], 'Lomba Pramuka', 'Kepemimpinan', 'Provinsi', 'Juara 2', '2022-07-15', 'Diverifikasi', 85);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[145], comp_ids[5], 'Lomba Karya Tulis Ilmiah', 'Akademik', 'Kabupaten', 'Juara 2', '2022-11-15', 'Diverifikasi', 99);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[119], comp_ids[2], 'Festival Lomba Seni Siswa Nasional (FLS2N)', 'Seni', 'Provinsi', 'Juara 3', '2025-03-15', 'Diverifikasi', 96);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[47], comp_ids[4], 'Lomba Cerdas Cermat', 'Akademik', 'Internasional', 'Juara 3', '2022-08-15', 'Diverifikasi', 85);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[108], comp_ids[15], 'Lomba Tari Tradisional', 'Seni', 'Provinsi', 'Juara 2', '2024-08-15', 'Diverifikasi', 94);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[122], comp_ids[25], 'Kejuaraan Taekwondo', 'Olahraga', 'Sekolah', 'Harapan 1', '2025-08-15', 'Diverifikasi', 88);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[72], comp_ids[2], 'Festival Lomba Seni Siswa Nasional (FLS2N)', 'Seni', 'Provinsi', 'Juara 2', '2025-03-15', 'Diverifikasi', 94);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[136], comp_ids[7], 'Pentas Pendidikan Agama Islam', 'Keagamaan', 'Internasional', 'Juara 2', '2023-01-15', 'Diverifikasi', 80);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[165], comp_ids[30], 'Turnamen Tenis Meja', 'Olahraga', 'Provinsi', 'Juara 3', '2023-06-15', 'Diverifikasi', 84);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[242], comp_ids[22], 'Lomba Jurnalistik', 'Bahasa', 'Internasional', 'Juara 3', '2025-05-15', 'Diverifikasi', 93);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[188], comp_ids[7], 'Pentas Pendidikan Agama Islam', 'Keagamaan', 'Internasional', 'Juara 2', '2023-01-15', 'Diverifikasi', 90);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[171], comp_ids[34], 'Lomba Palang Merah Remaja', 'Kepemimpinan', 'Nasional', 'Juara 3', '2025-10-15', 'Diverifikasi', 80);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[199], comp_ids[25], 'Kejuaraan Taekwondo', 'Olahraga', 'Sekolah', 'Juara 1', '2025-08-15', 'Diverifikasi', 83);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[47], comp_ids[12], 'Lomba Pidato', 'Bahasa', 'Internasional', 'Harapan 1', '2025-07-15', 'Diverifikasi', 87);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[172], comp_ids[32], 'Lomba Senam SKJ', 'Olahraga', 'Kabupaten', 'Juara 2', '2023-04-15', 'Diverifikasi', 89);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[95], comp_ids[24], 'Kejuaraan Karate', 'Olahraga', 'Kecamatan', 'Harapan 1', '2022-08-15', 'Diverifikasi', 85);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[59], comp_ids[31], 'Turnamen Catur', 'Olahraga', 'Sekolah', 'Juara 2', '2024-11-15', 'Diverifikasi', 97);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[64], comp_ids[13], 'Lomba Menulis Puisi', 'Bahasa', 'Kabupaten', 'Harapan 1', '2024-11-15', 'Diverifikasi', 88);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[292], comp_ids[13], 'Lomba Menulis Puisi', 'Bahasa', 'Kabupaten', 'Juara 1', '2024-11-15', 'Diverifikasi', 85);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[43], comp_ids[14], 'Lomba Menyanyi Solo', 'Seni', 'Internasional', 'Juara 3', '2023-02-15', 'Diverifikasi', 99);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[292], comp_ids[29], 'Turnamen Bulu Tangkis', 'Olahraga', 'Nasional', 'Harapan 1', '2024-03-15', 'Diverifikasi', 88);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[102], comp_ids[33], 'Lomba Baris Berbaris', 'Kepemimpinan', 'Internasional', 'Harapan 1', '2025-10-15', 'Diverifikasi', 94);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[247], comp_ids[27], 'Turnamen Bola Voli', 'Olahraga', 'Internasional', 'Juara 2', '2023-11-15', 'Diverifikasi', 82);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[130], comp_ids[31], 'Turnamen Catur', 'Olahraga', 'Sekolah', 'Juara 1', '2024-11-15', 'Diverifikasi', 90);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[170], comp_ids[13], 'Lomba Menulis Puisi', 'Bahasa', 'Kabupaten', 'Juara 3', '2024-11-15', 'Diverifikasi', 83);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[142], comp_ids[12], 'Lomba Pidato', 'Bahasa', 'Internasional', 'Juara 3', '2025-07-15', 'Diverifikasi', 97);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[48], comp_ids[34], 'Lomba Palang Merah Remaja', 'Kepemimpinan', 'Nasional', 'Juara 2', '2025-10-15', 'Diverifikasi', 98);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[225], comp_ids[20], 'Lomba Fotografi', 'Seni', 'Kecamatan', 'Juara 2', '2024-02-15', 'Diverifikasi', 96);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[30], comp_ids[16], 'Lomba Melukis', 'Seni', 'Internasional', 'Juara 3', '2023-03-15', 'Diverifikasi', 95);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[92], comp_ids[20], 'Lomba Fotografi', 'Seni', 'Kecamatan', 'Harapan 1', '2024-02-15', 'Diverifikasi', 92);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[95], comp_ids[5], 'Lomba Karya Tulis Ilmiah', 'Akademik', 'Kabupaten', 'Juara 2', '2022-11-15', 'Diverifikasi', 80);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[166], comp_ids[18], 'Lomba Pemrograman Web', 'Teknologi', 'Provinsi', 'Juara 2', '2025-07-15', 'Diverifikasi', 81);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[247], comp_ids[4], 'Lomba Cerdas Cermat', 'Akademik', 'Internasional', 'Juara 2', '2022-08-15', 'Diverifikasi', 81);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[297], comp_ids[22], 'Lomba Jurnalistik', 'Bahasa', 'Internasional', 'Juara 3', '2025-05-15', 'Diverifikasi', 91);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[138], comp_ids[14], 'Lomba Menyanyi Solo', 'Seni', 'Internasional', 'Juara 1', '2023-02-15', 'Diverifikasi', 95);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[155], comp_ids[16], 'Lomba Melukis', 'Seni', 'Internasional', 'Juara 2', '2023-03-15', 'Diverifikasi', 92);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[194], comp_ids[27], 'Turnamen Bola Voli', 'Olahraga', 'Internasional', 'Juara 3', '2023-11-15', 'Diverifikasi', 89);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[102], comp_ids[9], 'Lomba Debat Bahasa Indonesia', 'Bahasa', 'Kabupaten', 'Juara 1', '2025-08-15', 'Diverifikasi', 92);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[264], comp_ids[16], 'Lomba Melukis', 'Seni', 'Internasional', 'Juara 1', '2023-03-15', 'Diverifikasi', 90);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[76], comp_ids[32], 'Lomba Senam SKJ', 'Olahraga', 'Kabupaten', 'Juara 2', '2023-04-15', 'Diverifikasi', 92);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[159], comp_ids[4], 'Lomba Cerdas Cermat', 'Akademik', 'Internasional', 'Juara 2', '2022-08-15', 'Diverifikasi', 84);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[260], comp_ids[8], 'Kompetisi Sains Madrasah (KSM)', 'Akademik', 'Internasional', 'Harapan 1', '2023-04-15', 'Diverifikasi', 81);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[208], comp_ids[3], 'Olimpiade Olahraga Siswa Nasional (O2SN)', 'Olahraga', 'Kecamatan', 'Juara 3', '2024-08-15', 'Diverifikasi', 80);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[71], comp_ids[30], 'Turnamen Tenis Meja', 'Olahraga', 'Provinsi', 'Juara 1', '2023-06-15', 'Diverifikasi', 98);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[198], comp_ids[9], 'Lomba Debat Bahasa Indonesia', 'Bahasa', 'Kabupaten', 'Juara 2', '2025-08-15', 'Diverifikasi', 93);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[135], comp_ids[8], 'Kompetisi Sains Madrasah (KSM)', 'Akademik', 'Internasional', 'Juara 1', '2023-04-15', 'Diverifikasi', 95);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[183], comp_ids[2], 'Festival Lomba Seni Siswa Nasional (FLS2N)', 'Seni', 'Provinsi', 'Juara 3', '2025-03-15', 'Diverifikasi', 95);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[236], comp_ids[29], 'Turnamen Bulu Tangkis', 'Olahraga', 'Nasional', 'Harapan 1', '2024-03-15', 'Diverifikasi', 80);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[61], comp_ids[15], 'Lomba Tari Tradisional', 'Seni', 'Provinsi', 'Juara 3', '2024-08-15', 'Diverifikasi', 92);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[130], comp_ids[25], 'Kejuaraan Taekwondo', 'Olahraga', 'Sekolah', 'Harapan 1', '2025-08-15', 'Diverifikasi', 99);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[119], comp_ids[13], 'Lomba Menulis Puisi', 'Bahasa', 'Kabupaten', 'Juara 1', '2024-11-15', 'Diverifikasi', 85);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[101], comp_ids[26], 'Turnamen Futsal', 'Olahraga', 'Kecamatan', 'Juara 2', '2024-11-15', 'Diverifikasi', 90);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[275], comp_ids[2], 'Festival Lomba Seni Siswa Nasional (FLS2N)', 'Seni', 'Provinsi', 'Juara 2', '2025-03-15', 'Diverifikasi', 90);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[263], comp_ids[2], 'Festival Lomba Seni Siswa Nasional (FLS2N)', 'Seni', 'Provinsi', 'Harapan 1', '2025-03-15', 'Diverifikasi', 86);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[99], comp_ids[24], 'Kejuaraan Karate', 'Olahraga', 'Kecamatan', 'Harapan 1', '2022-08-15', 'Diverifikasi', 82);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[21], comp_ids[21], 'Lomba Film Pendek', 'Seni', 'Provinsi', 'Juara 1', '2024-10-15', 'Diverifikasi', 90);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[217], comp_ids[13], 'Lomba Menulis Puisi', 'Bahasa', 'Kabupaten', 'Harapan 1', '2024-11-15', 'Diverifikasi', 94);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[118], comp_ids[18], 'Lomba Pemrograman Web', 'Teknologi', 'Provinsi', 'Harapan 1', '2025-07-15', 'Diverifikasi', 92);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[240], comp_ids[5], 'Lomba Karya Tulis Ilmiah', 'Akademik', 'Kabupaten', 'Juara 3', '2022-11-15', 'Diverifikasi', 85);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[155], comp_ids[4], 'Lomba Cerdas Cermat', 'Akademik', 'Internasional', 'Harapan 1', '2022-08-15', 'Diverifikasi', 92);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[226], comp_ids[10], 'Lomba Debat Bahasa Inggris', 'Bahasa', 'Kabupaten', 'Juara 1', '2022-04-15', 'Diverifikasi', 88);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[269], comp_ids[20], 'Lomba Fotografi', 'Seni', 'Kecamatan', 'Harapan 1', '2024-02-15', 'Diverifikasi', 93);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[57], comp_ids[2], 'Festival Lomba Seni Siswa Nasional (FLS2N)', 'Seni', 'Provinsi', 'Juara 1', '2025-03-15', 'Diverifikasi', 82);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[287], comp_ids[8], 'Kompetisi Sains Madrasah (KSM)', 'Akademik', 'Internasional', 'Juara 1', '2023-04-15', 'Diverifikasi', 88);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[96], comp_ids[13], 'Lomba Menulis Puisi', 'Bahasa', 'Kabupaten', 'Juara 1', '2024-11-15', 'Diverifikasi', 86);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[182], comp_ids[34], 'Lomba Palang Merah Remaja', 'Kepemimpinan', 'Nasional', 'Juara 3', '2025-10-15', 'Diverifikasi', 90);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[197], comp_ids[33], 'Lomba Baris Berbaris', 'Kepemimpinan', 'Internasional', 'Juara 1', '2025-10-15', 'Diverifikasi', 91);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[71], comp_ids[34], 'Lomba Palang Merah Remaja', 'Kepemimpinan', 'Nasional', 'Harapan 1', '2025-10-15', 'Diverifikasi', 87);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[231], comp_ids[22], 'Lomba Jurnalistik', 'Bahasa', 'Internasional', 'Juara 3', '2025-05-15', 'Diverifikasi', 84);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[94], comp_ids[10], 'Lomba Debat Bahasa Inggris', 'Bahasa', 'Kabupaten', 'Harapan 1', '2022-04-15', 'Diverifikasi', 89);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[75], comp_ids[32], 'Lomba Senam SKJ', 'Olahraga', 'Kabupaten', 'Juara 3', '2023-04-15', 'Diverifikasi', 89);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[234], comp_ids[18], 'Lomba Pemrograman Web', 'Teknologi', 'Provinsi', 'Juara 1', '2025-07-15', 'Diverifikasi', 85);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[276], comp_ids[23], 'Kejuaraan Pencak Silat', 'Olahraga', 'Internasional', 'Juara 1', '2022-09-15', 'Diverifikasi', 84);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[64], comp_ids[20], 'Lomba Fotografi', 'Seni', 'Kecamatan', 'Juara 3', '2024-02-15', 'Diverifikasi', 96);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[63], comp_ids[1], 'Olimpiade Sains Nasional (OSN)', 'Akademik', 'Kecamatan', 'Juara 2', '2023-06-15', 'Diverifikasi', 91);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[219], comp_ids[7], 'Pentas Pendidikan Agama Islam', 'Keagamaan', 'Internasional', 'Juara 2', '2023-01-15', 'Diverifikasi', 99);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[100], comp_ids[18], 'Lomba Pemrograman Web', 'Teknologi', 'Provinsi', 'Harapan 1', '2025-07-15', 'Diverifikasi', 97);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[129], comp_ids[12], 'Lomba Pidato', 'Bahasa', 'Internasional', 'Juara 2', '2025-07-15', 'Diverifikasi', 99);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[232], comp_ids[24], 'Kejuaraan Karate', 'Olahraga', 'Kecamatan', 'Juara 1', '2022-08-15', 'Diverifikasi', 85);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[226], comp_ids[5], 'Lomba Karya Tulis Ilmiah', 'Akademik', 'Kabupaten', 'Juara 3', '2022-11-15', 'Diverifikasi', 88);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[273], comp_ids[30], 'Turnamen Tenis Meja', 'Olahraga', 'Provinsi', 'Harapan 1', '2023-06-15', 'Diverifikasi', 90);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[21], comp_ids[17], 'Lomba Desain Grafis', 'Teknologi', 'Sekolah', 'Juara 3', '2023-02-15', 'Diverifikasi', 84);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[252], comp_ids[23], 'Kejuaraan Pencak Silat', 'Olahraga', 'Internasional', 'Juara 2', '2022-09-15', 'Diverifikasi', 96);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[100], comp_ids[13], 'Lomba Menulis Puisi', 'Bahasa', 'Kabupaten', 'Juara 2', '2024-11-15', 'Diverifikasi', 96);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[174], comp_ids[15], 'Lomba Tari Tradisional', 'Seni', 'Provinsi', 'Juara 1', '2024-08-15', 'Diverifikasi', 80);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[184], comp_ids[23], 'Kejuaraan Pencak Silat', 'Olahraga', 'Internasional', 'Harapan 1', '2022-09-15', 'Diverifikasi', 96);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[201], comp_ids[2], 'Festival Lomba Seni Siswa Nasional (FLS2N)', 'Seni', 'Provinsi', 'Juara 1', '2025-03-15', 'Diverifikasi', 91);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[56], comp_ids[19], 'Lomba Cipta Game Edukasi', 'Teknologi', 'Provinsi', 'Juara 1', '2024-05-15', 'Diverifikasi', 97);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[83], comp_ids[27], 'Turnamen Bola Voli', 'Olahraga', 'Internasional', 'Harapan 1', '2023-11-15', 'Diverifikasi', 82);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[290], comp_ids[24], 'Kejuaraan Karate', 'Olahraga', 'Kecamatan', 'Juara 1', '2022-08-15', 'Diverifikasi', 99);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[205], comp_ids[7], 'Pentas Pendidikan Agama Islam', 'Keagamaan', 'Internasional', 'Harapan 1', '2023-01-15', 'Diverifikasi', 84);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[278], comp_ids[21], 'Lomba Film Pendek', 'Seni', 'Provinsi', 'Juara 3', '2024-10-15', 'Diverifikasi', 94);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[299], comp_ids[31], 'Turnamen Catur', 'Olahraga', 'Sekolah', 'Juara 2', '2024-11-15', 'Diverifikasi', 89);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[177], comp_ids[31], 'Turnamen Catur', 'Olahraga', 'Sekolah', 'Juara 3', '2024-11-15', 'Diverifikasi', 87);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[173], comp_ids[27], 'Turnamen Bola Voli', 'Olahraga', 'Internasional', 'Harapan 1', '2023-11-15', 'Diverifikasi', 86);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[48], comp_ids[25], 'Kejuaraan Taekwondo', 'Olahraga', 'Sekolah', 'Harapan 1', '2025-08-15', 'Diverifikasi', 98);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[265], comp_ids[18], 'Lomba Pemrograman Web', 'Teknologi', 'Provinsi', 'Harapan 1', '2025-07-15', 'Diverifikasi', 83);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[201], comp_ids[32], 'Lomba Senam SKJ', 'Olahraga', 'Kabupaten', 'Juara 1', '2023-04-15', 'Diverifikasi', 96);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[6], comp_ids[19], 'Lomba Cipta Game Edukasi', 'Teknologi', 'Provinsi', 'Juara 3', '2024-05-15', 'Diverifikasi', 85);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[89], comp_ids[6], 'Kompetisi Robotik Nasional', 'Teknologi', 'Provinsi', 'Juara 2', '2024-09-15', 'Diverifikasi', 88);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[61], comp_ids[12], 'Lomba Pidato', 'Bahasa', 'Internasional', 'Harapan 1', '2025-07-15', 'Diverifikasi', 83);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[25], comp_ids[13], 'Lomba Menulis Puisi', 'Bahasa', 'Kabupaten', 'Harapan 1', '2024-11-15', 'Diverifikasi', 98);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[167], comp_ids[6], 'Kompetisi Robotik Nasional', 'Teknologi', 'Provinsi', 'Juara 2', '2024-09-15', 'Diverifikasi', 96);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[177], comp_ids[34], 'Lomba Palang Merah Remaja', 'Kepemimpinan', 'Nasional', 'Harapan 1', '2025-10-15', 'Diverifikasi', 81);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[212], comp_ids[6], 'Kompetisi Robotik Nasional', 'Teknologi', 'Provinsi', 'Juara 3', '2024-09-15', 'Diverifikasi', 82);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[7], comp_ids[13], 'Lomba Menulis Puisi', 'Bahasa', 'Kabupaten', 'Juara 2', '2024-11-15', 'Diverifikasi', 89);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[211], comp_ids[16], 'Lomba Melukis', 'Seni', 'Internasional', 'Harapan 1', '2023-03-15', 'Diverifikasi', 84);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[300], comp_ids[19], 'Lomba Cipta Game Edukasi', 'Teknologi', 'Provinsi', 'Juara 3', '2024-05-15', 'Diverifikasi', 80);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[300], comp_ids[10], 'Lomba Debat Bahasa Inggris', 'Bahasa', 'Kabupaten', 'Juara 3', '2022-04-15', 'Diverifikasi', 87);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[70], comp_ids[32], 'Lomba Senam SKJ', 'Olahraga', 'Kabupaten', 'Juara 3', '2023-04-15', 'Diverifikasi', 83);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[276], comp_ids[20], 'Lomba Fotografi', 'Seni', 'Kecamatan', 'Juara 3', '2024-02-15', 'Diverifikasi', 94);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[22], comp_ids[9], 'Lomba Debat Bahasa Indonesia', 'Bahasa', 'Kabupaten', 'Juara 3', '2025-08-15', 'Diverifikasi', 86);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[147], comp_ids[33], 'Lomba Baris Berbaris', 'Kepemimpinan', 'Internasional', 'Juara 3', '2025-10-15', 'Diverifikasi', 86);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[178], comp_ids[12], 'Lomba Pidato', 'Bahasa', 'Internasional', 'Harapan 1', '2025-07-15', 'Diverifikasi', 83);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[202], comp_ids[9], 'Lomba Debat Bahasa Indonesia', 'Bahasa', 'Kabupaten', 'Harapan 1', '2025-08-15', 'Diverifikasi', 93);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[84], comp_ids[1], 'Olimpiade Sains Nasional (OSN)', 'Akademik', 'Kecamatan', 'Juara 3', '2023-06-15', 'Diverifikasi', 97);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[98], comp_ids[15], 'Lomba Tari Tradisional', 'Seni', 'Provinsi', 'Juara 3', '2024-08-15', 'Diverifikasi', 93);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[178], comp_ids[16], 'Lomba Melukis', 'Seni', 'Internasional', 'Juara 3', '2023-03-15', 'Diverifikasi', 98);

    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[60], comp_ids[25], 'Kejuaraan Taekwondo', 'Olahraga', 'Sekolah', 'Juara 1', '2025-08-15', 'Diverifikasi', 80);

    -- 7. INSERT INCUBATION PROGRAMS

    v_id := gen_random_uuid();
    prog_ids := prog_ids || v_id;
    INSERT INTO public.incubation_programs (id, name, description, target_domain, mentor_id, status, start_date, end_date)
    VALUES (v_id, 'Klub Olimpiade Matematika', 'Program pembinaan bakat khusus di bidang Akademik.', 'Akademik', teacher_ids[13], 'Active', '2024-01-15', '2024-12-15');

    v_id := gen_random_uuid();
    prog_ids := prog_ids || v_id;
    INSERT INTO public.incubation_programs (id, name, description, target_domain, mentor_id, status, start_date, end_date)
    VALUES (v_id, 'Klub Olimpiade Sains', 'Program pembinaan bakat khusus di bidang Akademik.', 'Akademik', teacher_ids[13], 'Active', '2024-01-15', '2024-12-15');

    v_id := gen_random_uuid();
    prog_ids := prog_ids || v_id;
    INSERT INTO public.incubation_programs (id, name, description, target_domain, mentor_id, status, start_date, end_date)
    VALUES (v_id, 'Ekskul Jurnalistik', 'Program pembinaan bakat khusus di bidang Bahasa.', 'Bahasa', teacher_ids[10], 'Active', '2024-01-15', '2024-12-15');

    v_id := gen_random_uuid();
    prog_ids := prog_ids || v_id;
    INSERT INTO public.incubation_programs (id, name, description, target_domain, mentor_id, status, start_date, end_date)
    VALUES (v_id, 'Ekskul Robotik', 'Program pembinaan bakat khusus di bidang Teknologi.', 'Teknologi', teacher_ids[11], 'Active', '2024-01-15', '2024-12-15');

    v_id := gen_random_uuid();
    prog_ids := prog_ids || v_id;
    INSERT INTO public.incubation_programs (id, name, description, target_domain, mentor_id, status, start_date, end_date)
    VALUES (v_id, 'Ekskul Coding', 'Program pembinaan bakat khusus di bidang Teknologi.', 'Teknologi', teacher_ids[6], 'Active', '2024-01-15', '2024-12-15');

    v_id := gen_random_uuid();
    prog_ids := prog_ids || v_id;
    INSERT INTO public.incubation_programs (id, name, description, target_domain, mentor_id, status, start_date, end_date)
    VALUES (v_id, 'Ekskul Paduan Suara', 'Program pembinaan bakat khusus di bidang Seni.', 'Seni', teacher_ids[26], 'Active', '2024-01-15', '2024-12-15');

    v_id := gen_random_uuid();
    prog_ids := prog_ids || v_id;
    INSERT INTO public.incubation_programs (id, name, description, target_domain, mentor_id, status, start_date, end_date)
    VALUES (v_id, 'Ekskul Tari Tradisional', 'Program pembinaan bakat khusus di bidang Seni.', 'Seni', teacher_ids[21], 'Active', '2024-01-15', '2024-12-15');

    v_id := gen_random_uuid();
    prog_ids := prog_ids || v_id;
    INSERT INTO public.incubation_programs (id, name, description, target_domain, mentor_id, status, start_date, end_date)
    VALUES (v_id, 'Ekskul Teater', 'Program pembinaan bakat khusus di bidang Seni.', 'Seni', teacher_ids[5], 'Active', '2024-01-15', '2024-12-15');

    v_id := gen_random_uuid();
    prog_ids := prog_ids || v_id;
    INSERT INTO public.incubation_programs (id, name, description, target_domain, mentor_id, status, start_date, end_date)
    VALUES (v_id, 'Ekskul Melukis', 'Program pembinaan bakat khusus di bidang Seni.', 'Seni', teacher_ids[10], 'Active', '2024-01-15', '2024-12-15');

    v_id := gen_random_uuid();
    prog_ids := prog_ids || v_id;
    INSERT INTO public.incubation_programs (id, name, description, target_domain, mentor_id, status, start_date, end_date)
    VALUES (v_id, 'Klub Futsal', 'Program pembinaan bakat khusus di bidang Olahraga.', 'Olahraga', teacher_ids[18], 'Active', '2024-01-15', '2024-12-15');

    v_id := gen_random_uuid();
    prog_ids := prog_ids || v_id;
    INSERT INTO public.incubation_programs (id, name, description, target_domain, mentor_id, status, start_date, end_date)
    VALUES (v_id, 'Klub Bola Basket', 'Program pembinaan bakat khusus di bidang Olahraga.', 'Olahraga', teacher_ids[29], 'Active', '2024-01-15', '2024-12-15');

    v_id := gen_random_uuid();
    prog_ids := prog_ids || v_id;
    INSERT INTO public.incubation_programs (id, name, description, target_domain, mentor_id, status, start_date, end_date)
    VALUES (v_id, 'Klub Bulu Tangkis', 'Program pembinaan bakat khusus di bidang Olahraga.', 'Olahraga', teacher_ids[10], 'Active', '2024-01-15', '2024-12-15');

    v_id := gen_random_uuid();
    prog_ids := prog_ids || v_id;
    INSERT INTO public.incubation_programs (id, name, description, target_domain, mentor_id, status, start_date, end_date)
    VALUES (v_id, 'Ekskul Pencak Silat', 'Program pembinaan bakat khusus di bidang Olahraga.', 'Olahraga', teacher_ids[30], 'Active', '2024-01-15', '2024-12-15');

    v_id := gen_random_uuid();
    prog_ids := prog_ids || v_id;
    INSERT INTO public.incubation_programs (id, name, description, target_domain, mentor_id, status, start_date, end_date)
    VALUES (v_id, 'Ekskul Pramuka', 'Program pembinaan bakat khusus di bidang Kepemimpinan.', 'Kepemimpinan', teacher_ids[1], 'Active', '2024-01-15', '2024-12-15');

    v_id := gen_random_uuid();
    prog_ids := prog_ids || v_id;
    INSERT INTO public.incubation_programs (id, name, description, target_domain, mentor_id, status, start_date, end_date)
    VALUES (v_id, 'Ekskul PMR', 'Program pembinaan bakat khusus di bidang Kepemimpinan.', 'Kepemimpinan', teacher_ids[18], 'Active', '2024-01-15', '2024-12-15');

    v_id := gen_random_uuid();
    prog_ids := prog_ids || v_id;
    INSERT INTO public.incubation_programs (id, name, description, target_domain, mentor_id, status, start_date, end_date)
    VALUES (v_id, 'Klub Bahasa Inggris', 'Program pembinaan bakat khusus di bidang Bahasa.', 'Bahasa', teacher_ids[14], 'Active', '2024-01-15', '2024-12-15');

    v_id := gen_random_uuid();
    prog_ids := prog_ids || v_id;
    INSERT INTO public.incubation_programs (id, name, description, target_domain, mentor_id, status, start_date, end_date)
    VALUES (v_id, 'Klub Bahasa Arab', 'Program pembinaan bakat khusus di bidang Bahasa.', 'Bahasa', teacher_ids[24], 'Active', '2024-01-15', '2024-12-15');

    v_id := gen_random_uuid();
    prog_ids := prog_ids || v_id;
    INSERT INTO public.incubation_programs (id, name, description, target_domain, mentor_id, status, start_date, end_date)
    VALUES (v_id, 'Tahfidz Al-Quran', 'Program pembinaan bakat khusus di bidang Keagamaan.', 'Keagamaan', teacher_ids[22], 'Active', '2024-01-15', '2024-12-15');

    v_id := gen_random_uuid();
    prog_ids := prog_ids || v_id;
    INSERT INTO public.incubation_programs (id, name, description, target_domain, mentor_id, status, start_date, end_date)
    VALUES (v_id, 'Kajian Keislaman', 'Program pembinaan bakat khusus di bidang Keagamaan.', 'Keagamaan', teacher_ids[1], 'Active', '2024-01-15', '2024-12-15');

    v_id := gen_random_uuid();
    prog_ids := prog_ids || v_id;
    INSERT INTO public.incubation_programs (id, name, description, target_domain, mentor_id, status, start_date, end_date)
    VALUES (v_id, 'Klub Fotografi', 'Program pembinaan bakat khusus di bidang Seni.', 'Seni', teacher_ids[3], 'Active', '2024-01-15', '2024-12-15');

    v_id := gen_random_uuid();
    prog_ids := prog_ids || v_id;
    INSERT INTO public.incubation_programs (id, name, description, target_domain, mentor_id, status, start_date, end_date)
    VALUES (v_id, 'Klub Film Pendek', 'Program pembinaan bakat khusus di bidang Seni.', 'Seni', teacher_ids[12], 'Active', '2024-01-15', '2024-12-15');

    v_id := gen_random_uuid();
    prog_ids := prog_ids || v_id;
    INSERT INTO public.incubation_programs (id, name, description, target_domain, mentor_id, status, start_date, end_date)
    VALUES (v_id, 'Klub Desain Grafis', 'Program pembinaan bakat khusus di bidang Teknologi.', 'Teknologi', teacher_ids[19], 'Active', '2024-01-15', '2024-12-15');

    v_id := gen_random_uuid();
    prog_ids := prog_ids || v_id;
    INSERT INTO public.incubation_programs (id, name, description, target_domain, mentor_id, status, start_date, end_date)
    VALUES (v_id, 'Klub Pecinta Alam', 'Program pembinaan bakat khusus di bidang Kepemimpinan.', 'Kepemimpinan', teacher_ids[25], 'Active', '2024-01-15', '2024-12-15');

    v_id := gen_random_uuid();
    prog_ids := prog_ids || v_id;
    INSERT INTO public.incubation_programs (id, name, description, target_domain, mentor_id, status, start_date, end_date)
    VALUES (v_id, 'Klub Catur', 'Program pembinaan bakat khusus di bidang Olahraga.', 'Olahraga', teacher_ids[26], 'Active', '2024-01-15', '2024-12-15');

    v_id := gen_random_uuid();
    prog_ids := prog_ids || v_id;
    INSERT INTO public.incubation_programs (id, name, description, target_domain, mentor_id, status, start_date, end_date)
    VALUES (v_id, 'Klub Kewirausahaan', 'Program pembinaan bakat khusus di bidang Kepemimpinan.', 'Kepemimpinan', teacher_ids[16], 'Active', '2024-01-15', '2024-12-15');

    -- 8. INSERT INCUBATION PARTICIPANTS
    FOR i IN 1..25 LOOP
      FOR j IN 1..8 LOOP
        BEGIN
          INSERT INTO public.incubation_participants (id, program_id, student_id, status, progress_score, evaluation_notes)
          VALUES (gen_random_uuid(), prog_ids[i], student_ids[floor(random() * 300 + 1)::int], 'Active', floor(random() * 40 + 60)::int, 'Perkembangan sangat baik');
        EXCEPTION WHEN unique_violation THEN
          -- Ignore duplicate enrollments
        END;
      END LOOP;
    END LOOP;

    -- 9. INSERT OBSERVATIONS
    -- For simplicity, we loop through the first 150 students
    FOR i IN 1..150 LOOP
      -- random dominant domain index 1..7
      j := floor(random() * 7 + 1)::int;
      
      -- Parent observations
      FOR parent_inds IN SELECT * FROM public.talent_indicators WHERE role_type = 'Parent' LOOP
         INSERT INTO public.parent_observations (id, student_id, assessor_id, indicator_id, score)
         VALUES (gen_random_uuid(), student_ids[i], admin_id, parent_inds.id, floor(random() * 3 + 3)::int);
      END LOOP;
      
      -- Teacher observations
      FOR teacher_inds IN SELECT * FROM public.talent_indicators WHERE role_type = 'Teacher' LOOP
         INSERT INTO public.teacher_observations (id, student_id, assessor_id, indicator_id, score)
         VALUES (gen_random_uuid(), student_ids[i], admin_id, teacher_inds.id, floor(random() * 3 + 3)::int);
      END LOOP;
      
      -- Notes
      IF i % 2 = 0 THEN
        INSERT INTO public.observation_notes (id, student_id, assessor_id, role_type, notes)
        VALUES (gen_random_uuid(), student_ids[i], admin_id, 'Teacher', 'Perkembangan di kelas sangat positif dan menonjol.');
      ELSE
        INSERT INTO public.observation_notes (id, student_id, assessor_id, role_type, notes)
        VALUES (gen_random_uuid(), student_ids[i], admin_id, 'Parent', 'Anak ini sangat berbakat dan rajin berlatih.');
      END IF;

      -- Talent Recommendation
      INSERT INTO public.talent_recommendations (student_id, primary_talent, secondary_talent, strengths, specializations)
      VALUES (student_ids[i], 'AKD', 'TEK', ARRAY['Siswa menunjukkan ketertarikan tinggi pada analitik dan logika.']::text[], ARRAY['Matematika', 'Pemrograman']::text[])
      ON CONFLICT (student_id) DO UPDATE SET primary_talent = EXCLUDED.primary_talent;

    END LOOP;

END $$;
