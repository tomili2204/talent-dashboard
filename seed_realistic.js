const fs = require('fs');

const firstNames = ['Budi', 'Andi', 'Siti', 'Dewi', 'Agus', 'Hendra', 'Rina', 'Fitri', 'Rizki', 'Nisa', 'Ahmad', 'Putri', 'Bagus', 'Ayu', 'Dwi', 'Sri', 'Wahyu', 'Eko', 'Tri', 'Indah', 'Bayu', 'Fajar', 'Dian', 'Kurniawan', 'Lestari', 'Saputra', 'Wahyuni', 'Pratama', 'Sari', 'Nugroho', 'Wati', 'Hidayat', 'Susanti', 'Setiawan', 'Rahmawati', 'Syahputra', 'Wulandari', 'Kurnia', 'Haryanto', 'Rahayu', 'Arif', 'Tari', 'Dimas', 'Ratna', 'Faisal', 'Rani', 'Yudi', 'Lina', 'Hasan', 'Maya'];
const lastNames = ['Santoso', 'Wijaya', 'Kusuma', 'Pratama', 'Saputra', 'Setiawan', 'Gunawan', 'Hidayat', 'Nugroho', 'Putra', 'Aditya', 'Maulana', 'Firmansyah', 'Pangestu', 'Siregar', 'Harahap', 'Sinaga', 'Simanjuntak', 'Nasution', 'Hutagalung', 'Sihombing', 'Sitompul', 'Tarihoran', 'Panjaitan', 'Sitorus', 'Manurung', 'Nababan', 'Lubis', 'Hasibuan', 'Dalimunthe'];

