'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { createClient } from '@/lib/supabase/client';
import { PaginationControls } from '@/components/ui/pagination-controls';
import { ArrowLeft, Target, Trophy } from 'lucide-react';

export default function TalentAssessmentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const supabase = createClient();

  async function fetchStudentsWithTalents(currentPage = page, currentLimit = limit) {
    setLoading(true);
    
    // Get user and role
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    const { data: userRoleData } = await supabase.from('user_roles').select('role').eq('id', user.id).single();
    const role = userRoleData?.role;

    let query = supabase
      .from('students')
      .select('id, nis, full_name, class_id, class:classes(name), talent:talent_scores(final_score, domain)', { count: 'exact' });

    // Filter by role if Orang Tua
    if (role === 'Orang Tua') {
      const { data: parentStudents } = await supabase.from('parent_student').select('student_id').eq('parent_id', user.id);
      
      if (parentStudents && parentStudents.length > 0) {
        if (parentStudents.length === 1) {
          // If only 1 child, redirect directly to the assessment profile!
          router.push(`/dashboard/talents/assessments/${parentStudents[0].student_id}`);
          return;
        }
        
        const studentIds = parentStudents.map(p => p.student_id);
        query = query.in('id', studentIds);
      } else {
        // No children linked yet
        setStudents([]);
        setTotal(0);
        setLoading(false);
        return;
      }
    } else if (role === 'Guru' || role === 'Wali Kelas') {
      // Filter by role if Guru/Wali Kelas (only their classes)
      const { data: guruClasses } = await supabase.from('classes').select('id').eq('homeroom_teacher_id', user.id);
      if (guruClasses && guruClasses.length > 0) {
        const classIds = guruClasses.map(c => c.id);
        query = query.in('class_id', classIds);
      } else {
        // Teacher has no classes assigned
        setStudents([]);
        setTotal(0);
        setLoading(false);
        return;
      }
    }

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,nis.ilike.%${search}%`);
    }

    const from = (currentPage - 1) * currentLimit;
    const to = from + currentLimit - 1;
    query = query.range(from, to).order('full_name', { ascending: true });

    const { data, count, error } = await query;
    
    if (error) {
      console.error("Error fetching students:", error);
      setErrorMsg(error.message);
    } else {
      setErrorMsg(null);
    }
    
    if (data) {
      setStudents(data);
    }
    setTotal(count || 0);
    setLoading(false);
  }

  useEffect(() => {
    fetchStudentsWithTalents(page, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchStudentsWithTalents(1, limit);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Asesmen & Ranking</h1>
          <p className="text-gray-500">Kelola nilai asesmen talenta untuk setiap siswa.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/talents">
            <Button variant="outline" className="border-gray-200 gap-2">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Dasbor
            </Button>
          </Link>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
          <p className="font-bold">Error mengambil data:</p>
          <p className="text-sm font-mono">{errorMsg}</p>
        </div>
      )}

      <Card className="shadow-sm border-gray-100">
        <CardHeader className="pb-3 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full sm:max-w-md">
              <Input
                placeholder="Cari nama siswa atau NIS..."
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
            <div className="text-center py-10 text-gray-500">Memuat data siswa...</div>
          ) : (
            <div className="rounded-md border border-gray-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-700 w-16 text-center">No</TableHead>
                    <TableHead className="font-semibold text-gray-700">Nama Siswa</TableHead>
                    <TableHead className="font-semibold text-gray-700">Kelas</TableHead>
                    <TableHead className="font-semibold text-gray-700">Domain Talenta</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">Talent Score</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student, index) => {
                    // Find the dominant talent (highest final_score)
                    let dominantTalent = null;
                    if (Array.isArray(student.talent) && student.talent.length > 0) {
                      dominantTalent = student.talent.reduce((prev: any, current: any) => {
                        return (prev.final_score > current.final_score) ? prev : current;
                      });
                    }
                    
                    const isAssessed = !!dominantTalent;

                    return (
                      <TableRow key={student.id} className="hover:bg-gray-50/50">
                        <TableCell className="text-center font-medium text-gray-600">
                          {(page - 1) * limit + index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-gray-900">{student.full_name}</div>
                          <div className="text-xs text-gray-500 font-mono">{student.nis}</div>
                        </TableCell>
                        <TableCell className="text-gray-600">{student.class?.name || '-'}</TableCell>
                        <TableCell>
                          {isAssessed ? (
                            <div>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {dominantTalent.domain}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm italic">Belum diasesmen</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {isAssessed ? (
                            <div className="flex items-center justify-center gap-1.5 font-bold text-[#125B34]">
                              <Trophy className="w-4 h-4 text-amber-500" />
                              {Number(dominantTalent.final_score).toFixed(1)}
                            </div>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/dashboard/talents/assessments/${student.id}`}>
                            <Button 
                              variant={isAssessed ? "outline" : "default"}
                              size="sm" 
                              className={isAssessed ? "h-8 border-gray-200" : "h-8 bg-[#125B34] hover:bg-[#0B3A20] text-white"}
                            >
                              {isAssessed ? 'Lihat Profil' : 'Mulai Asesmen'}
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {students.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                        Tidak ada siswa ditemukan.
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
