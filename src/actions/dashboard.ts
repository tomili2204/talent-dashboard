'use server';

import { createClient } from '@/lib/supabase/server';
import { DOMAIN_TO_CATEGORY, TalentDomain } from '@/types/talent';

export async function getExecutiveStats(yearFilter?: string, classId?: string) {
  const supabase = await createClient();

  // Basic counts
  const { count: teachersCount } = await supabase.from('teachers').select('*', { count: 'exact', head: true });
  
  let classesQuery = supabase.from('classes').select('id, name');
  const { data: classesData } = await classesQuery;
  const classesCount = classesData?.length || 0;

  let studentsQuery = supabase.from('students').select('id, class_id, full_name, classes(name)');
  if (classId && classId !== 'all') {
    studentsQuery = studentsQuery.eq('class_id', classId);
  }
  const { data: studentsData } = await studentsQuery;
  const studentsCount = studentsData?.length || 0;

  const safeStudentsData = studentsData || [];
  const classDistribution = (classesData || []).map(c => ({
    name: c.name,
    count: safeStudentsData.filter(s => s.class_id === c.id).length
  })).sort((a, b) => b.count - a.count);

  // Active Incubation Programs
  let incubationQuery = supabase.from('incubation_programs').select('*').eq('status', 'Active');
  if (yearFilter && yearFilter !== 'all') {
    incubationQuery = incubationQuery.gte('start_date', `${yearFilter}-01-01`).lte('start_date', `${yearFilter}-12-31`);
  }
  const { data: activeIncubations } = await incubationQuery;
  const activeIncubationCount = activeIncubations?.length || 0;

  // Achievements
  let achievementsQuery = supabase.from('achievements').select('*, student:students(id, full_name, class_id, class:classes(name))');
  if (yearFilter && yearFilter !== 'all') {
    achievementsQuery = achievementsQuery.gte('date', `${yearFilter}-01-01`).lte('date', `${yearFilter}-12-31`);
  }
  let { data: achievementsRaw } = await achievementsQuery;
  let achievementsData = achievementsRaw || [];
  
  // Filter achievements by class if specified
  if (classId && classId !== 'all') {
    achievementsData = achievementsData.filter(a => a.student?.class_id === classId);
  }

  // Achievement Categories (Jumlah Prestasi per kategori)
  const achievementsByCategory = achievementsData.reduce((acc: any, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {});
  
  const achievementsByCategoryList = Object.entries(achievementsByCategory).map(([name, value]) => ({ name, value }));

  // Achievement Levels (Prestasi berdasarkan tingkat)
  const achievementLevels = ['Sekolah', 'Kecamatan', 'Kabupaten', 'Provinsi', 'Nasional', 'Internasional'];
  const achievementsByLevelList = achievementLevels.map(level => {
    return {
      name: level,
      count: achievementsData.filter(a => a.level === level).length
    };
  });

  // Achievement per Class
  const achievementsByClass = achievementsData.reduce((acc: any, curr) => {
    const className = curr.student?.class?.name || 'Unknown';
    acc[className] = (acc[className] || 0) + 1;
    return acc;
  }, {});
  const achievementsByClassList = Object.entries(achievementsByClass).map(([name, count]) => ({ name, count }));

  // 5 Year Trends (Prestasi & Keikutsertaan)
  // Determine current year and last 5 years
  const currentYear = new Date().getFullYear();
  const last5Years = Array.from({ length: 5 }, (_, i) => (currentYear - 4 + i).toString());
  
  const trendData = last5Years.map(year => {
    const yearAchievements = achievementsData.filter(a => a.date.startsWith(year));
    
    // Ranks breakdown
    const juara1 = yearAchievements.filter(a => a.rank === 'Juara 1' || a.rank === 'Gold Medals/Award').length;
    const juara2 = yearAchievements.filter(a => a.rank === 'Juara 2' || a.rank === 'Silver Medals/Award').length;
    const juara3 = yearAchievements.filter(a => a.rank === 'Juara 3' || a.rank === 'Bronze Medals/Award').length;
    const harapan = yearAchievements.filter(a => a.rank?.includes('Harapan')).length;
    const peserta = yearAchievements.filter(a => a.rank === 'Peserta' || !a.rank).length;
    
    return {
      year,
      total: yearAchievements.length,
      juara1,
      juara2,
      juara3,
      harapan,
      peserta
    };
  });

  // Talents
  let talentsQuery = supabase.from('talent_scores').select('*, student:students(id, full_name, class_id, class:classes(name))');
  if (yearFilter && yearFilter !== 'all') {
    talentsQuery = talentsQuery.gte('created_at', `${yearFilter}-01-01`).lte('created_at', `${yearFilter}-12-31`);
  }
  let { data: talentsRaw } = await talentsQuery;
  let talentsData = talentsRaw || [];

  if (classId && classId !== 'all') {
    talentsData = talentsData.filter(t => t.student?.class_id === classId);
  }

  // Superior Talents (Talenta Unggul) per category (final_score >= 85)
  const superiorTalents = talentsData.filter(t => t.final_score >= 85);
  const superiorTalentsByCategory = superiorTalents.reduce((acc: any, curr) => {
    acc[curr.domain] = (acc[curr.domain] || 0) + 1;
    return acc;
  }, {});
  const superiorTalentsByCategoryList = Object.entries(superiorTalentsByCategory).map(([name, value]) => ({ 
    name: DOMAIN_TO_CATEGORY[name as TalentDomain] || name, 
    value 
  }));

  // Talent Distribution (All)
  const talentDistribution = talentsData.reduce((acc: any, curr) => {
    acc[curr.domain] = (acc[curr.domain] || 0) + 1;
    return acc;
  }, {});
  const talentDistributionList = Object.entries(talentDistribution).map(([name, value]) => ({ 
    name: DOMAIN_TO_CATEGORY[name as TalentDomain] || name, 
    value 
  }));

  // Top 20 Talents
  // We rank students based on their highest final_score
  const studentScores = talentsData.reduce((acc: any, curr) => {
    const sId = curr.student_id;
    if (!acc[sId] || acc[sId].score < curr.final_score) {
      acc[sId] = {
        id: sId,
        name: curr.student?.full_name || 'Unknown',
        class: curr.student?.class?.name || '-',
        domain: curr.domain,
        score: curr.final_score
      };
    }
    return acc;
  }, {});
  
  const top20Talents = Object.values(studentScores)
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 20);

  return {
    summary: {
      studentsCount,
      teachersCount,
      classesCount,
      activeIncubationCount,
      totalAchievements: achievementsData.length,
      totalSuperiorTalents: superiorTalents.length
    },
    classDistribution,
    achievementsByCategory: achievementsByCategoryList,
    achievementsByLevel: achievementsByLevelList,
    achievementsByClass: achievementsByClassList,
    trendData,
    superiorTalentsByCategory: superiorTalentsByCategoryList,
    talentDistribution: talentDistributionList,
    top20Talents
  };
}
