import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { logout } from '@/actions/auth';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LogOut, LayoutDashboard, Users, School, ShieldAlert, GraduationCap, Target, BarChart3, Lightbulb, Trophy, Star, HelpCircle } from 'lucide-react';

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

  const renderMenus = () => {
    const menuItems = [];

    // Dashboard
    if (role !== 'Guru' && role !== 'Orang Tua') {
      menuItems.push(
        <Link key="dashboard" href="/dashboard" className="flex items-center gap-3 text-gray-600 transition-colors hover:text-[#125B34] hover:bg-green-50 px-3 py-2.5 rounded-lg">
          <LayoutDashboard className="w-5 h-5" /> Executive Dashboard
        </Link>
      );
    }

    // Manajemen Data
    if (role === 'Admin') {
      menuItems.push(
        <div key="label-data" className="mt-4 mb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Manajemen Data
        </div>
      );
      
      menuItems.push(
        <Link key="teachers" href="/dashboard/teachers" className="flex items-center gap-3 text-gray-600 transition-colors hover:text-[#125B34] hover:bg-green-50 px-3 py-2.5 rounded-lg">
          <GraduationCap className="w-5 h-5" /> Data Guru
        </Link>
      );

      menuItems.push(
        <Link key="students" href="/dashboard/students" className="flex items-center gap-3 text-gray-600 transition-colors hover:text-[#125B34] hover:bg-green-50 px-3 py-2.5 rounded-lg">
          <Users className="w-5 h-5" /> Data Siswa
        </Link>
      );

      menuItems.push(
        <Link key="classes" href="/dashboard/classes" className="flex items-center gap-3 text-gray-600 transition-colors hover:text-[#125B34] hover:bg-green-50 px-3 py-2.5 rounded-lg">
          <School className="w-5 h-5" /> Data Kelas
        </Link>
      );
      
      menuItems.push(
        <Link key="competitions" href="/dashboard/competitions" className="flex items-center gap-3 text-gray-600 transition-colors hover:text-[#125B34] hover:bg-green-50 px-3 py-2.5 rounded-lg">
          <Trophy className="w-5 h-5" /> Event / Lomba
        </Link>
      );
    }

    // Orang Tua Portal
    if (role === 'Orang Tua') {
      menuItems.push(
        <div key="label-ortu" className="mt-4 mb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Portal Orang Tua
        </div>
      );
      menuItems.push(
        <Link key="profil-anak" href={studentId ? `/dashboard/students/${studentId}` : '#'} className="flex items-center gap-3 text-gray-600 transition-colors hover:text-[#125B34] hover:bg-green-50 px-3 py-2.5 rounded-lg">
          <Users className="w-5 h-5" /> Profil Anak
        </Link>
      );
      menuItems.push(
        <Link key="lomba-anak" href={studentId ? `/dashboard/students/${studentId}/competitions` : '#'} className="flex items-center gap-3 text-gray-600 transition-colors hover:text-[#125B34] hover:bg-green-50 px-3 py-2.5 rounded-lg">
          <Trophy className="w-5 h-5" /> Event / Lomba
        </Link>
      );
      menuItems.push(
        <Link key="talenta-anak" href={studentId ? `/dashboard/talents/assessments/${studentId}` : '#'} className="flex items-center gap-3 text-gray-600 transition-colors hover:text-[#125B34] hover:bg-green-50 px-3 py-2.5 rounded-lg">
          <Target className="w-5 h-5" /> Talenta Anak
        </Link>
      );
      menuItems.push(
        <div key="label-prestasi-ortu" className="mt-4 mb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Prestasi
        </div>
      );
      menuItems.push(
        <Link key="prestasi-sekolah-ortu" href="/dashboard/achievements" className="flex items-center gap-3 text-gray-600 transition-colors hover:text-[#125B34] hover:bg-green-50 px-3 py-2.5 rounded-lg">
          <BarChart3 className="w-5 h-5" /> Dasbor Prestasi Sekolah
        </Link>
      );
      menuItems.push(
        <Link key="prestasi-anak" href={studentId ? `/dashboard/students/${studentId}/achievements` : '#'} className="flex items-center gap-3 text-gray-600 transition-colors hover:text-[#125B34] hover:bg-green-50 px-3 py-2.5 rounded-lg">
          <Trophy className="w-5 h-5" /> Riwayat Prestasi Anak
        </Link>
      );
      menuItems.push(
        <Link key="dasbor-inkubasi-ortu" href="/dashboard/incubation" className="flex items-center gap-3 text-gray-600 transition-colors hover:text-[#125B34] hover:bg-green-50 px-3 py-2.5 rounded-lg">
          <BarChart3 className="w-5 h-5" /> Dasbor Inkubasi Sekolah
        </Link>
      );
      menuItems.push(
        <Link key="inkubasi-anak" href={studentId ? `/dashboard/students/${studentId}/incubation` : '#'} className="flex items-center gap-3 text-gray-600 transition-colors hover:text-[#125B34] hover:bg-green-50 px-3 py-2.5 rounded-lg">
          <Lightbulb className="w-5 h-5" /> Program Inkubasi Anak
        </Link>
      );
    }

    // Pemetaan Talenta
    if (role !== 'Orang Tua') {
      menuItems.push(
        <div key="label-talenta" className="mt-4 mb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Pemetaan Talenta
        </div>
      );
      menuItems.push(
        <Link key="dashboard-talenta" href="/dashboard/talents" className="flex items-center gap-3 text-gray-600 transition-colors hover:text-[#125B34] hover:bg-green-50 px-3 py-2.5 rounded-lg">
          <BarChart3 className="w-5 h-5" /> Dasbor Talenta
        </Link>
      );
      menuItems.push(
        <Link key="asesmen" href="/dashboard/talents/assessments" className="flex items-center gap-3 text-gray-600 transition-colors hover:text-[#125B34] hover:bg-green-50 px-3 py-2.5 rounded-lg">
          <Target className="w-5 h-5" /> Asesmen & Ranking
        </Link>
      );
    }

    // Manajemen Prestasi
    if (role !== 'Orang Tua') {
      menuItems.push(
        <div key="label-prestasi" className="mt-4 mb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Manajemen Prestasi
        </div>
      );
      if (role !== 'Guru' && role !== 'Wali Kelas') {
        menuItems.push(
          <Link key="dashboard-prestasi" href="/dashboard/achievements" className="flex items-center gap-3 text-gray-600 transition-colors hover:text-[#125B34] hover:bg-green-50 px-3 py-2.5 rounded-lg">
            <BarChart3 className="w-5 h-5" /> Dasbor Prestasi
          </Link>
        );
      }
      menuItems.push(
        <Link key="daftar-prestasi" href="/dashboard/achievements/records" className="flex items-center gap-3 text-gray-600 transition-colors hover:text-[#125B34] hover:bg-green-50 px-3 py-2.5 rounded-lg">
          <Trophy className="w-5 h-5" /> Daftar Prestasi
        </Link>
      );
    }

    // Program Inkubasi
    if (role !== 'Orang Tua' && role !== 'Guru' && role !== 'Wali Kelas') {
      menuItems.push(
        <div key="label-inkubasi" className="mt-4 mb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Program Inkubasi
        </div>
      );
      menuItems.push(
        <Link key="dashboard-inkubasi" href="/dashboard/incubation" className="flex items-center gap-3 text-gray-600 transition-colors hover:text-[#125B34] hover:bg-green-50 px-3 py-2.5 rounded-lg">
          <BarChart3 className="w-5 h-5" /> Dasbor Inkubasi
        </Link>
      );
      menuItems.push(
        <Link key="daftar-program" href="/dashboard/incubation/programs" className="flex items-center gap-3 text-gray-600 transition-colors hover:text-[#125B34] hover:bg-green-50 px-3 py-2.5 rounded-lg">
          <Lightbulb className="w-5 h-5" /> Daftar Program
        </Link>
      );
    }

    // Sistem
    if (role === 'Admin') {
      menuItems.push(
        <div key="label-sistem" className="mt-4 mb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Sistem
        </div>
      );
      menuItems.push(
        <Link key="users" href="/dashboard/admin/users" className="flex items-center gap-3 text-gray-600 transition-colors hover:text-[#125B34] hover:bg-green-50 px-3 py-2.5 rounded-lg">
          <ShieldAlert className="w-5 h-5" /> Role Management
        </Link>
      );
    }

    // Bantuan (Tersedia untuk semua)
    menuItems.push(
      <div key="label-bantuan" className="mt-4 mb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Bantuan
      </div>
    );
    menuItems.push(
      <Link key="guide" href="/dashboard/guide" className="flex items-center gap-3 text-gray-600 transition-colors hover:text-[#125B34] hover:bg-green-50 px-3 py-2.5 rounded-lg">
        <HelpCircle className="w-5 h-5" /> Panduan Penggunaan
      </Link>
    );

    return menuItems;
  };

  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC]">
      
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white">
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-100">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo LPI" width={36} height={36} className="h-9 w-auto drop-shadow-sm" />
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-[#125B34] leading-tight text-lg">Talent<span className="text-gray-900">Dashboard</span></span>
            </div>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <nav className="flex flex-col gap-2 text-sm font-medium">
            {renderMenus()}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-100">
           <div className="bg-emerald-50 text-emerald-800 px-3 py-2 rounded-lg text-xs font-semibold text-center border border-emerald-100">
             Login sebagai: {role}
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b border-gray-200 bg-white/80 backdrop-blur-md px-6 shadow-sm">
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

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
      
    </div>
  );
}
