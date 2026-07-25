import { getCompetitions, deleteCompetition } from '@/actions/competitions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Calendar, MapPin, Building, Search, Trash2, Clock, CheckCircle2, Timer } from 'lucide-react';
import Link from 'next/link';
import { CompetitionDialog } from '@/components/competitions/competition-dialog';
import { ACHIEVEMENT_LEVELS } from '@/types/achievement';

export const dynamic = 'force-dynamic';

const MONTHS = [
  { value: '1', label: 'Januari' },
  { value: '2', label: 'Februari' },
  { value: '3', label: 'Maret' },
  { value: '4', label: 'April' },
  { value: '5', label: 'Mei' },
  { value: '6', label: 'Juni' },
  { value: '7', label: 'Juli' },
  { value: '8', label: 'Agustus' },
  { value: '9', label: 'September' },
  { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' },
  { value: '12', label: 'Desember' },
];

function getCompetitionStatus(comp: any): 'upcoming' | 'ongoing' | 'finished' | 'unknown' {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Use execution_date as the primary reference for "done"
  if (comp.execution_date) {
    const execDate = new Date(comp.execution_date);
    execDate.setHours(0, 0, 0, 0);
    if (execDate < today) return 'finished';
    if (execDate.toDateString() === today.toDateString()) return 'ongoing';
    return 'upcoming';
  }

  // Fallback: use end_date of registration period
  if (comp.end_date) {
    const endDate = new Date(comp.end_date);
    endDate.setHours(0, 0, 0, 0);
    if (endDate < today) return 'finished';
    if (comp.start_date) {
      const startDate = new Date(comp.start_date);
      startDate.setHours(0, 0, 0, 0);
      if (startDate <= today && today <= endDate) return 'ongoing';
    }
    return 'upcoming';
  }

  return 'unknown';
}

function StatusBadge({ status }: { status: 'upcoming' | 'ongoing' | 'finished' | 'unknown' }) {
  if (status === 'finished') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">
        <CheckCircle2 className="w-3 h-3" /> Selesai
      </span>
    );
  }
  if (status === 'ongoing') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
        <Timer className="w-3 h-3" /> Sedang Berlangsung
      </span>
    );
  }
  if (status === 'upcoming') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <Clock className="w-3 h-3" /> Akan Berlangsung
      </span>
    );
  }
  return null;
}

