'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Plus } from 'lucide-react';
import { requestIncubationParticipation } from '@/actions/incubation-interests';

export function JoinIncubationButton({ studentId, programId, isJoined }: { studentId: string, programId: string, isJoined: boolean }) {
  const [loading, setLoading] = useState(false);

  if (isJoined) {
    return (
      <Button variant="outline" className="w-full bg-gray-50 text-emerald-600 border-emerald-200 hover:bg-gray-50 cursor-default" disabled>
        <CheckCircle className="w-4 h-4 mr-2" /> Sudah Terdaftar / Mengajukan
      </Button>
    );
  }

  const handleJoin = async () => {
    setLoading(true);
    const result = await requestIncubationParticipation(studentId, programId);
    setLoading(false);

    if (result.success) {
      alert('Berhasil! Pengajuan keikutsertaan telah dikirim.');
    } else {
      alert(result.error || 'Terjadi kesalahan.');
    }
  };

  return (
    <Button 
      className="w-full bg-[#125B34] hover:bg-[#0B3A20] text-white" 
      onClick={handleJoin}
      disabled={loading}
    >
      <Plus className="w-4 h-4 mr-2" />
      {loading ? 'Memproses...' : 'Ajukan Keikutsertaan'}
    </Button>
  );
}