function getRandomName() {
  const f = firstNames[Math.floor(Math.random() * firstNames.length)];
  const l = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${f} ${l}`;
}

const competitionsData = [
  { name: 'Olimpiade Sains Nasional (OSN)', cat: 'Akademik' },
  { name: 'Festival Lomba Seni Siswa Nasional (FLS2N)', cat: 'Seni' },
  { name: 'Olimpiade Olahraga Siswa Nasional (O2SN)', cat: 'Olahraga' },
  { name: 'Lomba Cerdas Cermat', cat: 'Akademik' },
  { name: 'Lomba Karya Tulis Ilmiah', cat: 'Akademik' },
  { name: 'Kompetisi Robotik Nasional', cat: 'Teknologi' },
  { name: 'Pentas Pendidikan Agama Islam', cat: 'Keagamaan' },
  { name: 'Kompetisi Sains Madrasah (KSM)', cat: 'Akademik' },
  { name: 'Lomba Debat Bahasa Indonesia', cat: 'Bahasa' },
  { name: 'Lomba Debat Bahasa Inggris', cat: 'Bahasa' },
  { name: 'Musabaqah Tilawatil Quran (MTQ)', cat: 'Keagamaan' },
  { name: 'Lomba Pidato', cat: 'Bahasa' },
  { name: 'Lomba Menulis Puisi', cat: 'Bahasa' },
  { name: 'Lomba Menyanyi Solo', cat: 'Seni' },
  { name: 'Lomba Tari Tradisional', cat: 'Seni' },
  { name: 'Lomba Melukis', cat: 'Seni' },
  { name: 'Lomba Desain Grafis', cat: 'Teknologi' },
  { name: 'Lomba Pemrograman Web', cat: 'Teknologi' },
  { name: 'Lomba Cipta Game Edukasi', cat: 'Teknologi' },
  { name: 'Lomba Fotografi', cat: 'Seni' },
  { name: 'Lomba Film Pendek', cat: 'Seni' },
  { name: 'Lomba Jurnalistik', cat: 'Bahasa' },
  { name: 'Kejuaraan Pencak Silat', cat: 'Olahraga' },
  { name: 'Kejuaraan Karate', cat: 'Olahraga' },
  { name: 'Kejuaraan Taekwondo', cat: 'Olahraga' },
  { name: 'Turnamen Futsal', cat: 'Olahraga' },
  { name: 'Turnamen Bola Voli', cat: 'Olahraga' },
  { name: 'Turnamen Bola Basket', cat: 'Olahraga' },
  { name: 'Turnamen Bulu Tangkis', cat: 'Olahraga' },
  { name: 'Turnamen Tenis Meja', cat: 'Olahraga' },
  { name: 'Turnamen Catur', cat: 'Olahraga' },
  { name: 'Lomba Senam SKJ', cat: 'Olahraga' },
  { name: 'Lomba Baris Berbaris', cat: 'Kepemimpinan' },
  { name: 'Lomba Palang Merah Remaja', cat: 'Kepemimpinan' },
  { name: 'Lomba Pramuka', cat: 'Kepemimpinan' }
];

const incubationsData = [
  { name: 'Klub Olimpiade Matematika', cat: 'Akademik' },
  { name: 'Klub Olimpiade Sains', cat: 'Akademik' },
  { name: 'Ekskul Jurnalistik', cat: 'Bahasa' },
  { name: 'Ekskul Robotik', cat: 'Teknologi' },
  { name: 'Ekskul Coding', cat: 'Teknologi' },
  { name: 'Ekskul Paduan Suara', cat: 'Seni' },
  { name: 'Ekskul Tari Tradisional', cat: 'Seni' },
  { name: 'Ekskul Teater', cat: 'Seni' },
  { name: 'Ekskul Melukis', cat: 'Seni' },
  { name: 'Klub Futsal', cat: 'Olahraga' },
  { name: 'Klub Bola Basket', cat: 'Olahraga' },
  { name: 'Klub Bulu Tangkis', cat: 'Olahraga' },
  { name: 'Ekskul Pencak Silat', cat: 'Olahraga' },
  { name: 'Ekskul Pramuka', cat: 'Kepemimpinan' },
  { name: 'Ekskul PMR', cat: 'Kepemimpinan' },
  { name: 'Klub Bahasa Inggris', cat: 'Bahasa' },
  { name: 'Klub Bahasa Arab', cat: 'Bahasa' },
  { name: 'Tahfidz Al-Quran', cat: 'Keagamaan' },
  { name: 'Kajian Keislaman', cat: 'Keagamaan' },
  { name: 'Klub Fotografi', cat: 'Seni' },
  { name: 'Klub Film Pendek', cat: 'Seni' },
  { name: 'Klub Desain Grafis', cat: 'Teknologi' },
  { name: 'Klub Pecinta Alam', cat: 'Kepemimpinan' },
  { name: 'Klub Catur', cat: 'Olahraga' },
  { name: 'Klub Kewirausahaan', cat: 'Kepemimpinan' }
];

let sql = `
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
`;

const teachers = [];
for (let i = 1; i <= 30; i++) {
  teachers.push({
    nik: `19800101${String(i).padStart(6, '0')}`,
    full_name: getRandomName(),
    position: `Guru Mapel ${i}`,
    phone: `08123456${String(i).padStart(3, '0')}`
  });
}
for (const t of teachers) {
  sql += `
    v_id := gen_random_uuid();
    teacher_ids := teacher_ids || v_id;
    INSERT INTO public.teachers (id, nik, full_name, position, phone) VALUES (v_id, '${t.nik}', '${t.full_name.replace(/'/g, "''")}', '${t.position}', '${t.phone}');
`;
}

sql += `
    -- 3. INSERT CLASSES
`;
const classNames = ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B'];
classNames.forEach((name, idx) => {
  sql += `
    v_id := gen_random_uuid();
    class_ids := class_ids || v_id;
    INSERT INTO public.classes (id, name, homeroom_teacher_id) VALUES (v_id, '${name}', teacher_ids[${(idx % 30) + 1}]);
`;
});

sql += `
    -- 4. INSERT STUDENTS
