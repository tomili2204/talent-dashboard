'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { createCompetition, updateCompetition } from '@/actions/competitions';
import { Competition } from '@/types/competition';
import { ACHIEVEMENT_CATEGORIES, ACHIEVEMENT_LEVELS } from '@/types/achievement';
import { Pencil, Plus } from 'lucide-react';

interface CompetitionDialogProps {
  competition?: Competition;
  trigger?: React.ReactElement;
}

export function CompetitionDialog({ competition, trigger }: CompetitionDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!competition;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      if (isEditing) {
        await updateCompetition(competition.id, formData);
      } else {
        await createCompetition(formData);
      }
      setOpen(false);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        trigger || (
          <Button className="bg-[#125B34] hover:bg-[#125B34]/90">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Lomba
          </Button>
        )
      } />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Lomba' : 'Tambah Lomba Baru'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Nama Lomba</label>
            <Input name="name" required defaultValue={competition?.name} placeholder="Misal: Olimpiade Sains Nasional" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Penyelenggara</label>
            <Input name="organizer" required defaultValue={competition?.organizer} placeholder="Misal: Kemdikbud" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Kategori</label>
              <Select name="category" defaultValue={competition?.category} required>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  {ACHIEVEMENT_CATEGORIES.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Jenjang/Tingkat</label>
              <Select name="level" defaultValue={competition?.level} required>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Jenjang" />
                </SelectTrigger>
                <SelectContent>
                  {ACHIEVEMENT_LEVELS.map(l => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tahun</label>
            <Input name="year" required defaultValue={competition?.year} placeholder="Misal: 2026" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal Mulai (Opsional)</label>
              <Input name="start_date" type="date" defaultValue={competition?.start_date || ''} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal Selesai (Opsional)</label>
              <Input name="end_date" type="date" defaultValue={competition?.end_date || ''} />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#125B34] hover:bg-[#125B34]/90">
              {loading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
