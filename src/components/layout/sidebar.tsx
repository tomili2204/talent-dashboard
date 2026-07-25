'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutDashboard, Users, School, ShieldAlert, GraduationCap, Target, BarChart3, Lightbulb, Trophy, HelpCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from '@/actions/auth';
import Image from 'next/image';

interface NavItem {
  type: 'link' | 'label';
  key: string;
  href?: string;
  label: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  role: string;
  studentId: string;
}

export default function Sidebar({ role, studentId }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const buildNavItems = (): NavItem[] => {
    const items: NavItem[] = [];

    if (role !== 'Guru' && role !== 'Orang Tua') {
      items.push({ type: 'link', key: 'dashboard', href: '/dashboard', label: 'Executive Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> });
    }

    if (role === 'Admin') {
      items.push({ type: 'label', key: 'label-data', label: 'Manajemen Data' });
      items.push({ type: 'link', key: 'teachers', href: '/dashboard/teachers', label: 'Data Guru', icon: <GraduationCap className="w-5 h-5" /> });
      items.push({ type: 'link', key: 'students', href: '/dashboard/students', label: 'Data Siswa', icon: <Users className="w-5 h-5" /> });
      items.push({ type: 'link', key: 'classes', href: '/dashboard/classes', label: 'Data Kelas', icon: <School className="w-5 h-5" /> });
      items.push({ type: 'link', key: 'competitions', href: '/dashboard/competitions', label: 'Event / Lomba', icon: <Trophy className="w-5 h-5" /> });
    }

    if (role === 'Orang Tua') {
      items.push({ type: 'label', key: 'label-ortu', label: 'Portal Orang Tua' });
      items.push({ type: 'link', key: 'profil-anak', href: studentId ? `/dashboard/students/${studentId}` : '#', label: 'Profil Anak', icon: <Users className="w-5 h-5" /> });
      items.push({ type: 'link', key: 'lomba-anak', href: studentId ? `/dashboard/students/${studentId}/competitions` : '#', label: 'Event / Lomba', icon: <Trophy className="w-5 h-5" /> });
      items.push({ type: 'link', key: 'talenta-anak', href: studentId ? `/dashboard/talents/assessments/${studentId}` : '#', label: 'Talenta Anak', icon: <Target className="w-5 h-5" /> });
      items.push({ type: 'label', key: 'label-prestasi-ortu', label: 'Prestasi' });
      items.push({ type: 'link', key: 'prestasi-sekolah-ortu', href: '/dashboard/achievements', label: 'Dasbor Prestasi Sekolah', icon: <BarChart3 className="w-5 h-5" /> });
      items.push({ type: 'link', key: 'prestasi-anak', href: studentId ? `/dashboard/students/${studentId}/achievements` : '#', label: 'Riwayat Prestasi Anak', icon: <Trophy className="w-5 h-5" /> });
      items.push({ type: 'link', key: 'inkubasi-ortu', href: '/dashboard/incubation', label: 'Dasbor Inkubasi Sekolah', icon: <BarChart3 className="w-5 h-5" /> });
      items.push({ type: 'link', key: 'inkubasi-anak', href: studentId ? `/dashboard/students/${studentId}/incubation` : '#', label: 'Program Inkubasi Anak', icon: <Lightbulb className="w-5 h-5" /> });
    }

    if (role !== 'Orang Tua') {
      items.push({ type: 'label', key: 'label-talenta', label: 'Pemetaan Talenta' });
      items.push({ type: 'link', key: 'dashboard-talenta', href: '/dashboard/talents', label: 'Dasbor Talenta', icon: <BarChart3 className="w-5 h-5" /> });
      items.push({ type: 'link', key: 'asesmen', href: '/dashboard/talents/assessments', label: 'Asesmen & Ranking', icon: <Target className="w-5 h-5" /> });
    }

    if (role !== 'Orang Tua') {
      items.push({ type: 'label', key: 'label-prestasi', label: 'Manajemen Prestasi' });
      if (role !== 'Guru' && role !== 'Wali Kelas') {
        items.push({ type: 'link', key: 'dashboard-prestasi', href: '/dashboard/achievements', label: 'Dasbor Prestasi', icon: <BarChart3 className="w-5 h-5" /> });
      }
      items.push({ type: 'link', key: 'daftar-prestasi', href: '/dashboard/achievements/records', label: 'Daftar Prestasi', icon: <Trophy className="w-5 h-5" /> });
    }

    if (role !== 'Orang Tua' && role !== 'Guru' && role !== 'Wali Kelas') {
      items.push({ type: 'label', key: 'label-inkubasi', label: 'Program Inkubasi' });
      items.push({ type: 'link', key: 'dashboard-inkubasi', href: '/dashboard/incubation', label: 'Dasbor Inkubasi', icon: <BarChart3 className="w-5 h-5" /> });
      items.push({ type: 'link', key: 'daftar-program', href: '/dashboard/incubation/programs', label: 'Daftar Program', icon: <Lightbulb className="w-5 h-5" /> });
    }

    if (role === 'Admin') {
      items.push({ type: 'label', key: 'label-sistem', label: 'Sistem' });
      items.push({ type: 'link', key: 'users', href: '/dashboard/admin/users', label: 'Role Management', icon: <ShieldAlert className="w-5 h-5" /> });
    }

    items.push({ type: 'label', key: 'label-bantuan', label: 'Bantuan' });
    items.push({ type: 'link', key: 'guide', href: '/dashboard/guide', label: 'Panduan Penggunaan', icon: <HelpCircle className="w-5 h-5" /> });

    return items;
  };

  const navItems = buildNavItems();

  const NavContent = () => (
    <nav className="flex flex-col gap-1 text-sm font-medium">
      {navItems.map(item => {
        if (item.type === 'label') {
          return (
            <div key={item.key} className="mt-5 mb-1 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {item.label}
            </div>
          );
        }
        const isActive = item.href && item.href !== '#' && pathname === item.href;
        return (
          <Link
            key={item.key}
            href={item.href || '#'}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              isActive
                ? 'bg-emerald-50 text-[#125B34] font-semibold border-l-2 border-[#125B34]'
                : 'text-gray-600 hover:text-[#125B34] hover:bg-green-50'
            }`}
          >
            <span className={isActive ? 'text-[#125B34]' : 'text-gray-400'}>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* ===== MOBILE TOP BAR ===== */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-14 px-4 bg-white border-b border-gray-200 shadow-sm">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={30} height={30} className="h-8 w-auto" />
          <span className="font-extrabold text-[#125B34] text-base">Talent<span className="text-gray-900">Dashboard</span></span>
        </Link>
        <div className="flex items-center gap-2">
          <form action={logout}>
            <Button variant="ghost" size="icon" type="submit" className="text-red-500 hover:bg-red-50 h-9 w-9">
              <LogOut className="w-4 h-4" />
            </Button>
          </form>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="h-9 w-9 text-gray-600"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* ===== MOBILE OVERLAY ===== */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ===== MOBILE DRAWER ===== */}
      <aside className={`lg:hidden fixed top-14 left-0 bottom-0 z-50 w-72 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <NavContent />
        </div>
        <div className="p-3 border-t border-gray-100">
          <div className="bg-emerald-50 text-emerald-800 px-3 py-2 rounded-lg text-xs font-semibold text-center border border-emerald-100">
            Login sebagai: {role}
          </div>
        </div>
      </aside>

      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-64 flex-col border-r border-gray-200 bg-white">
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-100">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo LPI" width={36} height={36} className="h-9 w-auto drop-shadow-sm" />
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-[#125B34] leading-tight text-lg">
                Talent<span className="text-gray-900">Dashboard</span>
              </span>
            </div>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <NavContent />
        </div>
        <div className="p-4 border-t border-gray-100">
          <div className="bg-emerald-50 text-emerald-800 px-3 py-2 rounded-lg text-xs font-semibold text-center border border-emerald-100">
            Login sebagai: {role}
          </div>
        </div>
      </aside>
    </>
  );
}
