'use client';

import { useState, useEffect } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ClassData } from '@/types/class';
import { getClasses, createClass, updateClass, deleteClass, getTeachers } from '@/actions/classes';
import { PaginationControls } from '@/components/ui/pagination-controls';

export default function ClassesPage() {
  const [classes, setClasses] = useState<(ClassData & { teacher_name?: string })[]>([]);
  const [teachers, setTeachers] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [className, setClassName] = useState('');
  const [homeroomTeacherId, setHomeroomTeacherId] = useState<string>('none');
  const [isComboboxOpen, setIsComboboxOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  async function loadClasses(currentPage = page, currentLimit = limit) {
    setLoading(true);
    const res = await getClasses(currentPage, currentLimit);
    if (res.data) setClasses(res.data);
    setTotal(res.count || 0);
    setLoading(false);
  }

  useEffect(() => {
    loadClasses(page, limit);
    getTeachers().then(setTeachers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const openNewDialog = () => {
    setEditingId(null);
    setClassName('');
    setHomeroomTeacherId('none');
    setError(null);
    setIsOpen(true);
  };

  const openEditDialog = (c: ClassData) => {
    setEditingId(c.id);
    setClassName(c.name);
    setHomeroomTeacherId(c.homeroom_teacher_id || 'none');
    setError(null);
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    let res;
    const tId = homeroomTeacherId === 'none' ? undefined : homeroomTeacherId;
    if (editingId) {
      res = await updateClass(editingId, className, tId);
    } else {
      res = await createClass(className, tId);
    }

    if (res.success) {
      setIsOpen(false);
      loadClasses();
    } else {
      setError(res.error);
    }
    setIsPending(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus kelas ${name}? Data siswa di kelas ini bisa terdampak.`)) {
      const res = await deleteClass(id);
      if (res.success) {
        loadClasses();
      } else {
        alert(res.error);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Master Data Kelas</h1>
          <p className="text-gray-500">Kelola daftar rombongan belajar (rombel).</p>
        </div>
        <Button onClick={openNewDialog} className="bg-[#125B34] hover:bg-[#0B3A20] text-white">
          + Tambah Kelas
        </Button>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Kelas' : 'Tambah Kelas Baru'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Nama Kelas</Label>
                <Input
                  id="name"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Contoh: X MIPA 1"
                  required
                />
              </div>
              <div className="space-y-2 flex flex-col">
                <Label htmlFor="homeroom">Wali Kelas</Label>
                <Popover open={isComboboxOpen} onOpenChange={setIsComboboxOpen}>
                  <PopoverTrigger
                    role="combobox"
                    aria-expanded={isComboboxOpen}
                    className={cn(buttonVariants({ variant: 'outline' }), "justify-between w-full font-normal")}
                  >
                    {homeroomTeacherId && homeroomTeacherId !== 'none'
                      ? teachers.find((t) => t.id === homeroomTeacherId)?.name
                      : "Belum Ditentukan"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Cari nama guru..." />
                      <CommandList>
                        <CommandEmpty>Guru tidak ditemukan.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            value="none"
                            onSelect={() => {
                              setHomeroomTeacherId('none');
                              setIsComboboxOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                homeroomTeacherId === 'none' ? "opacity-100" : "opacity-0"
                              )}
                            />
                            Belum Ditentukan
                          </CommandItem>
                          {teachers.map((t) => (
                            <CommandItem
                              key={t.id}
                              value={t.name}
                              onSelect={() => {
                                setHomeroomTeacherId(t.id);
                                setIsComboboxOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  homeroomTeacherId === t.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {t.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" className="bg-[#125B34] hover:bg-[#0B3A20] text-white" disabled={isPending || !className}>
                  {isPending ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm border-gray-100">
        <CardContent className="pt-6">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Memuat data kelas...</div>
          ) : (
            <div className="rounded-md border border-gray-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold text-gray-700 w-16 text-center">No</TableHead>
                    <TableHead className="font-semibold text-gray-700">Nama Kelas</TableHead>
                    <TableHead className="font-semibold text-gray-700">Wali Kelas</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map((c, index) => (
                    <TableRow key={c.id} className="hover:bg-gray-50/50">
                      <TableCell className="text-center font-medium text-gray-600">
                        {(page - 1) * limit + index + 1}
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900">
                        {c.name}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {c.teacher_name || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 border-gray-200 hover:bg-gray-100 text-gray-600"
                            onClick={() => openEditDialog(c)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 border-red-200 hover:bg-red-50 text-red-600"
                            onClick={() => handleDelete(c.id, c.name)}
                          >
                            Hapus
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {classes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-10 text-gray-500">
                        Belum ada data kelas.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              {!loading && classes.length > 0 && (
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
