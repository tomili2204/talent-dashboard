import { StudentForm } from '@/components/students/student-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function NewStudentPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tambah Data Siswa</h1>
        <p className="text-gray-500">Masukkan informasi lengkap siswa baru ke dalam sistem.</p>
      </div>

      <Card className="shadow-sm border-gray-100">
        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
          <CardTitle>Formulir Pendaftaran Siswa</CardTitle>
          <CardDescription>Pastikan NIS dan NISN unik dan belum pernah didaftarkan.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <StudentForm />
        </CardContent>
      </Card>
    </div>
  );
}
