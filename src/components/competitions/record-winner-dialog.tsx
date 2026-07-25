'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, AlertCircle } from 'lucide-react';
import { ACHIEVEMENT_RANKS } from '@/types/achievement';
import { saveAchievement } from '@/actions/achievements';
import { Competition } from '@/types/competition';
import { useRouter } from 'next/navigation';

interface RecordWinnerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  competition: Competition;
  participants: any[];
  onSuccess: () => void;
  onOpenRegister: () => void;
}

export function RecordWinnerDialog({ open, onOpenChange, competition, participants, onSuccess, onOpenRegister }: RecordWinnerDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>('');
  const [rank, setRank] = useState<string>('Juara 1');
  const [description, setDescription] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setError(null);
      setDescription('');
      setRank('Juara 1');
      if (participants && participants.length > 0) {
        setSelectedParticipantId(participants[0].id);
      } else {
        setSelectedParticipantId('');
      }
    }
  }, [open, participants]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedParticipantId) {
      setError('Silakan pilih peserta terlebih dahulu.');
      return;
    }

    setLoading(true);
    setError(null);

    const participant = participants.find(p => p.id === selectedParticipantId);
    if (!participant) {
      setError('Data peserta tidak ditemukan.');
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.append('id', participant.id);
    formData.append('student_id', participant.student_id);
    formData.append('title', participant.title);
    formData.append('category', participant.category);
    formData.append('level', participant.level);
    formData.append('date', participant.date || competition.start_date || new Date().toISOString().split('T')[0]);
    formData.append('rank', rank);
    formData.append('status', 'Diverifikasi');
    formData.append('competition_id', competition.id);
    if (participant.branch_id) {
      formData.append('branch_id', participant.branch_id);
    }
    if (participant.teacher_id) {
      formData.append('teacher_id', participant.teacher_id);
    }
    if (participant.external_mentor) {
      formData.append('external_mentor', participant.external_mentor);
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

  const selectedParticipant = participants.find(p => p.id === selectedParticipantId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Trophy className="w-5 h-5 text-amber-600" />
            Catat Juara / Prestasi
          </DialogTitle>
          <DialogDescription>
            Pilih peserta yang telah didaftarkan lalu tentukan capaian juara dan upload sertifikat.
          </DialogDescription>
        </DialogHeader>

        {participants.length === 0 ? (
          <div className="py-8 text-center flex flex-col items-center space-y-3">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-gray-700">Belum ada peserta yang didaftarkan untuk lomba ini.</p>
            <p className="text-xs text-gray-500 max-w-xs">Silakan daftarkan peserta terlebih dahulu sebelum mencatat kejuaraan.</p>
            <Button
              type="button"
              onClick={() => {
                onOpenChange(false);
                onOpenRegister();
              }}
              className="bg-[#125B34] hover:bg-[#0B3A20] text-white text-xs mt-2"
            >
              + Daftarkan Peserta Sekarang
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>}

            <div className="space-y-2">
              <Label className="text-sm font-medium">Pilih Peserta Lomba <span className="text-red-500">*</span></Label>
              <Select value={selectedParticipantId} onValueChange={(val) => val && setSelectedParticipantId(val)}>
                <SelectTrigger className="bg-white">
                  <span className="truncate">
                    {selectedParticipant ? (
                      `${selectedParticipant.student?.full_name} — ${
                        selectedParticipant.branch?.name || 
                        (selectedParticipant.title && selectedParticipant.title.includes(' - ') 
                          ? selectedParticipant.title.split(' - ').slice(1).join(' - ') 
                          : competition.name)
                      }`
                    ) : "Pilih nama peserta"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {participants.map(p => {
                    const bName = p.branch?.name || (p.title && p.title.includes(' - ') ? p.title.split(' - ').slice(1).join(' - ') : competition.name);
                    return (
                      <SelectItem key={p.id} value={p.id}>
                        {p.student?.full_name} ({p.student?.class?.name || '-'}) — Cabang: {bName}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Prestasi / Juara yang Diraih <span className="text-red-500">*</span></Label>
              <Select value={rank} onValueChange={(val) => val && setRank(val)}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Pilih Peringkat/Juara" />
                </SelectTrigger>
                <SelectContent>
                  {ACHIEVEMENT_RANKS.filter(r => r !== 'Peserta').map(r => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Upload Sertifikat (Opsional)</Label>
              <Input name="certificate" type="file" accept=".pdf,image/png,image/jpeg,image/jpg" />
              <p className="text-xs text-gray-500">Maksimal 5MB. Format PDF, PNG, atau JPG.</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Catatan Khusus / Deskripsi (Opsional)</Label>
              <Textarea
                name="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={2}
                placeholder="Keterangan tambahan pencapaian..."
              />
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={loading} className="bg-amber-600 hover:bg-amber-700 text-white">
                {loading ? 'Menyimpan...' : 'Simpan Juara'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
