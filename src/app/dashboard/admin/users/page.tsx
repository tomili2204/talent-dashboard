'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
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
import { PaginationControls } from '@/components/ui/pagination-controls';
import { Users } from 'lucide-react';

type UserRole = {
  id: string;
  email: string;
  role: string;
  created_at: string;
  requested_role?: string;
  student_name?: string;
  mapped_student_name?: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const supabase = createClient();

  const ROLES = ['Admin', 'Kepala Madrasah', 'Guru', 'Wali Kelas', 'Pembina Prestasi', 'Siswa'];

  useEffect(() => {
    async function fetchUsers() {
      // Panggil RPC function get_all_users
      const { data, error } = await supabase.rpc('get_all_users');

      if (error) {
        console.error('Error fetching users:', error.message);
        setErrorMsg(error.message);
      } else if (data) {
        const usersData = data as UserRole[];
        
        // Fetch parent mappings
        const { data: mappings } = await supabase
          .from('parent_student')
          .select('parent_id, students(full_name, classes(name))');
          
        if (mappings) {
          const mapDict = mappings.reduce((acc: any, map: any) => {
            if (map.students) {
              const className = map.students.classes?.name ? ` - Kelas ${map.students.classes.name}` : '';
              acc[map.parent_id] = map.students.full_name + className;
            }
            return acc;
          }, {});
          
          usersData.forEach(u => {
            if (mapDict[u.id]) {
              u.mapped_student_name = mapDict[u.id];
            }
          });
        }

        setUsers(usersData);
      }
      setLoading(false);
    }
    fetchUsers();
  }, [supabase]);

  async function handleRoleChange(userId: string, newRole: string) {
    const { error } = await supabase
      .from('user_roles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      alert('Gagal mengubah role: ' + error.message);
    } else {
      // If approved as Orang Tua, map the student automatically
      if (newRole === 'Orang Tua') {
        const { data: pending } = await supabase
          .from('pending_registrations')
          .select('student_id')
          .eq('id', userId)
          .single();

        if (pending && pending.student_id) {
          await supabase
            .from('parent_student')
            .upsert({ parent_id: userId, student_id: pending.student_id }, { onConflict: 'parent_id, student_id' });
        }
      }

      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, role: newRole } : user))
      );
      
      // Refresh list to update mapped_student_name
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }
  }

  const filteredUsers = users.filter((user) => {
    // 1. Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        (user.email || '').toLowerCase().includes(query) ||
        (user.mapped_student_name || '').toLowerCase().includes(query) ||
        (user.student_name || '').toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // 2. Filter Status
    if (filterStatus === 'pending') {
      if (!user.requested_role) return false;
    }
    if (filterStatus === 'unlinked') {
      if (!(user.role === 'Orang Tua' && !user.mapped_student_name)) return false;
    }

    // 3. Filter Role
    if (filterRole !== 'all') {
      if (user.role !== filterRole) return false;
    }

    return true;
  });

  const total = filteredUsers.length;
  const paginatedUsers = filteredUsers.slice((page - 1) * limit, page * limit);

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Manajemen Role Pengguna</CardTitle>
        </CardHeader>
        <CardContent>
          {errorMsg && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
              <p className="font-bold">Error mengambil data:</p>
              <p className="text-sm font-mono">{errorMsg}</p>
            </div>
          )}
          {loading ? (
            <p className="text-gray-500">Memuat data pengguna...</p>
          ) : (
            <>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Input
                placeholder="Cari email atau nama siswa..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="max-w-xs"
              />
              <Select value={filterRole} onValueChange={(val) => { setFilterRole(val || 'all'); setPage(1); }}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Semua Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Role</SelectItem>
                  {ROLES.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                  <SelectItem value="Orang Tua">Orang Tua</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={(val) => { setFilterStatus(val || 'all'); setPage(1); }}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="pending">Perlu Verifikasi</SelectItem>
                  <SelectItem value="unlinked">Belum Terhubung</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email Pengguna</TableHead>
                  <TableHead>Role Saat Ini</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-sm">
                      {user.email || user.id}
                      {user.requested_role && (
                        <div className="mt-2 text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded inline-block border border-orange-100">
                          Mendaftar sebagai: <b>{user.requested_role}</b>
                          {user.student_name && ` (Calon Wali dari: ${user.student_name})`}
                        </div>
                      )}
                      {user.role === 'Orang Tua' && user.mapped_student_name && (
                        <div className="mt-2 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded inline-block border border-blue-100 font-medium">
                          <Users className="w-3 h-3 inline mr-1 mb-0.5" />
                          Terhubung ke anak: <b>{user.mapped_student_name}</b>
                        </div>
                      )}
                      {user.role === 'Orang Tua' && !user.mapped_student_name && (
                        <div className="mt-2 text-xs bg-red-50 text-red-600 px-2 py-1 rounded inline-block border border-red-100 font-medium">
                          Belum terhubung ke anak
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md font-semibold">
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Select
                          value={user.role}
                          onValueChange={(val) => {
                            if (val) handleRoleChange(user.id, val);
                          }}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Pilih Role" />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLES.map((role) => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))}
                            <SelectItem value="Orang Tua">Orang Tua</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={async () => {
                            if (confirm('Apakah Anda yakin ingin menghapus pengguna ini secara permanen? Semua data terkait juga akan terhapus.')) {
                              const { error } = await supabase.rpc('delete_user', { user_id: user.id });
                              if (error) {
                                alert('Gagal menghapus pengguna: ' + error.message);
                              } else {
                                setUsers((prev) => prev.filter((u) => u.id !== user.id));
                              }
                            }
                          }}
                        >
                          Hapus
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      Belum ada data pengguna.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            {!loading && users.length > 0 && (
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
