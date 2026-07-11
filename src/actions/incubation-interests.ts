'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function requestIncubationParticipation(studentId: string, programId: string) {
  const supabase = await createClient();

  // Memeriksa apakah user punya hak ases, tapi di sini kita hanya insert
  const { error } = await supabase
    .from('incubation_participants')
    .insert({
      student_id: studentId,
      program_id: programId,
      status: 'Pending',
      progress_score: 0
    });

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'Anak Anda sudah terdaftar atau sedang mengajukan keikutsertaan pada program ini.' };
    }
    console.error('Error requesting participation:', error);
    return { success: false, error: 'Terjadi kesalahan saat mengajukan keikutsertaan.' };
  }

  revalidatePath(`/dashboard/students/${studentId}/incubation`);
  return { success: true };
}
