import React, { useMemo, useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import { CalendarDays, Clock3, BookOpen, Brain, TrendingUp } from 'lucide-react';

type TimeRange = '7d' | '30d' | '90d';

const studyByDay = [
  { day: 'Mon', hours: 2.2, sessions: 2 },
  { day: 'Tue', hours: 3.4, sessions: 3 },
  { day: 'Wed', hours: 1.8, sessions: 1 },
  { day: 'Thu', hours: 4.1, sessions: 3 },
  { day: 'Fri', hours: 2.9, sessions: 2 },
  { day: 'Sat', hours: 5.0, sessions: 4 },
  { day: 'Sun', hours: 3.1, sessions: 2 },
];

const topicHours = [
  { topic: 'React', hours: 16, completion: 74 },
  { topic: 'Python', hours: 21, completion: 83 },
  { topic: 'Algorithms', hours: 12, completion: 61 },
  { topic: 'System Design', hours: 10, completion: 55 },
  { topic: 'Databases', hours: 8, completion: 49 },
];

const skillDistribution = [
  { name: 'Frontend', value: 28 },
  { name: 'Backend', value: 22 },
  { name: 'DSA', value: 19 },
  { name: 'Problem Solving', value: 17 },
  { name: 'Databases', value: 14 },
];

const learningTrend = [
  { week: 'W1', hours: 14, quizzes: 6 },
  { week: 'W2', hours: 17, quizzes: 8 },
  { week: 'W3', hours: 16, quizzes: 7 },
  { week: 'W4', hours: 20, quizzes: 9 },
  { week: 'W5', hours: 19, quizzes: 10 },
  { week: 'W6', hours: 23, quizzes: 11 },
];

const skillRadar = [
  { skill: 'Logic', value: 82 },
  { skill: 'Coding Speed', value: 71 },
  { skill: 'Debugging', value: 76 },
  { skill: 'Architecture', value: 63 },
  { skill: 'Communication', value: 79 },
  { skill: 'Testing', value: 68 },
];

const chartPalette = {
  red: '#F87171',
  orange: '#FB923C',
  yellow: '#FACC15',
  green: '#4ADE80',
  cyan: '#22D3EE',
  blue: '#60A5FA',
  violet: '#A78BFA',
};

const pieColors = [
  chartPalette.green,
  chartPalette.red,
  chartPalette.yellow,
  chartPalette.orange,
  chartPalette.cyan,
];

const tooltipContentStyle = {
  background: '#0F1115CC',
  border: '1px solid rgba(176,122,76,0.35)',
  borderRadius: '12px',
  color: '#ECEEF3',
};

const tooltipLabelStyle = {
  color: '#D8DCE5',
  fontWeight: 600,
};

const tooltipItemStyle = {
  color: '#ECEEF3',
};

export const Analytics: React.FC = () => {
  const [range, setRange] = useState<TimeRange>('30d');

  const rangeMultiplier = useMemo(() => {
    if (range === '7d') return 0.35;
    if (range === '30d') return 1;
    return 2.7;
  }, [range]);

  const totalHours = useMemo(() => {
    const base = studyByDay.reduce((sum, item) => sum + item.hours, 0);
    return (base * rangeMultiplier).toFixed(1);
  }, [rangeMultiplier]);

  const totalSessions = useMemo(() => {
    const base = studyByDay.reduce((sum, item) => sum + item.sessions, 0);
    return Math.round(base * rangeMultiplier);
  }, [rangeMultiplier]);

  const avgDaily = useMemo(() => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    return (Number(totalHours) / days).toFixed(2);
  }, [range, totalHours]);

  const topSkill = useMemo(() => {
    return [...skillRadar].sort((a, b) => b.value - a.value)[0];
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Learning Analytics</h1>
          <p className="text-subtext mt-2">Track study patterns, topic depth, and skill growth over time.</p>
        </div>

        <div className="inline-flex bg-surface border border-white/10 rounded-xl p-1">
          {(['7d', '30d', '90d'] as TimeRange[]).map((item) => (
            <button
              key={item}
              onClick={() => setRange(item)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                range === item ? 'bg-primary text-black' : 'text-subtext hover:text-white'
              }`}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <GlassCard glowColor="primary">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase text-subtext">Total Hours</span>
            <Clock3 size={16} className="text-primary" />
          </div>
          <p className="text-3xl font-bold text-white">{totalHours}h</p>
          <p className="text-xs text-subtext mt-2">+11% vs previous range</p>
        </GlassCard>

        <GlassCard glowColor="secondary">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase text-subtext">Study Sessions</span>
            <CalendarDays size={16} className="text-secondary" />
          </div>
          <p className="text-3xl font-bold text-white">{totalSessions}</p>
          <p className="text-xs text-subtext mt-2">Consistency score: 82/100</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase text-subtext">Daily Average</span>
            <TrendingUp size={16} className="text-white" />
          </div>
          <p className="text-3xl font-bold text-white">{avgDaily}h</p>
          <p className="text-xs text-subtext mt-2">Across {range === '7d' ? 7 : range === '30d' ? 30 : 90} days</p>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase text-subtext">Top Skill</span>
            <Brain size={16} className="text-white" />
          </div>
          <p className="text-3xl font-bold text-white">{topSkill.skill}</p>
          <p className="text-xs text-subtext mt-2">Score: {topSkill.value}/100</p>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <GlassCard className="xl:col-span-2 min-h-[360px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Hours and Sessions by Day</h2>
            <span className="text-xs text-subtext">Bar + line overview</span>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studyByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="#A0A0A8" />
                <YAxis yAxisId="left" stroke="#A0A0A8" />
                <YAxis yAxisId="right" orientation="right" stroke="#A0A0A8" />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                  contentStyle={tooltipContentStyle}
                  labelStyle={tooltipLabelStyle}
                  itemStyle={tooltipItemStyle}
                />
                <Bar yAxisId="left" dataKey="hours" radius={[6, 6, 0, 0]}>
                  {studyByDay.map((entry, index) => (
                    <Cell
                      key={`${entry.day}-${index}`}
                      fill={index % 2 === 0 ? chartPalette.green : chartPalette.blue}
                    />
                  ))}
                </Bar>
                <Line yAxisId="right" type="monotone" dataKey="sessions" stroke={chartPalette.cyan} strokeWidth={2.5} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="min-h-[360px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Topic Share</h2>
            <BookOpen size={16} className="text-subtext" />
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={skillDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={3}
                >
                  {skillDistribution.map((entry, index) => (
                    <Cell key={`${entry.name}-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipContentStyle}
                  labelStyle={tooltipLabelStyle}
                  itemStyle={tooltipItemStyle}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <GlassCard className="min-h-[360px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Topic Depth and Completion</h2>
            <span className="text-xs text-subtext">Hours invested</span>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicHours} layout="vertical" margin={{ left: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" stroke="#A0A0A8" />
                <YAxis type="category" dataKey="topic" stroke="#A0A0A8" width={90} />
                <Tooltip
                  contentStyle={tooltipContentStyle}
                  labelStyle={tooltipLabelStyle}
                  itemStyle={tooltipItemStyle}
                />
                <Bar dataKey="hours" radius={[0, 6, 6, 0]}>
                  {topicHours.map((entry, index) => (
                    <Cell
                      key={`${entry.topic}-${index}`}
                      fill={[chartPalette.blue, chartPalette.orange, chartPalette.green, chartPalette.violet, chartPalette.red][index % 5]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="min-h-[360px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Skill Radar</h2>
            <span className="text-xs text-subtext">Current capability profile</span>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillRadar}>
                <PolarGrid stroke="rgba(255,255,255,0.15)" />
                <PolarAngleAxis dataKey="skill" stroke="#A0A0A8" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar dataKey="value" stroke={chartPalette.violet} fill={chartPalette.violet} fillOpacity={0.32} />
                <Tooltip
                  contentStyle={tooltipContentStyle}
                  labelStyle={tooltipLabelStyle}
                  itemStyle={tooltipItemStyle}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="min-h-[320px]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Weekly Learning Trend</h2>
          <span className="text-xs text-subtext">Hours and quiz attempts</span>
        </div>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={learningTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="week" stroke="#A0A0A8" />
              <YAxis stroke="#A0A0A8" />
              <Tooltip
                contentStyle={tooltipContentStyle}
                labelStyle={tooltipLabelStyle}
                itemStyle={tooltipItemStyle}
              />
              <Line type="monotone" dataKey="hours" stroke={chartPalette.yellow} strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="quizzes" stroke={chartPalette.green} strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
};
