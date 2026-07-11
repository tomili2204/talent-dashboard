'use server';

import { createClient } from '@/lib/supabase/server';
import { Teacher } from '@/types/teacher';
import { revalidatePath } from 'next/cache';

export async function getTeachers(
  searchQuery?: string,
  page: number = 1,
  limit: number = 10
): Promise<{ data: Teacher[] | null; count: number; error: string | null }> {
  const supabase = await createClient();
  let query = supabase
    .from('teachers')
    .select('*', { count: 'exact' })
    .order('full_name', { ascending: true });

  if (searchQuery) {
    query = query.or(`full_name.ilike.%${searchQuery}%,nik.ilike.%${searchQuery}%`);
  }
  
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error('Error fetching teachers:', error.message);
    return { data: null, count: 0, error: 'Gagal mengambil data guru.' };
  }

  return { data, count: count || 0, error: null };
}

export async function getTeacherById(id: string): Promise<{ data: Teacher | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return { data: null, error: 'Guru tidak ditemukan.' };
  }

  return { data, error: null };
}

export async function createTeacher(formData: FormData): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();
  

  const email = (formData.get('email') as string) || `guru_${formData.get('nik')}@sekolah.com`;
  const password = (formData.get('password') as string) || '123456';

  const { error } = await supabase.rpc('create_teacher_user', {
    p_full_name: formData.get('full_name') as string,
    p_email: email,
    p_password: password,
    p_nik: formData.get('nik') as string,
    p_position: (formData.get('position') as string) || null,
    p_phone: (formData.get('phone') as string) || null,
  });

  if (error) {
    console.error('Error creating teacher:', error.message);
    return { success: false, error: `Gagal: ${error.message}` };
  }

  revalidatePath('/dashboard/teachers');
  return { success: true, error: null };
}

export async function updateTeacher(id: string, formData: FormData): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();
  
  const rawData = {
    p_teacher_id: id,
    p_nik: formData.get('nik') as string,
    p_full_name: formData.get('full_name') as string,
    p_position: formData.get('position') as string || null,
    p_phone: formData.get('phone') as string || null,
    p_email: formData.get('email') as string || null,
    p_password: formData.get('password') as string || null,
  };

  const { error } = await supabase.rpc('update_teacher_user', rawData);

  if (error) {
    console.error('Error updating teacher:', error.message);
    return { success: false, error: 'Gagal memperbarui data guru.' };
  }

  revalidatePath('/dashboard/teachers');
  revalidatePath(`/dashboard/teachers/${id}`);
  return { success: true, error: null };
}

export async function deleteTeacher(id: string): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.rpc('delete_teacher_user', { p_user_id: id });

  if (error) {
    console.error('Error deleting teacher:', error.message);
    return { success: false, error: 'Gagal menghapus guru.' };
  }

  revalidatePath('/dashboard/teachers');
  return { success: true, error: null };
}

export async function bulkCreateTeachers(teachers: Partial<Teacher>[]): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();
  
  // Clean data to ensure only correct fields are inserted
  const rawData = teachers.map(t => ({
    nik: t.nik,
    full_name: t.full_name,
    position: t.position || null,
    phone: t.phone || null,
    email: t.email || null,
  }));

  let finalError: any = null;
  for (const t of rawData) {
    const email = t.email || `guru_${t.nik}@sekolah.com`;
    const { error: err } = await supabase.rpc('create_teacher_user', {
      p_full_name: t.full_name,
      p_email: email,
      p_password: '123456',
      p_nik: t.nik,
      p_position: t.position || null,
      p_phone: t.phone || null,
    });
    if (err) {
      console.error('Error bulk creating teacher:', t.full_name, err.message);
      finalError = err;
    }
  }

  if (finalError) {
    console.error('Error bulk creating teachers:', finalError.message);
    return { success: false, error: `Gagal: ${finalError.message}` };
  }

  revalidatePath('/dashboard/teachers');
  return { success: true, error: null };
}
