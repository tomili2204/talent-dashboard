'use server';

import { createClient } from '@/lib/supabase/server';
import { TalentScore, TalentIndicator, ParentObservation, TeacherObservation, TalentRecommendation } from '@/types/talent';
import { revalidatePath } from 'next/cache';

// Fetch Indicators
export async function getTalentIndicators(type: 'parent' | 'teacher'): Promise<{ data: TalentIndicator[] | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('talent_indicators')
    .select('*')
    .eq('role_type', type === 'parent' ? 'Parent' : 'Teacher')
    .order('domain', { ascending: true });

  if (error) {
    return { data: null, error: error.message };
  }
  return { data: data as TalentIndicator[], error: null };
}

// Fetch Parent Observations for a Student
export async function getParentObservations(studentId: string): Promise<{ data: ParentObservation[] | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('parent_observations')
    .select('*')
    .eq('student_id', studentId);

  if (error) return { data: null, error: error.message };
  return { data: data as ParentObservation[], error: null };
}

// Save Parent Observations
export async function saveParentObservations(studentId: string, parentId: string, scores: Record<string, number>): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();
  
  const entries = Object.entries(scores).map(([indicator_id, score]) => ({
    student_id: studentId,
    assessor_id: parentId,
    indicator_id,
    score
  }));

  if (entries.length === 0) return { success: true, error: null };

  const { error } = await supabase
    .from('parent_observations')
    .upsert(entries, { onConflict: 'student_id, indicator_id, assessor_id' });

  if (error) return { success: false, error: error.message };

  revalidatePath(`/dashboard/talents/assessments/${studentId}`);
  return { success: true, error: null };
}

// Fetch Teacher Observations for a Student
export async function getTeacherObservations(studentId: string): Promise<{ data: TeacherObservation[] | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('teacher_observations')
    .select('*')
    .eq('student_id', studentId);

  if (error) return { data: null, error: error.message };
  return { data: data as TeacherObservation[], error: null };
}

// Save Teacher Observations
export async function saveTeacherObservations(studentId: string, teacherId: string, scores: Record<string, number>): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();
  
  const entries = Object.entries(scores).map(([indicator_id, score]) => ({
    student_id: studentId,
    assessor_id: teacherId,
    indicator_id,
    score
  }));

  if (entries.length === 0) return { success: true, error: null };

  const { error } = await supabase
    .from('teacher_observations')
    .upsert(entries, { onConflict: 'student_id, indicator_id, assessor_id' });

  if (error) return { success: false, error: error.message };

  revalidatePath(`/dashboard/talents/assessments/${studentId}`);
  return { success: true, error: null };
}

// Get final calculated talent scores
export async function getTalentScores(studentId: string): Promise<{ data: TalentScore[] | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('talent_scores')
    .select('*')
    .eq('student_id', studentId)
    .order('final_score', { ascending: false });

  if (error) return { data: null, error: error.message };
  return { data: data as TalentScore[], error: null };
}

// Get Recommendation
export async function getTalentRecommendation(studentId: string): Promise<{ data: TalentRecommendation | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('talent_recommendations')
    .select('*')
    .eq('student_id', studentId)
    .single();

  if (error && error.code !== 'PGRST116') return { data: null, error: error.message };
  return { data: data as TalentRecommendation | null, error: null };
}

export async function getTalentAssessments(searchQuery?: string, page: number = 1, limit: number = 10) {
  // Mock implementation for the main table to avoid breaking the overview page right now
  const supabase = await createClient();
  let query = supabase.from('students').select('*, class:classes(name)', { count: 'exact' });
  
  if (searchQuery) {
    query = query.or(`full_name.ilike.%${searchQuery}%,nis.ilike.%${searchQuery}%`);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;
  if (error) return { data: null, count: 0, error: 'Gagal mengambil data siswa.' };

  // For the frontend list, we just return students. We can map them in the component later.
  return { data: data, count: count || 0, error: null };
}

export async function getObservationNote(studentId: string, roleType: 'Parent' | 'Teacher'): Promise<{ data: string | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('observation_notes')
    .select('notes')
    .eq('student_id', studentId)
    .eq('role_type', roleType)
    .limit(1)
    .maybeSingle();

  if (error) return { data: null, error: error.message };
  return { data: data ? data.notes : null, error: null };
}

export async function saveObservationNote(studentId: string, assessorId: string, roleType: 'Parent' | 'Teacher', notes: string): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('observation_notes')
    .upsert({ student_id: studentId, assessor_id: assessorId, role_type: roleType, notes }, { onConflict: 'student_id, assessor_id' });

  if (error) return { success: false, error: error.message };
  revalidatePath(`/dashboard/talents/assessments/${studentId}`);
  return { success: true, error: null };
}

export async function updateSpecializations(studentId: string, specializations: string[]): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('talent_recommendations')
    .upsert({ student_id: studentId, specializations }, { onConflict: 'student_id' });

  if (error) return { success: false, error: error.message };
  revalidatePath(`/dashboard/talents/assessments/${studentId}`);
  return { success: true, error: null };
}

export async function getTeacherContact(teacherId: string): Promise<{ data: { full_name: string, phone: string } | null; error: string | null }> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('teachers').select('full_name, phone').eq('id', teacherId).single();
  
  if (error || !data) return { data: null, error: error?.message || 'Not found' };
  return { data: { full_name: data.full_name, phone: data.phone || '-' }, error: null };
}

export async function getParentContact(studentId: string): Promise<{ data: { full_name: string, phone: string } | null; error: string | null }> {
  const supabase = await createClient();
  const { data: psData, error: psError } = await supabase.from('parent_student').select('parent_id').eq('student_id', studentId).single();
  
  if (psError || !psData) return { data: null, error: psError?.message || 'No parent linked' };
  
  const { data, error } = await supabase.from('parents').select('full_name, phone').eq('id', psData.parent_id).single();
  
  if (error || !data) return { data: null, error: error?.message || 'Not found' };
  return { data: { full_name: data.full_name, phone: data.phone || '-' }, error: null };
}
