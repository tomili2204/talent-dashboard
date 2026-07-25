'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, Trophy } from 'lucide-react';
import { RegisterParticipantDialog } from '@/components/competitions/register-participant-dialog';
import { RecordWinnerDialog } from '@/components/competitions/record-winner-dialog';
import { Competition } from '@/types/competition';
import { useRouter } from 'next/navigation';

export default function AddParticipantButton({ 
  competition, 
  participants = [] 
}: { 
  competition: Competition;
  participants?: any[];
}) {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [winnerOpen, setWinnerOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      {/* Button 1: Daftarkan Peserta (Keikutsertaan) */}
      <Button 
        onClick={() => setRegisterOpen(true)}
        className="bg-[#125B34] hover:bg-[#0B3A20] text-white text-xs gap-1.5 rounded-lg px-3 py-1.5 h-8 font-medium shadow-sm"
      >
        <UserPlus className="w-3.5 h-3.5" />
        Daftarkan Peserta
      </Button>

      {/* Button 2: Catat Juara / Prestasi */}
      <Button 
        onClick={() => setWinnerOpen(true)}
        variant="outline"
        className="border-amber-200 bg-amber-50/50 hover:bg-amber-100 text-amber-800 text-xs gap-1.5 rounded-lg px-3 py-1.5 h-8 font-medium"
      >
        <Trophy className="w-3.5 h-3.5 text-amber-600" />
        Catat Juara
      </Button>

      {/* Modal 1: Pendaftaran Keikutsertaan Peserta */}
      <RegisterParticipantDialog
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        competition={competition}
        onSuccess={() => {
          router.refresh();
        }}
      />

      {/* Modal 2: Catat Juara (Pilih dari Peserta yang ikut) */}
      <RecordWinnerDialog
        open={winnerOpen}
        onOpenChange={setWinnerOpen}
        competition={competition}
        participants={participants}
        onSuccess={() => {
          router.refresh();
        }}
        onOpenRegister={() => {
          setRegisterOpen(true);
        }}
      />
    </div>
  );
}
