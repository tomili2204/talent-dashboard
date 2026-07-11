'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Teacher } from '@/types/teacher';
import { getTeachers, deleteTeacher, bulkCreateTeachers } from '@/actions/teachers';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { Upload, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [isImporting, setIsImporting] = useState(false);

  async function fetchTeachers(currentPage = page, currentLimit = limit) {
    setLoading(true);
    const res = await getTeachers(search, currentPage, currentLimit);
    if (res.data) setTeachers(res.data);
    setTotal(res.count || 0);
    setLoading(false);
  }

  useEffect(() => {
    fetchTeachers(page, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTeachers(1, limit);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus data guru ${name}?`)) {
      const res = await deleteTeacher(id);
      if (res.success) {
        setTeachers(teachers.filter((t) => t.id !== id));
        fetchTeachers(page, limit); // Refresh to fix pagination
      } else {
        alert(res.error);
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet) as any[];

        const mappedTeachers: Partial<Teacher>[] = parsedData.map((row) => ({
          nik: String(row.NIK || row.nik || row.Nik || ''),
          full_name: String(row.Nama || row.nama || row['Nama Lengkap'] || ''),
          position: row.Jabatan || row.jabatan || null,
          phone: row['Nomor HP'] || row.HP || row.phone || null,
          email: row.Email || row.email || null,
        })).filter(t => t.nik && t.full_name); // Pastikan NIK dan Nama terisi

        if (mappedTeachers.length === 0) {
          alert("Data tidak valid atau kosong. Pastikan kolom NIK dan Nama Lengkap ada di Excel.");
          setIsImporting(false);
          return;
        }

        const res = await bulkCreateTeachers(mappedTeachers);
        if (res.success) {
          alert(`Berhasil mengimpor ${mappedTeachers.length} data guru.`);
          fetchTeachers(1, limit);
        } else {
          alert(res.error);
        }
      } catch (err) {
        console.error("Error parsing Excel:", err);
        alert("Gagal membaca file Excel. Pastikan formatnya benar.");
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsBinaryString(file);
    
    // Reset file input
    e.target.value = '';
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        NIK: "1234567890123456",
        "Nama Lengkap": "Ahmad Dahlan, S.Pd",
        Jabatan: "Guru Matematika",
        "Nomor HP": "081234567890",
        Email: "ahmad@sekolah.id"
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    
    // Auto-size columns to be slightly wider
    const colWidths = [
      { wch: 20 }, // NIK
      { wch: 30 }, // Nama Lengkap
      { wch: 20 }, // Jabatan
      { wch: 15 }, // Nomor HP
      { wch: 25 }, // Email
    ];
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template Guru");
    XLSX.writeFile(workbook, "Template_Data_Guru.xlsx");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Data Guru</h1>
          <p className="text-gray-500">Manajemen direktori guru dan tenaga pendidik.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 h-10 px-4 border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Template Excel
          </Button>
          <label className={`flex items-center justify-center gap-2 h-10 px-4 bg-white border border-gray-200 text-gray-700 rounded-md font-medium text-sm transition-colors cursor-pointer ${isImporting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 hover:text-gray-900'}`}>
            <Upload className="w-4 h-4" />
            {isImporting ? 'Mengimpor...' : 'Import Excel'}
            <input 
              type="file" 
              accept=".xlsx, .xls" 
              className="hidden" 
              onChange={handleFileUpload}
              disabled={isImporting}
            />
          </label>
          <Link href="/dashboard/teachers/new">
            <Button className="h-10 px-4 bg-[#125B34] hover:bg-[#0B3A20] text-white">
              + Tambah Guru
            </Button>
          </Link>
        </div>
      </div>

      <Card className="shadow-sm border-gray-100">
        <CardHeader className="pb-3 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full sm:max-w-md">
              <Input
                placeholder="Cari nama atau NIK..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-gray-50 border-gray-200"
              />
              <Button type="submit" variant="secondary">Cari</Button>
            </form>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Memuat data guru...</div>
          ) : (
            <div className="rounded-md border border-gray-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-700">NIK</TableHead>
                    <TableHead className="font-semibold text-gray-700">Nama Lengkap</TableHead>
                    <TableHead className="font-semibold text-gray-700">Jabatan</TableHead>
                    <TableHead className="font-semibold text-gray-700">Nomor HP</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((teacher) => (
                    <TableRow key={teacher.id} className="hover:bg-gray-50/50">
                      <TableCell className="font-medium text-gray-600">{teacher.nik}</TableCell>
                      <TableCell className="font-semibold text-gray-900">{teacher.full_name}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {teacher.position || '-'}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600">{teacher.phone || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/dashboard/teachers/${teacher.id}`}>
                            <Button variant="outline" size="sm" className="h-8 border-gray-200 hover:bg-gray-100 text-gray-600">
                              Edit
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 border-red-200 hover:bg-red-50 text-red-600"
                            onClick={() => handleDelete(teacher.id, teacher.full_name)}
                          >
                            Hapus
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {teachers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                        Tidak ada data guru ditemukan.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              {!loading && teachers.length > 0 && (
                <div className="border-t border-gray-100">
                  <PaginationControls
                    currentPage={page}
                    totalPages={Math.ceil(total / limit)}
                    totalItems={total}
                    limit={limit}
                    onPageChange={setPage}
                    onLimitChange={(newLimit) => {
                      setLimit(newLimit);
                      setPage(1);
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
