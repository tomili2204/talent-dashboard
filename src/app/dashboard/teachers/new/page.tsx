'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createTeacher } from '@/actions/teachers';
import { ArrowLeft } from 'lucide-react';

export default function NewTeacherPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await createTeacher(formData);

    if (res.success) {
      router.push('/dashboard/teachers');
    } else {
      setError(res.error);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/teachers">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tambah Guru Baru</h1>
          <p className="text-gray-500">Masukkan data guru atau tenaga pendidik baru ke dalam sistem.</p>
        </div>
      </div>

      <Card className="shadow-sm border-gray-100">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
          <CardTitle className="text-lg">Form Data Guru</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md font-medium">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nik" className="text-gray-700">NIK (Nomor Induk Kependudukan) <span className="text-red-500">*</span></Label>
                <Input id="nik" name="nik" placeholder="Masukkan NIK 16 digit" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-gray-700">Nama Lengkap <span className="text-red-500">*</span></Label>
                <Input id="full_name" name="full_name" placeholder="Nama beserta gelar" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position" className="text-gray-700">Jabatan</Label>
                <Input id="position" name="position" placeholder="Contoh: Guru Matematika" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700">Nomor HP</Label>
                <Input id="phone" name="phone" placeholder="Contoh: 081234567890" />
              </div>

              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="email" className="text-gray-700">Alamat Email</Label>
                <Input id="email" name="email" type="email" placeholder="contoh@guru.sch.id" />
              </div>

              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="password" className="text-gray-700">Password Login (Opsional)</Label>
                <Input id="password" name="password" type="text" placeholder="Default: 123456" />
                <p className="text-xs text-gray-400 mt-1">Jika dikosongkan, akan otomatis menggunakan 123456</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <Link href="/dashboard/teachers">
                <Button variant="outline" type="button" className="border-gray-200">Batal</Button>
              </Link>
              <Button type="submit" className="bg-[#125B34] hover:bg-[#0B3A20] text-white" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan Data Guru'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
