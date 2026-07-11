'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { TalentScore, TALENT_DOMAIN_LABELS } from '@/types/talent';

interface Props {
  scores: TalentScore[];
}

export function TalentRadarChart({ scores }: Props) {
  // Format data for Recharts
  const data = scores.map(score => ({
    subject: TALENT_DOMAIN_LABELS[score.domain] || score.domain,
    A: score.final_score,
    fullMark: 100,
  }));

  if (!scores || scores.length === 0) {
    return (
      <div className="flex h-full min-h-[300px] items-center justify-center text-gray-400 text-sm">
        Data asesmen belum lengkap
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="60%" data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
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
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#125B34', fontWeight: 'bold' }}
          />
          <Radar
            name="Skor Bakat"
            dataKey="A"
            stroke="#125B34"
            fill="#22c55e"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