`;
for (let i = 1; i <= 300; i++) {
  const gender = Math.random() > 0.5 ? 'Laki-laki' : 'Perempuan';
  const parentName = getRandomName().replace(/'/g, "''");
  const studentName = getRandomName().replace(/'/g, "''");
  sql += `
    v_id := gen_random_uuid();
    student_ids := student_ids || v_id;
    INSERT INTO public.students (id, nis, nisn, full_name, gender, date_of_birth, class_id, parent_name, parent_phone, address, status)
    VALUES (v_id, '2024${String(i).padStart(4, '0')}', '005000${String(i).padStart(4, '0')}', '${studentName}', '${gender}', '2010-01-01', class_ids[${(i % 12) + 1}], '${parentName}', '0852000${String(i).padStart(5, '0')}', 'Jl. Merdeka No. ${i}', 'Aktif');
`;
}

sql += `
    -- 5. INSERT COMPETITIONS
`;
competitionsData.forEach(c => {
  const organizer = ['Dinas Pendidikan', 'Pusat Prestasi Nasional', 'Kementerian Agama', 'Universitas Indonesia', 'Pemerintah Provinsi'][Math.floor(Math.random()*5)];
  const levels = ['Sekolah', 'Kecamatan', 'Kabupaten', 'Provinsi', 'Nasional', 'Internasional'];
  const level = levels[Math.floor(Math.random()*levels.length)];
  const year = 2022 + Math.floor(Math.random()*4);
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  c.level = level;
  c.year = year;
  c.month = month;
  sql += `
    v_id := gen_random_uuid();
    comp_ids := comp_ids || v_id;
    INSERT INTO public.competitions (id, name, organizer, level, category, year, start_date, end_date)
    VALUES (v_id, '${c.name}', '${organizer}', '${level}', '${c.cat}', '${year}', '${year}-${month}-01', '${year}-${month}-05');
`;
});

sql += `
    -- 6. INSERT ACHIEVEMENTS
`;
for (let i = 0; i < 150; i++) {
  const cIdx = Math.floor(Math.random() * competitionsData.length);
  const comp = competitionsData[cIdx];
  const rank = ['Juara 1', 'Juara 2', 'Juara 3', 'Harapan 1'][Math.floor(Math.random()*4)];
  const score = Math.floor(Math.random() * 20 + 80); // 80 to 99
  sql += `
    INSERT INTO public.achievements (id, student_id, competition_id, title, category, level, rank, date, status, score)
    VALUES (gen_random_uuid(), student_ids[${Math.floor(Math.random() * 300) + 1}], comp_ids[${cIdx + 1}], '${comp.name}', '${comp.cat}', '${comp.level}', '${rank}', '${comp.year}-${comp.month}-15', 'Diverifikasi', ${score});
`;
}

sql += `
    -- 7. INSERT INCUBATION PROGRAMS
`;
incubationsData.forEach(p => {
  sql += `
    v_id := gen_random_uuid();
    prog_ids := prog_ids || v_id;
    INSERT INTO public.incubation_programs (id, name, description, target_domain, mentor_id, status, start_date, end_date)
    VALUES (v_id, '${p.name}', 'Program pembinaan bakat khusus di bidang ${p.cat}.', '${p.cat}', teacher_ids[${Math.floor(Math.random() * 30) + 1}], 'Active', '2024-01-15', '2024-12-15');
`;
});

sql += `
    -- 8. INSERT INCUBATION PARTICIPANTS
    FOR i IN 1..${incubationsData.length} LOOP
      FOR j IN 1..8 LOOP
        BEGIN
          INSERT INTO public.incubation_participants (id, program_id, student_id, status, progress_score, evaluation_notes)
          VALUES (gen_random_uuid(), prog_ids[i], student_ids[floor(random() * 300 + 1)::int], 'Active', floor(random() * 40 + 60)::int, 'Perkembangan sangat baik');
        EXCEPTION WHEN unique_violation THEN
          -- Ignore duplicate enrollments
        END;
      END LOOP;
    END LOOP;
`;

sql += `
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
`;

sql += `
END $$;
`;

fs.writeFileSync('seed_realistic.sql', sql);
console.log('File seed_realistic.sql berhasil dibuat!');

