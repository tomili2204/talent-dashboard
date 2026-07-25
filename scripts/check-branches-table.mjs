import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lhlxteabiaffcbjvshja.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_NcgPfTYS1jr5LhMIOFkTUw_jFDEvbDk';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testTable() {
  const { data, error } = await supabase.from('competition_branches').select('*').limit(1);
  if (error) {
    console.log('Error accessing competition_branches:', error.message);
  } else {
    console.log('competition_branches table exists! Rows:', data.length);
  }
}

testTable();
