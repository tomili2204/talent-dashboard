'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ClassData } from '@/types/class';
import { getClasses } from '@/actions/classes';
import { createStudent, updateStudent } from '@/actions/students';
import { Student } from '@/types/student';

type StudentFormProps = {
  initialData?: Student | null;
};

export function StudentForm({ initialData }: StudentFormProps) {
  const router = useRouter();
  const initClass = initialData?.classes as any;
  const initialClassObj = Array.isArray(initClass) ? initClass[0] : initClass;
  
  const [classes, setClasses] = useState<ClassData[]>(
    initialClassObj ? [initialClassObj] : []
  );
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isEdit = !!initialData;

  const [classId, setClassId] = useState<string>(initialData?.class_id || '');

  useEffect(() => {
    async function fetchClasses() {
      const res = await getClasses(1, 100);
      if (res.data) {
        let fetchedClasses = res.data;
        const initClass = initialData?.classes as any;
        const initialClassObj = Array.isArray(initClass) ? initClass[0] : initClass;
        
        if (initialClassObj && !fetchedClasses.find(c => c.id === initialClassObj.id)) {
          fetchedClasses = [initialClassObj, ...fetchedClasses];
        }
        setClasses(fetchedClasses);
      }
    }
    fetchClasses();
  }, [initialData?.classes]);

  async function handleSubmit(formData: FormData) {
    formData.set('class_id', classId);
    setIsPending(true);
    setError(null);
    
    let res;
    if (isEdit && initialData) {
      res = await updateStudent(initialData.id, formData);
    } else {
      res = await createStudent(formData);
    }

    if (res.success) {
      router.push('/dashboard/students');
    } else {
      setError(res.error);
      setIsPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nis">NIS (Nomor Induk Siswa)</Label>
          <Input id="nis" name="nis" defaultValue={initialData?.nis || ''} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nisn">NISN</Label>
          <Input id="nisn" name="nisn" defaultValue={initialData?.nisn || ''} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="full_name">Nama Lengkap</Label>
        <Input id="full_name" name="full_name" defaultValue={initialData?.full_name || ''} required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="gender">Jenis Kelamin</Label>
          <Select name="gender" defaultValue={initialData?.gender || 'Laki-laki'}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Jenis Kelamin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Laki-laki">Laki-laki</SelectItem>
              <SelectItem value="Perempuan">Perempuan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="date_of_birth">Tanggal Lahir</Label>
          <Input id="date_of_birth" name="date_of_birth" type="date" defaultValue={initialData?.date_of_birth || ''} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="class_id">Kelas</Label>
          <Select name="class_id" value={classId} onValueChange={(val) => setClassId(val || '')}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Kelas">
                {classId ? (classes.find(c => c.id === classId)?.name || 'Kelas Tidak Ditemukan') : undefined}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {classes.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
              {classId && !classes.find(c => c.id === classId) && (
                <SelectItem value={classId}>Kelas Tidak Ditemukan</SelectItem>
              )}
              {classes.length === 0 && !classId && (
                <SelectItem value="" disabled>Belum ada data kelas</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status Siswa</Label>
          <Select name="status" defaultValue={initialData?.status || 'Aktif'}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Aktif">Aktif</SelectItem>
              <SelectItem value="Lulus">Lulus</SelectItem>
              <SelectItem value="Pindah">Pindah</SelectItem>
              <SelectItem value="Keluar">Keluar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="parent_name">Nama Orang Tua / Wali</Label>
        <Input id="parent_name" name="parent_name" defaultValue={initialData?.parent_name || ''} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="parent_phone">Nomor HP Orang Tua</Label>
        <Input id="parent_phone" name="parent_phone" defaultValue={initialData?.parent_phone || ''} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Alamat Lengkap</Label>
        <textarea 
          id="address" 
          name="address" 
          defaultValue={initialData?.address || ''}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button variant="outline" type="button" onClick={() => router.push('/dashboard/students')}>
          Batal
        </Button>
        <Button type="submit" className="bg-[#125B34] hover:bg-[#0B3A20] text-white" disabled={isPending}>
          {isPending ? 'Menyimpan...' : 'Simpan Data Siswa'}
        </Button>
      </div>
    </form>
  );
}