export default async function CompetitionsPage(props: {
  searchParams: Promise<{ year?: string; level?: string; search?: string; month?: string; status?: string }>;
}) {
  const searchParams = await props.searchParams;
  const yearFilter = searchParams?.year || 'all';
  const levelFilter = searchParams?.level || 'all';
  const monthFilter = searchParams?.month || 'all';
  const statusFilter = searchParams?.status || 'all';
  const search = searchParams?.search || '';

  const competitions = await getCompetitions(yearFilter, levelFilter);

  // Compute status per competition
  const competitionsWithStatus = competitions.map(c => ({
    ...c,
    _status: getCompetitionStatus(c),
  }));

  // Apply filters
  const filteredCompetitions = competitionsWithStatus.filter(c => {
    // Search filter
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.organizer.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    // Month filter – based on execution_date or start_date
    if (monthFilter !== 'all') {
      const refDate = c.execution_date || c.start_date || c.end_date;
      if (!refDate) return false;
      const month = new Date(refDate).getMonth() + 1;
      if (month !== parseInt(monthFilter)) return false;
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'upcoming' && c._status !== 'upcoming') return false;
      if (statusFilter === 'ongoing' && c._status !== 'ongoing') return false;
      if (statusFilter === 'finished' && c._status !== 'finished') return false;
    }

    return true;
  });

  const availableYears = Array.from(new Set(competitions.map(c => c.year))).sort(
    (a, b) => parseInt(b) - parseInt(a)
  );

  // Summary counts
  const countUpcoming = competitionsWithStatus.filter(c => c._status === 'upcoming').length;
  const countOngoing = competitionsWithStatus.filter(c => c._status === 'ongoing').length;
  const countFinished = competitionsWithStatus.filter(c => c._status === 'finished').length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Event / Lomba</h1>
          <p className="text-gray-500">Kelola daftar event atau lomba yang diikuti siswa.</p>
        </div>
        <CompetitionDialog />
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100">
          <Clock className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-semibold text-emerald-800">{countUpcoming} Akan Berlangsung</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-100">
          <Timer className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-semibold text-amber-800">{countOngoing} Sedang Berlangsung</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 border border-gray-200">
          <CheckCircle2 className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-600">{countFinished} Selesai</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 border border-blue-100">
          <Trophy className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-blue-800">{competitions.length} Total Event</span>
        </div>
      </div>

      <Card className="border-gray-100 shadow-sm">
        <CardHeader className="pb-4 border-b border-gray-50">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <CardTitle className="text-lg">Daftar Event</CardTitle>
              <form className="flex flex-wrap gap-2 w-full sm:w-auto items-center" method="GET">
                {/* Search */}
                <div className="relative w-full sm:w-[230px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    name="search"
                    defaultValue={search}
                    placeholder="Cari nama / penyelenggara..."
                    className="pl-9 bg-gray-50 border-transparent focus:border-green-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Status */}
                <Select key={`status-${statusFilter}`} name="status" defaultValue={statusFilter}>
                  <SelectTrigger className="w-full sm:w-[185px] bg-gray-50 border-transparent focus:border-green-500 focus:bg-white">
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="upcoming">🟢 Akan Berlangsung</SelectItem>
                    <SelectItem value="ongoing">🟡 Sedang Berlangsung</SelectItem>
                    <SelectItem value="finished">⚪ Selesai</SelectItem>
                  </SelectContent>
                </Select>

                {/* Month */}
                <Select key={`month-${monthFilter}`} name="month" defaultValue={monthFilter}>
                  <SelectTrigger className="w-full sm:w-[140px] bg-gray-50 border-transparent focus:border-green-500 focus:bg-white">
                    <SelectValue placeholder="Semua Bulan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Bulan</SelectItem>
                    {MONTHS.map(m => (
                      <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Year */}
                <Select key={`year-${yearFilter}`} name="year" defaultValue={yearFilter}>
                  <SelectTrigger className="w-full sm:w-[120px] bg-gray-50 border-transparent focus:border-green-500 focus:bg-white">
                    <SelectValue placeholder="Semua Tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tahun</SelectItem>
                    {availableYears.map(y => (
                      <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Level */}
                <Select key={`level-${levelFilter}`} name="level" defaultValue={levelFilter}>
                  <SelectTrigger className="w-full sm:w-[135px] bg-gray-50 border-transparent focus:border-green-500 focus:bg-white">
                    <SelectValue placeholder="Semua Jenjang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Jenjang</SelectItem>
                    {ACHIEVEMENT_LEVELS.map(l => (
                      <SelectItem key={l} value={l}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button type="submit" variant="secondary" className="bg-gray-100 hover:bg-gray-200">
                  Filter
                </Button>
              </form>
            </div>
            {/* Active filter chips */}
            {(statusFilter !== 'all' || monthFilter !== 'all' || yearFilter !== 'all' || levelFilter !== 'all' || search) && (
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="text-gray-500">Filter aktif:</span>
                {search && <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100">"{search}"</span>}
                {statusFilter !== 'all' && <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100">Status: {statusFilter === 'upcoming' ? 'Akan Berlangsung' : statusFilter === 'ongoing' ? 'Sedang Berlangsung' : 'Selesai'}</span>}
                {monthFilter !== 'all' && <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100">Bulan: {MONTHS.find(m => m.value === monthFilter)?.label}</span>}
                {yearFilter !== 'all' && <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100">Tahun: {yearFilter}</span>}
                {levelFilter !== 'all' && <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100">Jenjang: {levelFilter}</span>}
                <Link href="/dashboard/competitions" className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full border border-rose-100 hover:bg-rose-100 transition-colors">✕ Reset</Link>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredCompetitions.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {filteredCompetitions.map(comp => (
                <div key={comp.id} className={`p-6 hover:bg-gray-50/50 transition-colors flex flex-col md:flex-row justify-between gap-6 ${comp._status === 'finished' ? 'opacity-70' : ''}`}>
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      comp._status === 'upcoming' ? 'bg-emerald-50 text-emerald-600' :
                      comp._status === 'ongoing'  ? 'bg-amber-50 text-amber-600' :
                      comp._status === 'finished' ? 'bg-gray-100 text-gray-400' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link href={`/dashboard/competitions/${comp.id}`} className="text-lg font-semibold text-gray-900 hover:text-[#125B34] transition-colors">
                          {comp.name}
                        </Link>
                        <StatusBadge status={comp._status} />
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm text-gray-600">
                        <span className="flex items-center gap-1"><Building className="w-4 h-4 text-gray-400" /> {comp.organizer}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-400" /> {comp.level}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-gray-400" /> Tahun {comp.year}</span>
                      </div>
                      {/* Tanggal Pendaftaran & Pelaksanaan */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-500">
                        {(comp.start_date || comp.end_date) && (
                          <span className="flex items-center gap-1">
                            <span className="font-medium text-blue-600">Pendaftaran:</span>
                            {comp.start_date ? new Date(comp.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '?'}
                            {' – '}
                            {comp.end_date ? new Date(comp.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '?'}
                          </span>
                        )}
                        {comp.execution_date && (
                          <span className="flex items-center gap-1">
                            <span className="font-medium text-orange-600">Pelaksanaan:</span>
                            {new Date(comp.execution_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {comp.branches && comp.branches.length > 0 ? (
                          comp.branches.map((b, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                              {b.name && b.name !== comp.name ? `${b.name} (${b.category})` : b.category}
                            </span>
                          ))
                        ) : comp.category ? (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                            {comp.category}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 shrink-0">
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
              <h3 className="text-lg font-medium text-gray-900">Tidak ada lomba ditemukan</h3>
              <p className="text-gray-500 mt-1 max-w-sm">Tidak ada data yang cocok dengan filter yang dipilih.</p>
              <div className="mt-4 flex gap-3">
                <Link href="/dashboard/competitions">
                  <Button variant="outline" size="sm">Reset Filter</Button>
                </Link>
                <CompetitionDialog />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
