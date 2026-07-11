'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function expressInterestInCompetition(studentId: string, competitionId: string, parentId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('competition_interests')
    .insert([
      {
        student_id: studentId,
        competition_id: competitionId,
        parent_id: parentId,
        status: 'Berminat'
      }
    ]);

  if (error) {
    if (error.code === '23505') {
      throw new Error('Anda sudah menyatakan minat pada lomba ini sebelumnya.');
    }
    console.error('Error expressing interest:', error);
    throw new Error(`Gagal menyimpan: ${error.message} (Code: ${error.code})`);
  }

  revalidatePath(`/dashboard/students/${studentId}/competitions`);
  revalidatePath(`/dashboard/competitions/${competitionId}`);
}

export async function removeInterestInCompetition(studentId: string, competitionId: string) {
  const supabase = await createClient();

  // Memeriksa siapa usernya
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('competition_interests')
    .delete()
    .eq('student_id', studentId)
    .eq('competition_id', competitionId)
    .eq('parent_id', user.id);

  if (error) {
    console.error('Error removing interest:', error);
    throw new Error('Gagal membatalkan minat lomba.');
  }

  revalidatePath(`/dashboard/students/${studentId}/competitions`);
  revalidatePath(`/dashboard/competitions/${competitionId}`);
}

export async function getStudentInterests(studentId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('competition_interests')
    .select('*, competitions(*)')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

  if (error) {
    // If the table doesn't exist yet, return empty array to prevent crashing UI
    if (error.code === '42P01') {
      return [];
    }
    console.error('Error fetching interests:', error);
    return [];
  }

  return data;
}

export async function getInterestedStudents(competitionId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('competition_interests')
    .select('*, students(full_name, nisn)')
    .eq('competition_id', competitionId)
    .order('created_at', { ascending: false });

  if (error) {
    if (error.code === '42P01') {
      return [];
    }
    console.error('Error fetching interested students:', error);
    return [];
  }

  return data;
}

export async function updateInterestStatus(interestId: string, status: string, notes?: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('competition_interests')
    .update({ status, notes })
    .eq('id', interestId);

  if (error) {
    console.error('Error updating interest status:', error);
    throw new Error('Gagal memperbarui status');
  }
}
