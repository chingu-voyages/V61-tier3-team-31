'use client';

import {
  FileText, User, Users, XCircle, UsersRound, Calendar,
  ChevronRight, AlertTriangle, FileSearch, FileSignature,
  Check, CheckCircle, Clock, Info,
} from 'lucide-react';
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip} from 'recharts';
import {useDashboard} from '@/lib/auth-context';

/** Sprint-Aufgaben-Statistik fuer Pie-Chart */
const sprintTaskData = [
  {name: 'To Do', value: 3},
  {name: 'In Progress', value: 2},
  {name: 'Done', value: 6},
];
const TASK_COLORS = ['#e2e8f0', '#818cf8', '#77CF97'];

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
        <div className="font-outfit text-xl font-bold text-slate-800 dark:text-white leading-none">{value}</div>
        <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 leading-tight truncate">{label}</div>
        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">{subtext}</div>
      </div>
    </div>
  );
}

/** Deadlinedaten fuer Admin-Uebersicht */
const deadlines = [
  {title: 'Review applications', date: 'May 2, 2026', badge: '3 days', badgeColor: 'bg-rose-50 dark:bg-rose-500/10 text-rose-500'},
  {title: 'Confirm teams', date: 'May 9, 2026', badge: '10 days', badgeColor: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600'},
  {title: 'Onboarding check', date: 'May 16, 2026', badge: '17 days', badgeColor: 'bg-blue-50 dark:bg-blue-500/10 text-blue-500'},
  {title: 'Voyage starts', date: 'May 23, 2026', badge: '24 days', badgeColor: 'bg-[#77CF97]/10 text-[#77CF97]'},
];

/** Deadlinedaten fuer Admin-Uebersicht */
const pipelineSteps = [
  {
    step: '01', color: 'text-[#77CF97]', btnBg: 'bg-[#77CF97]/10', barColor: 'bg-[#77CF97]',
    title: 'Applications', subtitle: 'Collect & review applications',
    total: '312 TOTAL', progressWidth: '100%',
    stats: [
      {label: 'Pending Review', value: '64', color: 'text-slate-800 dark:text-white'},
      {label: 'Accepted', value: '128', color: 'text-[#77CF97]'},
      {label: 'Rejected', value: '28', color: 'text-rose-500'},
      {label: 'Incomplete', value: '92', color: 'text-[#77CF97]'},
    ],
  },
  {
    step: '02', color: 'text-blue-500', btnBg: 'bg-blue-500/10', barColor: 'bg-blue-500',
    title: 'Matching', subtitle: 'Match & assign participants',
    total: '72 REMAINING', progressWidth: '40%',
    stats: [
      {label: 'Unassigned', value: '72', color: 'text-slate-800 dark:text-white'},
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
      {label: 'Confirmed', value: '6', color: 'text-[#77CF97]'},
      {label: 'Needs Attention', value: '3', color: 'text-rose-500'},
    ],
  },
  {
    step: '04', color: 'text-rose-500', btnBg: 'bg-rose-500/10', barColor: 'bg-rose-500',
    title: 'Onboarding', subtitle: 'Complete required steps',
    total: '61% COMPLETED', progressWidth: '61%',
    stats: [
      {label: 'Completed', value: '79', color: 'text-[#77CF97]'},
      {label: 'In Progress', value: '38', color: 'text-blue-500'},
      {label: 'Missing', value: '19', color: 'text-rose-500'},
    ],
  },
];

/** Aufmerksamkeits-Eintraege fuer Admin */
const attentionItems = [
  {icon: <FileSearch />, color: {bg: 'bg-rose-50 dark:bg-rose-500/10', text: 'text-rose-500'}, title: 'Applications older than 7 days', desc: 'Need review', value: '24'},
  {icon: <AlertTriangle />, color: {bg: 'bg-orange-50 dark:bg-orange-500/10', text: 'text-orange-500'}, title: 'Accepted participants without team', desc: 'Require assignment', value: '16'},
  {icon: <UsersRound />, color: {bg: 'bg-purple-50 dark:bg-purple-500/10', text: 'text-purple-500'}, title: 'Teams missing required role', desc: 'Missing Product Owner or Developer', value: '8'},
  {icon: <FileSignature />, color: {bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-500'}, title: 'Onboarding forms incomplete', desc: 'Participants need to complete', value: '12'},
];

/** Aktivitaets-Eintraege */
const activityItems = [
  {avatar: 'https://i.pravatar.cc/100?img=11', icon: Check, iconColor: {bg: 'bg-[#77CF97]/20', text: 'text-[#77CF97]'}, highlight: 'Daniel Martinez', text: 'was accepted', time: '2 minutes ago'},
  {avatar: 'https://i.pravatar.cc/100?img=4', icon: UsersRound, iconColor: {bg: 'bg-purple-100 dark:bg-purple-500/20', text: 'text-purple-600'}, highlight: 'New team "Pixel Pioneers"', text: 'was created', time: '15 minutes ago'},
  {avatar: 'https://i.pravatar.cc/100?img=5', icon: FileSignature, iconColor: {bg: 'bg-blue-100 dark:bg-blue-500/20', text: 'text-blue-500'}, highlight: 'Sophia Taylor', text: 'submitted onboarding', time: '1 hour ago'},
  {avatar: 'https://i.pravatar.cc/100?img=9', icon: XCircle, iconColor: {bg: 'bg-rose-100 dark:bg-rose-500/20', text: 'text-rose-500'}, highlight: 'Alex Morgan', text: 'was rejected', time: '2 hours ago'},
];

/** Admin-Uebersicht: Metriken, Deadlines, Pipeline, Aufmerksamkeit, Aktivitaet */
export function AdminOverview() {
  return (
    <>
      {/* Obere Reihe: Metriken & Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Linkes Panel: Begruessung + Metriken */}
        <div className="lg:col-span-8 bg-white dark:bg-[#1a1b24] rounded-[24px] border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-8 flex flex-col justify-between">
          <div className="mb-6">
            <h1 className="text-[28px] font-outfit font-medium text-slate-900 dark:text-white mb-1 tracking-tight">Good morning, Jane. <span className="animate-wave">👋</span></h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Voyage <span className="text-rose-500 font-medium">51</span> is in application review.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-1">
            <MetricBlock icon={<FileText />} color={{bg: 'bg-[#77CF97]/10', text: 'text-[#77CF97]'}} value="312" label="Applications" subtext="+24 since yesterday" />
            <MetricBlock icon={<User />} color={{bg: 'bg-blue-500/10', text: 'text-blue-500'}} value="128" label="Accepted" subtext="41% of total" />
            <MetricBlock icon={<Users />} color={{bg: 'bg-purple-500/10', text: 'text-purple-500'}} value="64" label="Pending Review" subtext="20% of total" />
            <MetricBlock icon={<XCircle />} color={{bg: 'bg-rose-500/10', text: 'text-rose-500'}} value="28" label="Rejected" subtext="9% of total" />
            <MetricBlock icon={<UsersRound />} color={{bg: 'bg-amber-500/10', text: 'text-amber-500'}} value="18" label="Teams Drafted" subtext="65 members" />
          </div>
        </div>

        {/* Rechtes Panel: Kommende Deadlines */}
        <div className="lg:col-span-4 bg-white dark:bg-[#1a1b24] rounded-[24px] border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-slate-800 dark:text-white">Upcoming Deadlines</h3>
            <a href="#" className="text-xs font-medium text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">View all</a>
          </div>
          <div className="space-y-4 flex-1">
            {deadlines.map((d, i) => (
              <div key={i} className="flex items-center gap-4 py-1">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-slate-500 border border-slate-100/50 dark:border-white/5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-800 dark:text-white">{d.title}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{d.date}</div>
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
          <h2 className="font-semibold text-slate-900 dark:text-white text-lg">Voyage Pipeline</h2>
          <a href="#" className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">View full pipeline</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {pipelineSteps.map((p, i) => (
            <div key={i} className="bg-white dark:bg-[#1a1b24] rounded-[24px] border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6 relative flex flex-col h-full hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-shadow">
              <div className="flex gap-3.5 items-start mb-6">
                <div className={`font-outfit text-[40px] leading-none tracking-tighter font-light ${p.color}`}>{p.step}</div>
                <div className="pt-1">
                  <div className="font-semibold text-slate-800 dark:text-white text-sm leading-tight mb-1">{p.title}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">{p.subtitle}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${p.barColor}`} style={{width: p.progressWidth}}></div>
                </div>
                <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap uppercase tracking-wider">{p.total}</div>
              </div>
              <div className="space-y-3 mb-8 flex-1">
                {p.stats.map((s, j) => (
                  <div key={j} className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">{s.label}</span>
                    <span className={`font-semibold ${s.color || 'text-slate-900 dark:text-white'}`}>{s.value}</span>
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
        <div className="lg:col-span-6 bg-white dark:bg-[#1a1b24] rounded-[24px] border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
          <div className="flex items-center justify-between mb-6 px-1">
            <h3 className="font-semibold text-slate-900 dark:text-white">Needs Attention</h3>
          </div>
          <div className="space-y-1">
            {attentionItems.map((item, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-50 dark:border-white/5 last:border-0 last:pb-0 cursor-pointer group">
                <div className={`p-2.5 rounded-xl border border-rose-100/50 dark:border-white/10 shrink-0 shadow-sm ${item.color.bg} ${item.color.text}`}>
                  <span className="w-4 h-4">{item.icon}</span>
                </div>
                <div className="flex-1 pt-0.5">
                  <div className="text-sm font-medium text-slate-800 dark:text-white group-hover:text-rose-500 transition-colors mb-0.5">{item.title}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.desc}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs font-semibold text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-md">{item.value}</div>
                  <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-300 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Aktivitaet */}
        <div className="lg:col-span-6 bg-white dark:bg-[#1a1b24] rounded-[24px] border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
          <div className="flex items-center justify-between mb-6 px-1">
            <h3 className="font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
            <a href="#" className="text-xs font-medium text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">View all</a>
          </div>
          <div className="space-y-1">
            {activityItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex gap-4 items-start py-3 border-b border-slate-50 dark:border-white/5 last:border-0 last:pb-0 cursor-pointer group">
                  <div className="relative shrink-0 mt-0.5">
                    <img src={item.avatar} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10" alt="avatar" />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-[#1a1b24] flex items-center justify-center ${item.iconColor.bg}`}>
                      <Icon className={`w-3 h-3 ${item.iconColor.text}`} />
                    </div>
                  </div>
                  <div className="pt-0.5">
                    <div className="text-sm text-slate-600 dark:text-slate-300 leading-snug">
                      <span className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.highlight}</span> {item.text}
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-medium">{item.time}</div>
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

/** Mock-Daten fuer Participant-Overview */
const MOCK_PARTICIPANT = {
  name: 'Olivia',
  team: 'Team Atlas',
  sprint: {name: 'Sprint 3', remaining: 8, percent: 64, todo: 8, inProgress: 5, done: 23},
  meetings: [
    {month: 'May', day: 12, title: 'Daily Standup', time: 'Today, 18:30', platform: 'Discord', platformIcon: '💬'},
    {month: 'May', day: 13, title: 'Sprint Planning', time: 'Tomorrow, 19:00', platform: 'Zoom', platformIcon: '📹'},
    {month: 'May', day: 16, title: 'Mentor Check-in', time: 'Friday, 17:00', platform: 'Google Meet', platformIcon: '🎥'},
  ],
  tasks: {assigned: 6, inReview: 2, blocked: 1},
  onboarding: {completed: 3, total: 6, nextStep: 'Confirm Availability'},
  activity: [
    {text: 'Team Atlas completed 2 tasks', sub: 'Implement user profile page and fix navigation bug', time: '7h ago', color: 'text-[#77CF97]'},
    {text: 'Daniel commented on project board', sub: 'Left feedback on the API integration task', time: '2h ago', color: 'text-blue-500'},
    {text: 'New commit pushed to repository', sub: 'Update auth services and add tests', time: '5h ago', color: 'text-purple-500'},
    {text: 'Onboarding reminder sent', sub: 'Don\'t forget to confirm your availability', time: '1d ago', color: 'text-amber-500'},
  ],
  teamMembers: ['32', '11', '5', '7'],
};

/** Participant-Uebersicht: Sprint-Progress, Meetings, Tasks, Onboarding, Team, Activity */
export function ParticipantOverview() {
  const {setCurrentView} = useDashboard();
  const t = MOCK_PARTICIPANT;

  return (
    <div className="space-y-6">
      {/* Begruessung */}
      <div>
        <h1 className="text-[28px] font-outfit font-medium text-slate-900 dark:text-white mb-1 tracking-tight">
          Welcome back, {t.name}! <span className="animate-wave">👋</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Here is what is happening with your team and tasks today.</p>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#77CF97]/10 text-[#77CF97] text-xs font-semibold border border-[#77CF97]/20">
          <CheckCircle className="w-3 h-3" /> {t.sprint.name} Active
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-100 dark:border-blue-500/20">
          <UsersRound className="w-3 h-3" /> {t.team}
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold border border-purple-100 dark:border-purple-500/20">
          <User className="w-3 h-3" /> Participant
        </span>
      </div>

      {/* Obere Reihe: Sprint Progress + Meetings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sprint Progress */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1a1b24] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Sprint Progress</h3>
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-lg font-bold text-slate-900 dark:text-white">{t.sprint.name} is Active</span>
            <span className="w-2 h-2 rounded-full bg-[#77CF97]" />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Your team <strong className="text-slate-800 dark:text-white">{t.team}</strong> has <strong className="text-slate-800 dark:text-white">{t.sprint.remaining} tasks</strong> remaining.
          </p>

          <div className="flex items-center gap-8">
            {/* Pie-Chart */}
            <div className="relative w-40 h-40 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sprintTaskData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value" stroke="none">
                    {sprintTaskData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={TASK_COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-slate-800 dark:text-white">{t.sprint.percent}%</span>
                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Complete</span>
              </div>
            </div>

            {/* Stats + Button */}
            <div className="flex-1 space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-white/20" /> <span className="text-slate-600 dark:text-slate-300">To Do</span></div>
                  <span className="font-semibold text-slate-800 dark:text-white">{t.sprint.todo}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-indigo-400" /> <span className="text-slate-600 dark:text-slate-300">In Progress</span></div>
                  <span className="font-semibold text-slate-800 dark:text-white">{t.sprint.inProgress}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#77CF97]" /> <span className="text-slate-600 dark:text-slate-300">Done</span></div>
                  <span className="font-semibold text-slate-800 dark:text-white">{t.sprint.done}</span>
                </div>
              </div>
              <button
                onClick={() => setCurrentView('teams')}
                className="w-full py-2.5 bg-[#0b0c10] dark:bg-[#77CF97] text-white rounded-xl text-sm font-medium hover:bg-slate-800 dark:hover:bg-[#5ab87e] transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                Go to Team Space <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="bg-white dark:bg-[#1a1b24] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Upcoming Meetings</h3>
            <a href="#" className="text-xs font-medium text-[#77CF97] hover:underline">View Calendar ↗</a>
          </div>
          <div className="space-y-3 flex-1">
            {t.meetings.map((m, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors cursor-pointer">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100/50 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold uppercase">{m.month}</span>
                  <span className="text-sm font-bold leading-none mt-0.5">{m.day}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800 dark:text-white truncate">{m.title}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{m.time}</div>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">{m.platformIcon} {m.platform}</span>
              </div>
            ))}
          </div>
          <a href="#" className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-center transition-colors">
            View All Meetings →
          </a>
        </div>
      </div>

      {/* Untere Reihe: 3 Spalten */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spalte 1: My Tasks + My Onboarding */}
        <div className="space-y-6">
          {/* My Tasks */}
          <div className="bg-white dark:bg-[#1a1b24] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white">My Tasks</h3>
              <a href="#" className="text-xs font-medium text-[#77CF97] hover:underline">View Tasks</a>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-center">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/15 flex items-center justify-center mx-auto mb-2">
                  <User className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">{t.tasks.assigned}</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500">Assigned</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-center">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/15 flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">{t.tasks.inReview}</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500">In Review</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-center">
                <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-500/15 flex items-center justify-center mx-auto mb-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">{t.tasks.blocked}</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500">Blocked</div>
              </div>
            </div>
          </div>

          {/* My Onboarding */}
          <div className="bg-white dark:bg-[#1a1b24] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white">My Onboarding</h3>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="flex items-center gap-4 mb-3">
              <div className="relative w-14 h-14 shrink-0">
                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-100 dark:text-white/10" />
                  <circle cx="28" cy="28" r="24" fill="none" stroke="#77CF97" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${0.5 * 2 * Math.PI * 24} ${2 * Math.PI * 24}`} />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-800 dark:text-white">50%</span>
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{t.onboarding.completed} of {t.onboarding.total} steps completed</div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Keep going! You&apos;re halfway there.</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                <div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500">Next step</div>
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-200">{t.onboarding.nextStep}</div>
                </div>
              </div>
              <button
                onClick={() => setCurrentView('onboarding')}
                className="px-3 py-1.5 bg-[#0b0c10] dark:bg-[#77CF97] text-white rounded-lg text-xs font-medium hover:bg-slate-800 dark:hover:bg-[#5ab87e] transition-colors cursor-pointer"
              >
                Continue <ChevronRight className="w-3 h-3 inline" />
              </button>
            </div>
            <a href="#" className="block mt-3 text-xs font-medium text-[#77CF97] hover:underline text-center">
              View Onboarding Checklist →
            </a>
          </div>
        </div>

        {/* Spalte 2: Team Activity + My Team */}
        <div className="space-y-6">
          {/* Team Activity */}
          <div className="bg-white dark:bg-[#1a1b24] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Team Activity</h3>
              <a href="#" className="text-xs font-medium text-[#77CF97] hover:underline">View Activity</a>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#77CF97]/10 flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5 text-[#77CF97]" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">3 updates today</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Git/PIR repo active</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Latest: 2 hours ago</div>
              </div>
            </div>
          </div>

          {/* My Team */}
          <div className="bg-white dark:bg-[#1a1b24] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white">My Team</h3>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/15 flex items-center justify-center shrink-0">
                <UsersRound className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{t.team}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#77CF97]/10 text-[#77CF97] border border-[#77CF97]/20">Active</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 mb-3">
              {t.teamMembers.map((id, i) => (
                <img key={i} src={`https://i.pravatar.cc/100?img=${id}`} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#1a1b24] bg-slate-100 dark:bg-white/10" alt="" />
              ))}
              <span className="w-8 h-8 rounded-full border-2 border-white dark:border-[#1a1b24] bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 text-[10px] font-medium flex items-center justify-center">+1</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              <span className="font-medium">Roles in team:</span>
              <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium">Frontend</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium">Backend</span>
              <span className="px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 font-medium">Design</span>
            </div>
            <button
              onClick={() => setCurrentView('teams')}
              className="w-full py-2 bg-[#0b0c10] dark:bg-[#77CF97] text-white rounded-xl text-xs font-medium hover:bg-slate-800 dark:hover:bg-[#5ab87e] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              View Team <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Spalte 3: Sprint Health + Recent Activity */}
        <div className="space-y-6">
          {/* Sprint Health */}
          <div className="bg-white dark:bg-[#1a1b24] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Sprint Health</h3>
              <a href="#" className="text-xs font-medium text-[#77CF97] hover:underline">View Details</a>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Status</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#77CF97]" />
                  <span className="text-sm font-bold text-[#77CF97]">On Track</span>
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Everything looks good</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Overlap</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">4.5h</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Daily average</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-[#1a1b24] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Recent Activity</h3>
              <a href="#" className="text-xs font-medium text-[#77CF97] hover:underline">View All Activity ↗</a>
            </div>
            <div className="space-y-3">
              {t.activity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${a.color}`} />
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-slate-800 dark:text-white leading-snug">{a.text}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{a.sub}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{a.time}</div>
                  </div>
                </div>
              ))}
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
        <h1 className="text-[28px] font-outfit font-medium text-slate-900 dark:text-white mb-1 tracking-tight">Application Status</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Track your application for Voyage 51.</p>
      </div>

      <div className="bg-white dark:bg-[#1a1b24] rounded-[24px] border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Application</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Submitted for Voyage 51 — Application Review</p>
          </div>
        </div>

        {/* Status-Fortschritt */}
        <div className="flex items-center gap-2 mb-8">
          {['Submitted', 'Under Review', 'Decision', 'Onboarding'].map((step, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                i === 0 ? 'bg-[#77CF97] text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-slate-500'
              }`}>
                {i === 0 ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs font-medium ${i === 0 ? 'text-[#77CF97]' : 'text-slate-400 dark:text-slate-500'}`}>{step}</span>
              {i < 3 && <div className={`flex-1 h-[2px] ${i === 0 ? 'bg-[#77CF97]' : 'bg-slate-200 dark:bg-white/10'}`}></div>}
            </div>
          ))}
        </div>

        {/* Bewerbungsdetails */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Applied Role</div>
              <div className="text-sm font-medium text-slate-800 dark:text-white">Frontend Developer</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Experience Level</div>
              <div className="text-sm font-medium text-slate-800 dark:text-white">Advanced — 4 years</div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Submitted</div>
              <div className="text-sm font-medium text-slate-800 dark:text-white">May 1, 2026</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Status</div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold border border-amber-100 dark:border-amber-500/20">
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
