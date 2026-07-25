'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getStudents } from '@/actions/students';
import { saveAchievement } from '@/actions/achievements';
import { Competition } from '@/types/competition';
import { useRouter } from 'next/navigation';

interface RegisterParticipantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  competition: Competition;
  onSuccess: () => void;
}

export function RegisterParticipantDialog({ open, onOpenChange, competition, onSuccess }: RegisterParticipantDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [studentComboboxOpen, setStudentComboboxOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    if (open) {
      getStudents('', 'all', 1, 1000).then(({ data }) => {
        if (data) setStudents(data);
      });
      setSelectedStudent('');
      setError(null);
      if (competition.branches && competition.branches.length > 0) {
        setSelectedBranch(competition.branches[0].id || '');
      }
    }
  }, [open, competition]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedStudent) {
      setError('Silakan pilih siswa terlebih dahulu.');
      return;
    }

    setLoading(true);
    setError(null);

    const branch = competition.branches?.find(b => b.id === selectedBranch);
    const branchName = branch ? branch.name : competition.name;
    const category = branch ? branch.category : (competition.category || 'Akademik');

    const formData = new FormData();
    formData.append('student_id', selectedStudent);
    formData.append('title', branchName === competition.name ? competition.name : `${competition.name} - ${branchName}`);
    formData.append('category', category);
    formData.append('level', competition.level);
    formData.append('date', competition.start_date || new Date().toISOString().split('T')[0]);
    formData.append('rank', 'Peserta');
    formData.append('status', 'Diverifikasi');
    formData.append('competition_id', competition.id);
    if (selectedBranch) {
      formData.append('branch_id', selectedBranch);
    }

    const res = await saveAchievement(formData);

    if (res.success) {
      onSuccess();
      onOpenChange(false);
      router.refresh();
    } else {
      setError(res.error);
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <UserPlus className="w-5 h-5 text-emerald-600" />
            Daftarkan Peserta Lomba
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>}

          <div className="space-y-2">
            <Label className="text-sm font-medium">Pilih Siswa <span className="text-red-500">*</span></Label>
            <Popover open={studentComboboxOpen} onOpenChange={setStudentComboboxOpen}>
              <PopoverTrigger
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-normal"
              >
                {selectedStudent
                  ? students.find((student) => student.id === selectedStudent)?.full_name
                  : "Cari & pilih nama siswa..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Ketik nama siswa..." />
                  <CommandList>
                    <CommandEmpty>Siswa tidak ditemukan.</CommandEmpty>
                    <CommandGroup>
                      {students.map((student) => (
                        <CommandItem
                          key={student.id}
                          value={student.full_name}
                          onSelect={() => {
                            setSelectedStudent(student.id);
                            setStudentComboboxOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedStudent === student.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {student.full_name} ({student.nis})
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {competition.branches && competition.branches.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Cabang Lomba <span className="text-red-500">*</span></Label>
              <Select value={selectedBranch} onValueChange={(val) => val && setSelectedBranch(val)}>
                <SelectTrigger className="bg-white">
                  <span className="truncate">
                    {competition.branches.find(b => b.id === selectedBranch)?.name
                      ? `${competition.branches.find(b => b.id === selectedBranch)?.name} (${competition.branches.find(b => b.id === selectedBranch)?.category})`
                      : "Pilih Cabang Lomba"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {competition.branches.map(b => (
                    <SelectItem key={b.id || b.name} value={b.id || ''}>
                      {b.name} ({b.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#125B34] hover:bg-[#0B3A20] text-white">
              {loading ? 'Menyimpan...' : 'Daftarkan Peserta'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
