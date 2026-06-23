'use client';

import {useState, useEffect} from 'react';
import {
  BarChart3, Users, FileText, CheckCircle, UsersRound,
  TrendingUp, TrendingDown, Download, Calendar,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, Area, AreaChart,
} from 'recharts';
import {useDashboard} from '@/lib/auth-context';
import {useRouter} from 'next/navigation';
import type {MetricCard, ChartDataPoint, MultiMetricDataPoint} from '@/types';

/** Zeitraum-Optionen fuer den Datenfilter */
type DateRange = 'week' | 'month' | 'quarter' | 'all';

/** Aktivitaets-Eintrag fuer die Tabelle */
interface ActivityEntry {
  time: string;
  action: string;
  actor: string;
  target: string;
  details: string;
  color: string;
}

/** Mock-Daten: Bewerbungstrend (6 Monate) */
const applicationTrendData: ChartDataPoint[] = [
  {name: 'Jan', value: 42},
  {name: 'Feb', value: 58},
  {name: 'Mar', value: 73},
  {name: 'Apr', value: 95},
  {name: 'May', value: 88},
  {name: 'Jun', value: 112},
];

/** Mock-Daten: Rollenverteilung */
const roleDistributionData: ChartDataPoint[] = [
  {name: 'Frontend', value: 98},
  {name: 'Backend', value: 76},
  {name: 'Fullstack', value: 54},
  {name: 'Design', value: 48},
  {name: 'Product', value: 36},
];

/** Farben fuer das Kreisdiagramm */
const PIE_COLORS = ['#77CF97', '#6366f1', '#f59e0b', '#ec4899', '#3b82f6'];

/** Mock-Daten: Annahme-Funnel */
const funnelData: ChartDataPoint[] = [
  {name: 'Applied', value: 312},
  {name: 'Reviewed', value: 248},
  {name: 'Accepted', value: 128},
  {name: 'Onboarded', value: 95},
];

/** Mock-Daten: Voyage-Leistung */
const voyagePerformanceData: MultiMetricDataPoint[] = [
  {name: 'Voyage 49', participants: 98, teams: 14, completionRate: 87},
  {name: 'Voyage 50', participants: 112, teams: 16, completionRate: 79},
  {name: 'Voyage 51', participants: 128, teams: 18, completionRate: 61},
];

/** Mock-Daten: Aktivitaets-Feed */
const activityData: ActivityEntry[] = [
  {time: '2 min ago', action: 'Application accepted', actor: 'Jane Cooper', target: 'Daniel Martinez', details: 'Voyage 51', color: 'bg-[#77CF97]'},
  {time: '15 min ago', action: 'Team created', actor: 'Jane Cooper', target: 'Pixel Pioneers', details: '4 members', color: 'bg-purple-500'},
  {time: '1 hour ago', action: 'Onboarding submitted', actor: 'Sophia Taylor', target: 'Self', details: 'Step 3/6', color: 'bg-blue-500'},
  {time: '2 hours ago', action: 'Application rejected', actor: 'Jane Cooper', target: 'Alex Morgan', details: 'Incomplete profile', color: 'bg-rose-500'},
  {time: '3 hours ago', action: 'Voyage started', actor: 'System', target: 'Voyage 51', details: '128 participants', color: 'bg-amber-500'},
  {time: '5 hours ago', action: 'Team updated', actor: 'Mark Logic', target: 'Team Atlas', details: 'Added member', color: 'bg-purple-500'},
  {time: '8 hours ago', action: 'Application received', actor: 'System', target: '12 new', details: 'Auto-assigned', color: 'bg-slate-400'},
  {time: '1 day ago', action: 'Milestone reached', actor: 'System', target: '100 applications', details: 'Voyage 51', color: 'bg-amber-500'},
  {time: '1 day ago', action: 'Onboarding completed', actor: 'Emma Wilson', target: 'Self', details: 'All 6 steps', color: 'bg-[#77CF97]'},
  {time: '2 days ago', action: 'Application accepted', actor: 'Jane Cooper', target: 'Michael Davis', details: 'Voyage 51', color: 'bg-[#77CF97]'},
];

/**
 * KPI-Karte fuer Analytics.
 * Zeigt einen Kennwert mit Aenderungsprozent und Trend-Icon.
 */
function KpiCard({metric}: {metric: MetricCard}) {
  const Icon = metric.icon;
  const isPositive = metric.change >= 0;

  return (
    <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#77CF97]/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#77CF97]" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-[#77CF97]' : 'text-rose-500'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isPositive ? '+' : ''}{metric.change}%
        </div>
      </div>
      <div className="font-outfit text-2xl font-bold text-slate-900 dark:text-white mb-1">
        {metric.value}
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400">
        {metric.label} <span className="text-slate-400 dark:text-slate-600">· {metric.changeLabel}</span>
      </div>
    </div>
  );
}

/**
 * Analytics-Dashboard: Uebersicht von KPIs, Charts und Aktivitaets-Feed.
 * Nur fuer Admin-Rolle zugänglich.
 */
