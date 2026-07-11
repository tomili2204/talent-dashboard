'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ACHIEVEMENT_CATEGORIES, ACHIEVEMENT_LEVELS, ACHIEVEMENT_RANKS, Achievement } from '@/types/achievement';
import { saveAchievement } from '@/actions/achievements';
import { getStudents } from '@/actions/students';
import { getCompetitions } from '@/actions/competitions';
import { getTeachers } from '@/actions/teachers';
import { Competition } from '@/types/competition';
import { Teacher } from '@/types/teacher';

interface AchievementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  achievement?: Achievement | null;
  onSuccess: () => void;
}

export function AchievementDialog({ open, onOpenChange, achievement, onSuccess }: AchievementDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [studentComboboxOpen, setStudentComboboxOpen] = useState(false);

  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<string>('');
  const [competitionComboboxOpen, setCompetitionComboboxOpen] = useState(false);
  
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [teacherComboboxOpen, setTeacherComboboxOpen] = useState(false);
  
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [level, setLevel] = useState<string>('');
  const [rank, setRank] = useState<string>('');
  const [externalMentor, setExternalMentor] = useState<string>('');
  const [isManualInput, setIsManualInput] = useState<boolean>(false);
  
  // Load initial data
  useEffect(() => {
    async function loadData() {
      const [{ data: sData }, cData, { data: tData }] = await Promise.all([
        getStudents('', 'all', 1, 1000),
        getCompetitions(),
        getTeachers('', 1, 1000)
      ]);
      if (sData) setStudents(sData);
      if (cData) setCompetitions(cData);
      if (tData) setTeachers(tData);
    }
    if (open) {
      loadData();
      if (achievement) {
        setSelectedStudent(achievement.student_id);
        setRank(achievement.rank || '');
        setSelectedTeacher(achievement.teacher_id || '');
        setExternalMentor(achievement.external_mentor || '');
        if (achievement.competition_id) {
          setSelectedCompetition(achievement.competition_id);
          setIsManualInput(false);
          // Wait for loadData to finish to set other fields correctly, handled in another effect or just set them here
          setTitle(achievement.title);
          setCategory(achievement.category);
          setLevel(achievement.level);
        } else {
          setSelectedCompetition('manual');
          setIsManualInput(true);
          setTitle(achievement.title);
          setCategory(achievement.category);
          setLevel(achievement.level);
        }
      } else {
        setSelectedStudent('');
        setSelectedCompetition('');
        setSelectedTeacher('');
        setIsManualInput(false);
        setTitle('');
        setCategory('');
        setLevel('');
        setRank('');
        setExternalMentor('');
      }
    }
  }, [open, achievement]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    if (achievement) {
      formData.append('id', achievement.id);
      if (achievement.certificate_url) {
        formData.append('existing_certificate_url', achievement.certificate_url);
      }
    }
    
    formData.append('student_id', selectedStudent);
    formData.append('category', category);
    formData.append('level', level);
    formData.append('rank', rank);
    
    if (selectedTeacher) {
      formData.append('teacher_id', selectedTeacher);
    }
    if (externalMentor) {
      formData.append('external_mentor', externalMentor);
    }
    
    // Override title if not manual
    if (!isManualInput) {
      const comp = competitions.find(c => c.id === selectedCompetition);
      if (comp) {
        formData.set('title', comp.name);
        formData.append('competition_id', comp.id);
      }
    } else {
      formData.set('title', title);
    }

    const res = await saveAchievement(formData);

    if (res.success) {
      onSuccess();
      onOpenChange(false);
    } else {
      setError(res.error);
    }
    setLoading(false);
  }

  const handleSelectCompetition = (val: string) => {
    setSelectedCompetition(val);
    setCompetitionComboboxOpen(false);
    
    if (val === 'manual') {
      setIsManualInput(true);
      setTitle('');
      setCategory('');
      setLevel('');
    } else {
      setIsManualInput(false);
      const comp = competitions.find(c => c.id === val);
      if (comp) {
        setTitle(comp.name);
        setCategory(comp.category);
        setLevel(comp.level);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{achievement ? 'Edit Data Prestasi' : 'Tambah Prestasi Baru'}</DialogTitle>
          <DialogDescription>
            Masukkan rincian prestasi yang dicapai oleh siswa.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>}

          <div className="space-y-2">
            <Label>Siswa <span className="text-red-500">*</span></Label>
            <Popover open={studentComboboxOpen} onOpenChange={setStudentComboboxOpen}>
              <PopoverTrigger
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-normal"
                >
                  {selectedStudent
                    ? students.find((student) => student.id === selectedStudent)?.full_name
                    : "Pilih siswa..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Cari nama siswa..." />
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

          <div className="space-y-2">
            <Label>Event/Lomba <span className="text-red-500">*</span></Label>
            <Popover open={competitionComboboxOpen} onOpenChange={setCompetitionComboboxOpen}>
              <PopoverTrigger
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-normal"
                >
                  <span className="truncate">
                    {selectedCompetition === 'manual' 
                      ? 'Input Manual Lainnya' 
                      : selectedCompetition 
                        ? competitions.find((c) => c.id === selectedCompetition)?.name 
                        : "Pilih Event Lomba..."}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Cari lomba..." />
                  <CommandList>
                    <CommandEmpty>Lomba tidak ditemukan.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="Input Manual Lainnya"
                        onSelect={() => handleSelectCompetition('manual')}
                        className="font-medium text-blue-600"
                      >
                        <Check className={cn("mr-2 h-4 w-4", selectedCompetition === 'manual' ? "opacity-100" : "opacity-0")} />
                        Input Manual Lainnya
                      </CommandItem>
                      {competitions.map((comp) => (
                        <CommandItem
                          key={comp.id}
                          value={comp.name}
                          onSelect={() => handleSelectCompetition(comp.id)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCompetition === comp.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {comp.name} ({comp.year})
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {isManualInput && (
            <div className="space-y-2">
              <Label>Nama Lomba (Manual) <span className="text-red-500">*</span></Label>
              <Input 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                required={isManualInput} 
                placeholder="Ketik nama lomba..." 
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="rank">Prestasi <span className="text-red-500">*</span></Label>
            <Select value={rank} onValueChange={(val) => setRank(val || '')} required>
              <SelectTrigger>
                <SelectValue placeholder="Pilih prestasi/juara" />
              </SelectTrigger>
              <SelectContent>
                {ACHIEVEMENT_RANKS.map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Kategori <span className="text-red-500">*</span></Label>
              <Select value={category} onValueChange={(val) => setCategory(val || '')} required disabled={!isManualInput && selectedCompetition !== ''}>
                <SelectTrigger className={!isManualInput && selectedCompetition !== '' ? 'bg-gray-50' : ''}>
                  <span className="truncate">{category || "Pilih kategori"}</span>
                </SelectTrigger>
                <SelectContent>
                  {ACHIEVEMENT_CATEGORIES.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!isManualInput && selectedCompetition !== '' && (
                <p className="text-xs text-gray-400">Otomatis diisi dari data lomba</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="level">Tingkat <span className="text-red-500">*</span></Label>
              <Select value={level} onValueChange={(val) => setLevel(val || '')} required disabled={!isManualInput && selectedCompetition !== ''}>
                <SelectTrigger className={!isManualInput && selectedCompetition !== '' ? 'bg-gray-50' : ''}>
                  <span className="truncate">{level || "Pilih tingkat"}</span>
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
            <Label htmlFor="date">Tanggal Pencapaian <span className="text-red-500">*</span></Label>
            <Input id="date" name="date" type="date" defaultValue={achievement?.date} required />
          </div>

          <div className="space-y-2">
            <Label>Guru Pembimbing (Opsional)</Label>
            <Popover open={teacherComboboxOpen} onOpenChange={setTeacherComboboxOpen}>
              <PopoverTrigger
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-normal"
                >
                  {selectedTeacher
                    ? teachers.find((t) => t.id === selectedTeacher)?.full_name
                    : "Pilih guru pembimbing..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Cari nama guru..." />
                  <CommandList>
                    <CommandEmpty>Guru tidak ditemukan.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="reset"
                        onSelect={() => {
                          setSelectedTeacher('');
                          setTeacherComboboxOpen(false);
                        }}
                        className="text-red-500"
                      >
                        <Check className={cn("mr-2 h-4 w-4", selectedTeacher === '' ? "opacity-100" : "opacity-0")} />
                        (Kosongkan pilihan)
                      </CommandItem>
                      {teachers.map((t) => (
                        <CommandItem
                          key={t.id}
                          value={t.full_name}
                          onSelect={() => {
                            setSelectedTeacher(t.id);
                            setTeacherComboboxOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedTeacher === t.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {t.full_name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="external_mentor">Pembimbing Luar (Opsional)</Label>
            <Input 
              id="external_mentor" 
              name="external_mentor" 
              value={externalMentor}
              onChange={e => setExternalMentor(e.target.value)}
              placeholder="Contoh: Budi Santoso (Pelatih Luar)" 
            />
            <p className="text-xs text-gray-400">Gunakan jika pembimbing bukan dari guru sekolah.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi (Opsional)</Label>
            <Textarea id="description" name="description" defaultValue={achievement?.description || ''} rows={2} placeholder="Keterangan tambahan..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="certificate">Upload Sertifikat (Opsional)</Label>
            <Input id="certificate" name="certificate" type="file" accept=".pdf,image/png,image/jpeg,image/jpg" />
            <p className="text-xs text-gray-500">Maks. 5MB. Format PDF atau Gambar (JPG/PNG).</p>
            {achievement?.certificate_url && (
              <a href={achievement.certificate_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">
                Lihat sertifikat saat ini
              </a>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button type="submit" disabled={loading} className="bg-[#125B34] hover:bg-[#0B3A20] text-white">
              {loading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
