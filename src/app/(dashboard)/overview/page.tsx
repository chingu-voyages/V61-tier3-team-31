'use client';

import {
  FileText, User, Users, XCircle, UsersRound, Calendar,
  ChevronRight, AlertTriangle, FileSearch, FileSignature,
  Check, CheckCircle, Clock, Info,
} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useDashboard} from '@/lib/auth-context';

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
/**
 * Pipeline-Schritte fuer die Admin-Uebersicht.
 * Jedes Schritt definiert eine Navigationsroute fuer den Klick.
 */
const pipelineSteps: Array<{
  step: string; color: string; btnBg: string; barColor: string;
  title: string; subtitle: string; route: string;
  total: string; progressWidth: string;
  stats: Array<{label: string; value: string; color?: string}>;
}> = [
  {
    step: '01', color: 'text-[#77CF97]', btnBg: 'bg-[#77CF97]/10', barColor: 'bg-[#77CF97]',
    title: 'Applications', subtitle: 'Collect & review applications', route: '/applications',
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
    title: 'Matching', subtitle: 'Match & assign participants', route: '/matching',
    total: '72 REMAINING', progressWidth: '40%',
    stats: [
      {label: 'Unassigned', value: '72', color: 'text-slate-800 dark:text-white'},
      {label: 'Partial Matches', value: '34', color: 'text-blue-500'},
      {label: 'Matched', value: '56', color: 'text-purple-600'},
    ],
  },
  {
    step: '03', color: 'text-purple-600', btnBg: 'bg-purple-600/10', barColor: 'bg-purple-600',
    title: 'Teams', subtitle: 'Form & confirm teams', route: '/teams',
    total: '18 TEAMS', progressWidth: '70%',
    stats: [
      {label: 'Draft Teams', value: '12', color: 'text-purple-600'},
      {label: 'Confirmed', value: '6', color: 'text-[#77CF97]'},
      {label: 'Needs Attention', value: '3', color: 'text-rose-500'},
    ],
  },
  {
    step: '04', color: 'text-rose-500', btnBg: 'bg-rose-500/10', barColor: 'bg-rose-500',
    title: 'Onboarding', subtitle: 'Complete required steps', route: '/onboarding',
    total: '61% COMPLETED', progressWidth: '61%',
    stats: [
      {label: 'Completed', value: '79', color: 'text-[#77CF97]'},
      {label: 'In Progress', value: '38', color: 'text-blue-500'},
      {label: 'Missing', value: '19', color: 'text-rose-500'},
    ],
  },
];

