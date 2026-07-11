import { createClient } from '@/lib/supabase/server';
import { getExecutiveStats } from '@/actions/dashboard';
import { ExecutiveDashboard } from '@/components/dashboard/executive-dashboard';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get user role
  let role = 'Siswa'; // Default
  let userName = 'User';
  if (user) {
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (roleData) {
      role = roleData.role;
    }
    
    // Attempt to get name from teachers or students or users
    if (role === 'Guru' || role === 'Admin') {
      const { data: t } = await supabase.from('teachers').select('full_name').eq('id', user.id).single();
      if (t) userName = t.full_name;
    } else {
      const { data: s } = await supabase.from('students').select('full_name').eq('id', user.id).single();
      if (s) userName = s.full_name;
    }
    
    if (userName === 'User' && user.email) {
      userName = user.email.split('@')[0];
    }
  }

  // Redirect Orang Tua
  if (role === 'Orang Tua') {
    const { data: parentStudent } = await supabase
      .from('parent_student')
      .select('student_id')
      .eq('parent_id', user?.id)
      .limit(1)
      .single();
      
    if (parentStudent && parentStudent.student_id) {
      const { redirect } = await import('next/navigation');
      redirect(`/dashboard/students/${parentStudent.student_id}`);
    } else {
      // If no student mapped, show a placeholder
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Belum Ada Profil Anak</h2>
          <p className="text-gray-500 max-w-md">
            Akun Anda belum dihubungkan dengan profil siswa mana pun. Silakan hubungi Administrator sekolah untuk menghubungkan akun Anda dengan profil anak Anda.
          </p>
        </div>
      );
    }
  }

  const { data: classesData } = await supabase.from('classes').select('id, name');
  const classes = classesData || [];

  const initialData = await getExecutiveStats('all', 'all');

  return (
    <ExecutiveDashboard 
      initialData={initialData} 
      classes={classes} 
      userName={userName}
      userRole={role}
    />
  );
}
