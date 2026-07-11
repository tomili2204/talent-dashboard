'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Target } from 'lucide-react';
import { JoinIncubationButton } from './join-button';

type Program = {
  id: string;
  name: string;
  description: string;
  target_domain: string;
};

export function AvailableProgramsList({ programs, studentId }: { programs: Program[], studentId: string }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const filteredPrograms = programs.filter(prog => {
    if (selectedCategory !== 'Semua' && prog.target_domain !== selectedCategory) return false;
    return true;
  });

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 border-b pb-4 gap-4">
        <h2 className="text-xl font-bold text-gray-900">Eksplorasi Program Tersedia</h2>
        
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="text-sm border-gray-200 rounded-lg shadow-sm bg-white focus:ring-[#125B34] focus:border-[#125B34] py-2 px-3 outline-none border"
        >
          <option value="Semua">Semua Kategori</option>
          <option value="Akademik">Akademik</option>
          <option value="Olahraga">Olahraga</option>
          <option value="Seni">Seni</option>
          <option value="Teknologi">Teknologi</option>
          <option value="Keagamaan">Keagamaan</option>
          <option value="Bahasa">Bahasa</option>
          <option value="Kepemimpinan">Kepemimpinan</option>
        </select>
      </div>
      
      {filteredPrograms.length === 0 ? (
        <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          {programs.length === 0 
            ? 'Tidak ada program inkubasi baru yang tersedia saat ini.' 
            : 'Tidak ada program yang sesuai dengan filter Anda.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPrograms.map((prog) => (
            <Card key={prog.id} className="border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-gray-900">{prog.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Target className="w-4 h-4 text-[#125B34]" />
                  <span className="text-[#125B34] font-medium">{prog.target_domain}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {prog.description || 'Tidak ada deskripsi rinci untuk program ini.'}
                </p>
                
                <div className="mt-auto pt-4 border-t border-gray-50">
                  <JoinIncubationButton studentId={studentId} programId={prog.id} isJoined={false} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
