'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login, signup } from '@/actions/auth';
import { CheckCircle2, HelpCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

type AuthMode = 'login' | 'register_guru' | 'register_ortu';
type StudentOption = { id: string; full_name: string; nis: string; class: { name: string } | null };

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [showGuideModal, setShowGuideModal] = useState(false);

  async function clientAction(formData: FormData) {
    setIsPending(true);
    setError(null);
    setSuccess(null);
    
    if (authMode === 'login') {
      const result = await login(formData);
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        router.push('/dashboard');
        router.refresh();
        return;
      }
    } else {
      // Registration Mode
      formData.append('role', authMode === 'register_guru' ? 'Guru' : 'Orang Tua');

      const result = await signup(formData);
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setSuccess('Pendaftaran berhasil! Akun Anda sedang menunggu persetujuan Admin.');
        setAuthMode('login'); // Switch back to login
      }
    }
    setIsPending(false);
  }

  return (
    <div className="w-full min-h-screen flex bg-gray-50/50">
      {/* Left Side - Branding & Logo (Hidden on mobile) */}
      <div className="relative hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-[#125B34] to-[#0B3A20] text-white p-12 overflow-hidden">
        {/* Abstract Background Patterns */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent bg-[length:20px_20px]" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-30" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#F39C12] rounded-full mix-blend-multiply filter blur-[128px] opacity-20" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl shadow-lg">
              <img src="/logo.png" alt="Logo LPI Roudlotut Tholibin" className="w-12 h-12 object-contain" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150?text=Logo'; }} />
            </div>
            <div className="font-bold text-xl tracking-wide">Yayasan<br/>Roudlotut Tholibin</div>
          </div>
        </div>

        <div className="relative z-10 mb-20">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Dashboard <br/>
            <span className="text-[#F39C12]">Manajemen Talenta</span>
          </h1>
          <p className="text-emerald-50/80 text-lg max-w-md leading-relaxed text-justify">
            Platform terpadu untuk memetakan talenta, memonitor prestasi, dan mengembangkan karakter siswa LPI Roudlotut Tholibin.
          </p>
          <p className="text-emerald-300 text-xl max-w-md leading-relaxed mt-4 text-center sm:text-left" style={{ fontFamily: 'var(--font-cursive)' }}>
            "Mencetak Calon Cendekiawan Islam Kelas Dunia"
          </p>
        </div>

        <div className="relative z-10 text-sm text-emerald-200/60 font-medium">
          &copy; {new Date().getFullYear()} LPI Roudlotut Tholibin. All rights reserved.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 my-8">
          <div className="text-center lg:text-left space-y-2">
            {/* Mobile Logo Fallback */}
            <div className="lg:hidden flex justify-center mb-6">
               <div className="bg-gray-50 p-3 rounded-2xl shadow-sm border border-gray-100">
                  <img src="/logo.png" alt="Logo LPI" className="w-16 h-16 object-contain" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150?text=Logo'; }} />
               </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              {authMode === 'login' ? 'Selamat Datang' : 'Daftar Akun Baru'}
            </h2>
            <p className="text-sm text-gray-500">
              {authMode === 'login' 
                ? 'Silakan masuk dengan akun yang terdaftar di sistem.'
                : `Pendaftaran sebagai ${authMode === 'register_guru' ? 'Guru' : 'Orang Tua'}.`}
            </p>
          </div>


          <form action={clientAction} className="space-y-5 mt-6">
            {success && (
              <div className="p-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in-95 duration-300">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                {success}
              </div>
            )}
            {error && (
              <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in-95 duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email / Username</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={authMode === 'login' ? "admin@lpirt.sch.id" : "Masukkan email aktif..."}
                  required
                  className="h-12 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-[#125B34] focus-visible:ring-offset-2 focus-visible:border-[#125B34] transition-all"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                </div>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  placeholder="••••••••"
                  required 
                  className="h-12 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-[#125B34] focus-visible:ring-offset-2 focus-visible:border-[#125B34] transition-all"
                />
              </div>

              {authMode === 'register_ortu' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="p-3 bg-blue-50 text-blue-700 text-xs rounded-xl border border-blue-100 mb-2 leading-relaxed">
                    Untuk mendaftar sebagai Orang Tua, pastikan Anda memasukkan <b>NIS</b> dan <b>Tanggal Lahir</b> anak Anda dengan benar sesuai data sekolah.
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nis" className="text-gray-700 font-medium">NIS Anak / Siswa</Label>
                    <Input 
                      id="nis"
                      name="nis"
                      type="text"
                      placeholder="Contoh: 12345"
                      required
                      className="h-12 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-[#125B34] focus-visible:border-[#125B34]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth" className="text-gray-700 font-medium">Tanggal Lahir Anak</Label>
                    <Input 
                      id="date_of_birth"
                      name="date_of_birth"
                      type="date"
                      required
                      className="h-12 rounded-xl bg-gray-50/50 border-gray-200 focus-visible:ring-[#125B34] focus-visible:border-[#125B34]"
                    />
                  </div>
                </div>
              )}
            </div>

            <Button 
              className="w-full h-12 text-base font-semibold rounded-xl bg-[#125B34] hover:bg-[#0B3A20] text-white shadow-lg shadow-[#125B34]/20 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 mt-4" 
              type="submit" 
              disabled={isPending}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Memproses...</span>
                </div>
              ) : (authMode === 'login' ? 'Masuk ke Dashboard' : 'Daftar Akun')}
            </Button>
          </form>

          {authMode === 'login' ? (
            <div className="flex flex-wrap gap-2 justify-center pt-6 mt-4 border-t border-gray-100">
               <span className="text-sm text-gray-600 self-center w-full text-center mb-1">Belum punya akun? Daftar sebagai:</span>
               <div className="flex gap-2 justify-center">
                 <button type="button" onClick={() => { setAuthMode('register_guru'); setError(null); setSuccess(null); }} className="text-xs px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100 transition-colors">Guru</button>
                 <button type="button" onClick={() => { setAuthMode('register_ortu'); setError(null); setSuccess(null); }} className="text-xs px-4 py-2 rounded-full bg-orange-50 text-orange-700 font-semibold hover:bg-orange-100 transition-colors">Orang Tua</button>
               </div>
               <button 
                 type="button" 
                 onClick={() => setShowGuideModal(true)} 
                 className="mt-4 flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#125B34] font-medium transition-colors justify-center w-full"
               >
                 <HelpCircle className="w-4 h-4" /> Bagaimana cara mendaftar? Lihat Panduan
               </button>
            </div>
          ) : (
            <div className="flex gap-2 justify-center pt-6 mt-4 border-t border-gray-100">
               <button type="button" onClick={() => { setAuthMode('login'); setError(null); setSuccess(null); }} className="text-sm px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors">← Kembali ke Halaman Login</button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Panduan Pendaftaran */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button 
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="overflow-y-auto pr-2 space-y-6">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-[#125B34]" />
                  Panduan Pendaftaran Akun
                </h3>
                <p className="text-xs text-gray-500">
                  Berikut cara mendaftar akun baru agar dapat mengakses sistem Talent Dashboard.
                </p>
              </div>

              {/* Guru */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                <h4 className="font-bold text-sm text-[#125B34] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#125B34] text-white flex items-center justify-center text-xs">G</span>
                  Pendaftaran Akun Guru
                </h4>
                <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside pl-1.5 leading-relaxed">
                  <li>Pilih tombol <b>"Guru"</b> di halaman login.</li>
                  <li>Masukkan <b>Email aktif</b> dan buat <b>Password</b> Anda.</li>
                  <li>Klik <b>"Daftar Akun"</b>.</li>
                  <li>Akun Anda akan masuk antrean persetujuan. Hubungi <b>Admin Sekolah</b> untuk mengaktifkan akun Anda.</li>
                </ul>
              </div>

              {/* Orang Tua */}
              <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100 space-y-2">
                <h4 className="font-bold text-sm text-orange-800 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs">O</span>
                  Pendaftaran Akun Orang Tua (Wali)
                </h4>
                <div className="p-2 bg-blue-50 text-blue-700 text-[10px] rounded-lg border border-blue-100 font-medium">
                  Sistem menggunakan Verifikasi Ganda untuk keamanan data anak Anda.
                </div>
                <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside pl-1.5 leading-relaxed">
                  <li>Pilih tombol <b>"Orang Tua"</b> di halaman login.</li>
                  <li>Masukkan <b>Email aktif</b> dan <b>Password</b> yang ingin dibuat.</li>
                  <li>Masukkan <b>NIS (Nomor Induk Siswa)</b> dan <b>Tanggal Lahir</b> anak Anda secara tepat sesuai data sekolah.</li>
                  <li>Klik <b>"Daftar Akun"</b>. Jika data anak cocok, pendaftaran berhasil.</li>
                  <li>Tunggu verifikasi akhir dari <b>Admin Sekolah</b> sebelum Anda dapat login ke dasbor.</li>
                </ul>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-4 border-t border-gray-100 mt-6 flex justify-end">
              <Button 
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="bg-[#125B34] hover:bg-[#0B3A20] text-white rounded-xl px-6"
              >
                Saya Mengerti
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
