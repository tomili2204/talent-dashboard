'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Competition, CompetitionBranch } from '@/types/competition';

export async function getCompetitions(yearFilter?: string, levelFilter?: string) {
  const supabase = await createClient();
  
  // Try querying with branches
  let query = supabase.from('competitions').select('*, branches:competition_branches(*)').order('created_at', { ascending: false });

  if (yearFilter && yearFilter !== 'all') {
    query = query.eq('year', yearFilter);
  }

  if (levelFilter && levelFilter !== 'all') {
    query = query.eq('level', levelFilter);
  }

  const { data, error } = await query;
  if (error) {
    // If competition_branches table doesn't exist yet, fallback to simple select
    if (error.code === '42P01' || error.message?.includes('competition_branches')) {
      let fallbackQuery = supabase.from('competitions').select('*').order('created_at', { ascending: false });
      if (yearFilter && yearFilter !== 'all') fallbackQuery = fallbackQuery.eq('year', yearFilter);
      if (levelFilter && levelFilter !== 'all') fallbackQuery = fallbackQuery.eq('level', levelFilter);
      const { data: fallbackData, error: fallbackError } = await fallbackQuery;
      if (fallbackError) {
        throw new Error(`Gagal memuat data lomba: ${fallbackError.message}`);
      }
      return (fallbackData || []).map(c => ({
        ...c,
        branches: c.category ? [{ id: c.id, name: c.name, category: c.category }] : []
      })) as Competition[];
    }
    console.error('Error fetching competitions:', error.message);
    throw new Error(`Gagal memuat data lomba: ${error.message}`);
  }

  return (data || []).map((c: any) => ({
    ...c,
    // If branches are empty but legacy category exists, synthesize single branch
    branches: (c.branches && c.branches.length > 0) 
      ? c.branches 
      : (c.category ? [{ id: c.id, name: c.name, category: c.category }] : [])
  })) as Competition[];
}

export async function getCompetitionById(id: string) {
  const supabase = await createClient();
  
  let { data, error } = await supabase
    .from('competitions')
    .select('*, branches:competition_branches(*)')
    .eq('id', id)
    .single();

  if (error) {
    // Fallback if table doesn't exist yet
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('competitions')
      .select('*')
      .eq('id', id)
      .single();
      
    if (fallbackError) {
      throw new Error('Data lomba tidak ditemukan');
    }
    data = fallbackData;
  }

  const comp = data as any;
  return {
    ...comp,
    branches: (comp.branches && comp.branches.length > 0)
      ? comp.branches
      : (comp.category ? [{ id: comp.id, name: comp.name, category: comp.category }] : [])
  } as Competition;
}

export async function createCompetition(formData: FormData) {
  const supabase = await createClient();
  
  const name = formData.get('name') as string;
  const organizer = formData.get('organizer') as string;
  const level = formData.get('level') as string;
  const category = (formData.get('category') as string) || null;
  const year = formData.get('year') as string;
  const start_date = (formData.get('start_date') as string) || null;
  const end_date = (formData.get('end_date') as string) || null;
  const execution_date = (formData.get('execution_date') as string) || null;
  
  const branchesRaw = formData.get('branches_json') as string;
  let branches: { name: string; category: string }[] = [];
  if (branchesRaw) {
    try {
      branches = JSON.parse(branchesRaw);
    } catch (e) {
      branches = [];
    }
  }

  // Fallback to legacy category if no branches defined
  if (branches.length === 0 && category) {
    branches = [{ name, category }];
  }

  const competitionPayload: any = {
    name,
    organizer,
    level,
    category: category || (branches[0]?.category || null),
    year,
    start_date,
    end_date,
    execution_date,
  };

  const { data: compData, error } = await supabase
    .from('competitions')
    .insert([competitionPayload])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating competition:', error);
    throw new Error(`Gagal menambahkan lomba baru: ${error.message}`);
  }

  // Insert branches into competition_branches table if table exists
  if (compData && branches.length > 0) {
    const branchEntries = branches.map(b => ({
      competition_id: compData.id,
      name: b.name || name,
      category: b.category
    }));

    const { error: branchErr } = await supabase
      .from('competition_branches')
      .insert(branchEntries);

    if (branchErr && branchErr.code !== '42P01') {
      console.warn('Warning inserting branches:', branchErr.message);
    }
  }

  revalidatePath('/dashboard/competitions');
  revalidatePath('/dashboard/achievements/records');
}

export async function updateCompetition(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const name = formData.get('name') as string;
  const organizer = formData.get('organizer') as string;
  const level = formData.get('level') as string;
  const category = (formData.get('category') as string) || null;
  const year = formData.get('year') as string;
  const start_date = (formData.get('start_date') as string) || null;
  const end_date = (formData.get('end_date') as string) || null;
  const execution_date = (formData.get('execution_date') as string) || null;

  const branchesRaw = formData.get('branches_json') as string;
  let branches: { id?: string; name: string; category: string }[] = [];
  if (branchesRaw) {
    try {
      branches = JSON.parse(branchesRaw);
    } catch (e) {
      branches = [];
    }
  }

  if (branches.length === 0 && category) {
    branches = [{ name, category }];
  }

  const competitionPayload: any = {
    name,
    organizer,
    level,
    category: category || (branches[0]?.category || null),
    year,
    start_date,
    end_date,
    execution_date,
  };

  const { error } = await supabase.from('competitions').update(competitionPayload).eq('id', id);
  
  if (error) {
    console.error('Error updating competition:', error);
    throw new Error(`Gagal memperbarui lomba: ${error.message}`);
  }

  // Update competition_branches table
  if (branches.length > 0) {
    // Delete existing branches for this competition and insert new list
    const { error: delErr } = await supabase
      .from('competition_branches')
      .delete()
      .eq('competition_id', id);

    if (!delErr || delErr.code !== '42P01') {
      const branchEntries = branches.map(b => ({
        competition_id: id,
        name: b.name || name,
        category: b.category
      }));

      await supabase.from('competition_branches').insert(branchEntries);
    }
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
