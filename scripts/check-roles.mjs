import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lhlxteabiaffcbjvshja.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_NcgPfTYS1jr5LhMIOFkTUw_jFDEvbDk';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkRoles() {
  const { data, error } = await supabase.from('user_roles').select('*');
  if (error) {
    console.error('Error fetching user_roles:', error.message);
  } else {
    console.log('User roles in DB:', data);
  }
}

checkRoles();
