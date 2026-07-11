'use server';

import { createClient } from '@/lib/supabase/server';
import { IncubationProgram, IncubationParticipant } from '@/types/incubation';
import { revalidatePath } from 'next/cache';

// ==============================
// PROGRAMS
// ==============================

export async function getPrograms(): Promise<{ data: IncubationProgram[] | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('incubation_programs')
    .select(`
      *,
      mentor:mentor_id(id, full_name),
      participants:incubation_participants(count)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching programs:', error);
    return { data: null, error: 'Gagal mengambil data program inkubasi.' };
  }

  // Transform count format
  const formattedData = data.map((item: any) => ({
    ...item,
    _count: {
      participants: item.participants[0]?.count || 0
    }
  }));

  return { data: formattedData, error: null };
}

export async function getProgramById(id: string): Promise<{ data: IncubationProgram | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('incubation_programs')
    .select(`
      *,
      mentor:mentor_id(id, full_name)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching program:', error);
    return { data: null, error: 'Program tidak ditemukan.' };
  }

  return { data, error: null };
}

export async function saveProgram(id: string | null, formData: FormData): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();
  
  const rawData = {
    name: formData.get('name') as string,
    description: formData.get('description') as string || null,
    target_domain: formData.get('target_domain') as string,
    start_date: formData.get('start_date') as string,
    end_date: formData.get('end_date') as string || null,
    status: formData.get('status') as string,
    mentor_id: formData.get('mentor_id') as string || null,
  };

  let error;
  if (id) {
    const res = await supabase.from('incubation_programs').update(rawData).eq('id', id);
    error = res.error;
  } else {
    const res = await supabase.from('incubation_programs').insert([rawData]);
    error = res.error;
  }

  if (error) {
    console.error('Error saving program:', error);
    return { success: false, error: `Gagal menyimpan program: ${error.message}` };
  }

  revalidatePath('/dashboard/incubation');
  revalidatePath('/dashboard/incubation/programs');
  if (id) revalidatePath(`/dashboard/incubation/programs/${id}`);
  
  return { success: true, error: null };
}

export async function deleteProgram(id: string): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from('incubation_programs').delete().eq('id', id);

  if (error) {
    console.error('Error deleting program:', error);
    return { success: false, error: 'Gagal menghapus program inkubasi.' };
  }

  revalidatePath('/dashboard/incubation');
  revalidatePath('/dashboard/incubation/programs');
  return { success: true, error: null };
}

// ==============================
// PARTICIPANTS
// ==============================

export async function getParticipantsByProgramId(programId: string): Promise<{ data: IncubationParticipant[] | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('incubation_participants')
    .select(`
      *,
      student:student_id(id, full_name, nis, classes:class_id(name))
    `)
    .eq('program_id', programId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching participants:', error);
    return { data: null, error: 'Gagal mengambil data peserta.' };
  }

  return { data, error: null };
}

export async function addParticipant(programId: string, studentId: string): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();
  
  const { error } = await supabase.from('incubation_participants').insert([{
    program_id: programId,
    student_id: studentId,
    status: 'Active',
    progress_score: 0
  }]);

  if (error) {
    console.error('Error adding participant:', error);
    return { success: false, error: `Gagal menambahkan peserta. Mungkin siswa sudah terdaftar.` };
  }

  revalidatePath('/dashboard/incubation');
  revalidatePath(`/dashboard/incubation/programs/${programId}`);
  return { success: true, error: null };
}

export async function updateParticipant(
  id: string, 
  programId: string, 
  data: { status?: string, progress_score?: number, evaluation_notes?: string }
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();
  
  const { error } = await supabase.from('incubation_participants').update(data).eq('id', id);

  if (error) {
    console.error('Error updating participant:', error);
    return { success: false, error: 'Gagal memperbarui data peserta.' };
  }

  revalidatePath('/dashboard/incubation');
  revalidatePath(`/dashboard/incubation/programs/${programId}`);
  return { success: true, error: null };
}

export async function removeParticipant(id: string, programId: string): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from('incubation_participants').delete().eq('id', id);

  if (error) {
    console.error('Error removing participant:', error);
    return { success: false, error: 'Gagal mengeluarkan peserta.' };
  }

  revalidatePath('/dashboard/incubation');
  revalidatePath(`/dashboard/incubation/programs/${programId}`);
  return { success: true, error: null };
}

// ==============================
// DASHBOARD STATS
// ==============================

export async function getIncubationStats() {
  const supabase = await createClient();
  
  // Active programs count
  const { count: activePrograms } = await supabase
    .from('incubation_programs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Active');

  // Total participants
  const { count: totalParticipants } = await supabase
    .from('incubation_participants')
    .select('*', { count: 'exact', head: true });

  // Average progress
  const { data: participants } = await supabase
    .from('incubation_participants')
    .select('progress_score');
    
  let avgProgress = 0;
  if (participants && participants.length > 0) {
    const total = participants.reduce((acc, curr) => acc + (curr.progress_score || 0), 0);
    avgProgress = Math.round(total / participants.length);
  }

  // Active programs by domain
  const { data: programsData } = await supabase
    .from('incubation_programs')
    .select('target_domain');
    
  const domainCounts: Record<string, number> = {};
  programsData?.forEach(p => {
    domainCounts[p.target_domain] = (domainCounts[p.target_domain] || 0) + 1;
  });

  const domainDistribution = Object.entries(domainCounts).map(([name, count]) => ({
    name,
    count
  }));

  return {
    activePrograms: activePrograms || 0,
    totalParticipants: totalParticipants || 0,
    avgProgress,
    domainDistribution
  };
}
