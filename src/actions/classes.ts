'use server';

import { createClient } from '@/lib/supabase/server';
import { ClassData } from '@/types/class';
import { revalidatePath } from 'next/cache';

export async function getClasses(
  page: number = 1,
  limit: number = 10
): Promise<{ data: (ClassData & { teacher_name?: string })[] | null; count: number; error: string | null }> {
  const supabase = await createClient();
  let query = supabase
    .from('classes')
    .select('*', { count: 'exact' })
    .order('name', { ascending: true });

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data: classesData, count, error } = await query;

  if (error) {
    console.error('Error fetching classes:', error.message);
    return { data: null, count: 0, error: 'Gagal mengambil data kelas.' };
  }

  // Fetch all teachers to map teacher names
  const { data: teachersData } = await supabase.from('teachers').select('id, full_name');
  const mappedData = classesData?.map((c) => {
    let teacher_name = undefined;
    if (c.homeroom_teacher_id && teachersData) {
      const teacher = teachersData.find((t: any) => t.id === c.homeroom_teacher_id);
      if (teacher) {
        teacher_name = teacher.full_name;
      }
    }
    return { ...c, teacher_name };
  });

  return { data: mappedData || null, count: count || 0, error: null };
}

export async function getTeachers(): Promise<{ id: string; name: string }[]> {
  const supabase = await createClient();
  const { data: teachers } = await supabase.from('teachers').select('id, full_name').order('full_name', { ascending: true });
  if (!teachers) return [];
  
  return teachers.map((t: any) => ({
    id: t.id,
    name: t.full_name || 'Unknown'
  }));
}

export async function createClass(name: string, homeroom_teacher_id?: string): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  console.log("Session in createClass:", session?.user?.id, session?.user?.role);
  
  const { error } = await supabase
    .from('classes')
    .insert([{ name, homeroom_teacher_id: homeroom_teacher_id || null }]);

  if (error) {
    console.error('Error creating class:', error.message);
    return { success: false, error: `Gagal: ${error.message}` };
  }

  revalidatePath('/dashboard/classes');
  revalidatePath('/dashboard/students');
  return { success: true, error: null };
}

export async function updateClass(id: string, name: string, homeroom_teacher_id?: string): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('classes')
    .update({ name, homeroom_teacher_id: homeroom_teacher_id || null })
    .eq('id', id);

  if (error) {
    console.error('Error updating class:', error.message);
    return { success: false, error: `Gagal memperbarui kelas: ${error.message}` };
  }

  revalidatePath('/dashboard/classes');
  revalidatePath('/dashboard/students');
  return { success: true, error: null };
}

export async function deleteClass(id: string): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('classes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting class:', error.message);
    return { success: false, error: 'Gagal menghapus kelas. Pastikan tidak ada siswa yang masih terdaftar di kelas ini.' };
  }

  revalidatePath('/dashboard/classes');
  revalidatePath('/dashboard/students');
  return { success: true, error: null };
}
