import { getProgramById, getParticipantsByProgramId } from '@/actions/incubation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target, Calendar, User, Edit2 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ParticipantList } from '@/components/incubation/participant-list';
import { ProgramDialog } from '@/components/incubation/program-dialog';

export const dynamic = 'force-dynamic';

export default async function ProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  const [programRes, participantsRes] = await Promise.all([
    getProgramById(id),
    getParticipantsByProgramId(id)
  ]);

  if (!programRes.data) {
    notFound();
  }

  const program = programRes.data;
  const participants = participantsRes.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/incubation/programs">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Detail Program Inkubasi</h1>
          <p className="text-gray-500 mt-1">Informasi lengkap dan pemantauan peserta program</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-white border border-gray-200 shadow-sm lg:col-span-1">
          <CardHeader className="pb-3 border-b border-gray-100 flex flex-row items-start justify-between">
            <CardTitle className="text-lg">Informasi Program</CardTitle>
            <ProgramDialog mode="edit" program={program} />
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div>
              <h3 className="font-bold text-gray-900 text-lg leading-tight">{program.name}</h3>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {program.target_domain}
              </span>
            </div>

            <div className="text-sm text-gray-600 border-l-2 border-gray-200 pl-3 py-1">
              {program.description || 'Tidak ada deskripsi'}
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Guru Pembina / Mentor</p>
                  <p className="font-medium text-gray-900">{program.mentor?.full_name || 'Belum Ditugaskan'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Periode Pelaksanaan</p>
                  <p className="font-medium text-gray-900">
                    {new Date(program.start_date).toLocaleDateString('id-ID')} - {program.end_date ? new Date(program.end_date).toLocaleDateString('id-ID') : 'Selesai'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                  <Target className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status Program</p>
                  <p className="font-medium text-gray-900">{program.status === 'Active' ? 'Aktif Berjalan' : program.status === 'Completed' ? 'Telah Selesai' : 'Draft'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm lg:col-span-2">
          <CardHeader className="pb-3 border-b border-gray-100 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Peserta & Monitoring</CardTitle>
            <div className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
              {participants.length} Peserta Terdaftar
            </div>
          </CardHeader>
          <CardContent className="pt-0 px-0">
            <ParticipantList programId={program.id} initialParticipants={participants} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
