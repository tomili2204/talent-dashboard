import { getCompetitionById } from '@/actions/competitions';
import { getInterestedStudents } from '@/actions/interests';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Calendar, MapPin, Building, ArrowLeft, Users, Target } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function CompetitionDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  
  const competition = await getCompetitionById(id);
  const supabase = await createClient();

  // Fetch achievements associated with this competition
  const { data: achievements } = await supabase
    .from('achievements')
    .select('*, student:students(full_name, class:classes(name))')
    .eq('competition_id', id)
    .order('created_at', { ascending: false });

  // Fetch interested students from the new competition_interests table
  const interestedStudents = await getInterestedStudents(id);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/competitions">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{competition.name}</h1>
          <p className="text-gray-500 mt-1">Detail event dan daftar peserta yang berprestasi</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-gray-100 shadow-sm md:col-span-1 h-fit">
          <CardHeader className="pb-3 border-b border-gray-50 bg-gray-50/50 rounded-t-xl">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" /> Informasi Lomba
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Penyelenggara</p>
              <div className="flex items-center gap-2 font-medium text-gray-900">
                <Building className="w-4 h-4 text-blue-500" /> {competition.organizer}
              </div>
            </div>
            <div className="pt-3 border-t border-gray-50">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Tingkat & Kategori</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700">{competition.level}</span>
                <span className="px-2.5 py-1 rounded text-xs font-medium bg-emerald-50 text-emerald-700">{competition.category}</span>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-50">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Tahun & Waktu Pelaksanaan</p>
              <div className="flex items-center gap-2 font-medium text-gray-900 mt-1">
                <Calendar className="w-4 h-4 text-orange-500" /> Tahun {competition.year}
              </div>
              {(competition.start_date || competition.end_date) && (
                <p className="text-sm text-gray-600 mt-1 ml-6">
                  {competition.start_date ? new Date(competition.start_date).toLocaleDateString('id-ID') : '?'} 
                  {' - '}
                  {competition.end_date ? new Date(competition.end_date).toLocaleDateString('id-ID') : '?'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-sm md:col-span-2">
          <CardHeader className="pb-3 border-b border-gray-50 flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" /> Daftar Peserta / Prestasi
            </CardTitle>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              {achievements?.length || 0} Siswa
            </span>
          </CardHeader>
          <CardContent className="p-0">
            {achievements && achievements.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {achievements.map((ach) => (
                  <div key={ach.id} className="p-4 sm:p-6 hover:bg-gray-50/50 transition-colors flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{ach.student?.full_name}</h4>
                      <p className="text-sm text-gray-500 mt-0.5">Kelas {ach.student?.class?.name}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        {ach.rank || 'Peserta'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">Belum ada siswa yang tercatat mengikuti lomba ini.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-100 shadow-sm mt-2">
        <CardHeader className="pb-3 border-b border-gray-50 flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" /> Daftar Siswa Berminat (Pilihan Orang Tua)
          </CardTitle>
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
            {interestedStudents?.length || 0} Berminat
          </span>
        </CardHeader>
        <CardContent className="p-0">
          {interestedStudents && interestedStudents.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {interestedStudents.map((interest: any) => (
                <div key={interest.id} className="p-4 sm:p-6 hover:bg-gray-50/50 transition-colors flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{interest.students?.full_name}</h4>
                    <p className="text-sm text-gray-500 mt-0.5">NISN: {interest.students?.nisn}</p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {interest.status}
                    </span>
                    <Link href={`/dashboard/talents/assessments/${interest.student_id}`}>
                      <Button variant="outline" size="sm" className="text-xs">Cek Profil & Inkubasi</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">Belum ada orang tua yang mendaftarkan minat anaknya pada lomba ini.</p>
              <p className="text-xs text-gray-400 mt-1">Data akan muncul otomatis jika ada orang tua yang menekan tombol Minat di portal mereka.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
