import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lhlxteabiaffcbjvshja.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_NcgPfTYS1jr5LhMIOFkTUw_jFDEvbDk';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function main() {
  // Count remaining students
  const { data, count, error } = await supabase
    .from('students')
    .select('id, full_name, nis', { count: 'exact' })
    .limit(10);

  if (error) {
    console.log('Error:', error.message);
    return;
  }

  console.log(`Total siswa tersisa: ${count}`);
  if (data && data.length > 0) {
    console.log('Contoh data:');
    data.forEach(s => console.log(`  - ${s.full_name} (NIS: ${s.nis})`));
  }

  // Try to delete ALL with loop
  console.log('\n🔄 Menghapus semua siswa...');
  let totalDeleted = 0;
  let keepGoing = true;

  while (keepGoing) {
    const { data: batch } = await supabase
      .from('students')
      .select('id')
      .limit(500);

    if (!batch || batch.length === 0) {
      keepGoing = false;
      break;
    }

    const ids = batch.map(r => r.id);
    const { error: delErr } = await supabase
      .from('students')
      .delete()
      .in('id', ids);

    if (delErr) {
      console.log(`❌ Error: ${delErr.message}`);
      keepGoing = false;
    } else {
      totalDeleted += ids.length;
      console.log(`  Dihapus batch: ${ids.length} (total: ${totalDeleted})`);
    }
  }

  // Final count
  const { count: finalCount } = await supabase
    .from('students')
    .select('id', { count: 'exact', head: true });

  console.log(`\nSisa siswa di database: ${finalCount}`);
}

main().catch(console.error);
