require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  const { data: users, error } = await supabase.from('user_roles').select('*');
  console.log("Users Roles Error:", error);
  console.log("Users Roles:", users);
}

check();
