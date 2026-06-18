'use client';

import {
  FileText, User, Users, XCircle, UsersRound, Calendar,
  ChevronRight, AlertTriangle, FileSearch, FileSignature,
  Check, CheckCircle, Clock,
} from 'lucide-react';
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip} from 'recharts';
import {useDashboard} from '@/lib/auth-context';

/** Sprint-Aufgaben-Statistik fuer Pie-Chart */
const sprintTaskData = [
  {name: 'To Do', value: 3},
  {name: 'In Progress', value: 2},
  {name: 'Done', value: 6},
];
const TASK_COLORS = ['#e2e8f0', '#818cf8', '#1CB368'];

/** Metrik-Block fuer Admin-Uebersicht */
function MetricBlock({icon, color, value, label, subtext}: {
  icon: React.ReactNode;
  color: {bg: string; text: string};
  value: string;
  label: string;
  subtext: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3">
      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${color.bg}`}>
        <span className={`w-4 h-4 ${color.text}`}>{icon}</span>
      </div>
      <div className="min-w-0">
        <div className="font-outfit text-xl font-bold text-slate-800 leading-none">{value}</div>
        <div className="text-[11px] font-semibold text-slate-600 leading-tight truncate">{label}</div>
        <div className="text-[10px] text-slate-400 font-medium mt-0.5">{subtext}</div>
      </div>
    </div>
  );
}

/** Deadlinedaten fuer Admin-Uebersicht */
const deadlines = [
  {title: 'Review applications', date: 'May 2, 2026', badge: '3 days', badgeColor: 'bg-rose-50 text-rose-500'},
  {title: 'Confirm teams', date: 'May 9, 2026', badge: '10 days', badgeColor: 'bg-amber-50 text-amber-600'},
  {title: 'Onboarding check', date: 'May 16, 2026', badge: '17 days', badgeColor: 'bg-blue-50 text-blue-500'},
  {title: 'Voyage starts', date: 'May 23, 2026', badge: '24 days', badgeColor: 'bg-[#1CB368]/10 text-[#1CB368]'},
];

/** Deadlinedaten fuer Admin-Uebersicht */
const pipelineSteps = [
  {
    step: '01', color: 'text-[#1CB368]', btnBg: 'bg-[#1CB368]/10', barColor: 'bg-[#1CB368]',
    title: 'Applications', subtitle: 'Collect & review applications',
    total: '312 TOTAL', progressWidth: '100%',
    stats: [
      {label: 'Pending Review', value: '64', color: 'text-slate-800'},
      {label: 'Accepted', value: '128', color: 'text-[#1CB368]'},
      {label: 'Rejected', value: '28', color: 'text-rose-500'},
      {label: 'Incomplete', value: '92', color: 'text-[#1CB368]'},
    ],
  },
  {
    step: '02', color: 'text-blue-500', btnBg: 'bg-blue-500/10', barColor: 'bg-blue-500',
    title: 'Matching', subtitle: 'Match & assign participants',
    total: '72 REMAINING', progressWidth: '40%',
    stats: [
      {label: 'Unassigned', value: '72', color: 'text-slate-800'},
      {label: 'Partial Matches', value: '34', color: 'text-blue-500'},
      {label: 'Matched', value: '56', color: 'text-purple-600'},
    ],
  },
  {
    step: '03', color: 'text-purple-600', btnBg: 'bg-purple-600/10', barColor: 'bg-purple-600',
    title: 'Teams', subtitle: 'Form & confirm teams',
    total: '18 TEAMS', progressWidth: '70%',
    stats: [
      {label: 'Draft Teams', value: '12', color: 'text-purple-600'},
      {label: 'Confirmed', value: '6', color: 'text-[#1CB368]'},
      {label: 'Needs Attention', value: '3', color: 'text-rose-500'},
    ],
  },
  {
    step: '04', color: 'text-rose-500', btnBg: 'bg-rose-500/10', barColor: 'bg-rose-500',
    title: 'Onboarding', subtitle: 'Complete required steps',
    total: '61% COMPLETED', progressWidth: '61%',
    stats: [
      {label: 'Completed', value: '79', color: 'text-[#1CB368]'},
      {label: 'In Progress', value: '38', color: 'text-blue-500'},
      {label: 'Missing', value: '19', color: 'text-rose-500'},
    ],
  },
];

/** Aufmerksamkeits-Eintraege fuer Admin */
const attentionItems = [
  {icon: <FileSearch />, color: {bg: 'bg-rose-50', text: 'text-rose-500'}, title: 'Applications older than 7 days', desc: 'Need review', value: '24'},
  {icon: <AlertTriangle />, color: {bg: 'bg-orange-50', text: 'text-orange-500'}, title: 'Accepted participants without team', desc: 'Require assignment', value: '16'},
  {icon: <UsersRound />, color: {bg: 'bg-purple-50', text: 'text-purple-500'}, title: 'Teams missing required role', desc: 'Missing Product Owner or Developer', value: '8'},
  {icon: <FileSignature />, color: {bg: 'bg-blue-50', text: 'text-blue-500'}, title: 'Onboarding forms incomplete', desc: 'Participants need to complete', value: '12'},
];

/** Aktivitaets-Eintraege */
const activityItems = [
  {avatar: 'https://i.pravatar.cc/100?img=11', icon: Check, iconColor: {bg: 'bg-[#1CB368]/20', text: 'text-[#1CB368]'}, highlight: 'Daniel Martinez', text: 'was accepted', time: '2 minutes ago'},
  {avatar: 'https://i.pravatar.cc/100?img=4', icon: UsersRound, iconColor: {bg: 'bg-purple-100', text: 'text-purple-600'}, highlight: 'New team "Pixel Pioneers"', text: 'was created', time: '15 minutes ago'},
  {avatar: 'https://i.pravatar.cc/100?img=5', icon: FileSignature, iconColor: {bg: 'bg-blue-100', text: 'text-blue-500'}, highlight: 'Sophia Taylor', text: 'submitted onboarding', time: '1 hour ago'},
  {avatar: 'https://i.pravatar.cc/100?img=9', icon: XCircle, iconColor: {bg: 'bg-rose-100', text: 'text-rose-500'}, highlight: 'Alex Morgan', text: 'was rejected', time: '2 hours ago'},
];

/** Admin-Uebersicht: Metriken, Deadlines, Pipeline, Aufmerksamkeit, Aktivitaet */
export function AdminOverview() {
  return (
    <>
      {/* Obere Reihe: Metriken & Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Linkes Panel: Begruessung + Metriken */}
        <div className="lg:col-span-8 bg-white rounded-[24px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-8 flex flex-col justify-between">
          <div className="mb-6">
            <h1 className="text-[28px] font-outfit font-medium text-slate-900 mb-1 tracking-tight">Good morning, Jane.</h1>
            <p className="text-slate-500 text-sm">Voyage <span className="text-rose-500 font-medium">51</span> is in application review.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-1">
            <MetricBlock icon={<FileText />} color={{bg: 'bg-[#1CB368]/10', text: 'text-[#1CB368]'}} value="312" label="Applications" subtext="+24 since yesterday" />
            <MetricBlock icon={<User />} color={{bg: 'bg-blue-500/10', text: 'text-blue-500'}} value="128" label="Accepted" subtext="41% of total" />
            <MetricBlock icon={<Users />} color={{bg: 'bg-purple-500/10', text: 'text-purple-500'}} value="64" label="Pending Review" subtext="20% of total" />
            <MetricBlock icon={<XCircle />} color={{bg: 'bg-rose-500/10', text: 'text-rose-500'}} value="28" label="Rejected" subtext="9% of total" />
            <MetricBlock icon={<UsersRound />} color={{bg: 'bg-amber-500/10', text: 'text-amber-500'}} value="18" label="Teams Drafted" subtext="65 members" />
          </div>
        </div>

        {/* Rechtes Panel: Kommende Deadlines */}
        <div className="lg:col-span-4 bg-white rounded-[24px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-slate-800">Upcoming Deadlines</h3>
            <a href="#" className="text-xs font-medium text-slate-400 hover:text-slate-800 transition-colors">View all</a>
          </div>
          <div className="space-y-4 flex-1">
            {deadlines.map((d, i) => (
              <div key={i} className="flex items-center gap-4 py-1">
                <div className="p-2.5 rounded-xl bg-slate-50 text-slate-400 border border-slate-100/50">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-800">{d.title}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{d.date}</div>
                </div>
                <div className={`text-xs px-2.5 py-1 rounded-full font-medium ${d.badgeColor}`}>{d.badge}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pipeline-Bereich */}
      <div>
        <div className="flex justify-between items-end mb-4 px-1">
          <h2 className="font-semibold text-slate-900 text-lg">Voyage Pipeline</h2>
          <a href="#" className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">View full pipeline</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {pipelineSteps.map((p, i) => (
            <div key={i} className="bg-white rounded-[24px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6 relative flex flex-col h-full hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-shadow">
              <div className="flex gap-3.5 items-start mb-6">
                <div className={`font-outfit text-[40px] leading-none tracking-tighter font-light ${p.color}`}>{p.step}</div>
                <div className="pt-1">
                  <div className="font-semibold text-slate-800 text-sm leading-tight mb-1">{p.title}</div>
                  <div className="text-[11px] text-slate-500 leading-tight">{p.subtitle}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${p.barColor}`} style={{width: p.progressWidth}}></div>
                </div>
                <div className="text-[10px] font-medium text-slate-500 whitespace-nowrap uppercase tracking-wider">{p.total}</div>
              </div>
              <div className="space-y-3 mb-8 flex-1">
                {p.stats.map((s, j) => (
                  <div key={j} className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">{s.label}</span>
                    <span className={`font-semibold ${s.color || 'text-slate-900'}`}>{s.value}</span>
                  </div>
                ))}
              </div>
              <button className={`absolute bottom-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${p.btnBg} ${p.color} hover:bg-opacity-20`}>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Untere Reihe: Aufmerksamkeit & Aktivitaet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Aufmerksamkeit */}
        <div className="lg:col-span-6 bg-white rounded-[24px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6">
          <div className="flex items-center justify-between mb-6 px-1">
            <h3 className="font-semibold text-slate-900">Needs Attention</h3>
          </div>
          <div className="space-y-1">
            {attentionItems.map((item, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0 last:pb-0 cursor-pointer group">
                <div className={`p-2.5 rounded-xl border border-rose-100/50 shrink-0 shadow-sm ${item.color.bg} ${item.color.text}`}>
                  <span className="w-4 h-4">{item.icon}</span>
                </div>
                <div className="flex-1 pt-0.5">
                  <div className="text-sm font-medium text-slate-800 group-hover:text-rose-500 transition-colors mb-0.5">{item.title}</div>
                  <div className="text-[11px] text-slate-500">{item.desc}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">{item.value}</div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Aktivitaet */}
        <div className="lg:col-span-6 bg-white rounded-[24px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-6">
          <div className="flex items-center justify-between mb-6 px-1">
            <h3 className="font-semibold text-slate-900">Recent Activity</h3>
            <a href="#" className="text-xs font-medium text-slate-400 hover:text-slate-800 transition-colors">View all</a>
          </div>
          <div className="space-y-1">
            {activityItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex gap-4 items-start py-3 border-b border-slate-50 last:border-0 last:pb-0 cursor-pointer group">
                  <div className="relative shrink-0 mt-0.5">
                    <img src={item.avatar} className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200" alt="avatar" />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${item.iconColor.bg}`}>
                      <Icon className={`w-3 h-3 ${item.iconColor.text}`} />
                    </div>
                  </div>
                  <div className="pt-0.5">
                    <div className="text-sm text-slate-600 leading-snug">
                      <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{item.highlight}</span> {item.text}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 font-medium">{item.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

/** Participant-Uebersicht: Sprint-Progress, Pie-Chart, Meetings */
export function ParticipantOverview() {
  const {setCurrentView} = useDashboard();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-outfit font-medium text-slate-900 mb-1 tracking-tight">Welcome back, Mark 👋</h1>
          <p className="text-slate-500 text-sm">Here is what is happening with your team and tasks today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm flex items-center h-[350px]">
            <div className="flex-1 flex flex-col justify-center pl-8 text-left">
              <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Sprint 3 is Active</h3>
              <p className="text-slate-500 mt-2 max-w-sm leading-relaxed">
                Your team &quot;Pixel Pioneers&quot; has <strong className="text-slate-800">5 tasks</strong> remaining for this sprint. You are 54% complete overall.
              </p>
              <button
                onClick={() => setCurrentView('teams')}
                className="mt-8 w-fit px-6 py-2.5 bg-[#0b0c10] text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2"
              >
                Go to Team Space <span className="w-4 h-4">↗</span>
              </button>
            </div>
            <div className="flex-1 h-full flex flex-col items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sprintTaskData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={3} dataKey="value" stroke="none">
                    {sprintTaskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={TASK_COLORS[index % TASK_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)'}} itemStyle={{color: '#1e293b', fontWeight: 500}} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-slate-800">54%</span>
                <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">Done</span>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)] h-[350px]">
            <h3 className="font-semibold text-slate-900 mb-5">Upcoming Meetings</h3>
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl border border-slate-100 flex gap-4 items-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100/50 text-indigo-600 flex flex-col items-center justify-center shrink-0 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Oct</span>
                  <span className="text-base font-bold leading-none mt-0.5">24</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-800 truncate">Daily Standup</div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> 10:00 AM • Zoom
                  </div>
                </div>
              </div>
              <div className="p-3.5 rounded-2xl border border-slate-100 flex gap-4 items-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100/50 text-purple-600 flex flex-col items-center justify-center shrink-0 shadow-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Oct</span>
                  <span className="text-base font-bold leading-none mt-0.5">26</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-800 truncate">Sprint Planning</div>
                  <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> 2:00 PM • Discord
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Applicant-Uebersicht: Status der Bewerbung */
export function ApplicantOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] font-outfit font-medium text-slate-900 mb-1 tracking-tight">Application Status</h1>
        <p className="text-slate-500 text-sm">Track your application for Voyage 51.</p>
      </div>

      <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Application</h2>
            <p className="text-sm text-slate-500">Submitted for Voyage 51 — Application Review</p>
          </div>
        </div>

        {/* Status-Fortschritt */}
        <div className="flex items-center gap-2 mb-8">
          {['Submitted', 'Under Review', 'Decision', 'Onboarding'].map((step, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                i === 0 ? 'bg-[#1CB368] text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                {i === 0 ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs font-medium ${i === 0 ? 'text-[#1CB368]' : 'text-slate-400'}`}>{step}</span>
              {i < 3 && <div className={`flex-1 h-[2px] ${i === 0 ? 'bg-[#1CB368]' : 'bg-slate-200'}`}></div>}
            </div>
          ))}
        </div>

        {/* Bewerbungsdetails */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Applied Role</div>
              <div className="text-sm font-medium text-slate-800">Frontend Developer</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Experience Level</div>
              <div className="text-sm font-medium text-slate-800">Advanced — 4 years</div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Submitted</div>
              <div className="text-sm font-medium text-slate-800">May 1, 2026</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold border border-amber-100">
                <Clock className="w-3 h-3" /> Under Review
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Haupt-Overview-Seite: waehlt Ansicht basierend auf der Rolle */
export default function OverviewPage() {
  const {role} = useDashboard();
  if (role === 'admin') return <AdminOverview />;
  if (role === 'participant') return <ParticipantOverview />;
  return <ApplicantOverview />;
}
