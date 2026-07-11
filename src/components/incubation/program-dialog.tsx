'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { saveProgram } from '@/actions/incubation';
import { getTeachers } from '@/actions/teachers';
import { IncubationProgram } from '@/types/incubation';
import { Plus, Edit2 } from 'lucide-react';

interface ProgramDialogProps {
  mode: 'add' | 'edit';
  program?: IncubationProgram;
}

export function ProgramDialog({ mode, program }: ProgramDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<any[]>([]);

  const [targetDomain, setTargetDomain] = useState<string>(program?.target_domain || '');
  const [status, setStatus] = useState<string>(program?.status || 'Draft');
  const [mentorId, setMentorId] = useState<string>(program?.mentor_id || 'unassigned');

  useEffect(() => {
    async function loadTeachers() {
      const { data } = await getTeachers();
      if (data) setTeachers(data);
    }
    if (open) loadTeachers();
  }, [open]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set('target_domain', targetDomain);
    formData.set('status', status);
    
    if (mentorId && mentorId !== 'unassigned') {
      formData.set('mentor_id', mentorId);
    }

    const { success, error: serverError } = await saveProgram(program?.id || null, formData);

    if (!success) {
      setError(serverError);
      setLoading(false);
      return;
    }

    setLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        mode === 'add' ? (
          <Button className="bg-[#125B34] hover:bg-[#0e4729] gap-2">
            <Plus className="w-4 h-4" />
            Buat Program
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="gap-2">
            <Edit2 className="w-4 h-4" />
            Edit
          </Button>
        )
      } />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Buat Program Inkubasi Baru' : 'Edit Program Inkubasi'}</DialogTitle>
          <DialogDescription>
            Isi rincian program inkubasi/pembinaan talenta.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Program <span className="text-red-500">*</span></Label>
            <Input id="name" name="name" defaultValue={program?.name} required placeholder="Contoh: Persiapan OSN Matematika 2026" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea id="description" name="description" defaultValue={program?.description || ''} placeholder="Deskripsi singkat program..." rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target_domain">Domain Talenta <span className="text-red-500">*</span></Label>
              <Select value={targetDomain} onValueChange={(val) => setTargetDomain(val || '')} required>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih domain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Akademik">Akademik</SelectItem>
                  <SelectItem value="Keagamaan">Keagamaan</SelectItem>
                  <SelectItem value="Kepemimpinan">Kepemimpinan</SelectItem>
                  <SelectItem value="Seni">Seni</SelectItem>
                  <SelectItem value="Olahraga">Olahraga</SelectItem>
                  <SelectItem value="Teknologi">Teknologi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(val) => setStatus(val || '')} required>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Active">Aktif</SelectItem>
                  <SelectItem value="Completed">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Tanggal Mulai <span className="text-red-500">*</span></Label>
              <Input type="date" id="start_date" name="start_date" defaultValue={program?.start_date} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">Tanggal Selesai</Label>
              <Input type="date" id="end_date" name="end_date" defaultValue={program?.end_date || ''} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mentor_id">Guru Pembina / Mentor</Label>
            <Select value={mentorId} onValueChange={(val) => setMentorId(val || '')}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih guru pembina">
                  {mentorId === 'unassigned' 
                    ? '- Belum Ditugaskan -' 
                    : (teachers.find(t => t.id === mentorId)?.full_name || '')}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">- Belum Ditugaskan -</SelectItem>
                {teachers.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.full_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#125B34] hover:bg-[#0e4729]">
              {loading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
