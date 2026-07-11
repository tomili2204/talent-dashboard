'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  getTalentIndicators, 
  getParentObservations, 
  getTeacherObservations, 
  saveParentObservations, 
  saveTeacherObservations, 
  getTalentScores,
  getObservationNote,
  saveObservationNote,
  updateSpecializations,
  getTalentRecommendation,
  getTeacherContact,
  getParentContact
} from '@/actions/talents';
import { getAchievementsByStudentId } from '@/actions/achievements';
import { getRecommendedCompetitions, getRecommendedIncubations } from '@/actions/recommendations';
import { TalentDomain, TALENT_DOMAIN_LABELS, TALENT_DOMAINS, TalentIndicator, TalentScore, TalentRecommendation, DOMAIN_TO_CATEGORY } from '@/types/talent';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Save, TrendingUp, Award, ClipboardCheck, GraduationCap, Trophy, UserCircle, AlertCircle, Calendar } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function StudentAssessmentPage() {
  const params = useParams();
  const studentId = params.studentId as string;
  
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'ortu' | 'guru' | 'prestasi' | 'hasil'>('ortu');
  
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isParentOfStudent, setIsParentOfStudent] = useState(false);
  const [isTeacherOfStudent, setIsTeacherOfStudent] = useState(false);

  const [parentIndicators, setParentIndicators] = useState<TalentIndicator[]>([]);
  const [teacherIndicators, setTeacherIndicators] = useState<TalentIndicator[]>([]);

  const [parentScores, setParentScores] = useState<Record<string, number>>({});
  const [teacherScores, setTeacherScores] = useState<Record<string, number>>({});
  
  const [parentLastUpdated, setParentLastUpdated] = useState<string | null>(null);
  const [teacherLastUpdated, setTeacherLastUpdated] = useState<string | null>(null);
  const [parentEditMode, setParentEditMode] = useState<boolean>(true);
  const [teacherEditMode, setTeacherEditMode] = useState<boolean>(true);
  const [finalScores, setFinalScores] = useState<TalentScore[]>([]);

  const [parentNote, setParentNote] = useState('');
  const [teacherNote, setTeacherNote] = useState('');
  
  const [recommendation, setRecommendation] = useState<TalentRecommendation | null>(null);
  const [tempTags, setTempTags] = useState('');
  const [teacherContactInfo, setTeacherContactInfo] = useState<{full_name: string, phone: string} | null>(null);
  const [parentContactInfo, setParentContactInfo] = useState<{full_name: string, phone: string} | null>(null);
  const [achievements, setAchievements] = useState<any[]>([]);

  const [recommendedCompetitions, setRecommendedCompetitions] = useState<any[]>([]);
  const [recommendedIncubations, setRecommendedIncubations] = useState<any[]>([]);

  useEffect(() => {
    async function loadRecommendations() {
      if (finalScores.length === 0) return;
      
      const topScores = finalScores.filter(s => s.final_score > 60).slice(0, 2);
      if (topScores.length === 0) return;
      
      const categories = topScores.map(s => DOMAIN_TO_CATEGORY[s.domain as TalentDomain]).filter(Boolean);
      
      const [comps, incs] = await Promise.all([
        getRecommendedCompetitions(categories),
        getRecommendedIncubations(categories)
      ]);
      
      setRecommendedCompetitions(comps);
      setRecommendedIncubations(incs);
    }
    loadRecommendations();
  }, [finalScores]);

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      
      // 1. Get User Role
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) {
        setCurrentUserId(authData.user.id);
        const { data: roleData } = await supabase.from('user_roles').select('role').eq('id', authData.user.id).single();
        const role = roleData?.role || null;
        setCurrentUserRole(role);

        if (role === 'Orang Tua') {
          const { data: pData } = await supabase.from('parent_student')
            .select('*').eq('parent_id', authData.user.id).eq('student_id', studentId).single();
          if (pData) setIsParentOfStudent(true);
        }

        if (role === 'Guru' || role === 'Wali Kelas') {
          setIsTeacherOfStudent(true);
        }
      }

      // 2. Fetch Student
      const { data: stData } = await supabase.from('students').select('*, class:classes(name, homeroom_teacher_id)').eq('id', studentId).single();
      if (stData) {
        setStudent(stData);
        if (stData.class?.homeroom_teacher_id) {
          const contact = await getTeacherContact(stData.class.homeroom_teacher_id);
          if (contact.data) {
            setTeacherContactInfo(contact.data);
          }
        }
        const pContact = await getParentContact(studentId);
        if (pContact.data) {
          setParentContactInfo(pContact.data);
        }
      }

      // 3. Fetch Indicators
      const pInd = await getTalentIndicators('parent');
      if (pInd.data) setParentIndicators(pInd.data);
      
      const tInd = await getTalentIndicators('teacher');
      if (tInd.data) setTeacherIndicators(tInd.data);

      // 4. Fetch Existing Observations
      const pObs = await getParentObservations(studentId);
      if (pObs.data && pObs.data.length > 0) {
        const pMap: Record<string, number> = {};
        let latestDate = new Date(0);
        pObs.data.forEach(o => {
          pMap[o.indicator_id] = o.score;
          if (o.updated_at) {
             const d = new Date(o.updated_at);
             if (d > latestDate) latestDate = d;
          }
        });
        setParentScores(pMap);
        if (latestDate.getTime() > 0) {
          setParentLastUpdated(latestDate.toISOString());
          setParentEditMode(false);
        }
      }

      const tObs = await getTeacherObservations(studentId);
      if (tObs.data && tObs.data.length > 0) {
        const tMap: Record<string, number> = {};
        let latestDate = new Date(0);
        tObs.data.forEach(o => {
          tMap[o.indicator_id] = o.score;
          if (o.updated_at) {
             const d = new Date(o.updated_at);
             if (d > latestDate) latestDate = d;
          }
        });
        setTeacherScores(tMap);
        if (latestDate.getTime() > 0) {
          setTeacherLastUpdated(latestDate.toISOString());
          setTeacherEditMode(false);
        }
      }

      const scoresRes = await getTalentScores(studentId);
      if (scoresRes.data) setFinalScores(scoresRes.data);

      const pNote = await getObservationNote(studentId, 'Parent');
      if (pNote.data) setParentNote(pNote.data);
      
      const tNote = await getObservationNote(studentId, 'Teacher');
      if (tNote.data) setTeacherNote(tNote.data);

      const recRes = await getTalentRecommendation(studentId);
      if (recRes.data) {
        setRecommendation(recRes.data);
      }

      const achRes = await getAchievementsByStudentId(studentId);
      if (achRes.data) {
        setAchievements(achRes.data);
      }

      setLoading(false);
    }
    loadData();
  }, [studentId]);

  // Handle Parent Input
  const handleParentScoreChange = (indicatorId: string, score: number) => {
    setParentScores(prev => ({ ...prev, [indicatorId]: score }));
  };

  // Handle Teacher Input
  const handleTeacherScoreChange = (indicatorId: string, score: number) => {
    setTeacherScores(prev => ({ ...prev, [indicatorId]: score }));
  };

  async function handleParentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUserId) return;
    setSaving(true);
    const res = await saveParentObservations(studentId, currentUserId, parentScores);
    if (!res.success) {
      setSaving(false);
      alert(`Gagal menyimpan observasi: ${res.error}`);
      return;
    }
    
    if (parentNote.trim()) {
      const noteRes = await saveObservationNote(studentId, currentUserId, 'Parent', parentNote);
      if (!noteRes.success) {
        setSaving(false);
        alert(`Gagal menyimpan catatan: ${noteRes.error}`);
        return;
      }
    }
    
    // Refresh Final Scores since triggers calculated them
    const scoresRes = await getTalentScores(studentId);
    if (scoresRes.data) setFinalScores(scoresRes.data);

    setParentLastUpdated(new Date().toISOString());
    setParentEditMode(false);
    setSaving(false);
    alert('Observasi Orang Tua berhasil disimpan!');
  }

  async function handleTeacherSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUserId) return;
    setSaving(true);
    const res = await saveTeacherObservations(studentId, currentUserId, teacherScores);
    if (!res.success) {
      setSaving(false);
      alert(`Gagal menyimpan observasi: ${res.error}`);
      return;
    }
    
    if (teacherNote.trim()) {
      const noteRes = await saveObservationNote(studentId, currentUserId, 'Teacher', teacherNote);
      if (!noteRes.success) {
        setSaving(false);
        alert(`Gagal menyimpan catatan: ${noteRes.error}`);
        return;
      }
    }
    
    // Refresh Final Scores since triggers calculated them
    const scoresRes = await getTalentScores(studentId);
    if (scoresRes.data) setFinalScores(scoresRes.data);

    setTeacherLastUpdated(new Date().toISOString());
    setTeacherEditMode(false);
    setSaving(false);
    alert('Observasi Guru berhasil disimpan!');
  }

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempTags.trim()) return;
    setSaving(true);
    const newTags = tempTags.split(',').map(t => t.trim()).filter(t => t.length > 0);
    const currentTags = recommendation?.specializations || [];
    const mergedTags = Array.from(new Set([...currentTags, ...newTags]));
    
    await updateSpecializations(studentId, mergedTags);
    
    const recRes = await getTalentRecommendation(studentId);
    if (recRes.data) setRecommendation(recRes.data);
    
    setTempTags('');
    setSaving(false);
  };
  
  const handleRemoveTag = async (tagToRemove: string) => {
    setSaving(true);
    const currentTags = recommendation?.specializations || [];
    const updatedTags = currentTags.filter(t => t !== tagToRemove);
    
    await updateSpecializations(studentId, updatedTags);
    
    const recRes = await getTalentRecommendation(studentId);
    if (recRes.data) setRecommendation(recRes.data);
    setSaving(false);
  };

  const renderScoresSummary = (role: 'Parent' | 'Teacher') => {
    const isParent = role === 'Parent';
    const lastUpdated = isParent ? parentLastUpdated : teacherLastUpdated;
    const setEditMode = isParent ? setParentEditMode : setTeacherEditMode;
    const canEdit = lastUpdated 
      ? Math.floor((Date.now() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60 * 24)) >= 30
      : true;
    const remainingDays = lastUpdated
      ? 30 - Math.floor((Date.now() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    return (
      <div className="space-y-6">
        <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 text-sm">Instrumen Telah Diisi</h4>
            <p className="text-sm text-blue-800 mt-1">
              Terima kasih telah mengisi instrumen observasi. Nilai telah dikalkulasi ke dalam skala 1-100. 
              Untuk menjaga konsistensi dan objektivitas data observasi, perbaikan nilai hanya dapat dilakukan setiap 30 hari sekali.
            </p>
            {!canEdit && (
               <p className="text-sm text-red-600 font-medium mt-2">
                 ⏳ Anda dapat memperbarui observasi ini dalam {remainingDays} hari lagi.
               </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TALENT_DOMAINS.map(domain => {
            const scoreRow = finalScores.find(f => f.domain === domain);
            const val = scoreRow ? (isParent ? scoreRow.parent_score : scoreRow.teacher_score) : 0;
            return (
              <div key={domain} className="bg-white border border-gray-100 p-4 rounded-xl flex items-center justify-between">
                <span className="font-medium text-gray-700">{TALENT_DOMAIN_LABELS[domain]}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-[#125B34]">{Math.round(val)}</span>
                  <span className="text-sm font-medium text-[#125B34]/60">/ 100</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-4">
          <Button 
             variant="outline" 
             onClick={() => setEditMode(true)}
             disabled={!canEdit}
             className="border-gray-300"
          >
            Perbaiki Nilai Observasi
          </Button>
        </div>
      </div>
    );
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Memuat data talenta...</div>;
  if (!student) return <div className="p-8 text-center text-red-500">Siswa tidak ditemukan.</div>;

  const chartData = finalScores.map(score => ({
    subject: TALENT_DOMAIN_LABELS[score.domain],
    A: score.final_score,
    fullMark: 100
  }));

  const dominantScore = finalScores.length > 0 ? finalScores[0] : null;

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      {/* Header Profile */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/talents/assessments">
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-gray-100">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold shadow-sm">
              {student?.full_name?.charAt(0) || '?'}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">{student.full_name}</h1>
              <p className="text-gray-500 font-mono text-sm">{student.nis} • Kelas {student.class?.name || '-'}</p>
              
              {recommendation?.specializations && recommendation.specializations.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {recommendation.specializations.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-md border border-blue-100">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {dominantScore && (
          <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
            <Award className="w-8 h-8 text-emerald-600" />
            <div>
              <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">Talenta Dominan</p>
              <p className="text-sm font-bold text-gray-900">{TALENT_DOMAIN_LABELS[dominantScore.domain]}</p>
            </div>
            <div className="ml-4 text-2xl font-black text-emerald-700 flex items-baseline gap-1">
              {Number(dominantScore.final_score).toFixed(1)}
              <span className="text-sm font-medium text-emerald-600/60">/ 100</span>
            </div>
          </div>
        )}
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('ortu')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'ortu' ? 'bg-[#125B34] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'}`}
          >
            <UserCircle className="w-5 h-5" />
            Observasi Orang Tua
          </button>
          <button 
            onClick={() => setActiveTab('guru')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'guru' ? 'bg-[#125B34] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'}`}
          >
            <GraduationCap className="w-5 h-5" />
            Observasi Guru
          </button>
          <button 
            onClick={() => setActiveTab('prestasi')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'prestasi' ? 'bg-[#125B34] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'}`}
          >
            <Trophy className="w-5 h-5" />
            Data Prestasi
          </button>
          <button 
            onClick={() => setActiveTab('hasil')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'hasil' ? 'bg-[#125B34] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'}`}
          >
            <TrendingUp className="w-5 h-5" />
            Hasil & Rekomendasi
          </button>
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-3">
          
          {/* ORTU TAB */}
          {activeTab === 'ortu' && (
            <Card className="border-gray-100 shadow-sm animate-in fade-in zoom-in-95 duration-300">
              <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <UserCircle className="w-5 h-5 text-[#125B34]" />
                  Kuesioner Observasi Orang Tua
                </CardTitle>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Diisi berdasarkan pengamatan keseharian anak di rumah.</p>
                  <p className="text-sm font-medium text-[#125B34]">✨ Mohon isi kuesioner ini dengan jujur dan apa adanya, agar potensi anak benar-benar tergali secara obyektif.</p>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {currentUserRole === 'Orang Tua' && !isParentOfStudent ? (
                  <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Anda tidak memiliki akses untuk mengisi form siswa ini.
                  </div>
                ) : !parentEditMode ? (
                  renderScoresSummary('Parent')
                ) : currentUserRole !== 'Orang Tua' ? (
                  <div className="p-4 bg-amber-50 text-amber-700 rounded-xl border border-amber-100 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium leading-relaxed">
                      Menunggu isian dari orang tua {parentContactInfo ? <span className="font-bold">({parentContactInfo.full_name} - {parentContactInfo.phone})</span> : ''} jika data observasi talenta belum diisikan.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleParentSubmit} className="space-y-8">
                    {Object.values(TALENT_DOMAIN_LABELS).map((domainName, idx) => {
                      const domainCode = (Object.keys(TALENT_DOMAIN_LABELS) as TalentDomain[]).find(k => TALENT_DOMAIN_LABELS[k] === domainName);
                      const indicators = parentIndicators.filter(i => i.domain === domainCode);
                      if (indicators.length === 0) return null;
                      
                      return (
                        <div key={domainCode} className="space-y-4">
                          <h3 className="font-bold text-lg text-gray-900 border-b border-gray-100 pb-2">{domainName}</h3>
                          <div className="space-y-4">
                            {indicators.map((ind, i) => (
                              <div key={ind.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100 hover:border-green-200 transition-colors">
                                <span className="text-sm text-gray-700 font-medium leading-relaxed max-w-lg">
                                  {i+1}. {ind.indicator_text}
                                </span>
                                <div className="flex items-center gap-2 shrink-0">
                                  {[1,2,3,4,5].map((val) => (
                                    <label key={val} className={`flex flex-col items-center justify-center w-10 h-10 rounded-full cursor-pointer border-2 transition-all ${parentScores[ind.id] === val ? 'bg-[#125B34] border-[#125B34] text-white scale-110 shadow-md' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`} title={`Skala ${val}`}>
                                      <input 
                                        type="radio" 
                                        name={`ortu_${ind.id}`} 
                                        value={val} 
                                        className="hidden"
                                        checked={parentScores[ind.id] === val}
                                        onChange={() => handleParentScoreChange(ind.id, val)}
                                        disabled={currentUserRole !== 'Orang Tua' && currentUserRole !== 'Admin'} // Hanya Ortu & Admin yg bisa edit
                                      />
                                      <span className="text-sm font-bold">{val}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    
                    <div className="space-y-3 pt-4 border-t border-gray-100">
                      <Label htmlFor="parentNote" className="text-gray-900 font-semibold text-base">
                        Catatan Khusus / Spesialisasi Anak (Opsional)
                      </Label>
                      <p className="text-sm text-gray-500">
                        Ceritakan secara singkat jika ada bakat spesifik atau kebiasaan menonjol pada anak di rumah (misal: "Sangat suka bermain catur", "Pandai berenang", dll).
                      </p>
                      <textarea
                        id="parentNote"
                        value={parentNote}
                        onChange={(e) => setParentNote(e.target.value)}
                        disabled={currentUserRole !== 'Orang Tua' && currentUserRole !== 'Admin'}
                        className="w-full rounded-xl border-gray-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 min-h-[100px] p-3 text-sm"
                        placeholder="Tuliskan catatan Anda di sini..."
                      />
                    </div>
                    
                    {(currentUserRole === 'Orang Tua' || currentUserRole === 'Admin') && (
                      <div className="flex justify-end pt-6">
                        <Button type="submit" className="bg-[#125B34] hover:bg-[#0B3A20] text-white" disabled={saving}>
                          {saving ? 'Menyimpan...' : 'Simpan Observasi'}
                        </Button>
                      </div>
                    )}
                  </form>
                )}
              </CardContent>
            </Card>
          )}

          {/* GURU TAB */}
          {activeTab === 'guru' && (
            <Card className="border-gray-100 shadow-sm animate-in fade-in zoom-in-95 duration-300">
              <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#125B34]" />
                  Kuesioner Observasi Guru
                </CardTitle>
                <p className="text-sm text-gray-500">Diisi berdasarkan pengamatan performa anak di sekolah.</p>
              </CardHeader>
              <CardContent className="pt-6">
                {['Orang Tua', 'Siswa'].includes(currentUserRole || '') ? (
                  !teacherLastUpdated ? (
                    <div className="p-4 bg-amber-50 text-amber-700 rounded-xl border border-amber-100 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p className="text-sm font-medium leading-relaxed">
                        Menunggu Isian Observasi Talenta dari Guru/Wali Kelas, silahkan menghubungi wali kelas {teacherContactInfo ? <span className="font-bold">({teacherContactInfo.full_name} - {teacherContactInfo.phone})</span> : ''} jika data observasi talenta tidak segera diisikan.
                      </p>
                    </div>
                  ) : (
                    renderScoresSummary('Teacher')
                  )
                ) : !teacherEditMode ? (
                  renderScoresSummary('Teacher')
                ) : (
                  <form onSubmit={handleTeacherSubmit} className="space-y-8">
                    {Object.values(TALENT_DOMAIN_LABELS).map((domainName, idx) => {
                    const domainCode = (Object.keys(TALENT_DOMAIN_LABELS) as TalentDomain[]).find(k => TALENT_DOMAIN_LABELS[k] === domainName);
                    const indicators = teacherIndicators.filter(i => i.domain === domainCode);
                    if (indicators.length === 0) return null;
                    
                    return (
                      <div key={domainCode} className="space-y-4">
                        <h3 className="font-bold text-lg text-gray-900 border-b border-gray-100 pb-2">{domainName}</h3>
                        <div className="space-y-4">
                          {indicators.map((ind, i) => (
                            <div key={ind.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100 hover:border-green-200 transition-colors">
                              <span className="text-sm text-gray-700 font-medium leading-relaxed max-w-lg">
                                {i+1}. {ind.indicator_text}
                              </span>
                              <div className="flex items-center gap-2 shrink-0">
                                {[1,2,3,4,5].map((val) => (
                                  <label key={val} className={`flex flex-col items-center justify-center w-10 h-10 rounded-full cursor-pointer border-2 transition-all ${teacherScores[ind.id] === val ? 'bg-[#125B34] border-[#125B34] text-white scale-110 shadow-md' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`} title={`Skala ${val}`}>
                                    <input 
                                      type="radio" 
                                      name={`guru_${ind.id}`} 
                                      value={val} 
                                      className="hidden"
                                      checked={teacherScores[ind.id] === val}
                                      onChange={() => handleTeacherScoreChange(ind.id, val)}
                                      disabled={currentUserRole === 'Orang Tua'} // Ortu tidak bisa edit form guru
                                    />
                                    <span className="text-sm font-bold">{val}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  
                  {currentUserRole !== 'Orang Tua' && (
                    <>
                      <div className="space-y-3 pt-4 border-t border-gray-100">
                        <Label htmlFor="teacherNote" className="text-gray-900 font-semibold text-base">
                          Catatan Khusus Guru / Spesialisasi Anak (Opsional)
                        </Label>
                        <p className="text-sm text-gray-500">
                          Ceritakan secara singkat jika ada bakat spesifik atau perilaku menonjol pada anak selama di sekolah.
                        </p>
                        <textarea
                          id="teacherNote"
                          value={teacherNote}
                          onChange={(e) => setTeacherNote(e.target.value)}
                          disabled={currentUserRole === 'Orang Tua'}
                          className="w-full rounded-xl border-gray-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 min-h-[100px] p-3 text-sm"
                          placeholder="Tuliskan catatan Anda di sini..."
                        />
                      </div>
                      <div className="flex justify-end pt-6">
                        <Button type="submit" className="bg-[#125B34] hover:bg-[#0B3A20] text-white" disabled={saving}>
                          {saving ? 'Menyimpan...' : 'Simpan Observasi Guru'}
                        </Button>
                      </div>
                    </>
                  )}
                </form>
                )}
              </CardContent>
            </Card>
          )}

          {/* PRESTASI TAB */}
          {activeTab === 'prestasi' && (
            <Card className="border-gray-100 shadow-sm animate-in fade-in zoom-in-95 duration-300">
              <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#125B34]" />
                  Data Prestasi Siswa
                </CardTitle>
                <p className="text-sm text-gray-500">Histori prestasi yang memengaruhi skor bakat.</p>
              </CardHeader>
              <CardContent className="pt-6">
                {achievements.length > 0 ? (
                  <div className="space-y-4">
                    {achievements.map((ach) => (
                      <div key={ach.id} className="p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-emerald-50 rounded-lg shrink-0">
                              <Trophy className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{ach.title}</h4>
                              <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500">
                                <span className="inline-flex items-center gap-1"><Award className="w-3 h-3" /> {ach.category}</span>
                                <span>•</span>
                                <span>{ach.level}</span>
                                {ach.date && (
                                  <>
                                    <span>•</span>
                                    <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(ach.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                              + {ach.score || 0} Poin Bakat
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-center mt-6">
                      <Link href={`/dashboard/achievements?student=${studentId}`}>
                        <Button variant="outline" className="border-gray-300 text-gray-700">Kelola Prestasi Siswa</Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Modul Prestasi Terintegrasi</p>
                    <p className="text-sm text-gray-400 mt-1">Siswa ini belum memiliki data prestasi terbaru, atau Anda dapat menambahkannya melalui menu Dasbor Prestasi.</p>
                    <Link href={`/dashboard/achievements?student=${studentId}`}>
                      <Button variant="outline" className="mt-4 border-gray-300 text-gray-700">Kelola Prestasi Siswa</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* HASIL & REKOMENDASI TAB */}
          {activeTab === 'hasil' && (
            <Card className="border-gray-100 shadow-sm animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-emerald-900 to-[#125B34] text-white border-none">
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="w-5 h-5" />
                  Peta Potensi & Rekomendasi
                </CardTitle>
                <p className="text-emerald-100/80 text-sm">Hasil kalkulasi otomatis dari seluruh komponen (Ortu, Guru, Prestasi).</p>
              </CardHeader>
              <CardContent className="pt-8">
                
                {finalScores.length === 0 ? (
                  <div className="text-center p-8 text-gray-500">Belum ada skor yang terkalkulasi. Pastikan observasi telah diisi.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Radar Chart */}
                    <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                      <h3 className="text-center font-bold text-gray-700 mb-2">Radar Talenta</h3>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="60%" data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                            <PolarGrid stroke="#e5e7eb" />
                            <PolarAngleAxis 
                              dataKey="subject" 
                              tick={(props: any) => {
                                const { payload, x, y, textAnchor } = props;
                                const text = payload.value;
                                const words = text.split(' dan ');
                                return (
                                  <text x={x} y={y} textAnchor={textAnchor} fill="#4b5563" fontSize={10} fontWeight={600}>
                                    {words.length > 1 ? (
                                      <>
                                        <tspan x={x} dy="-0.5em">{words[0]}</tspan>
                                        <tspan x={x} dy="1.2em">dan {words[1]}</tspan>
                                      </>
                                    ) : (
                                      <tspan x={x} dy="0em">{text}</tspan>
                                    )}
                                  </text>
                                );
                              }} 
                            />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar
                              name="Skor Akhir"
                              dataKey="A"
                              stroke="#125B34"
                              strokeWidth={2}
                              fill="#10b981"
                              fillOpacity={0.4}
                            />
                            <Tooltip 
                              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Breakdown Scores */}
                    <div className="space-y-4">
                      <h3 className="font-bold text-gray-900">Rincian Skor per Domain</h3>
                      <div className="space-y-3">
                        {finalScores.map((score, index) => (
                          <div key={score.domain} className="flex flex-col gap-1.5 p-3 bg-white rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                            {index === 0 && (
                              <div className="absolute top-0 right-0 w-1 bg-[#F39C12] h-full" />
                            )}
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-sm text-gray-800">{TALENT_DOMAIN_LABELS[score.domain]}</span>
                              <div className="flex items-baseline gap-1">
                                <span className="font-bold text-[#125B34] text-lg">{Number(score.final_score).toFixed(1)}</span>
                                <span className="text-xs font-medium text-[#125B34]/60">/ 100</span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                              <div className="bg-[#125B34] h-1.5 rounded-full" style={{ width: `${Math.min(100, score.final_score)}%` }}></div>
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
                              <span>Ortu: {Number(score.parent_score).toFixed(1)}</span>
                              <span>Guru: {Number(score.teacher_score).toFixed(1)}</span>
                              <span>Prestasi: {Number(score.achievement_score).toFixed(1)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Analisis & Rekomendasi */}
                {finalScores.length > 0 && finalScores[0].final_score > 60 && (
                  <div className="mt-8 pt-8 border-t border-gray-100">
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50/30 rounded-2xl p-6 border border-indigo-100 mb-8">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-6 h-6 text-indigo-600" />
                        <h3 className="font-bold text-indigo-900 text-xl">Analisis Potensi & Rekomendasi Tindak Lanjut</h3>
                      </div>
                      <p className="text-sm text-indigo-900/80 leading-relaxed mb-6">
                        Berdasarkan pemetaan potensi, <strong>{student?.full_name}</strong> memiliki bakat yang sangat menonjol di bidang <strong>{TALENT_DOMAIN_LABELS[finalScores[0].domain as TalentDomain]}</strong>
                        {finalScores.length > 1 && finalScores[1].final_score > 60 && (
                          <span> dan <strong>{TALENT_DOMAIN_LABELS[finalScores[1].domain as TalentDomain]}</strong></span>
                        )}. Sangat disarankan untuk terus mengasah bakat ini melalui kompetisi dan program pembinaan yang relevan.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Rekomendasi Kompetisi */}
                        <div className="bg-white rounded-xl p-5 border border-indigo-100/50 shadow-sm">
                          <div className="flex items-center gap-2 mb-4">
                            <Trophy className="w-5 h-5 text-orange-500" />
                            <h4 className="font-bold text-gray-800">Rekomendasi Lomba</h4>
                          </div>
                          {recommendedCompetitions.length > 0 ? (
                            <div className="space-y-4">
                              {recommendedCompetitions.map(comp => (
                                <div key={comp.id} className="border-l-2 border-orange-400 pl-4">
                                  <p className="text-sm font-semibold text-gray-800 line-clamp-1">{comp.name}</p>
                                  <p className="text-xs text-gray-500 mt-1">{comp.level} • {comp.organizer}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="bg-gray-50 rounded-lg p-3 border border-dashed border-gray-200">
                              <p className="text-sm text-gray-500 italic">Belum ada lomba terkait yang sesuai saat ini.</p>
                            </div>
                          )}
                          <Link href="/dashboard/competitions" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 mt-4 inline-block">Lihat Semua Lomba &rarr;</Link>
                        </div>

                        {/* Rekomendasi Inkubasi */}
                        <div className="bg-white rounded-xl p-5 border border-indigo-100/50 shadow-sm">
                          <div className="flex items-center gap-2 mb-4">
                            <GraduationCap className="w-5 h-5 text-emerald-500" />
                            <h4 className="font-bold text-gray-800">Rekomendasi Inkubasi</h4>
                          </div>
                          {recommendedIncubations.length > 0 ? (
                            <div className="space-y-4">
                              {recommendedIncubations.map(inc => (
                                <div key={inc.id} className="border-l-2 border-emerald-400 pl-4">
                                  <p className="text-sm font-semibold text-gray-800 line-clamp-1">{inc.name}</p>
                                  <p className="text-xs text-gray-500 mt-1">Mentor: {inc.mentor?.full_name || '-'}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="bg-gray-50 rounded-lg p-3 border border-dashed border-gray-200">
                              <p className="text-sm text-gray-500 italic">Belum ada program inkubasi terkait saat ini.</p>
                            </div>
                          )}
                          <Link href="/dashboard/incubation" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 mt-4 inline-block">Lihat Semua Program &rarr;</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Bagian Catatan dan Spesialisasi (Hanya Muncul Jika Sudah Ada Hasil) */}
                {finalScores.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-gray-100">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">Catatan & Spesialisasi Anak</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                        <div className="flex items-center gap-2 mb-2">
                          <UserCircle className="w-4 h-4 text-orange-600" />
                          <span className="font-semibold text-sm text-orange-900">Catatan Orang Tua</span>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{parentNote || <span className="text-gray-400 italic">Belum ada catatan.</span>}</p>
                      </div>
                      
                      <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                        <div className="flex items-center gap-2 mb-2">
                          <GraduationCap className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-sm text-blue-900">Catatan Guru</span>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{teacherNote || <span className="text-gray-400 italic">Belum ada catatan.</span>}</p>
                      </div>
                    </div>

                    {/* Manajemen Label Spesialisasi */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                      <h4 className="font-bold text-gray-800 mb-3 text-sm">Label Spesialisasi (Skill Tags)</h4>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {recommendation?.specializations?.map((tag, idx) => (
                          <span key={idx} className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-lg border border-emerald-200">
                            #{tag}
                            {(currentUserRole === 'Admin' || currentUserRole === 'Guru' || currentUserRole === 'Wali Kelas') && (
                              <button onClick={() => handleRemoveTag(tag)} className="ml-1 text-emerald-400 hover:text-emerald-700 transition-colors" title="Hapus Label" disabled={saving}>&times;</button>
                            )}
                          </span>
                        ))}
                        {(!recommendation?.specializations || recommendation.specializations.length === 0) && (
                          <span className="text-sm text-gray-400 italic">Belum ada label spesialisasi yang ditambahkan.</span>
                        )}
                      </div>

                      {(currentUserRole === 'Admin' || currentUserRole === 'Guru' || currentUserRole === 'Wali Kelas') && (
                        <form onSubmit={handleAddTag} className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Ketik tag, pisahkan dengan koma (misal: Sepak Bola, Berenang)" 
                            className="flex-1 rounded-lg border-gray-300 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                            value={tempTags}
                            onChange={(e) => setTempTags(e.target.value)}
                            disabled={saving}
                          />
                          <Button type="submit" className="bg-gray-900 text-white hover:bg-gray-800" disabled={saving}>
                            Tambah Label
                          </Button>
                        </form>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
