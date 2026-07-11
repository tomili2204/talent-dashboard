import { getIncubationStats } from '@/actions/incubation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Users, TrendingUp, Award } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function IncubationDashboardPage() {
  const stats = await getIncubationStats();
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let role = 'Siswa';
  if (user) {
    const { data: roleData } = await supabase.from('user_roles').select('role').eq('id', user.id).single();
    if (roleData) role = roleData.role;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dasbor Program Inkubasi</h1>
          <p className="text-gray-500 mt-1">Pantau perkembangan program pembinaan talenta khusus</p>
        </div>
        {role !== 'Orang Tua' && role !== 'Siswa' && (
          <Link href="/dashboard/incubation/programs">
            <Button className="bg-[#125B34] hover:bg-[#0e4729]">
              Kelola Program
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Program Aktif</CardTitle>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.activePrograms}</div>
            <p className="text-sm text-gray-500 mt-1">Sedang berjalan</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Peserta</CardTitle>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.totalParticipants}</div>
            <p className="text-sm text-gray-500 mt-1">Siswa dibina</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Rata-rata Progress</CardTitle>
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.avgProgress}%</div>
            <p className="text-sm text-gray-500 mt-1">Capaian pembinaan</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Distribusi Program per Domain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.domainDistribution.length > 0 ? (
                stats.domainDistribution.map((domain, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <Award className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="font-medium text-gray-700">{domain.name}</span>
                    </div>
                    <span className="text-sm font-bold bg-gray-100 px-3 py-1 rounded-full">{domain.count} Program</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">Belum ada data program.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
