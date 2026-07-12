'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, CheckCircle, Clock, Edit, Trash2, ShieldCheck, DownloadCloud } from 'lucide-react';
import { getAchievements, deleteAchievement } from '@/actions/achievements';
import { Achievement, ACHIEVEMENT_CATEGORIES, ACHIEVEMENT_LEVELS } from '@/types/achievement';
import { AchievementDialog } from '@/components/achievements/achievement-dialog';
import { VerificationDialog } from '@/components/achievements/verification-dialog';

export default function AchievementRecordsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  async function loadData() {
    setLoading(true);
    const { data } = await getAchievements(search, categoryFilter, levelFilter, yearFilter, 1, 50, statusFilter);
    if (data) setAchievements(data);
    setLoading(false);
  }

  useEffect(() => {
    // Debounce search slightly
    const timer = setTimeout(() => {
      loadData();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, categoryFilter, levelFilter, yearFilter, statusFilter]);

  function handleAdd() {
    setSelectedAchievement(null);
    setDialogOpen(true);
  }

  function handleEdit(a: Achievement) {
    setSelectedAchievement(a);
    setDialogOpen(true);
  }

  function handleVerify(a: Achievement) {
    setSelectedAchievement(a);
    setVerifyDialogOpen(true);
  }

  async function handleDelete(id: string) {
    if (confirm('Apakah Anda yakin ingin menghapus data prestasi ini?')) {
      const res = await deleteAchievement(id);
      if (res.success) {
        loadData();
      } else {
        alert(res.error);
      }
    }
  }

  // Generate year options from 2020 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => (currentYear - i).toString());

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Daftar Prestasi</h1>
          <p className="text-gray-500">Kelola dan verifikasi data prestasi siswa.</p>
        </div>
        <Button onClick={handleAdd} className="bg-[#125B34] hover:bg-[#0B3A20] text-white gap-2">
          <Plus className="w-4 h-4" />
          Tambah Prestasi
        </Button>
      </div>

      <Card className="border-gray-100 shadow-sm">
        <CardHeader className="pb-3 border-b border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <CardTitle>Data Prestasi</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Cari prestasi / nama siswa..."
                  className="pl-9 bg-gray-50 border-gray-200 w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={(val) => setCategoryFilter(val || '')}>
                <SelectTrigger className="w-full sm:w-[140px] bg-gray-50">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {ACHIEVEMENT_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={levelFilter} onValueChange={(val) => setLevelFilter(val || '')}>
                <SelectTrigger className="w-full sm:w-[140px] bg-gray-50">
                  <SelectValue placeholder="Tingkat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tingkat</SelectItem>
                  {ACHIEVEMENT_LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={yearFilter} onValueChange={(val) => setYearFilter(val || '')}>
                <SelectTrigger className="w-full sm:w-[120px] bg-gray-50">
                  <SelectValue placeholder="Tahun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tahun</SelectItem>
                  {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || '')}>
                <SelectTrigger className="w-full sm:w-[180px] bg-gray-50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="Menunggu Verifikasi">Menunggu Verifikasi</SelectItem>
                  <SelectItem value="Diverifikasi">Diverifikasi</SelectItem>
                  <SelectItem value="Ditolak">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Memuat data...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead>Siswa</TableHead>
                    <TableHead>Nama Lomba & Prestasi</TableHead>
                    <TableHead>Kategori & Tingkat</TableHead>
                    <TableHead>Pembimbing</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {achievements.length > 0 ? achievements.map((a) => (
                    <TableRow key={a.id} className="hover:bg-gray-50/50">
                      <TableCell>
                        <div className="font-medium text-gray-900">{a.student?.full_name}</div>
                        <div className="text-xs text-gray-500">Kelas {a.student?.class?.name || '-'}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">{a.title}</div>
                        {a.rank && <div className="text-sm text-blue-600 font-medium mt-0.5">{a.rank}</div>}
                        {a.certificate_url && (
                          <a href={a.certificate_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1">
                            <DownloadCloud className="w-3 h-3" /> Sertifikat
                          </a>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 items-start">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">{a.category}</span>
                          <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded font-medium">{a.level}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900">
                          {a.teacher?.full_name || a.external_mentor || '-'}
                        </div>
                        {a.external_mentor && !a.teacher?.full_name && (
                          <div className="text-xs text-gray-500">(Luar)</div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(a.date).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                          ${a.status === 'Diverifikasi' ? 'bg-green-50 text-green-700 border-green-200' : 
                            a.status === 'Ditolak' ? 'bg-red-50 text-red-700 border-red-200' : 
                            'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                          {a.status === 'Diverifikasi' && <CheckCircle className="w-3.5 h-3.5" />}
                          {a.status === 'Menunggu Verifikasi' && <Clock className="w-3.5 h-3.5" />}
                          {a.status === 'Ditolak' && <Trash2 className="w-3.5 h-3.5" />}
                          {a.status}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {a.status === 'Menunggu Verifikasi' && (
                            <Button variant="outline" size="sm" onClick={() => handleVerify(a)} className="text-blue-600 border-blue-200 hover:bg-blue-50">
                              <ShieldCheck className="w-4 h-4 mr-1" /> Verifikasi
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(a)} className="text-gray-500 hover:text-blue-600">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)} className="text-gray-500 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                        Tidak ada data prestasi ditemukan.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AchievementDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        achievement={selectedAchievement}
        onSuccess={loadData}
      />

      <VerificationDialog 
        open={verifyDialogOpen}
        onOpenChange={setVerifyDialogOpen}
        achievement={selectedAchievement}
        onSuccess={loadData}
      />
    </div>
  );
}
