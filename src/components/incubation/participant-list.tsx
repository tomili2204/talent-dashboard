'use client';

import { useState, useEffect } from 'react';
import { IncubationParticipant } from '@/types/incubation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { addParticipant, updateParticipant, removeParticipant } from '@/actions/incubation';
import { getStudents } from '@/actions/students';
import { UserPlus, Save, Trash2, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ParticipantListProps {
  programId: string;
  initialParticipants: IncubationParticipant[];
}

function EvaluationNotesManager({ participant, handleUpdate }: { participant: any, handleUpdate: (id: string, updates: any) => Promise<void> }) {
  const [newNote, setNewNote] = useState('');
  const [posting, setPosting] = useState(false);
  
  // Parse notes
  let notes: { date: string, text: string }[] = [];
  if (participant.evaluation_notes) {
    try {
      notes = JSON.parse(participant.evaluation_notes);
      if (!Array.isArray(notes)) throw new Error('Not an array');
    } catch (e) {
      // Legacy text
      notes = [{ date: participant.created_at || new Date().toISOString(), text: participant.evaluation_notes }];
    }
  }

  const handlePost = async () => {
    if (!newNote.trim()) return;
    setPosting(true);
    const updatedNotes = [...notes, { date: new Date().toISOString(), text: newNote.trim() }];
    
    // Optimistic UI update can be handled by parent if handleUpdate mutates state, 
    // but here we just wait for DB update. The parent component doesn't update its own state on handleUpdate,
    // actually handleUpdate currently doesn't update the `participants` state locally, wait!
    // The handleUpdate function in ParticipantList:
    // const { success, error } = await updateParticipant(id, programId, updates);
    // It does not update local state! It relies on reload or external.
    // I should update local state here to reflect immediately.
    
    // We will update the participant object locally for optimism
    participant.evaluation_notes = JSON.stringify(updatedNotes);
    
    await handleUpdate(participant.id, { evaluation_notes: participant.evaluation_notes });
    setNewNote('');
    setPosting(false);
  };

  return (
    <div className="mt-3">
      <label className="text-xs font-medium text-gray-700 block mb-2">Riwayat Catatan Evaluasi</label>
      <div className="space-y-2 mb-3 max-h-[150px] overflow-y-auto pr-1">
        {notes.length === 0 ? (
          <p className="text-xs text-gray-400 italic">Belum ada catatan.</p>
        ) : (
          notes.map((n, i) => (
            <div key={i} className="bg-white border border-gray-100 p-2 rounded-md shadow-sm">
              <p className="text-[10px] font-semibold text-[#125B34] mb-0.5">
                {new Date(n.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-xs text-gray-700 whitespace-pre-wrap">{n.text}</p>
            </div>
          ))
        )}
      </div>
      <div className="flex gap-2">
        <Input 
          className="h-8 text-xs bg-white" 
          placeholder="Ketik catatan baru..." 
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handlePost(); }}
        />
        <Button 
          size="sm" 
          className="h-8 bg-[#125B34] hover:bg-[#0e4729]" 
          onClick={handlePost} 
          disabled={posting || !newNote.trim()}
        >
          {posting ? '...' : 'Post'}
        </Button>
      </div>
    </div>
  );
}

export function ParticipantList({ programId, initialParticipants }: ParticipantListProps) {
  const [participants, setParticipants] = useState<IncubationParticipant[]>(initialParticipants);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [studentComboboxOpen, setStudentComboboxOpen] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function loadStudents() {
      const { data } = await getStudents('', 'all', 1, 1000);
      if (data) setStudents(data);
    }
    loadStudents();
  }, []);

  const handleAddParticipant = async () => {
    if (!selectedStudent) return;
    setAdding(true);
    const { success, error } = await addParticipant(programId, selectedStudent);
    if (!success) {
      alert(error || "Gagal menambah peserta");
    } else {
      alert("Peserta ditambahkan");
      setSelectedStudent('');
      window.location.reload();
    }
    setAdding(false);
  };

  const handleUpdate = async (id: string, updates: any) => {
    const { success, error } = await updateParticipant(id, programId, updates);
    if (!success) {
      alert(error || "Gagal mengupdate");
    } else {
      // alert("Tersimpan");
    }
  };

  const handleRemove = async (id: string) => {
    if (confirm('Yakin ingin mengeluarkan peserta ini?')) {
      const { success, error } = await removeParticipant(id, programId);
      if (!success) {
        alert(error || "Gagal mengeluarkan");
      } else {
        alert("Peserta dikeluarkan");
        window.location.reload();
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-end sm:items-center gap-3">
        <div className="w-full sm:flex-1">
          <Popover open={studentComboboxOpen} onOpenChange={setStudentComboboxOpen}>
            <PopoverTrigger
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-normal"
              >
                {selectedStudent
                  ? students.find((student) => student.id === selectedStudent)?.full_name
                  : "Cari dan tambah siswa..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </PopoverTrigger>
            <PopoverContent className="w-[300px] sm:w-[400px] p-0">
              <Command>
                <CommandInput placeholder="Cari nama atau NIS..." />
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
                        {student.full_name} ({student.nis}) - {student.classes?.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <Button 
          onClick={handleAddParticipant} 
          disabled={!selectedStudent || adding}
          className="bg-[#125B34] hover:bg-[#0e4729] w-full sm:w-auto"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          {adding ? 'Menambahkan...' : 'Tambah'}
        </Button>
      </div>

      <div className="divide-y divide-gray-100">
        {participants.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Belum ada peserta yang ditambahkan ke program ini.
          </div>
        ) : (
          participants.map((p) => (
            <div key={p.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{p.student?.full_name}</h4>
                  <p className="text-xs text-gray-500 mb-2">NIS: {p.student?.nis} • Kelas: {p.student?.classes?.name || '-'}</p>
                  
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-700 block mb-1">Status Partisipasi</label>
                      <Select 
                        defaultValue={p.status} 
                        onValueChange={(val) => handleUpdate(p.id, { status: val || '' })}
                      >
                        <SelectTrigger className="h-8 text-xs bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Aktif</SelectItem>
                          <SelectItem value="Graduated">Lulus/Selesai</SelectItem>
                          <SelectItem value="Dropped">Dikeluarkan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 block mb-1">Progress Score (0-100)</label>
                      <Input 
                        type="number" 
                        min="0" max="100" 
                        defaultValue={p.progress_score} 
                        className="h-8 text-xs bg-white"
                        onBlur={(e) => handleUpdate(p.id, { progress_score: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  
                  <EvaluationNotesManager participant={p} handleUpdate={handleUpdate} />
                </div>
                
                <div className="sm:pl-4 sm:border-l border-gray-100 flex sm:flex-col justify-end gap-2 shrink-0">
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8" onClick={() => handleRemove(p.id)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Hapus
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
