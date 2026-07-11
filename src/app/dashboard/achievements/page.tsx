import { getDashboardStats } from '@/actions/achievements';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Star, Target, BarChart, Medal } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ACHIEVEMENT_CATEGORIES, ACHIEVEMENT_LEVELS } from '@/types/achievement';
import { createClient } from '@/lib/supabase/server';

export default async function AchievementsDashboardPage() {
  const stats = await getDashboardStats();
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let role = 'Siswa';
  if (user) {
    const { data: roleData } = await supabase.from('user_roles').select('role').eq('id', user.id).single();
    if (roleData) role = roleData.role;
  }

  const sortedCategories = Object.entries(stats.byCategory).sort((a: any, b: any) => b[1] - a[1]);
  const sortedLevels = Object.entries(stats.byLevel).sort((a: any, b: any) => b[1] - a[1]);
  const sortedClasses = Object.entries(stats.byClass).sort((a: any, b: any) => b[1] - a[1]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dasbor Prestasi</h1>
          <p className="text-gray-500">Ringkasan pencapaian dan prestasi siswa.</p>
        </div>
        {role !== 'Orang Tua' && role !== 'Siswa' && (
          <Link href="/dashboard/achievements/records">
            <Button className="bg-[#125B34] hover:bg-[#0B3A20] text-white gap-2">
              <Medal className="w-4 h-4" />
              Kelola Prestasi
            </Button>
          </Link>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-gray-100 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Prestasi</p>
              <h2 className="text-3xl font-bold text-gray-900">{stats.total}</h2>
            </div>
          </CardContent>
        </Card>
        
        {sortedCategories.slice(0, 3).map((cat: any, idx) => {
          const colors = ['bg-amber-50 text-amber-600', 'bg-emerald-50 text-emerald-600', 'bg-purple-50 text-purple-600'];
          return (
            <Card key={cat[0]} className="border-gray-100 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-3 rounded-lg ${colors[idx] || 'bg-gray-50 text-gray-600'}`}>
                  <BarChart className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{cat[0]}</p>
                  <h2 className="text-3xl font-bold text-gray-900">{cat[1]}</h2>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card className="border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Top 5 Performer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topPerformers.length > 0 ? (
                  stats.topPerformers.map((student: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold text-sm">
                          {index + 1}
                        </div>
                        <p className="font-semibold text-gray-900">{student.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[#125B34]">{student.count} Prestasi</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500">Belum ada data prestasi.</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Statistik Tingkat Prestasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ACHIEVEMENT_LEVELS.map((level, index) => {
                  const count = stats.byLevel[level] || 0;
                  const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{level}</span>
                        <span className="text-gray-500">{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Distribusi per Kategori</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ACHIEVEMENT_CATEGORIES.map((cat, index) => {
                  const count = stats.byCategory[cat] || 0;
                  const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{cat}</span>
                        <span className="text-gray-500">{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-[#125B34] h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Prestasi per Kelas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sortedClasses.length > 0 ? (
                  sortedClasses.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                      <span className="font-medium text-gray-700">{item[0]}</span>
                      <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded font-medium">{item[1]} Prestasi</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">Belum ada data.</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-purple-500" />
                Top 5 Guru Pembimbing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topTeachers && stats.topTeachers.length > 0 ? (
                  stats.topTeachers.map((teacher: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-sm">
                          {index + 1}
                        </div>
                        <p className="font-semibold text-gray-900">{teacher.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[#125B34]">{teacher.count} Bimbingan</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500">Belum ada data pembimbing.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
