'use server';

import { createClient } from '@/lib/supabase/server';
import { Student } from '@/types/student';
import { revalidatePath } from 'next/cache';

export async function getStudents(
  searchQuery?: string,
  classId?: string,
  page: number = 1,
  limit: number = 10
): Promise<{ data: Student[] | null; count: number; error: string | null }> {
  const supabase = await createClient();
  let query = supabase
    .from('students')
    .select(`
      *,
      classes:class_id (id, name)
    `, { count: 'exact' })
    .order('full_name', { ascending: true });

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: roleData } = await supabase.from('user_roles').select('role').eq('id', user.id).single();
    if (roleData?.role === 'Guru' || roleData?.role === 'Wali Kelas') {
      const { data: guruClasses } = await supabase.from('classes').select('id').eq('homeroom_teacher_id', user.id);
      if (guruClasses && guruClasses.length > 0) {
        const classIds = guruClasses.map(c => c.id);
        query = query.in('class_id', classIds);
      } else {
        query = query.eq('class_id', '00000000-0000-0000-0000-000000000000');
      }
    } else if (roleData?.role === 'Orang Tua') {
      const { data: parentStudents } = await supabase.from('parent_student').select('student_id').eq('parent_id', user.id);
      if (parentStudents && parentStudents.length > 0) {
        const studentIds = parentStudents.map(p => p.student_id);
        query = query.in('id', studentIds);
      } else {
        query = query.eq('id', '00000000-0000-0000-0000-000000000000');
      }
    }
  }

  if (searchQuery) {
    query = query.or(`full_name.ilike.%${searchQuery}%,nis.ilike.%${searchQuery}%`);
  }
  
  if (classId && classId !== 'all') {
    query = query.eq('class_id', classId);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error('Error fetching students:', error.message);
    return { data: null, count: 0, error: 'Gagal mengambil data siswa.' };
  }

  return { data, count: count || 0, error: null };
}

export async function getStudentById(id: string): Promise<{ data: Student | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('students')
    .select(`
      *,
      classes:class_id (id, name)
    `)
    .eq('id', id)
    .single();

  if (error) {
    return { data: null, error: 'Siswa tidak ditemukan.' };
  }

  return { data, error: null };
}

export async function createStudent(formData: FormData): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();
  
  const rawData = {
    nis: formData.get('nis') as string || null,
    nisn: formData.get('nisn') as string || null,
    full_name: formData.get('full_name') as string,
    gender: formData.get('gender') as string,
    date_of_birth: formData.get('date_of_birth') as string || null,
    class_id: formData.get('class_id') as string || null,
    parent_name: formData.get('parent_name') as string || null,
    parent_phone: formData.get('parent_phone') as string || null,
    address: formData.get('address') as string || null,
    status: formData.get('status') as string || 'Aktif',
  };

  const { error } = await supabase.from('students').insert([rawData]);

  if (error) {
    console.error('Error creating student:', error.message);
    return { success: false, error: `Gagal: ${error.message}` };
  }

  revalidatePath('/dashboard/students');
  return { success: true, error: null };
}

export async function updateStudent(id: string, formData: FormData): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();
  
  const rawData = {
    nis: formData.get('nis') as string || null,
    nisn: formData.get('nisn') as string || null,
    full_name: formData.get('full_name') as string,
    gender: formData.get('gender') as string,
    date_of_birth: formData.get('date_of_birth') as string || null,
    class_id: formData.get('class_id') as string || null,
    parent_name: formData.get('parent_name') as string || null,
    parent_phone: formData.get('parent_phone') as string || null,
    address: formData.get('address') as string || null,
    status: formData.get('status') as string || 'Aktif',
  };

  const { error } = await supabase.from('students').update(rawData).eq('id', id);

  if (error) {
    console.error('Error updating student:', error.message);
    return { success: false, error: 'Gagal memperbarui data siswa.' };
  }

  revalidatePath('/dashboard/students');
  revalidatePath(`/dashboard/students/${id}`);
  return { success: true, error: null };
}

export async function deleteStudent(id: string): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from('students').delete().eq('id', id);

  if (error) {
    console.error('Error deleting student:', error.message);
    return { success: false, error: 'Gagal menghapus siswa.' };
  }

  revalidatePath('/dashboard/students');
  return { success: true, error: null };
}
