import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Target, Calendar, ClipboardList, Lightbulb, User } from 'lucide-react';
import { getStudentById } from '@/actions/students';
import { AvailableProgramsList } from './available-programs';

export default async function StudentIncubationPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  
  const { data: student } = await getStudentById(id);
  const supabase = await createClient();

  // Ambil data program yang diikuti
  const { data: participations } = await supabase
    .from('incubation_participants')
    .select('*, program:incubation_programs(*)')
    .eq('student_id', id);

  const enrolledPrograms = participations || [];
  const activeEnrolled = enrolledPrograms.filter(p => p.status === 'Active');
  const pendingEnrolled = enrolledPrograms.filter(p => p.status === 'Pending');
  
  const avgProgress = activeEnrolled.length > 0 
    ? Math.round(activeEnrolled.reduce((acc, p) => acc + (p.progress_score || 0), 0) / activeEnrolled.length)
    : 0;

  // Ambil semua program aktif
  const { data: allPrograms } = await supabase
    .from('incubation_programs')
    .select('*')
    .eq('status', 'Active')
    .order('created_at', { ascending: false });

  const availablePrograms = allPrograms?.filter(prog => 
    !enrolledPrograms.some(p => p.program_id === prog.id)
  ) || [];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Program Pembinaan & Inkubasi</h1>
        <p className="text-gray-500">
          Pantau perkembangan talenta {student?.full_name || 'Siswa'} dan temukan program baru yang sesuai.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-gray-100 shadow-sm bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">Program Diikuti</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-bold text-gray-900">{activeEnrolled.length}</h2>
                <span className="text-sm text-gray-500">Aktif</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-sm bg-gradient-to-br from-emerald-50 to-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-emerald-800">Rata-rata Progress</p>
              <div className="flex items-center gap-3 mt-1">
                <h2 className="text-3xl font-bold text-gray-900">{avgProgress}%</h2>
                <div className="w-full bg-emerald-200 rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${avgProgress}%` }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 space-y-10">
        
        {/* Section: Program Sedang Diikuti */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Sedang Diikuti & Menunggu</h2>
          
          {enrolledPrograms.length === 0 ? (
            <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              Belum ada program inkubasi yang diikuti. Silakan eksplorasi program di bawah.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrolledPrograms.map((p) => {
                const prog = p.program;
                if (!prog) return null;
                
                const isPending = p.status === 'Pending';

                return (
                  <Card key={p.id} className={`border-gray-100 shadow-sm overflow-hidden ${isPending ? 'opacity-80' : ''}`}>
                    <div className={`h-1.5 w-full ${isPending ? 'bg-amber-400' : 'bg-[#125B34]'}`} />
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-lg text-gray-900 leading-tight">{prog.name}</h3>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                          isPending ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {isPending ? 'Menunggu' : 'Aktif'}
                        </span>
                      </div>
                      
                      {!isPending && (
                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress Pembinaan</span>
                            <span className="font-semibold text-gray-700">{p.progress_score}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-[#125B34] h-2 rounded-full transition-all duration-500" style={{ width: `${p.progress_score || 0}%` }}></div>
                          </div>
                        </div>
                      )}

                      {!isPending && p.evaluation_notes && (
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-2">
                          <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1 border-b border-gray-200 pb-1">
                            <ClipboardList className="w-3 h-3" /> Riwayat Catatan Mentor
                          </p>
                          <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                            {(() => {
                              try {
                                const notes = JSON.parse(p.evaluation_notes);
                                if (!Array.isArray(notes)) throw new Error('Not array');
                                return notes.map((n: any, i: number) => (
                                  <div key={i} className="pl-2 border-l-2 border-[#125B34]">
                                    <p className="text-[10px] font-semibold text-[#125B34] mb-0.5">
                                      {new Date(n.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <p className="text-xs text-gray-700 whitespace-pre-wrap">{n.text}</p>
                                  </div>
                                ));
                              } catch {
                                return (
                                  <div className="pl-2 border-l-2 border-[#125B34]">
                                    <p className="text-xs text-gray-700 whitespace-pre-wrap">{p.evaluation_notes}</p>
                                  </div>
                                );
                              }
                            })()}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Target className="w-3.5 h-3.5" />
                          <span>{prog.target_domain}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(prog.start_date).toLocaleDateString('id-ID')}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        <AvailableProgramsList programs={availablePrograms} studentId={id} />

      </div>
    </div>
  );
}
