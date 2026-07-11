import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Star, Target, BarChart } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function TalentDashboardPage() {
  const supabase = await createClient();

  // Get user and role
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data: userRoleData } = await supabase.from('user_roles').select('role').eq('id', user.id).single();
  const role = userRoleData?.role;

  let query = supabase
    .from('talent_scores')
    .select('*, student:students!inner(id, full_name, nis, class_id, class:classes(name))')
    .gt('final_score', 0)
    .order('final_score', { ascending: false });

  // Filter by role if Guru/Wali Kelas (only their classes)
  if (role === 'Guru' || role === 'Wali Kelas') {
    const { data: guruClasses } = await supabase.from('classes').select('id').eq('homeroom_teacher_id', user.id);
    if (guruClasses && guruClasses.length > 0) {
      const classIds = guruClasses.map(c => c.id);
      query = query.in('student.class_id', classIds);
    } else {
      query = query.eq('id', '00000000-0000-0000-0000-000000000000'); // Force empty results
    }
  } else if (role === 'Orang Tua') {
    const { data: parentStudents } = await supabase.from('parent_student').select('student_id').eq('parent_id', user.id);
    if (parentStudents && parentStudents.length > 0) {
      const studentIds = parentStudents.map(p => p.student_id);
      query = query.in('student_id', studentIds);
    } else {
      query = query.eq('id', '00000000-0000-0000-0000-000000000000'); // Force empty results
    }
  }

  const { data: talents } = await query;

  // Group by student to find distinct assessed students
  const uniqueStudentIds = new Set(talents?.map(t => t.student_id));
  const totalAssessed = uniqueStudentIds.size;
  
  // Calculate distribution by domain
  const TALENT_DOMAIN_LABELS: Record<string, string> = {
    'AKD': 'Akademik',
    'BHS': 'Bahasa dan Komunikasi',
    'THF': 'Tahfidz dan Keagamaan',
    'TEK': 'Teknologi Digital',
    'SNI': 'Seni dan Kreativitas',
    'ORG': 'Olahraga',
    'KPM': 'Kepemimpinan'
  };

  const domainDistribution = talents?.reduce((acc: Record<string, number>, curr) => {
    const label = TALENT_DOMAIN_LABELS[curr.domain] || curr.domain;
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {}) || {};

  // Sort domains by count
  const sortedDomains = Object.entries(domainDistribution).sort((a, b) => b[1] - a[1]);

  // Calculate distribution by class (unique students per class)
  const classDistribution: Record<string, Set<string>> = {};
  talents?.forEach(curr => {
    // @ts-ignore
    const className = curr.student?.class?.name || 'Tanpa Kelas';
    if (!classDistribution[className]) classDistribution[className] = new Set();
    classDistribution[className].add(curr.student_id);
  });
  
  const sortedClasses = Object.entries(classDistribution)
    .map(([className, studentSet]) => [className, studentSet.size] as [string, number])
    .sort((a, b) => b[1] - a[1]);

  // Top 5 Talents across all students and domains
  const topTalents = talents?.slice(0, 5) || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dasbor Talenta</h1>
          <p className="text-gray-500">Ringkasan pemetaan potensi dan prestasi siswa.</p>
        </div>
        <Link href="/dashboard/talents/assessments">
          <Button className="bg-[#125B34] hover:bg-[#0B3A20] text-white gap-2">
            <Target className="w-4 h-4" />
            Kelola Asesmen
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-gray-100 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Diasesmen</p>
              <h2 className="text-3xl font-bold text-gray-900">{totalAssessed}</h2>
            </div>
          </CardContent>
        </Card>
        
        {sortedDomains.slice(0, 3).map((domain, idx) => {
          const colors = ['bg-amber-50 text-amber-600', 'bg-emerald-50 text-emerald-600', 'bg-purple-50 text-purple-600'];
          return (
            <Card key={domain[0]} className="border-gray-100 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`p-3 rounded-lg ${colors[idx] || 'bg-gray-50 text-gray-600'}`}>
                  <BarChart className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{domain[0]}</p>
                  <h2 className="text-3xl font-bold text-gray-900">{domain[1]}</h2>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Top 5 Ranking Talenta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topTalents.length > 0 ? (
                topTalents.map((talent, index) => (
                  <div key={talent.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        {/* @ts-ignore */}
                        <p className="font-semibold text-gray-900">{talent.student?.full_name}</p>
                        <p className="text-xs text-gray-500">{TALENT_DOMAIN_LABELS[talent.domain] || talent.domain}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#125B34]">{Number(talent.final_score).toFixed(1)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">Belum ada data asesmen talenta.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Distribusi per Domain</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sortedDomains.length > 0 ? (
                  sortedDomains.map((domain, index) => {
                    const percentage = Math.round((domain[1] / totalAssessed) * 100);
                    return (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700">{domain[0]}</span>
                          <span className="text-gray-500">{domain[1]} siswa ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className="bg-[#125B34] h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4 text-gray-500">Belum ada data.</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Talenta per Kelas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sortedClasses.length > 0 ? (
                  sortedClasses.map((item, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                      <span className="font-medium text-gray-700">{item[0]}</span>
                      <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded font-medium">{item[1]} Siswa Berbakat</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">Belum ada data.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
