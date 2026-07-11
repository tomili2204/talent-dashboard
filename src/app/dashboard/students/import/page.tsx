'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { createStudent } from '@/actions/students';
import { getClasses } from '@/actions/classes';

export default function ImportExcelPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const processExcel = async () => {
    if (!file) return;
    setIsUploading(true);
    setLogs(['Membaca file Excel...']);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet) as any[];

        setLogs((prev) => [...prev, `Ditemukan ${json.length} baris data.`]);

        let successCount = 0;
        let failCount = 0;

        // Fetch classes mapping
        const classesRes = await getClasses();
        const classesList = classesRes.data || [];
        const classMap = new Map<string, string>();
        classesList.forEach(c => {
          // Normalize name for mapping
          classMap.set(c.name.trim().toLowerCase(), c.id);
        });

        for (const row of json) {
          const formData = new FormData();
          formData.append('nis', row['NIS']?.toString() || '');
          formData.append('nisn', row['NISN']?.toString() || '');
          formData.append('full_name', row['Nama Lengkap'] || '');
          
          let genderVal = row['Jenis Kelamin']?.toString().trim().toUpperCase() || 'Laki-laki';
          if (genderVal === 'L' || genderVal === 'LAKI-LAKI' || genderVal === 'LAKI LAKI') genderVal = 'Laki-laki';
          else if (genderVal === 'P' || genderVal === 'PEREMPUAN') genderVal = 'Perempuan';
          else genderVal = 'Laki-laki'; // default fallback
          formData.append('gender', genderVal);

          if (row['Tanggal Lahir']) formData.append('date_of_birth', row['Tanggal Lahir']);
          if (row['Nama Orang Tua']) formData.append('parent_name', row['Nama Orang Tua']);
          if (row['Nomor HP']) formData.append('parent_phone', row['Nomor HP']?.toString());
          if (row['Alamat']) formData.append('address', row['Alamat']);
          formData.append('status', row['Status'] || 'Aktif');

          // Map Kelas string to class_id
          const className = row['Kelas']?.toString().trim().toLowerCase();
          if (className && classMap.has(className)) {
            formData.append('class_id', classMap.get(className)!);
          }

          if (!row['Nama Lengkap']) {
            failCount++;
            continue;
          }

          const res = await createStudent(formData);
          if (res.success) {
            successCount++;
          } else {
            failCount++;
            setLogs((prev) => [...prev, `Gagal impor: ${row['Nama Lengkap']} - ${res.error}`]);
          }
        }

        setLogs((prev) => [...prev, `Selesai! Berhasil: ${successCount}, Gagal: ${failCount}`]);
      } catch (err: any) {
        setLogs((prev) => [...prev, `Terjadi kesalahan saat memproses file: ${err.message}`]);
      }
      setIsUploading(false);
    };

    reader.readAsBinaryString(file);
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      {
        'NIS': '12345',
        'NISN': '0012345678',
        'Nama Lengkap': 'John Doe',
        'Jenis Kelamin': 'Laki-laki',
        'Tanggal Lahir': '2005-08-17',
        'Kelas': '1A',
        'Nama Orang Tua': 'Budi Santoso',
        'Nomor HP': '081234567890',
        'Alamat': 'Jl. Merdeka No. 10',
        'Status': 'Aktif'
      }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'TemplateSiswa');
    XLSX.writeFile(wb, 'Template_Impor_Siswa.xlsx');
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Impor Data Siswa</h1>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Unggah File Excel</CardTitle>
              <CardDescription>
                Format kolom yang didukung: NIS, NISN, Nama Lengkap, Jenis Kelamin, Tanggal Lahir, Kelas, Nama Orang Tua, Nomor HP, Alamat, Status.
              </CardDescription>
            </div>
            <Button variant="outline" onClick={downloadTemplate} className="shrink-0">
              Download Template
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
          
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => router.push('/dashboard/students')} disabled={isUploading}>
              Kembali
            </Button>
            <Button onClick={processExcel} disabled={!file || isUploading} className="bg-[#125B34] hover:bg-[#0B3A20] text-white">
              {isUploading ? 'Memproses...' : 'Mulai Impor'}
            </Button>
          </div>

          {logs.length > 0 && (
            <div className="mt-4 p-4 bg-gray-900 text-green-400 font-mono text-sm rounded-lg max-h-64 overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
