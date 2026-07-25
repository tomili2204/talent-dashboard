import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lhlxteabiaffcbjvshja.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_NcgPfTYS1jr5LhMIOFkTUw_jFDEvbDk';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Complete list ordered by deepest dependency first
const TABLES_TO_CLEAR = [
  'talent_recommendations',
  'talent_scores',
  'talent_indicators',
  'teacher_observations',
  'parent_observations',
  'observation_notes',
  'achievements',
  'competition_interests',
  'incubation_participants',
  'incubation_programs',
  'competitions',
  'parent_student',
  'students',
  'classes',
  'teachers',
];

async function clearTable(tableName) {
  // Step 1: Get all IDs
  const { data, error: selErr } = await supabase
    .from(tableName)
    .select('id')
    .limit(5000);

  if (selErr) {
    console.log(`  ⏭️  ${tableName}: tidak bisa dibaca (${selErr.message})`);
    return false;
  }

  if (!data || data.length === 0) {
    console.log(`  ✅ ${tableName}: sudah kosong`);
    return true;
  }

  // Step 2: Delete in batches of 100 using .in('id', [...])
  let deleted = 0;
  const ids = data.map(r => r.id);

  for (let i = 0; i < ids.length; i += 100) {
    const batch = ids.slice(i, i + 100);
    const { error: delErr } = await supabase
      .from(tableName)
      .delete()
      .in('id', batch);

    if (delErr) {
      if (delErr.message.includes('foreign key') || delErr.message.includes('violates')) {
        console.log(`  ⏳ ${tableName}: FK constraint, akan dicoba ulang nanti...`);
        return false;
      }
      console.log(`  ❌ ${tableName}: ${delErr.message}`);
      return false;
    }
    deleted += batch.length;
  }

  console.log(`  ✅ ${tableName}: ${deleted} baris dihapus`);
  
  // Check for remaining rows (if > 5000 total)
  const { data: remaining } = await supabase.from(tableName).select('id').limit(1);
  if (remaining && remaining.length > 0) {
    return await clearTable(tableName);
  }
  return true;
}

async function clearUserRolesExceptAdmin() {
  const { data, error } = await supabase
    .from('user_roles')
    .select('id, role');

  if (error) {
    console.log(`  ❌ user_roles: ${error.message}`);
    console.log('  💡 Hapus akun non-admin secara manual via Supabase Dashboard:');
    console.log('     https://supabase.com/dashboard → Authentication → Users');
    return;
  }

  const admins = data.filter(r => r.role === 'Admin');
  const nonAdmins = data.filter(r => r.role !== 'Admin');

  console.log(`  ℹ️  ${admins.length} akun Admin dipertahankan`);
  
  if (nonAdmins.length === 0) {
    console.log(`  ✅ user_roles: tidak ada akun non-admin`);
    return;
  }

  for (let i = 0; i < nonAdmins.length; i += 50) {
    const batch = nonAdmins.slice(i, i + 50).map(r => r.id);
    const { error: delErr } = await supabase
      .from('user_roles')
      .delete()
      .in('id', batch);

    if (delErr) {
      console.log(`  ❌ user_roles: ${delErr.message}`);
      console.log('  💡 Hapus akun non-admin secara manual via Supabase Dashboard.');
      return;
    }
  }
  console.log(`  ✅ user_roles: ${nonAdmins.length} akun non-admin dihapus`);
}

async function main() {
  console.log('🧹 Memulai pembersihan data dummy...\n');

  let failedTables = [...TABLES_TO_CLEAR];

  for (let pass = 1; pass <= 4; pass++) {
    if (failedTables.length === 0) break;
    console.log(`\n--- Pass ${pass} ---`);
    const stillFailed = [];
    for (const table of failedTables) {
      const ok = await clearTable(table);
      if (!ok) stillFailed.push(table);
    }
    failedTables = stillFailed;
  }

  if (failedTables.length > 0) {
    console.log(`\n⚠️  Tabel belum bersih: ${failedTables.join(', ')}`);
    console.log('   Silakan hapus manual via Supabase Dashboard → Table Editor.');
  }

  console.log('\n👤 Membersihkan user_roles (mempertahankan Admin)...');
  await clearUserRolesExceptAdmin();

  console.log('\n✨ Pembersihan selesai!');
}

main().catch(console.error);
