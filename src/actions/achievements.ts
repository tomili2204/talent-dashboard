'use server';

import { createClient } from '@/lib/supabase/server';
import { Achievement, AchievementStatus } from '@/types/achievement';
import { revalidatePath } from 'next/cache';


export async function getAchievements(
  searchQuery?: string,
  categoryFilter?: string,
  levelFilter?: string,
  yearFilter?: string,
  page: number = 1,
  limit: number = 10,
  statusFilter?: string
): Promise<{ data: Achievement[] | null; count: number; error: string | null }> {
  const supabase = await createClient();
  
  let query = supabase
    .from('achievements')
    .select('*, student:students!inner(full_name, nis, class_id, class:classes(name)), teacher:teachers(full_name)', { count: 'exact' })
    .order('created_at', { ascending: false });

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: roleData } = await supabase.from('user_roles').select('role').eq('id', user.id).single();
    if (roleData?.role === 'Guru' || roleData?.role === 'Wali Kelas') {
      const { data: guruClasses } = await supabase.from('classes').select('id').eq('homeroom_teacher_id', user.id);
      if (guruClasses && guruClasses.length > 0) {
        const classIds = guruClasses.map(c => c.id);
        const { data: classStudents } = await supabase.from('students').select('id').in('class_id', classIds);
        if (classStudents && classStudents.length > 0) {
           const studentIds = classStudents.map(s => s.id);
           query = query.in('student_id', studentIds);
        } else {
           query = query.eq('student_id', '00000000-0000-0000-0000-000000000000');
        }
      } else {
        query = query.eq('student_id', '00000000-0000-0000-0000-000000000000');
      }
    } else if (roleData?.role === 'Orang Tua') {
      const { data: parentStudents } = await supabase.from('parent_student').select('student_id').eq('parent_id', user.id);
      if (parentStudents && parentStudents.length > 0) {
        const studentIds = parentStudents.map(p => p.student_id);
        query = query.in('student_id', studentIds);
      } else {
        query = query.eq('student_id', '00000000-0000-0000-0000-000000000000');
      }
    }
  }

  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
  }
  if (categoryFilter && categoryFilter !== 'all') {
    query = query.eq('category', categoryFilter);
  }
  if (levelFilter && levelFilter !== 'all') {
    query = query.eq('level', levelFilter);
  }
  if (yearFilter && yearFilter !== 'all') {
    // filter by date year
    query = query.gte('date', `${yearFilter}-01-01`).lte('date', `${yearFilter}-12-31`);
  }
  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error('Error fetching achievements:', error.message);
    return { data: null, count: 0, error: 'Gagal mengambil data prestasi.' };
  }

  return { data: data as any, count: count || 0, error: null };
}

export async function getAchievementsByStudentId(studentId: string): Promise<{ data: Achievement[] | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('achievements')
    .select('*, student:students(full_name, nis, class_id, class:classes(name)), teacher:teachers(full_name)')
    .eq('student_id', studentId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching student achievements:', error.message);
    return { data: null, error: 'Gagal mengambil data prestasi siswa.' };
  }
  return { data: data as any, error: null };
}

