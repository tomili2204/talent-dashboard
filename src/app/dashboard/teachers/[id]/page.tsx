'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Teacher } from '@/types/teacher';
import { getTeacherById, updateTeacher } from '@/actions/teachers';
import { ArrowLeft } from 'lucide-react';

export default function EditTeacherPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const res = await getTeacherById(id);
      if (res.data) {
        setTeacher(res.data);
      } else {
        setError(res.error);
      }
      setLoading(false);
    }
    loadData();
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await updateTeacher(id, formData);

    if (res.success) {
      router.push('/dashboard/teachers');
    } else {
      setError(res.error);
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Memuat data guru...</div>;
  if (!teacher && error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!teacher) return <div className="p-8 text-center">Data tidak ditemukan.</div>;

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/teachers">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Detail & Edit Guru</h1>
          <p className="text-gray-500">Perbarui data informasi guru atau tenaga pendidik.</p>
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
                <Input id="nik" name="nik" defaultValue={teacher.nik} required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-gray-700">Nama Lengkap <span className="text-red-500">*</span></Label>
                <Input id="full_name" name="full_name" defaultValue={teacher.full_name} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position" className="text-gray-700">Jabatan</Label>
                <Input id="position" name="position" defaultValue={teacher.position || ''} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700">Nomor HP</Label>
                <Input id="phone" name="phone" defaultValue={teacher.phone || ''} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Alamat Email</Label>
                <Input id="email" name="email" type="email" defaultValue={teacher.email || ''} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password Baru (Opsional)</Label>
                <Input id="password" name="password" type="password" placeholder="••••••••" />
                <p className="text-xs text-gray-500">Kosongkan jika tidak ingin merubah password saat ini.</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <Link href="/dashboard/teachers">
                <Button variant="outline" type="button" className="border-gray-200">Batal</Button>
              </Link>
              <Button type="submit" className="bg-[#125B34] hover:bg-[#0B3A20] text-white" disabled={saving}>
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
