import { getCompetitions, deleteCompetition } from '@/actions/competitions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Calendar, MapPin, Building, Search, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { CompetitionDialog } from '@/components/competitions/competition-dialog';
import { ACHIEVEMENT_LEVELS } from '@/types/achievement';

export const dynamic = 'force-dynamic';

export default async function CompetitionsPage(props: { searchParams: Promise<{ year?: string, level?: string, search?: string }> }) {
  const searchParams = await props.searchParams;
  const yearFilter = searchParams?.year || 'all';
  const levelFilter = searchParams?.level || 'all';
  const search = searchParams?.search || '';

  const competitions = await getCompetitions(yearFilter, levelFilter);
  
  const filteredCompetitions = competitions.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.organizer.toLowerCase().includes(search.toLowerCase())
  );

  // Get distinct years from competitions
  const availableYears = Array.from(new Set(competitions.map(c => c.year))).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Event / Lomba</h1>
          <p className="text-gray-500">Kelola daftar event atau lomba yang diikuti siswa.</p>
        </div>
        <CompetitionDialog />
      </div>

      <Card className="border-gray-100 shadow-sm">
        <CardHeader className="pb-3 border-b border-gray-50">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <CardTitle className="text-lg">Daftar Event</CardTitle>
            <form className="flex flex-wrap gap-3 w-full sm:w-auto items-center" method="GET">
              <div className="relative w-full sm:w-[250px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  name="search" 
                  defaultValue={search} 
                  placeholder="Cari nama atau penyelenggara..." 
                  className="pl-9 bg-gray-50 border-transparent focus:border-green-500 focus:bg-white transition-all"
                />
              </div>

              <Select name="level" defaultValue={levelFilter}>
                <SelectTrigger className="w-full sm:w-[150px] bg-gray-50 border-transparent focus:border-green-500 focus:bg-white">
                  <SelectValue placeholder="Semua Jenjang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jenjang</SelectItem>
                  {ACHIEVEMENT_LEVELS.map(l => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select name="year" defaultValue={yearFilter}>
                <SelectTrigger className="w-full sm:w-[130px] bg-gray-50 border-transparent focus:border-green-500 focus:bg-white">
                  <SelectValue placeholder="Semua Tahun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tahun</SelectItem>
                  {availableYears.map(y => (
                    <SelectItem key={y} value={y}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button type="submit" variant="secondary" className="bg-gray-100 hover:bg-gray-200">
                Filter
              </Button>
            </form>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredCompetitions.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {filteredCompetitions.map(comp => (
                <div key={comp.id} className="p-6 hover:bg-gray-50/50 transition-colors flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <Link href={`/dashboard/competitions/${comp.id}`} className="text-lg font-semibold text-gray-900 hover:text-[#125B34] transition-colors">
                        {comp.name}
                      </Link>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1"><Building className="w-4 h-4 text-gray-400" /> {comp.organizer}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-400" /> {comp.level}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-gray-400" /> Tahun {comp.year}</span>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {comp.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CompetitionDialog 
                      competition={comp} 
                      trigger={
                        <Button variant="outline" size="sm" className="h-8 border-gray-200">Edit</Button>
                      }
                    />
                    <form action={async () => {
                      'use server';
                      await deleteCompetition(comp.id);
                    }}>
                      <Button variant="ghost" size="icon" type="submit" className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50" title="Hapus Lomba">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Belum ada lomba</h3>
              <p className="text-gray-500 mt-1 max-w-sm">Data lomba/event belum ditambahkan atau tidak ada yang cocok dengan pencarian.</p>
              <div className="mt-6">
                <CompetitionDialog />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
