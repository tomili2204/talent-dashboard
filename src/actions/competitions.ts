'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Competition } from '@/types/competition';

export async function getCompetitions(yearFilter?: string, levelFilter?: string) {
  const supabase = await createClient();
  let query = supabase.from('competitions').select('*').order('created_at', { ascending: false });

  if (yearFilter && yearFilter !== 'all') {
    query = query.eq('year', yearFilter);
  }

  if (levelFilter && levelFilter !== 'all') {
    query = query.eq('level', levelFilter);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching competitions:', error.message, error.details, error.hint, error.code);
    throw new Error(`Gagal memuat data lomba: ${error.message}`);
  }

  return data as Competition[];
}

export async function getCompetitionById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('competitions').select('*').eq('id', id).single();
  
  if (error) {
    throw new Error('Data lomba tidak ditemukan');
  }

  return data as Competition;
}

export async function createCompetition(formData: FormData) {
  const supabase = await createClient();
  
  const competition = {
    name: formData.get('name') as string,
    organizer: formData.get('organizer') as string,
    level: formData.get('level') as string,
    category: formData.get('category') as string,
    year: formData.get('year') as string,
    start_date: (formData.get('start_date') as string) || null,
    end_date: (formData.get('end_date') as string) || null,
  };

  const { error } = await supabase.from('competitions').insert([competition]);
  
  if (error) {
    console.error('Error creating competition:', error);
    throw new Error('Gagal menambahkan lomba baru');
  }

  revalidatePath('/dashboard/competitions');
  revalidatePath('/dashboard/achievements/records');
}

export async function updateCompetition(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const competition = {
    name: formData.get('name') as string,
    organizer: formData.get('organizer') as string,
    level: formData.get('level') as string,
    category: formData.get('category') as string,
    year: formData.get('year') as string,
    start_date: (formData.get('start_date') as string) || null,
    end_date: (formData.get('end_date') as string) || null,
  };

  const { error } = await supabase.from('competitions').update(competition).eq('id', id);
  
  if (error) {
    console.error('Error updating competition:', error);
    throw new Error('Gagal memperbarui lomba');
  }

  revalidatePath('/dashboard/competitions');
  revalidatePath(`/dashboard/competitions/${id}`);
  revalidatePath('/dashboard/achievements/records');
}

export async function deleteCompetition(id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase.from('competitions').delete().eq('id', id);
  
  if (error) {
    console.error('Error deleting competition:', error);
    throw new Error('Gagal menghapus lomba');
  }

  revalidatePath('/dashboard/competitions');
}
