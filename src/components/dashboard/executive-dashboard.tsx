'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getExecutiveStats } from '@/actions/dashboard';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, ComposedChart
} from 'recharts';
import { DownloadCloud, Users, School, GraduationCap, Target, Trophy, Award, BookOpen, Star } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

// Colors for charts
const COLORS = ['#125B34', '#1e8a4f', '#2fb86e', '#54d48f', '#81e6b0', '#b3f2ce'];

interface ExecutiveDashboardProps {
  initialData: any;
  classes: { id: string, name: string }[];
  userName: string;
  userRole: string;
}

export function ExecutiveDashboard({ initialData, classes, userName, userRole }: ExecutiveDashboardProps) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [yearFilter, setYearFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Generate year options from 2020 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => (currentYear - i).toString());

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const newData = await getExecutiveStats(yearFilter, classFilter);
      setData(newData);
      setLoading(false);
    }
    // Only reload if filters changed from initial 'all'
    if (yearFilter !== 'all' || classFilter !== 'all') {
      loadData();
    } else {
      setData(initialData);
    }
  }, [yearFilter, classFilter, initialData]);

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();
    
    // Top 20 Talents Sheet
    if (data.top20Talents && data.top20Talents.length > 0) {
      const wsTalents = XLSX.utils.json_to_sheet(data.top20Talents.map((t: any) => ({
        'Nama Siswa': t.name,
        'Kelas': t.class,
        'Domain Talenta': t.domain,
        'Skor Akhir': t.score
      })));
      XLSX.utils.book_append_sheet(wb, wsTalents, "Top 20 Talenta");
    }

    // Trend Sheet
    if (data.trendData && data.trendData.length > 0) {
      const wsTrend = XLSX.utils.json_to_sheet(data.trendData.map((t: any) => ({
        'Tahun': t.year,
        'Total Partisipasi': t.total,
        'Juara 1/Gold': t.juara1,
        'Juara 2/Silver': t.juara2,
        'Juara 3/Bronze': t.juara3,
        'Harapan': t.harapan,
        'Hanya Peserta': t.peserta
      })));
      XLSX.utils.book_append_sheet(wb, wsTrend, "Tren Prestasi");
    }

    XLSX.writeFile(wb, `Executive_Dashboard_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleExportPDF = async () => {
    // We use jsPDF to create a document, and add tables.
    // To add the charts, we might need html2canvas.
    const pdf = new jsPDF('l', 'pt', 'a4');
    pdf.setFontSize(18);
    pdf.text('Executive Dashboard Report', 40, 40);
    pdf.setFontSize(12);
    pdf.text(`Tanggal Export: ${new Date().toLocaleDateString('id-ID')}`, 40, 60);
    
    // Add KPI summary
    pdf.setFontSize(14);
    pdf.text('Ringkasan KPI', 40, 90);
    const kpiData = [
      ['Total Siswa', data.summary.studentsCount.toString()],
      ['Total Guru', data.summary.teachersCount.toString()],
      ['Total Kelas', data.summary.classesCount.toString()],
      ['Program Inkubasi Aktif', data.summary.activeIncubationCount.toString()],
      ['Total Prestasi', data.summary.totalAchievements.toString()],
      ['Talenta Unggul (Skor >= 85)', data.summary.totalSuperiorTalents.toString()]
    ];
    (pdf as any).autoTable({
      startY: 100,
      head: [['Indikator', 'Jumlah']],
      body: kpiData,
      theme: 'grid',
      styles: { fontSize: 10 }
    });

    // Top Talents Table
    const finalY = (pdf as any).lastAutoTable.finalY + 30;
    pdf.text('Top 20 Talenta Unggul', 40, finalY);
    
    const talentsBody = data.top20Talents.map((t: any) => [
      t.name, t.class, t.domain, t.score
    ]);
    
    (pdf as any).autoTable({
      startY: finalY + 10,
      head: [['Nama Siswa', 'Kelas', 'Domain Talenta', 'Skor Akhir']],
      body: talentsBody,
      theme: 'striped',
      styles: { fontSize: 10 }
    });

    pdf.save(`Executive_Dashboard_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="flex flex-col gap-6" ref={dashboardRef}>
      {/* Header & Actions */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Executive Dashboard</h1>
          <p className="text-gray-500 mt-1">Selamat datang kembali, {userName}. Analitik komprehensif talenta dan prestasi sekolah.</p>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center w-full xl:w-auto">
          <Select value={classFilter} onValueChange={(val) => setClassFilter(val || 'all')}>
            <SelectTrigger className="w-[160px] bg-gray-50">
              <span className="truncate">
                {classFilter === 'all' 
                  ? 'Semua Kelas' 
                  : `Kelas ${classes.find(c => c.id === classFilter)?.name || ''}`}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kelas</SelectItem>
              {classes.map(c => (
                <SelectItem key={c.id} value={c.id}>Kelas {c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={yearFilter} onValueChange={(val) => setYearFilter(val || 'all')}>
            <SelectTrigger className="w-[140px] bg-gray-50">
              <span className="truncate">
                {yearFilter === 'all' ? 'Semua Tahun' : yearFilter}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tahun</SelectItem>
              {years.map(y => (
                <SelectItem key={y} value={y}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button onClick={handleExportExcel} variant="outline" className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
              <DownloadCloud className="w-4 h-4" /> Excel
            </Button>
            <Button onClick={handleExportPDF} variant="outline" className="gap-2 border-rose-200 text-rose-700 hover:bg-rose-50">
              <DownloadCloud className="w-4 h-4" /> PDF
            </Button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
          <div className="px-6 py-4 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-[#125B34] border-t-transparent rounded-full animate-spin" />
            <p className="font-medium text-gray-700">Memperbarui data...</p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <Card className="border-gray-100 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total Siswa</p>
                <h3 className="text-2xl font-bold text-gray-900">{data.summary.studentsCount}</h3>
              </div>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users className="w-4 h-4" /></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total Guru</p>
                <h3 className="text-2xl font-bold text-gray-900">{data.summary.teachersCount}</h3>
              </div>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><GraduationCap className="w-4 h-4" /></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total Kelas</p>
                <h3 className="text-2xl font-bold text-gray-900">{data.summary.classesCount}</h3>
              </div>
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><School className="w-4 h-4" /></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total Prestasi</p>
                <h3 className="text-2xl font-bold text-gray-900">{data.summary.totalAchievements}</h3>
              </div>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Trophy className="w-4 h-4" /></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Talenta Unggul</p>
                <h3 className="text-2xl font-bold text-gray-900">{data.summary.totalSuperiorTalents}</h3>
              </div>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Star className="w-4 h-4" /></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-100 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Inkubasi Aktif</p>
                <h3 className="text-2xl font-bold text-gray-900">{data.summary.activeIncubationCount}</h3>
              </div>
              <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Target className="w-4 h-4" /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Trend Prestasi 5 Tahun */}
        <Card className="border-gray-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tren Keikutsertaan & Prestasi (5 Tahun)</CardTitle>
            <CardDescription>Grafik jumlah peserta lomba dan perolehan juara</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data.trendData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar yAxisId="left" dataKey="juara1" name="Juara 1/Gold" stackId="a" fill="#125B34" radius={[0, 0, 0, 0]} />
                <Bar yAxisId="left" dataKey="juara2" name="Juara 2/Silver" stackId="a" fill="#2fb86e" radius={[0, 0, 0, 0]} />
                <Bar yAxisId="left" dataKey="juara3" name="Juara 3/Bronze" stackId="a" fill="#81e6b0" radius={[0, 0, 0, 0]} />
                <Bar yAxisId="left" dataKey="harapan" name="Harapan" stackId="a" fill="#b3f2ce" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="total" name="Total Partisipasi" stroke="#f59e0b" strokeWidth={3} dot={{r: 4}} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribusi Talenta (Keseluruhan) */}
        <Card className="border-gray-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Distribusi Talenta Siswa</CardTitle>
            <CardDescription>Komposisi dominansi talenta per domain</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {data.talentDistribution && data.talentDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.talentDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {data.talentDistribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 italic">
                Belum ada data asesmen talenta siswa.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prestasi Berdasarkan Tingkat */}
        <Card className="border-gray-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Prestasi Berdasarkan Tingkat</CardTitle>
            <CardDescription>Jumlah prestasi mulai dari tingkat Sekolah hingga Internasional</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.achievementsByLevel} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#eee" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 12}} width={90} />
                <RechartsTooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" name="Jumlah" fill="#2fb86e" radius={[0, 4, 4, 0]}>
                  {data.achievementsByLevel.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Talenta Unggul Per Kategori & Prestasi per Kelas */}
        <div className="grid gap-6 grid-cols-1">
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Jumlah Talenta Unggul</CardTitle>
              <CardDescription>Siswa dengan skor talenta akhir {'>='} 85 per domain</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {data.superiorTalentsByCategory.map((t: any, i: number) => (
                  <div key={i} className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <span className="text-2xl font-bold text-[#125B34]">{t.value}</span>
                    <span className="text-xs text-gray-500 font-medium mt-1">{t.name}</span>
                  </div>
                ))}
                {data.superiorTalentsByCategory.length === 0 && (
                  <div className="col-span-3 text-center text-sm text-gray-500 pt-6">Belum ada data talenta unggul.</div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Distribusi Kelas</CardTitle>
              <CardDescription>Jumlah siswa berdasarkan kelas</CardDescription>
            </CardHeader>
            <CardContent className="h-[120px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-3">
                {data.classDistribution.map((c: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-medium">Kelas {c.name}</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium">{c.count} Siswa</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Top 20 Talenta */}
      <Card className="border-gray-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Top 20 Talenta Siswa</CardTitle>
          <CardDescription>Peringkat siswa dengan capaian skor talenta tertinggi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-y border-gray-100">
                <tr>
                  <th className="px-4 py-3 font-medium">Peringkat</th>
                  <th className="px-4 py-3 font-medium">Nama Siswa</th>
                  <th className="px-4 py-3 font-medium">Kelas</th>
                  <th className="px-4 py-3 font-medium">Domain Terbaik</th>
                  <th className="px-4 py-3 font-medium text-right">Skor Akhir</th>
                </tr>
              </thead>
              <tbody>
                {data.top20Talents.map((t: any, idx: number) => (
                  <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold
                        ${idx === 0 ? 'bg-yellow-100 text-yellow-700' : 
                          idx === 1 ? 'bg-gray-200 text-gray-700' : 
                          idx === 2 ? 'bg-orange-100 text-orange-700' : 'text-gray-500'}`}>
                        {idx + 1}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{t.name}</td>
                    <td className="px-4 py-3 text-gray-600">{t.class}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded">
                        {t.domain}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-[#125B34]">{t.score}</td>
                  </tr>
                ))}
                {data.top20Talents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      Belum ada data talenta.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