export async function saveAchievement(formData: FormData): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();
  
  const id = formData.get('id') as string;
  const student_id = formData.get('student_id') as string;
  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  const level = formData.get('level') as string;
  const date = formData.get('date') as string;
  const rank = formData.get('rank') as string || null;
  const description = formData.get('description') as string || null;
  const competition_id = formData.get('competition_id') as string || null;
  const teacher_id = formData.get('teacher_id') as string || null;
  const external_mentor = formData.get('external_mentor') as string || null;
  const status = formData.get('status') as string || 'Menunggu Verifikasi';

  // Kalkulasi Score
  let score = 0;
  if (level) {
    const isInternasional = level === 'Internasional';
    const isNasional = level === 'Nasional';
    const isProvinsi = level === 'Provinsi';
    const isKabupaten = level === 'Kabupaten';
    const isKecamatan = level === 'Kecamatan';
    const isSekolah = level === 'Sekolah';

    const r = rank ? rank.toLowerCase() : '';
    const isRank1 = r.includes('juara 1') || r.includes('gold') || r.includes('emas');
    const isRank2 = r.includes('juara 2') || r.includes('silver') || r.includes('perak');
    const isRank3 = r.includes('juara 3') || r.includes('bronze') || r.includes('perunggu');
    
    if (isInternasional) score = isRank1 ? 100 : isRank2 ? 95 : isRank3 ? 90 : 80;
    else if (isNasional) score = isRank1 ? 90 : isRank2 ? 85 : isRank3 ? 80 : 70;
    else if (isProvinsi) score = isRank1 ? 80 : isRank2 ? 75 : isRank3 ? 70 : 60;
    else if (isKabupaten) score = isRank1 ? 70 : isRank2 ? 65 : isRank3 ? 60 : 50;
    else if (isKecamatan) score = isRank1 ? 60 : isRank2 ? 55 : isRank3 ? 50 : 40;
    else if (isSekolah) score = isRank1 ? 50 : isRank2 ? 45 : isRank3 ? 40 : 30;
  }

  // extract file if uploaded
  const certificateFile = formData.get('certificate') as File | null;
  let certificate_url = formData.get('certificate_url') as string || null;

  if (certificateFile && certificateFile.size > 0) {
    // delete old if any
    if (certificate_url) {
      const oldPath = certificate_url.split('/').pop();
      if (oldPath) await supabase.storage.from('certificates').remove([oldPath]);
    }
    const ext = certificateFile.name.split('.').pop();
    const fileName = `${student_id}-${Date.now()}.${ext}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('certificates')
      .upload(fileName, certificateFile);
    if (!uploadError && uploadData) {
      const { data: publicUrlData } = supabase.storage.from('certificates').getPublicUrl(fileName);
      certificate_url = publicUrlData.publicUrl;
    }
  }

  const payload = {
    student_id,
    title,
    category,
    level,
    date,
    rank,
    description,
    certificate_url,
    status,
    competition_id,
    teacher_id,
    external_mentor,
    score
  };

  let res;
  if (id) {
    res = await supabase.from('achievements').update(payload).eq('id', id);
  } else {
    // Default status is 'Menunggu Verifikasi', managed by DB default
    res = await supabase.from('achievements').insert([payload]);
  }

  if (res.error) {
    console.error('Error saving achievement:', res.error.message);
    return { success: false, error: `Gagal menyimpan: ${res.error.message}` };
  }

  revalidatePath('/dashboard/achievements');
  revalidatePath('/dashboard/achievements/records');
  return { success: true, error: null };
}

export async function deleteAchievement(id: string): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from('achievements').delete().eq('id', id);

  if (error) {
    console.error('Error deleting achievement:', error.message);
    return { success: false, error: 'Gagal menghapus prestasi.' };
  }

  revalidatePath('/dashboard/achievements');
  revalidatePath('/dashboard/achievements/records');
  return { success: true, error: null };
}

// Hanya Admin yang bisa verifikasi
export async function verifyAchievement(id: string, status: AchievementStatus): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();
  
  // Verify if the current user is admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  // Assume admin check can be done here by email or using our rpc function
  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) {
    return { success: false, error: 'Hanya Admin yang berhak memverifikasi prestasi.' };
  }

  const { error } = await supabase.from('achievements').update({ status }).eq('id', id);

  if (error) {
    console.error('Error verifying achievement:', error.message);
    return { success: false, error: 'Gagal memverifikasi prestasi.' };
  }

  revalidatePath('/dashboard/achievements');
  revalidatePath('/dashboard/achievements/records');
  return { success: true, error: null };
}

export async function getDashboardStats() {
  const supabase = await createClient();
  const { data: achievements } = await supabase
    .from('achievements')
    .select('*, student:students(full_name, class:classes(name)), teacher:teachers(full_name)');

  const total = achievements?.length || 0;
  
  // Distribusi per Kategori
  const byCategory = achievements?.reduce((acc: any, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {}) || {};

  // Distribusi per Tingkat
  const byLevel = achievements?.reduce((acc: any, curr) => {
    acc[curr.level] = (acc[curr.level] || 0) + 1;
    return acc;
  }, {}) || {};

  // Top Performer (Siswa dengan prestasi terbanyak)
  const studentCount = achievements?.reduce((acc: any, curr) => {
    const name = curr.student?.full_name || 'Unknown';
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {}) || {};
  const topPerformers = Object.entries(studentCount)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 5)
    .map(entry => ({ name: entry[0], count: entry[1] }));

  // Distribusi Kelas
  const byClass = achievements?.reduce((acc: any, curr) => {
    const className = curr.student?.class?.name || 'Tanpa Kelas';
    acc[className] = (acc[className] || 0) + 1;
    return acc;
  }, {}) || {};

  // Top 5 Guru Pembimbing
  const teacherCount = achievements?.reduce((acc: any, curr) => {
    const teacherName = curr.teacher?.full_name || curr.external_mentor;
    if (teacherName) {
      acc[teacherName] = (acc[teacherName] || 0) + 1;
    }
    return acc;
  }, {}) || {};
  const topTeachers = Object.entries(teacherCount)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 5)
    .map(entry => ({ name: entry[0], count: entry[1] }));

  return {
    total,
    byCategory,
    byLevel,
    topPerformers,
    byClass,
    topTeachers
  };
}
