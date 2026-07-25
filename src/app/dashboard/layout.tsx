import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { logout } from '@/actions/auth';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LogOut } from 'lucide-react';
import Sidebar from '@/components/layout/sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  let role = 'Admin';
  let studentId = '';

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (roleData) {
    role = roleData.role;
  }

  if (role === 'Orang Tua') {
    const { data: parentStudent } = await supabase
      .from('parent_student')
      .select('student_id')
      .eq('parent_id', user.id)
      .limit(1)
      .single();
    if (parentStudent) {
      studentId = parentStudent.student_id;
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC]">
      
      {/* Sidebar (handles both mobile & desktop) */}
      <Sidebar role={role} studentId={studentId} />

      {/* Main Content Area - offset for desktop sidebar */}
      <div className="flex flex-1 flex-col lg:pl-64">
        
        {/* Desktop Top Header */}
        <header className="hidden lg:flex sticky top-0 z-40 h-16 shrink-0 items-center gap-4 border-b border-gray-200 bg-white/80 backdrop-blur-md px-6 shadow-sm">
          <div className="flex flex-1 items-center">
            <h2 className="text-lg font-bold text-[#125B34] tracking-wide">LPI Roudlotut Tholibin</h2>
          </div>
          <div className="flex items-center gap-4">
            <form action={logout}>
              <Button variant="ghost" type="submit" className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-2">
                <LogOut className="w-4 h-4" />
                Keluar
              </Button>
            </form>
          </div>
        </header>

        {/* Page Content — extra top padding on mobile to clear the fixed top bar */}
        <main className="flex-1 p-4 pt-20 md:p-6 md:pt-20 lg:p-8 lg:pt-8">
          {children}
        </main>
      </div>
      
    </div>
  );
}
