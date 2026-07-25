'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { createCompetition, updateCompetition } from '@/actions/competitions';
import { Competition, CompetitionBranch } from '@/types/competition';
import { ACHIEVEMENT_CATEGORIES, ACHIEVEMENT_LEVELS, AchievementCategory } from '@/types/achievement';
import { Pencil, Plus, Trash2, Layers, Calendar } from 'lucide-react';

interface CompetitionDialogProps {
  competition?: Competition;
  trigger?: React.ReactElement;
}

export function CompetitionDialog({ competition, trigger }: CompetitionDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!competition;

  // Multi-branch state
  const [branches, setBranches] = useState<{ name: string; category: AchievementCategory }[]>([]);

  useEffect(() => {
    if (open) {
      if (competition?.branches && competition.branches.length > 0) {
        setBranches(competition.branches.map(b => ({
          name: b.name,
          category: b.category as AchievementCategory
        })));
      } else if (competition?.category) {
        setBranches([{
          name: competition.name,
          category: competition.category as AchievementCategory
        }]);
      } else {
        setBranches([{
          name: '',
          category: 'Akademik'
        }]);
      }
    }
  }, [open, competition]);

  const handleAddBranch = () => {
    setBranches(prev => [...prev, { name: '', category: 'Akademik' }]);
  };

  const handleRemoveBranch = (index: number) => {
    if (branches.length <= 1) return; // Keep at least one branch
    setBranches(prev => prev.filter((_, i) => i !== index));
  };

  const handleBranchChange = (index: number, field: 'name' | 'category', value: string) => {
    setBranches(prev => prev.map((b, i) => i === index ? { ...b, [field]: value } : b));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    // Filter valid branches
    const validBranches = branches.map((b, idx) => ({
      name: b.name.trim() || (idx === 0 ? (formData.get('name') as string) : `Cabang ${idx + 1}`),
      category: b.category
    }));

    formData.append('branches_json', JSON.stringify(validBranches));
    // Set fallback category for backwards compatibility
    if (validBranches.length > 0) {
      formData.append('category', validBranches[0].category);
    }

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
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Event / Lomba' : 'Tambah Event / Lomba Baru'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Nama Event / Lomba <span className="text-red-500">*</span></label>
            <Input name="name" required defaultValue={competition?.name} placeholder="Misal: Ajang Siswa Berprestasi 2026" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Penyelenggara <span className="text-red-500">*</span></label>
            <Input name="organizer" required defaultValue={competition?.organizer} placeholder="Misal: MJ Education Centre" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Jenjang / Tingkat <span className="text-red-500">*</span></label>
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Tahun <span className="text-red-500">*</span></label>
              <Input name="year" required defaultValue={competition?.year || new Date().getFullYear().toString()} placeholder="Misal: 2026" />
            </div>
          </div>

          {/* Tanggal Pendaftaran Section */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <label className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" /> Tanggal Pendaftaran (Opsional)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Dari Tanggal (Mulai)</label>
                <Input name="start_date" type="date" defaultValue={competition?.start_date || ''} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Sampai Tanggal (Selesai)</label>
                <Input name="end_date" type="date" defaultValue={competition?.end_date || ''} />
              </div>
            </div>
          </div>

          {/* Tanggal Pelaksanaan Section */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-orange-600" /> Tanggal Pelaksanaan (Opsional)
            </label>
            <Input name="execution_date" type="date" defaultValue={competition?.execution_date || ''} />
          </div>

          {/* Section Cabang Perlombaan */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-600" /> Cabang Perlombaan
                </label>
                <p className="text-xs text-gray-500">Satu event bisa berisi beberapa jenis / cabang lomba.</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={handleAddBranch} className="text-xs gap-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                <Plus className="w-3.5 h-3.5" /> Tambah Cabang
              </Button>
            </div>

            <div className="space-y-3">
              {branches.map((branch, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-gray-600">Cabang #{index + 1}</span>
                    {branches.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveBranch(index)}
                        className="text-gray-400 hover:text-red-500 p-2 rounded-lg transition-colors hover:bg-red-50"
                        title="Hapus cabang ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <Input
                        placeholder="Nama Cabang (misal: Olimpiade Matematika)"
                        value={branch.name}
                        onChange={(e) => handleBranchChange(index, 'name', e.target.value)}
                        className="bg-white text-xs h-9"
                      />
                    </div>
                    <div>
                      <Select
                        value={branch.category}
                        onValueChange={(val) => handleBranchChange(index, 'category', val as AchievementCategory)}
                      >
                        <SelectTrigger className="bg-white text-xs h-9">
                          <SelectValue placeholder="Pilih Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {ACHIEVEMENT_CATEGORIES.map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
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
