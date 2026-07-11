import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Trophy, Medal, Star, Calendar, CheckCircle, Clock } from 'lucide-react';
import { getStudentById } from '@/actions/students';

export default async function StudentAchievementsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  
  const { data: student } = await getStudentById(id);
  const supabase = await createClient();

  const { data: achievements } = await supabase
    .from('achievements')
    .select('*, competition:competitions(*)')
    .eq('student_id', id)
    .order('date', { ascending: false });

  const verified = achievements?.filter(a => a.status === 'Diverifikasi') || [];
  const pending = achievements?.filter(a => a.status === 'Menunggu Verifikasi') || [];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Riwayat Prestasi</h1>
        <p className="text-gray-500">
          Catatan perjalanan prestasi dan keikutsertaan lomba dari {student?.full_name || 'Siswa'}.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-gray-100 shadow-sm bg-gradient-to-br from-emerald-50 to-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-800">Total Prestasi</p>
              <h2 className="text-3xl font-bold text-gray-900">{verified.length}</h2>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8 mt-4">
        {/* Verified Achievements Timeline */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" /> Prestasi Terverifikasi
          </h2>
          
          {verified.length === 0 ? (
            <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              Belum ada data prestasi resmi yang tercatat.
            </div>
          ) : (
            <div className="relative border-l-2 border-emerald-100 ml-3 md:ml-4 space-y-6">
              {verified.map((ach) => (
                <div key={ach.id} className="relative pl-6 md:pl-8">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm" />
                  
                  <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                        <div>
                          <CardTitle className="text-lg text-gray-900">{ach.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <span className="text-emerald-700 font-medium">{ach.category}</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-600">{ach.level}</span>
                          </CardDescription>
                        </div>
                        <div className="inline-flex items-center px-3 py-1 bg-amber-50 text-amber-700 font-bold text-sm rounded-full border border-amber-200 self-start">
                          <Medal className="w-4 h-4 mr-1.5" />
                          {ach.rank || 'Peserta'}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {ach.competition && (
                        <div className="mb-3 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700 border border-gray-100">
                          <span className="font-medium">Lomba:</span> {ach.competition.name}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {new Date(ach.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                      {ach.description && (
                        <p className="text-gray-600 mt-3 text-sm">{ach.description}</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Pending Achievements Timeline */}
        {pending.length > 0 && (
          <section className="pt-6 border-t border-gray-100">
            <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" /> Menunggu Verifikasi Sekolah
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pending.map(ach => (
                <div key={ach.id} className="bg-white p-4 rounded-xl border border-dashed border-gray-300 opacity-70">
                  <h3 className="font-semibold text-gray-800">{ach.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      {ach.rank || 'Menunggu Check'}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {new Date(ach.date).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
