import { getPrograms } from '@/actions/incubation';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Calendar, Users, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { ProgramDialog } from '@/components/incubation/program-dialog';

export const dynamic = 'force-dynamic';

export default async function ProgramsPage() {
  const { data: programs } = await getPrograms();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Aktif</span>;
      case 'Completed': return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Selesai</span>;
      default: return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">Draft</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Program Inkubasi</h1>
          <p className="text-gray-500 mt-1">Kelola program pembinaan dan talenta siswa</p>
        </div>
        <ProgramDialog mode="add" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {programs && programs.length > 0 ? (
          programs.map((program) => (
            <Link key={program.id} href={`/dashboard/incubation/programs/${program.id}`}>
              <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    {getStatusBadge(program.status)}
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <Target className="w-5 h-5 text-gray-600" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{program.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{program.description || 'Tidak ada deskripsi.'}</p>
                  
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{new Date(program.start_date).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{program._count?.participants || 0} Peserta</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center text-sm font-medium text-[#125B34]">
                    Lihat Detail
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">Belum ada program</h3>
            <p className="text-gray-500 mt-1">Mulai dengan membuat program inkubasi baru.</p>
          </div>
        )}
      </div>
    </div>
  );
}