/** Aufmerksamkeits-Eintraege fuer Admin mit Navigationsrouten */
const attentionItems: Array<{
  icon: React.ReactNode; color: {bg: string; text: string};
  title: string; desc: string; value: string; route: string;
}> = [
  {icon: <FileSearch />, color: {bg: 'bg-rose-50 dark:bg-rose-500/10', text: 'text-rose-500'}, title: 'Applications older than 7 days', desc: 'Need review', value: '24', route: '/applications'},
  {icon: <AlertTriangle />, color: {bg: 'bg-orange-50 dark:bg-orange-500/10', text: 'text-orange-500'}, title: 'Accepted participants without team', desc: 'Require assignment', value: '16', route: '/participants'},
  {icon: <UsersRound />, color: {bg: 'bg-purple-50 dark:bg-purple-500/10', text: 'text-purple-500'}, title: 'Teams missing required role', desc: 'Missing Product Owner or Developer', value: '8', route: '/teams'},
  {icon: <FileSignature />, color: {bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-500'}, title: 'Onboarding forms incomplete', desc: 'Participants need to complete', value: '12', route: '/onboarding'},
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
  const router = useRouter();

  const navigate = (route: string) => {
    router.push(route);
  };

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
          <div className="grid grid-cols-2 gap-3">
            <MetricBlock icon={<FileText />} color={{bg: 'bg-[#77CF97]/10', text: 'text-[#77CF97]'}} value="312" label="Applications" subtext="+24 since yesterday" />
            <MetricBlock icon={<User />} color={{bg: 'bg-blue-500/10', text: 'text-blue-500'}} value="128" label="Accepted" subtext="41% of total" />
            <MetricBlock icon={<Users />} color={{bg: 'bg-purple-500/10', text: 'text-purple-500'}} value="64" label="Pending Review" subtext="20% of total" />
            <MetricBlock icon={<XCircle />} color={{bg: 'bg-rose-500/10', text: 'text-rose-500'}} value="28" label="Rejected" subtext="9% of total" />
          </div>
        </div>

        {/* Rechtes Panel: Kommende Deadlines */}
        <div className="lg:col-span-4 bg-white dark:bg-[#1a1b24] rounded-[24px] border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-slate-800 dark:text-white">Upcoming Deadlines</h3>
            <button onClick={() => navigate('/calendar')} className="text-xs font-medium text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer">View all</button>
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
          <button onClick={() => navigate('/matching')} className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer">View full pipeline</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {pipelineSteps.map((p, i) => (
            <div key={i} onClick={() => navigate(p.route)} className="bg-white dark:bg-[#1a1b24] rounded-[24px] border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6 relative flex flex-col h-full hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-shadow cursor-pointer group/card">
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
              <div className={`absolute bottom-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${p.btnBg} ${p.color} group-hover/card:scale-110`}>
                <ChevronRight className="w-4 h-4" />
              </div>
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
              <div key={i} onClick={() => navigate(item.route)} className="flex items-center gap-4 py-3 border-b border-slate-50 dark:border-white/5 last:border-0 last:pb-0 cursor-pointer group">
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
            <button onClick={() => navigate('/analytics')} className="text-xs font-medium text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer">View all</button>
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

/**
 * Mock-Daten fuer den Participant-Dashboard.
 * Enthaelt Team, Onboarding-Fortschritt, Termine, Quick Actions und Announcements.
 */
const MOCK_PARTICIPANT = {
  name: 'Olivia',
  team: {
    name: 'Team Atlas',
    status: 'active' as const,
    members: [
      {avatar: '32', name: 'Olivia Chen', role: 'Frontend', timezone: 'UTC-7', isYou: true},
      {avatar: '11', name: 'Daniel Martinez', role: 'PM', timezone: 'UTC-6'},
      {avatar: '5', name: 'Emma Wilson', role: 'Design', timezone: 'UTC-5'},
      {avatar: '7', name: 'Michael Davis', role: 'Backend', timezone: 'UTC+1'},
    ],
    memberExtra: '+2',
    roles: ['PM', 'Frontend', 'Backend', 'Design'],
    sharedOverlap: '4.5h/day',
  },
  onboarding: {
    completed: 3,
    total: 6,
    percent: 50,
    nextStep: 'Confirm Availability',
  },
  upcomingDates: [
    {month: 'May', day: 12, title: 'Daily Standup', time: 'Today, 18:30'},
    {month: 'May', day: 13, title: 'Sprint Planning', time: 'Tomorrow, 19:00'},
    {month: 'May', day: 16, title: 'Mentor Check-in', time: 'Friday, 17:00'},
    {month: 'Jun', day: 1, title: 'Demo Day', time: '3 weeks away'},
  ],
  quickActions: [
    {label: 'Continue Onboarding', icon: CheckCircle, route: 'onboarding' as const},
    {label: 'Update My Profile', icon: User, route: 'profile' as const},
    {label: 'View My Team', icon: UsersRound, route: 'teams' as const},
  ],
  announcements: [
    {text: 'Team Atlas completed onboarding', time: '2h ago'},
    {text: 'Mentorship sessions start next week', time: '1d ago'},
    {text: 'Voyage 51 Demo Day: Jun 1', time: '3d ago'},
  ],
};

/**
 * Fortschrittsring fuer das Onboarding (reines SVG, kein Recharts).
 * Zeigt den prozentualen Abschluss als Kreisbogen.
 */
function ProgressRing({percent, size = 80, strokeWidth = 5}: {
  percent: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{width: size, height: size}}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100 dark:text-white/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#77CF97"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xl font-bold text-slate-800 dark:text-white">{percent}%</span>
        <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Complete</span>
      </div>
    </div>
  );
}

/** Participant-Uebersicht: Onboarding, Team, Termine, Quick Actions, Announcements */
export function ParticipantOverview() {
  const {setCurrentView} = useDashboard();
  const router = useRouter();
  const t = MOCK_PARTICIPANT;

  /** Statusmeldung dynamisch je nach Onboarding-Fortschritt */
  const statusMessage = t.onboarding.percent === 100
    ? "You're all set!"
    : `Next up: ${t.onboarding.nextStep}.`;

  return (
    <div className="space-y-6">
      {/* Begrussung + Badges */}
      <div>
        <h1 className="text-[28px] font-outfit font-medium text-slate-900 dark:text-white mb-1 tracking-tight">
          Welcome back, {t.name}! <span className="animate-wave">&#x1f44b;</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">{statusMessage}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#77CF97]/10 text-[#77CF97] text-xs font-semibold border border-[#77CF97]/20">
          <CheckCircle className="w-3 h-3" /> {t.team.name} &bull; {t.team.status}
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-100 dark:border-blue-500/20">
          <CheckCircle className="w-3 h-3" /> Onboarding: {t.onboarding.completed}/{t.onboarding.total}
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold border border-purple-100 dark:border-purple-500/20">
          <User className="w-3 h-3" /> Participant
        </span>
      </div>

      {/* Bento-Grid: asymmetrische Karten mit variablen Groessen */}
      {/*
        Layout (4 Spalten, 2 Zeilen):
        ┌───────────────────┬─────────┐
        │  Onboarding (3c)  │  Team   │
        │                   │  (1c,   │
        │                   │  2r)    │
        ├────────┬──────────┤         │
        │ Dates  │ Quick    ├─────────┤
        │ (1c)   │ Actions  │ News    │
        │        │ (1c)     │ (1c)    │
        └────────┴──────────┴─────────┘
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-[auto_1fr] gap-4 auto-rows-min">

        {/* Onboarding — breite Hero-Karte, 3 Spalten */}
        <div className="lg:col-span-3 bg-white dark:bg-[#1a1b24] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-5">Onboarding Progress</h3>
          <div className="flex items-center gap-6">
            <ProgressRing percent={t.onboarding.percent} size={100} strokeWidth={6} />
            <div className="flex-1 space-y-3">
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{t.onboarding.completed} of {t.onboarding.total} steps completed</div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{statusMessage}</p>
              </div>
              <button
                onClick={() => setCurrentView('onboarding')}
                className="px-4 py-2 bg-[#0b0c10] dark:bg-[#77CF97] text-white dark:text-[#0b0c10] rounded-xl text-xs font-medium hover:bg-slate-800 dark:hover:bg-[#5ab87e] transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                Continue <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* My Team — hohe Karte, 1 Spalte, 2 Zeilen */}
        <div className="lg:col-span-1 lg:row-span-2 bg-white dark:bg-[#1a1b24] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white">My Team</h3>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/15 flex items-center justify-center shrink-0">
              <UsersRound className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{t.team.name}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#77CF97]/10 text-[#77CF97] border border-[#77CF97]/20 capitalize shrink-0">{t.team.status}</span>
              </div>
            </div>
          </div>

          {/* Avatar-Stack */}
          <div className="flex items-center gap-1 mb-4">
            {t.team.members.map((m, i) => (
              <img key={i} src={`https://i.pravatar.cc/100?img=${m.avatar}`} className="w-9 h-9 rounded-full border-2 border-white dark:border-[#1a1b24] bg-slate-100 dark:bg-white/10" alt={m.name} title={`${m.name} (${m.role})`} />
            ))}
            <span className="w-9 h-9 rounded-full border-2 border-white dark:border-[#1a1b24] bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 text-[10px] font-medium flex items-center justify-center">{t.team.memberExtra}</span>
          </div>

          {/* Rollen-Tags */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mb-3 flex-wrap">
            {t.team.roles.map((role, i) => (
              <span key={i} className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium">{role}</span>
            ))}
          </div>

          {/* Shared Overlap */}
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-4">
            Shared Overlap: <span className="font-semibold text-slate-700 dark:text-slate-200">{t.team.sharedOverlap}</span>
          </div>

          <div className="mt-auto">
            <button
              onClick={() => setCurrentView('teams')}
              className="w-full py-2 bg-[#0b0c10] dark:bg-[#77CF97] text-white dark:text-[#0b0c10] rounded-xl text-xs font-medium hover:bg-slate-800 dark:hover:bg-[#5ab87e] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              View Team Space <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Upcoming Dates — kompakte Karte */}
        <div className="bg-white dark:bg-[#1a1b24] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Upcoming Dates</h3>
            <button onClick={() => setCurrentView('calendar')} className="text-[10px] font-medium text-[#77CF97] hover:underline cursor-pointer">View All</button>
          </div>
          <div className="space-y-2.5 flex-1">
            {t.upcomingDates.slice(0, 3).map((d, i) => (
              <div key={i} className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors cursor-pointer">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100/50 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[8px] font-bold uppercase leading-none">{d.month}</span>
                  <span className="text-xs font-bold leading-none mt-0.5">{d.day}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-800 dark:text-white truncate">{d.title}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500">{d.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions — kompakte Karte */}
        <div className="bg-white dark:bg-[#1a1b24] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {t.quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <button
                  key={i}
                  onClick={() => setCurrentView(action.route)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer group"
                >
                  <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#77CF97] transition-colors" />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{action.label}</span>
                  <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600 ml-auto group-hover:text-slate-500 dark:group-hover:text-slate-300 transition-colors" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Announcements — kompakte Karte */}
        <div className="bg-white dark:bg-[#1a1b24] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">Announcements</h3>
          <div className="space-y-3">
            {t.announcements.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-[#77CF97]" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-slate-800 dark:text-white leading-snug">{item.text}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{item.time}</div>
                </div>
              </div>
            ))}
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

/** Haupt-Overview-Seite: waehlt Ansicht basierend auf der Rolle und dem Status */
export default function OverviewPage() {
  const {role, status} = useDashboard();
  if (role === 'admin') return <AdminOverview />;
  if (status === 'participant') return <ParticipantOverview />;
  return <ApplicantOverview />;
}
