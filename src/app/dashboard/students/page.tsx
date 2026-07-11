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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Student } from '@/types/student';
import { ClassData } from '@/types/class';
import { getStudents, deleteStudent } from '@/actions/students';
import { getClasses } from '@/actions/classes';
import { PaginationControls } from '@/components/ui/pagination-controls';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  
  const router = useRouter();

  useEffect(() => {
    async function checkAccess() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('user_roles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'Admin') {
        router.push('/dashboard');
        return;
      }
    }
    checkAccess();
  }, [router]);

  async function fetchStudents(currentPage = page, currentLimit = limit) {
    setLoading(true);
    const res = await getStudents(search, classFilter, currentPage, currentLimit);
    if (res.data) setStudents(res.data);
    setTotal(res.count || 0);
    setLoading(false);
  }

  async function fetchClasses() {
    const res = await getClasses(1, 1000);
    if (res.data) setClasses(res.data);
  }

  // Load classes only once on mount
  useEffect(() => {
    fetchClasses();
  }, []);

  // Load students whenever filters or pagination changes
  useEffect(() => {
    fetchStudents(page, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classFilter, page, limit]);

  // Handle search with a simple submit to avoid too many requests
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchStudents(1, limit);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus data siswa ${name}?`)) {
      const res = await deleteStudent(id);
      if (res.success) {
        setStudents(students.filter((s) => s.id !== id));
      } else {
        alert(res.error);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Data Siswa</h1>
          <p className="text-gray-500">Manajemen direktori siswa LPI Roudlotut Tholibin.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/students/import">
            <Button variant="outline" className="border-[#125B34] text-[#125B34] hover:bg-[#125B34] hover:text-white">
              Impor Excel
            </Button>
          </Link>
          <Link href="/dashboard/students/new">
            <Button className="bg-[#125B34] hover:bg-[#0B3A20] text-white">
              + Tambah Siswa
            </Button>
          </Link>
        </div>
      </div>

      <Card className="shadow-sm border-gray-100">
        <CardHeader className="pb-3 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full sm:max-w-md">
              <Input
                placeholder="Cari nama atau NIS..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-gray-50 border-gray-200"
              />
              <Button type="submit" variant="secondary">Cari</Button>
            </form>
            <div className="w-full sm:w-48">
              <Select 
                value={classFilter === 'all' ? 'Semua Kelas' : (classes.find(c => c.id === classFilter)?.name || 'Semua Kelas')} 
                onValueChange={(val) => {
                  setPage(1); // Reset page on filter change
                  if (val === 'Semua Kelas') setClassFilter('all');
                  else {
                    const selected = classes.find(c => c.name === val);
                    if (selected) setClassFilter(selected.id);
                  }
                }}
              >
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Pilih Kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Semua Kelas">Semua Kelas</SelectItem>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Memuat data siswa...</div>
          ) : (
            <div className="rounded-md border border-gray-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-700">NIS</TableHead>
                    <TableHead className="font-semibold text-gray-700">Nama Lengkap</TableHead>
                    <TableHead className="font-semibold text-gray-700">L/P</TableHead>
                    <TableHead className="font-semibold text-gray-700">Kelas</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id} className="hover:bg-gray-50/50">
                      <TableCell className="font-medium text-gray-600">{student.nis || '-'}</TableCell>
                      <TableCell className="font-semibold text-gray-900">{student.full_name}</TableCell>
                      <TableCell>{student.gender === 'Laki-laki' ? 'L' : 'P'}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {student.classes?.name || '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student.status === 'Aktif' ? 'bg-green-100 text-green-800' :
                          student.status === 'Lulus' ? 'bg-purple-100 text-purple-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {student.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/dashboard/students/${student.id}`}>
                            <Button variant="outline" size="sm" className="h-8 border-gray-200 hover:bg-gray-100 text-gray-600">
                              Edit
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 border-red-200 hover:bg-red-50 text-red-600"
                            onClick={() => handleDelete(student.id, student.full_name)}
                          >
                            Hapus
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {students.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                        Tidak ada data siswa ditemukan.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              {!loading && students.length > 0 && (
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
