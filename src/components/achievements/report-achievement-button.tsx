'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, X } from 'lucide-react';
import { saveAchievement } from '@/actions/achievements';

export default function ReportAchievementButton({ studentId }: { studentId: string }) {
  const [showModal, setShowModal] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);

    formData.set('student_id', studentId);
    formData.set('status', 'Menunggu Verifikasi');

    const result = await saveAchievement(formData);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        setShowModal(false);
        setSuccess(false);
        window.location.reload();
      }, 1500);
    } else {
      setError(result.error || 'Terjadi kesalahan saat menyimpan.');
    }
    setIsPending(false);
  }

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className="bg-[#125B34] hover:bg-[#0B3A20] text-white rounded-xl gap-2 shadow-md"
      >
        <PlusCircle className="w-4 h-4" />
        Laporkan Prestasi
      </Button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => { setShowModal(false); setError(null); setSuccess(false); }}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-1">Laporkan Prestasi Anak</h3>
            <p className="text-xs text-gray-500 mb-5">Prestasi akan dikirim ke Admin untuk diverifikasi.</p>

            {success ? (
              <div className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <PlusCircle className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-green-700 font-semibold">Prestasi berhasil dilaporkan!</p>
                <p className="text-xs text-gray-500 mt-1">Menunggu verifikasi Admin sekolah.</p>
              </div>
            ) : (
              <form action={handleSubmit} className="overflow-y-auto space-y-4 pr-1">
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl">
                    {error}
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-sm font-medium">Judul Prestasi *</Label>
                  <Input id="title" name="title" placeholder="Contoh: Juara 1 Lomba Tahfidz" required className="rounded-xl" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Kategori *</Label>
                    <Select name="category" required>
                      <SelectTrigger className="rounded-xl"><SelectValue placeholder="Pilih" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Akademik">Akademik</SelectItem>
                        <SelectItem value="Olahraga">Olahraga</SelectItem>
                        <SelectItem value="Seni">Seni</SelectItem>
                        <SelectItem value="Keagamaan">Keagamaan</SelectItem>
                        <SelectItem value="Teknologi">Teknologi</SelectItem>
                        <SelectItem value="Lainnya">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Tingkat *</Label>
                    <Select name="level" required>
                      <SelectTrigger className="rounded-xl"><SelectValue placeholder="Pilih" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sekolah">Sekolah</SelectItem>
                        <SelectItem value="Kecamatan">Kecamatan</SelectItem>
                        <SelectItem value="Kabupaten">Kabupaten</SelectItem>
                        <SelectItem value="Provinsi">Provinsi</SelectItem>
                        <SelectItem value="Nasional">Nasional</SelectItem>
                        <SelectItem value="Internasional">Internasional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="rank" className="text-sm font-medium">Peringkat / Juara</Label>
                    <Input id="rank" name="rank" placeholder="Contoh: Juara 1" className="rounded-xl" />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="date" className="text-sm font-medium">Tanggal *</Label>
                    <Input id="date" name="date" type="date" required className="rounded-xl" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description" className="text-sm font-medium">Deskripsi (Opsional)</Label>
                  <textarea
                    id="description"
                    name="description"
                    rows={2}
                    placeholder="Keterangan tambahan..."
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#125B34] focus:border-transparent"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="certificate" className="text-sm font-medium">Upload Sertifikat (Opsional)</Label>
                  <Input id="certificate" name="certificate" type="file" accept="image/*,.pdf" className="rounded-xl text-sm" />
                  <p className="text-[10px] text-gray-400">Format: JPG, PNG, atau PDF. Maksimal 2 MB.</p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => { setShowModal(false); setError(null); }}
                    className="rounded-xl"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-[#125B34] hover:bg-[#0B3A20] text-white rounded-xl px-6"
                  >
                    {isPending ? 'Mengirim...' : 'Laporkan Prestasi'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
