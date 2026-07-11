'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Achievement, AchievementStatus } from '@/types/achievement';
import { verifyAchievement } from '@/actions/achievements';
import { CheckCircle, XCircle } from 'lucide-react';

interface VerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  achievement: Achievement | null;
  onSuccess: () => void;
}

export function VerificationDialog({ open, onOpenChange, achievement, onSuccess }: VerificationDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleVerify(status: AchievementStatus) {
    if (!achievement) return;
    
    setLoading(true);
    setError(null);

    const res = await verifyAchievement(achievement.id, status);

    if (res.success) {
      onSuccess();
      onOpenChange(false);
    } else {
      setError(res.error);
    }
    setLoading(false);
  }

  if (!achievement) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Verifikasi Prestasi</DialogTitle>
          <DialogDescription>
            Validasi pencapaian siswa ini. Hanya Admin yang berhak melakukan tindakan ini.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>}

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h3 className="font-bold text-gray-900">{achievement.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{achievement.student?.full_name}</p>
            <div className="flex gap-2 mt-2">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium">{achievement.category}</span>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-medium">{achievement.level}</span>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <p><strong>Tanggal:</strong> {new Date(achievement.date).toLocaleDateString('id-ID')}</p>
            {achievement.certificate_url ? (
              <a href={achievement.certificate_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline mt-2 block">
                Lihat Lampiran Sertifikat
              </a>
            ) : (
              <p className="mt-2 italic text-gray-400">Tidak ada sertifikat terlampir</p>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:justify-between w-full">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Batal
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="destructive" 
              onClick={() => handleVerify('Ditolak')}
              disabled={loading}
              className="gap-2"
            >
              <XCircle className="w-4 h-4" /> Tolak
            </Button>
            <Button 
              onClick={() => handleVerify('Diverifikasi')}
              disabled={loading}
              className="bg-[#125B34] hover:bg-[#0B3A20] text-white gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Verifikasi
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
