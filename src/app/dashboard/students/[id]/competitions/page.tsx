'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getCompetitions } from '@/actions/competitions';
import { expressInterestInCompetition, removeInterestInCompetition, getStudentInterests } from '@/actions/interests';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Calendar, MapPin, CheckCircle, Clock } from 'lucide-react';
import { Competition } from '@/types/competition';
import { createClient } from '@/lib/supabase/client';

export default function StudentCompetitionsPage() {
  const params = useParams();
  const studentId = params.id as string;
  
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [interests, setInterests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [parentId, setParentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedLevel, setSelectedLevel] = useState<string>('Semua');

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setParentId(user.id);

        const allComps = await getCompetitions('all', 'all');
        const studentInts = await getStudentInterests(studentId);
        
        // Filter out past competitions
        const today = new Date().toISOString().split('T')[0];
        const activeComps = allComps.filter(c => !c.end_date || c.end_date >= today);
        
        setCompetitions(activeComps);
        setInterests(studentInts);
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan saat memuat data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [studentId]);

  const handleInterest = async (competitionId: string, branchId?: string) => {
    if (!parentId) return;
    const processKey = branchId ? `${competitionId}-${branchId}` : competitionId;
    setProcessing(processKey);
    try {
      await expressInterestInCompetition(studentId, competitionId, parentId, branchId);
      const updated = await getStudentInterests(studentId);
      setInterests(updated);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessing(null);
    }
  };

  const handleRemoveInterest = async (competitionId: string, branchId?: string) => {
    if (!confirm('Apakah Anda yakin ingin membatalkan minat pada lomba ini?')) return;
    
    const processKey = branchId ? `${competitionId}-${branchId}` : competitionId;
    setProcessing(processKey);
    try {
      await removeInterestInCompetition(studentId, competitionId, branchId);
      const updated = await getStudentInterests(studentId);
      setInterests(updated);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Memuat data...</div>;

  if (error) return (
    <div className="p-8 text-center">
      <p className="text-red-500 mb-4">{error}</p>
      <p className="text-gray-500 text-sm">Harap pastikan administrator telah menjalankan script database untuk fitur ini.</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Event / Lomba</h1>
        <p className="text-gray-500">
          Temukan dan nyatakan minat untuk berbagai lomba yang relevan dengan bakat anak Anda.
          Sekolah akan menindaklanjuti minat ini ke program pembinaan (Inkubasi).
        </p>
      </div>

      {interests.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl">
          <h2 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            Lomba yang Diminati
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {interests.map(interest => (
              <div key={interest.id} className="bg-white p-4 rounded-xl shadow-sm border border-emerald-100 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800 line-clamp-1">{interest.competitions?.name}</h3>
                  {interest.branch?.name && (
                    <p className="text-xs font-semibold text-emerald-700 mt-0.5">Cabang: {interest.branch.name}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">{interest.competitions?.organizer}</p>
                  
                  <div className="mt-3 inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                    Status: {interest.status}
                  </div>
                </div>
                {interest.status === 'Berminat' && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-4 text-red-500 hover:text-red-700 hover:bg-red-50 w-full"
                    disabled={processing === (interest.branch_id ? `${interest.competition_id}-${interest.branch_id}` : interest.competition_id)}
                    onClick={() => handleRemoveInterest(interest.competition_id, interest.branch_id)}
                  >
                    {processing === (interest.branch_id ? `${interest.competition_id}-${interest.branch_id}` : interest.competition_id) ? 'Memproses...' : 'Batal Minat'}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 border-b pb-4 gap-4">
        <h2 className="text-xl font-bold text-gray-900">Lomba Tersedia</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
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
          
          <select 
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="text-sm border-gray-200 rounded-lg shadow-sm bg-white focus:ring-[#125B34] focus:border-[#125B34] py-2 px-3 outline-none border"
          >
            <option value="Semua">Semua Tingkat</option>
            <option value="Sekolah">Sekolah</option>
            <option value="Kecamatan">Kecamatan</option>
            <option value="Kabupaten">Kabupaten</option>
            <option value="Provinsi">Provinsi</option>
            <option value="Nasional">Nasional</option>
            <option value="Internasional">Internasional</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {(() => {
          const filteredCompetitions = competitions.filter(comp => {
            if (selectedLevel !== 'Semua' && comp.level !== selectedLevel) return false;
            if (selectedCategory !== 'Semua') {
              const hasMatchingBranch = comp.branches?.some(b => b.category === selectedCategory);
              if (!hasMatchingBranch && comp.category !== selectedCategory) return false;
            }
            return true;
          });

          if (filteredCompetitions.length === 0) {
            return (
              <div className="col-span-full p-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed">
                {competitions.length === 0 ? 'Belum ada lomba yang aktif saat ini.' : 'Tidak ada lomba yang sesuai dengan filter Anda.'}
              </div>
            );
          }

          return filteredCompetitions.map(comp => {
            const hasMultipleBranches = comp.branches && comp.branches.length > 1;

            return (
              <Card key={comp.id} className="flex flex-col border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3 border-b border-gray-50">
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-lg leading-tight text-gray-800">{comp.name}</CardTitle>
                  </div>
                  <CardDescription className="flex items-center gap-1.5 text-orange-600 font-medium mt-1">
                    <Trophy className="w-4 h-4" /> {comp.level}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>
                        {comp.start_date && comp.end_date 
                          ? `${comp.start_date} s/d ${comp.end_date}` 
                          : comp.start_date || comp.end_date || comp.year}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span className="line-clamp-2">{comp.organizer}</span>
                    </div>
                  </div>

                  {/* Branches Section */}
                  {comp.branches && comp.branches.length > 0 && (
                    <div className="space-y-2 pt-3 border-t border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cabang Lomba:</p>
                      <div className="space-y-2">
                        {comp.branches.map(branch => {
                          const branchInterested = interests.some(i => i.competition_id === comp.id && (i.branch_id === branch.id || (!i.branch_id && comp.branches?.length === 1)));
                          const pKey = branch.id ? `${comp.id}-${branch.id}` : comp.id;

                          return (
                            <div key={branch.id || branch.name} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-xs gap-2">
                              <div>
                                <span className="font-semibold text-gray-900">{branch.name}</span>
                                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] rounded bg-emerald-100 text-emerald-800 font-medium">
                                  {branch.category}
                                </span>
                              </div>
                              {branchInterested ? (
                                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 shrink-0">
                                  <CheckCircle className="w-3.5 h-3.5" /> Diminati
                                </span>
                              ) : (
                                <Button
                                  size="sm"
                                  className="h-7 text-xs bg-[#125B34] hover:bg-[#0B3A20] text-white shrink-0 px-2.5"
                                  onClick={() => handleInterest(comp.id, branch.id)}
                                  disabled={processing === pKey}
                                >
                                  {processing === pKey ? '...' : 'Minat'}
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {(!comp.branches || comp.branches.length === 0) && (() => {
                    const hasExpressedInterest = interests.some(i => i.competition_id === comp.id);
                    return hasExpressedInterest ? (
                      <Button variant="outline" className="w-full mt-4 bg-gray-50 text-emerald-600 border-emerald-200 hover:bg-gray-50 cursor-default" disabled>
                        <CheckCircle className="w-4 h-4 mr-2" /> Sudah Diminati
                      </Button>
                    ) : (
                      <Button 
                        className="w-full mt-4 bg-[#125B34] hover:bg-[#0B3A20] text-white" 
                        onClick={() => handleInterest(comp.id)}
                        disabled={processing === comp.id}
                      >
                        {processing === comp.id ? 'Memproses...' : 'Saya Minat Ikut!'}
                      </Button>
                    );
                  })()}
                </CardContent>
              </Card>
            );
          });
        })()}
      </div>
    </div>
  );
}
