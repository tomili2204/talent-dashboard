import { StudentForm } from '@/components/students/student-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getStudentById } from '@/actions/students';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { 
  User, 
  MapPin, 
  Calendar, 
  Phone, 
  School, 
  ArrowLeft,
  GraduationCap,
  Award,
  Activity,
  Edit
} from 'lucide-react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

export default async function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const { data: student, error } = await getStudentById(id);

  if (error || !student) {
    notFound();
  }

  // Check role
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let role = 'Orang Tua'; // fallback
  if (user) {
    const { data: roleData } = await supabase.from('user_roles').select('role').eq('id', user.id).single();
    if (roleData) {
      role = roleData.role;
    }
  }

  const isAdmin = role === 'Admin' || role === 'Tim Manajemen Talenta';

  // Format date safely
  const formattedDate = student.date_of_birth 
    ? format(new Date(student.date_of_birth), 'dd MMMM yyyy', { locale: localeId })
    : '-';

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full pb-10">
      {/* Header section with gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#125B34] to-[#1A7C48] p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-10 -translate-y-10">
          <GraduationCap className="w-64 h-64" />
        </div>
        
        <div className="relative z-10">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors font-medium text-sm">
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dashboard
          </Link>
          
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-inner">
              <User className="w-12 h-12 text-white" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{student.full_name}</h1>
                <span className={`px-3 py-1 border rounded-full text-xs font-bold uppercase tracking-wider ${
                  student.status === 'Aktif' ? 'bg-green-400/20 border-green-400/50 text-green-100' :
                  student.status === 'Lulus' ? 'bg-blue-400/20 border-blue-400/50 text-blue-100' :
                  'bg-red-400/20 border-red-400/50 text-red-100'
                }`}>
                  {student.status}
                </span>
              </div>
              <p className="text-emerald-50 text-lg flex items-center gap-2 font-medium">
                <School className="w-5 h-5 opacity-80" /> 
                {student.classes?.name || 'Belum ada kelas'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Personal Info */}
        <Card className="md:col-span-1 shadow-sm border-gray-100 overflow-hidden h-fit">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
              <User className="w-5 h-5 text-[#125B34]" />
              Informasi Pribadi
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              <div className="p-4 px-6 hover:bg-gray-50/50 transition-colors">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">NIS / NISN</p>
                <p className="text-gray-900 font-medium">{student.nis || '-'} / {student.nisn || '-'}</p>
              </div>
              <div className="p-4 px-6 hover:bg-gray-50/50 transition-colors">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Jenis Kelamin</p>
                <p className="text-gray-900 font-medium">{student.gender || '-'}</p>
              </div>
              <div className="p-4 px-6 hover:bg-gray-50/50 transition-colors flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tanggal Lahir</p>
                  <p className="text-gray-900 font-medium">{formattedDate}</p>
                </div>
              </div>
              <div className="p-4 px-6 hover:bg-gray-50/50 transition-colors flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Alamat</p>
                  <p className="text-gray-900 font-medium">{student.address || '-'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Parent Info & Quick Actions */}
        <div className="md:col-span-2 flex flex-col gap-6">
          
          <Card className="shadow-sm border-gray-100">
            <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                <UsersIcon className="w-5 h-5 text-[#125B34]" />
                Informasi Orang Tua / Wali
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nama Orang Tua</p>
                  <p className="text-gray-900 font-semibold text-lg">{student.parent_name || '-'}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#125B34]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nomor Telepon</p>
                    <p className="text-gray-900 font-semibold">{student.parent_phone || '-'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links / Dashboard Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href={`/dashboard/talents/assessments/${student.id}`} className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-b from-white to-emerald-50/50 p-6 shadow-sm transition-all hover:shadow-md hover:border-emerald-200">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Activity className="w-24 h-24 text-[#125B34]" />
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 text-[#125B34] group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Talenta Anak</h3>
              <p className="text-sm text-gray-500">Lihat hasil asesmen dan pemetaan bakat anak.</p>
            </Link>

            <Link href={`/dashboard/achievements/records?studentId=${student.id}`} className="group relative overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-b from-white to-orange-50/50 p-6 shadow-sm transition-all hover:shadow-md hover:border-orange-200">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Award className="w-24 h-24 text-orange-600" />
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 text-orange-600 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Prestasi Anak</h3>
              <p className="text-sm text-gray-500">Pantau rekam jejak prestasi dan pencapaian.</p>
            </Link>
          </div>

          {/* Edit Form for Admins */}
          {isAdmin && (
            <Card className="shadow-sm border-gray-100 mt-4 border-l-4 border-l-[#125B34]">
              <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <Edit className="w-5 h-5 text-gray-500" />
                  Edit Data Administratif
                </CardTitle>
                <CardDescription>Ubah informasi siswa atau perbarui status pendaftaran (Hanya terlihat oleh Admin).</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <StudentForm initialData={student} />
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}

// Extracting a quick UsersIcon for right column
function UsersIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