export default function AnalyticsPage() {
  const {role} = useDashboard();
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange>('month');

  // Nur Admin hat Zugriff
  useEffect(() => {
    if (role !== 'admin') {
      router.push('/overview');
    }
  }, [role, router]);

  if (role !== 'admin') return null;

  /** KPI-Metriken basierend auf dem gewaehlten Zeitraum */
  const kpiMetrics: MetricCard[] = [
    {label: 'Total Applications', value: '312', change: 12, changeLabel: 'vs. last month', icon: FileText},
    {label: 'Acceptance Rate', value: '41%', change: 3.2, changeLabel: 'vs. last month', icon: CheckCircle},
    {label: 'Active Participants', value: '128', change: 8, changeLabel: 'vs. last month', icon: Users},
    {label: 'Teams Formed', value: '18', change: 5, changeLabel: 'vs. last month', icon: UsersRound},
  ];

  /** Export-Report ausloesen */
  const handleExport = () => {
    // eslint-disable-next-line no-alert
    alert('Export functionality: Report would be generated and downloaded as PDF/CSV.');
  };

  return (
    <div className="space-y-6">
      {/* Seitenkopf */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-outfit font-medium text-slate-900 dark:text-white mb-1 tracking-tight">
            Analytics & Reports
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Track platform performance, application trends, and voyage metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Zeitraum-Auswahl */}
          <div className="flex gap-1 bg-slate-100 dark:bg-white/5 rounded-xl p-1 border border-slate-200 dark:border-white/10">
            {([
              {key: 'week' as const, label: 'This Week'},
              {key: 'month' as const, label: 'This Month'},
              {key: 'quarter' as const, label: 'This Quarter'},
              {key: 'all' as const, label: 'All Time'},
            ]).map((opt) => (
              <button
                key={opt.key}
                onClick={() => setDateRange(opt.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  dateRange === opt.key
                    ? 'bg-white dark:bg-[#1a1b24] text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {/* Export-Button */}
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-[#0b0c10] dark:bg-[#77CF97] text-white dark:text-[#0b0c10] rounded-xl text-sm font-medium hover:bg-slate-800 dark:hover:bg-[#5ab87e] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* KPI-Reihe */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiMetrics.map((metric) => (
          <KpiCard key={metric.label} metric={metric} />
        ))}
      </div>

      {/* Charts-Grid (2x2) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Bewerbungen ueber Zeit (Linien-Chart) */}
        <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Applications Over Time</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Monthly submissions — last 6 months</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#77CF97] font-medium">
              <Calendar className="w-3.5 h-3.5" /> 6 months
            </div>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={applicationTrendData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#77CF97" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#77CF97" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-white/5" />
                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1b24',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="value" stroke="#77CF97" strokeWidth={2.5} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Rollenverteilung (Kreis-/Donut-Diagramm) */}
        <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Role Distribution</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Breakdown by participant role</p>
            </div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">312 total</span>
          </div>
          <div className="h-[260px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {roleDistributionData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1b24',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  verticalAlign="middle"
                  align="right"
                  layout="vertical"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value: string) => <span className="text-xs text-slate-600 dark:text-slate-300">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Annahme-Funnel (Balken-Chart) */}
        <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Acceptance Funnel</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Conversion through each stage</p>
            </div>
            <span className="text-xs font-medium text-[#77CF97]">30.4% end-to-end</span>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{left: 10}}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} className="dark:stroke-white/5" />
                <XAxis type="number" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{fontSize: 12, fill: '#94a3b8'}}
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1b24',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="value" fill="#77CF97" radius={[0, 6, 6, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Voyage-Leistung (Gruppiertes Balken-Diagramm) */}
        <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Voyage Performance</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Compare participants, teams, and completion</p>
            </div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">3 voyages</span>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={voyagePerformanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="dark:stroke-white/5" />
                <XAxis dataKey="name" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1b24',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value: string) => <span className="text-xs text-slate-600 dark:text-slate-300 capitalize">{value.replace(/([A-Z])/g, ' $1').trim()}</span>}
                />
                <Bar dataKey="participants" fill="#77CF97" radius={[4, 4, 0, 0]} barSize={16} />
                <Bar dataKey="teams" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={16} />
                <Bar dataKey="completionRate" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Aktivitaets-Tabelle */}
      <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Recent Activity</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Latest 10 actions across the platform</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/10">
                <th className="text-left text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider pb-3 pr-4">Time</th>
                <th className="text-left text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider pb-3 pr-4">Action</th>
                <th className="text-left text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider pb-3 pr-4">Actor</th>
                <th className="text-left text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider pb-3 pr-4">Target</th>
                <th className="text-left text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider pb-3">Details</th>
              </tr>
            </thead>
            <tbody>
              {activityData.map((entry, i) => (
                <tr
                  key={i}
                  className="border-b border-slate-50 dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 pr-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{entry.time}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${entry.color}`} />
                      <span className="text-xs font-medium text-slate-800 dark:text-white">{entry.action}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-xs text-slate-600 dark:text-slate-300">{entry.actor}</td>
                  <td className="py-3 pr-4 text-xs font-medium text-slate-800 dark:text-white">{entry.target}</td>
                  <td className="py-3 text-xs text-slate-500 dark:text-slate-400">{entry.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
