'use server';

import { createClient } from '@/lib/supabase/server';
import { Competition } from '@/types/competition';

export async function getRecommendedCompetitions(categories: string[], limit: number = 3) {
  if (!categories || categories.length === 0) return [];

  const supabase = await createClient();
  
  // Get active/upcoming competitions that match the categories
  // Using end_date >= today OR end_date is null
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('competitions')
    .select('*')
    .in('category', categories)
    .or(`end_date.gte.${today},end_date.is.null`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recommended competitions:', error);
    return [];
  }

  return data as Competition[];
}

export async function getRecommendedIncubations(categories: string[], limit: number = 3) {
  if (!categories || categories.length === 0) return [];

  const supabase = await createClient();
  
  // Get Active incubation programs that match the target domain
  const { data, error } = await supabase
    .from('incubation_programs')
    .select('*, mentor:mentor_id(full_name)')
    .in('target_domain', categories)
    .eq('status', 'Active')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recommended incubations:', error);
    return [];
  }

  return data;
}
