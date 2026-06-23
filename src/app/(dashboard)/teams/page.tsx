'use client';

import {
  CheckCircle, AlertTriangle, Clock, Search, Plus,
  MessageSquare, ChevronRight, UserPlus, Database,
  Monitor, History, Copy, Check, ArrowUpRight,
  Users, ExternalLink, FileText, Info, Activity,
} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useDashboard} from '@/lib/auth-context';

/** Mock-Teams fuer Admin-Ansicht */
const adminTeams = [
  {id: 'team-nebula', name: 'Nebula Builders', tier: 'Tier 2', domain: 'E-Commerce', emoji: '🌌', bg: 'bg-indigo-50 dark:bg-indigo-500/10', textColor: 'text-indigo-600 dark:text-indigo-400', status: 'Active', statusStyle: 'bg-[#77CF97]/10 text-[#77CF97] border border-[#77CF97]/20', statusIcon: CheckCircle, description: 'Building a decentralized marketplace for digital assets with cross-chain compatibility and zero gas fees.', progress: 75, barColor: 'bg-indigo-500', members: ['11', '12', '13'], extra: '+1'},
  {id: 'team-apollo', name: 'Apollo Strike', tier: 'Tier 3', domain: 'Developer Tools', emoji: '🚀', bg: 'bg-rose-50 dark:bg-rose-500/10', textColor: 'text-rose-600 dark:text-rose-400', status: 'At Risk', statusStyle: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20', statusIcon: AlertTriangle, description: 'An AI-powered VS Code extension for real-time refactoring and style guide enforcement for Next.js.', progress: 30, barColor: 'bg-rose-500', members: ['14', '15'], extra: ''},
  {id: 'team-flora', name: 'Flora Health', tier: 'Tier 1', domain: 'HealthTech', emoji: '🌿', bg: 'bg-emerald-50 dark:bg-emerald-500/10', textColor: 'text-emerald-600 dark:text-emerald-400', status: 'Active', statusStyle: 'bg-[#77CF97]/10 text-[#77CF97] border border-[#77CF97]/20', statusIcon: CheckCircle, description: 'Mental health journal app utilizing sentiment analysis to track mood trends and recommend mindfulness exercises.', progress: 90, barColor: 'bg-emerald-500', members: ['17', '18', '19'], extra: ''},
  {id: 'team-bolt', name: 'Bolt Finance', tier: 'Tier 2', domain: 'FinTech', emoji: '⚡️', bg: 'bg-amber-50 dark:bg-amber-500/10', textColor: 'text-amber-600 dark:text-amber-400', status: 'Active', statusStyle: 'bg-[#77CF97]/10 text-[#77CF97] border border-[#77CF97]/20', statusIcon: CheckCircle, description: 'Micro-budgeting tool aiming to help college students automatically round up savings across multiple bank accounts.', progress: 55, barColor: 'bg-amber-500', members: ['20', '21', '22', '23'], extra: ''},
  {id: 'team-ocean', name: 'Ocean Data', tier: 'Tier 3', domain: 'Data Vis', emoji: '🌊', bg: 'bg-cyan-50 dark:bg-cyan-500/10', textColor: 'text-cyan-600 dark:text-cyan-400', status: 'Forming', statusStyle: 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-white/10', statusIcon: Clock, description: 'Visualizing open-source marine data to track coral bleaching events and climate impact.', progress: 10, barColor: 'bg-cyan-500', members: ['24', '25'], extra: ''},
  {id: 'team-pixel', name: 'Pixel Pirates', tier: 'Tier 2', domain: 'Gaming', emoji: '🎮', bg: 'bg-purple-50 dark:bg-purple-500/10', textColor: 'text-purple-600 dark:text-purple-400', status: 'Active', statusStyle: 'bg-[#77CF97]/10 text-[#77CF97] border border-[#77CF97]/20', statusIcon: CheckCircle, description: 'Browser-based multiplayer trivia game using web sockets and real-time question generation via LLM.', progress: 100, barColor: 'bg-purple-500', members: ['26', '27', '28'], extra: ''},
];

/** Admin-Ansicht: Team-Verzeichnis mit Karten */
function AdminTeams() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-outfit font-medium text-slate-900 dark:text-white mb-1 tracking-tight">Teams Directory</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Monitor team progress, project status, and engagement.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white dark:bg-[#1a1b24] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
            Sprints
          </button>
          <button className="px-4 py-2 bg-[#0b0c10] dark:bg-[#77CF97] text-white dark:text-[#0b0c10] rounded-xl text-sm font-medium hover:bg-slate-800 dark:hover:bg-[#5ab87e] transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
            <Plus className="w-4 h-4" /> New Team
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-px">
        <div className="flex gap-2">
          <button className="px-4 py-2 border-b-2 border-slate-900 dark:border-white text-slate-900 dark:text-white font-medium text-sm cursor-pointer shadow-sm">All Teams (18)</button>
          <button className="px-4 py-2 border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium text-sm cursor-pointer">Active (15)</button>
          <button className="px-4 py-2 border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium text-sm cursor-pointer">At Risk (2)</button>
          <button className="px-4 py-2 border-b-2 border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium text-sm cursor-pointer">Completed (1)</button>
        </div>
        <div className="relative mb-2">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input type="text" placeholder="Search teams..." className="w-64 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-300 dark:focus:border-white/20 transition-colors shadow-sm" />
        </div>
      </div>

      {/* Teams-Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {adminTeams.map((team, i) => {
          const TeamIcon = team.statusIcon;
          return (
            <div key={i} onClick={() => router.push(`/teams/${team.id}`)} className="bg-white dark:bg-[#1a1b24] rounded-[24px] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-slate-300 dark:hover:border-white/20 transition-all p-6 flex flex-col cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-3 items-center">
                  <div className={`w-12 h-12 rounded-2xl ${team.bg} flex items-center justify-center font-outfit font-bold text-xl ${team.textColor}`}>{team.emoji}</div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{team.name}</h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{team.tier} • {team.domain}</div>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${team.statusStyle}`}>
                  <TeamIcon className="w-3 h-3" /> {team.status}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 line-clamp-2">{team.description}</p>
              <div className="mt-auto">
                <div className="flex items-center justify-between mb-3 text-sm">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Sprint 2 Progress</span>
                  <span className="text-slate-800 dark:text-white font-bold">{team.progress}%</span>
                </div>
                <div className="relative w-full h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden mb-6">
                  <div className={`absolute top-0 left-0 h-full ${team.barColor} rounded-full`} style={{width: `${team.progress}%`}}></div>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/10 pt-4">
                  <div className="flex -space-x-2">
                    {team.members.slice(0, 3).map((m, j) => (
                      <img key={j} src={`https://i.pravatar.cc/100?img=${m}`} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#1a1b24] bg-slate-100 dark:bg-white/10" alt="" />
                    ))}
                    {team.extra && (
                      <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#1a1b24] bg-slate-50 dark:bg-white/10 text-slate-500 dark:text-slate-400 text-[10px] font-medium flex items-center justify-center">{team.extra}</div>
                    )}
                  </div>
                  <button onClick={(e) => {e.stopPropagation(); router.push(`/teams/${team.id}`)}} className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">View Details</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Mock-Daten fuer Team Space (Participant-Ansicht) */
const MOCK_TEAM = {
  name: 'Team Atlas',
  voyage: 'Voyage 54',
  domain: 'Full-stack product team',
  status: 'active' as const,
  members: [
    {name: 'Olivia Chen', avatar: '32', role: 'Frontend', timezone: 'UTC-7', availability: 'Mon-Thu, 18:00-22:00', github: 'oliviachen', isYou: true},
    {name: 'Daniel Martinez', avatar: '11', role: 'PM', timezone: 'UTC-6', availability: 'Weekdays, 17:00 - 20:00', github: 'dmartinez'},
    {name: 'Emma Wilson', avatar: '5', role: 'Design', timezone: 'UTC-5', availability: 'Tue-Sat evenings', github: 'emmawilson'},
    {name: 'Michael Davis', avatar: '7', role: 'Backend', timezone: 'UTC+1', availability: 'Weekends + evenings', github: 'michaeldavis'},
    {name: 'Sophia Taylor', avatar: '9', role: 'Backend', timezone: 'UTC+0', availability: 'Mon-Fri, 18:00 - 22:00', github: 'sophiataylor'},
    {name: 'James Liu', avatar: '14', role: 'Fullstack', timezone: 'UTC+8', availability: 'Sat-Sun mornings', github: 'jamesliu'},
  ],
  roleCoverage: [
    {role: 'PM', name: 'Daniel Martinez', filled: true},
    {role: 'Frontend', name: 'Olivia Chen', filled: true},
    {role: 'Backend', name: 'Sophia Taylor', filled: true},
    {role: 'Design', name: 'Emma Wilson', filled: true},
    {role: 'Product', name: null, filled: false},
  ],
  avgTimezone: 'UTC-5',
  sharedOverlap: '4.5h/day',
  openRole: 'Product',
  resources: [
    {label: 'GitHub Repository', sublabel: 'team-atlas/product', icon: 'git'},
    {label: 'Discord Channel', sublabel: '#team-atlas', icon: 'chat'},
    {label: 'Project Board', sublabel: 'Linear project', icon: 'board'},
    {label: 'Meeting Notes', sublabel: 'team-atlas-notes', icon: 'doc'},
  ],
};

/**
 * Verfuegbarkeits-Zeitleiste — zeigt die Verfuegbarkeit jedes Mitglieds
 * als horizontale Balken auf einer 24h-Skala (UTC).
 * Die gruene gestrichelte Zone markiert das gemeinsame Ueberlappungsfenster.
 */
function AvailabilityMap({members}: {members: typeof MOCK_TEAM.members}) {
  const ticks = [0, 3, 6, 9, 12, 15, 18, 21, 24];
  const dotColors = ['#6366f1', '#d946ef', '#86efac', '#38bdf8', '#f97316', '#60a5fa'];
  const ROW_H = 28; // px pro Zeile

  // Verfuegbarkeit in UTC (startHour, endHour) pro Mitglied
  const availability: Array<{start: number; end: number}> = [
    {start: 11, end: 22}, // Olivia Chen — UTC-7
    {start: 11, end: 23}, // Daniel Martinez — UTC-6
    {start: 12, end: 22}, // Emma Wilson — UTC-5
    {start: 17, end: 22}, // Michael Davis — UTC+1
    {start: 18, end: 24}, // Sophia Taylor — UTC+0
    {start: 18, end: 22}, // James Liu — UTC+8
  ];

  const overlapStart = Math.max(...availability.map((a) => a.start));
  const overlapEnd = Math.min(...availability.map((a) => a.end));
  const pct = (h: number) => `${(h / 24) * 100}%`;

  return (
    <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm p-6">
      <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
        Availability Map
        <Info className="w-3.5 h-3.5 text-slate-400" />
      </h3>

      <div className="overflow-x-auto">
        <div className="min-w-[580px]">
          {/* Stunden-Header */}
          <div className="flex mb-2">
            <div className="w-[160px] shrink-0" />
            <div className="flex-1 relative h-5">
              {ticks.map((h) => (
                <span key={h} className="absolute text-[10px] text-slate-400 dark:text-slate-500 font-mono" style={{left: pct(h), transform: 'translateX(-50%)'}}>
                  {String(h).padStart(2, '0')}:00
                </span>
              ))}
            </div>
          </div>

          {/* Balkenbereich mit Ueberlappungs-Zone */}
          <div className="relative">
            {members.map((m, i) => {
              const a = availability[i] ?? {start: 12, end: 20};
              const color = dotColors[i % dotColors.length];

              return (
                <div key={i} className="flex items-center" style={{height: ROW_H}}>
                  <div className="w-[160px] shrink-0 flex items-center gap-2 pr-3">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{backgroundColor: color}} />
                    <span className="text-xs text-slate-700 dark:text-slate-200 truncate">{m.name}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 ml-auto">{m.timezone}</span>
                  </div>
                  <div className="flex-1 relative" style={{height: ROW_H}}>
                    {ticks.map((h) => (
                      <div key={h} className="absolute top-0 bottom-0 border-l border-slate-100 dark:border-white/5" style={{left: pct(h)}} />
                    ))}
                    <div className="absolute rounded-sm" style={{left: pct(a.start), width: pct(a.end - a.start), top: 4, bottom: 4, backgroundColor: color, opacity: 0.85}} />
                  </div>
                </div>
              );
            })}

            {/* Shared-Overlap-Zone (absolute, ueberlagert alle Zeilen) */}
            <div
              className="absolute border-2 border-dashed border-[#77CF97]/40 bg-[#77CF97]/[0.04] rounded pointer-events-none z-10"
              style={{
                left: `calc(160px + ${(overlapStart / 24)} * (100% - 160px))`,
                width: `calc(${(overlapEnd - overlapStart) / 24} * (100% - 160px))`,
                top: 0,
                height: members.length * ROW_H,
              }}
            />
          </div>

          {/* Legende */}
          <div className="flex items-center gap-2 mt-4 ml-[160px]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#77CF97]" />
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Best shared overlap: {String(overlapStart).padStart(2, '0')}:00 – {String(overlapEnd).padStart(2, '0')}:30 UTC
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Participant Team Space — nur eigene Team-Ansicht */
function UserTeams() {
  const t = MOCK_TEAM;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Linke Spalte — Hauptinhalt */}
        <div className="xl:col-span-9 space-y-6">
          {/* Kopf — Gradient */}
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm p-6 bg-gradient-to-r from-teal-50 via-sky-50 to-indigo-50 dark:from-teal-500/10 dark:via-sky-500/10 dark:to-indigo-500/10">
            <div className="flex flex-col lg:flex-row items-start gap-5">
              {/* Linke Seite: Icon + Info */}
              <div className="flex items-start gap-4 flex-1 min-w-0">
                {/* Team-Icon */}
                <div className="w-16 h-16 rounded-full bg-white dark:bg-white/10 shadow-sm flex items-center justify-center text-2xl shrink-0 border border-white/60 dark:border-white/10">
                  🏔️
                </div>

                {/* Info */}
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t.name}</h1>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#77CF97]/10 text-[#77CF97] text-xs font-semibold border border-[#77CF97]/20">
                      <CheckCircle className="w-3 h-3" /> Active
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{t.voyage} • {t.domain}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-2.5">You are viewing this team as a participant. Only admins can make changes.</p>
                </div>
              </div>

              {/* Rechte Seite: Avatare */}
              <div className="flex flex-col items-end gap-3 shrink-0 w-full lg:w-auto">
                <div className="flex -space-x-2">
                  {t.members.slice(0, 5).map((m, i) => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${m.avatar}`} className="w-9 h-9 rounded-full border-2 border-white dark:border-[#1a1b24]" alt={m.name} title={m.name} />
                  ))}
                  {t.members.length > 5 && (
                    <div className="w-9 h-9 rounded-full border-2 border-white dark:border-[#1a1b24] bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 text-[10px] font-medium flex items-center justify-center">
                      +{t.members.length - 5}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stat-Badges — ganz unten im Block */}
            <div className="flex flex-wrap items-center gap-3 bg-white/70 dark:bg-white/5 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white dark:border-white/10 mt-5">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold">{t.members.length}</span>
                <span className="text-slate-400 dark:text-slate-500">Members</span>
              </span>
              <span className="w-px h-4 bg-slate-200 dark:bg-white/10" />
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold">{t.avgTimezone}</span>
                <span className="text-slate-400 dark:text-slate-500">Avg Timezone</span>
              </span>
              <span className="w-px h-4 bg-slate-200 dark:bg-white/10" />
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold">{t.sharedOverlap}</span>
                <span className="text-slate-400 dark:text-slate-500">Shared Overlap</span>
              </span>
            </div>
          </div>

          {/* Mitglieder */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {t.members.map((m, i) => (
                <div key={i} className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm p-5 hover:shadow-md dark:hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={`https://i.pravatar.cc/100?img=${m.avatar}`} className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/10" alt={m.name} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{m.name}</h3>
                        {m.isYou && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">You</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <Clock className="w-3 h-3 shrink-0" />
                      {m.timezone}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <Users className="w-3 h-3 shrink-0" />
                      {m.availability}
                    </div>
                    <a href={`https://github.com/${m.github}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      github.com/{m.github}
                    </a>
                  </div>
                  <Link href="/profile" className="block w-full text-center py-2 border border-slate-200 dark:border-white/10 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    View Profile →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Availability Map */}
          <AvailabilityMap members={t.members} />
        </div>

        {/* Rechte Spalte — Sidebar */}
        <div className="xl:col-span-3 space-y-6">
          {/* Role Coverage */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                Role Coverage
                <Info className="w-3.5 h-3.5 text-slate-400" />
              </h3>
              {/* Circular progress ring */}
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-100 dark:text-white/10" />
                  <circle cx="24" cy="24" r="20" fill="none" stroke="#77CF97" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${0.8 * 2 * Math.PI * 20} ${2 * Math.PI * 20}`} />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-slate-800 dark:text-white">80%</span>
              </div>
            </div>
            <div className="space-y-4">
              {t.roleCoverage.map((rc, i) => {
                const roleStyles: Record<string, {bg: string; text: string; icon: React.ReactNode}> = {
                  PM: {bg: 'bg-purple-100 dark:bg-purple-500/15', text: 'text-purple-600 dark:text-purple-400', icon: <Users className="w-4 h-4" />},
                  Frontend: {bg: 'bg-emerald-100 dark:bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-400', icon: <Monitor className="w-4 h-4" />},
                  Backend: {bg: 'bg-amber-100 dark:bg-amber-500/15', text: 'text-amber-600 dark:text-amber-400', icon: <Database className="w-4 h-4" />},
                  Design: {bg: 'bg-blue-100 dark:bg-blue-500/15', text: 'text-blue-600 dark:text-blue-400', icon: <FileText className="w-4 h-4" />},
                  Product: {bg: 'bg-rose-100 dark:bg-rose-500/15', text: 'text-rose-600 dark:text-rose-400', icon: <Users className="w-4 h-4" />},
                };
                const s = roleStyles[rc.role] ?? roleStyles.PM;

                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${s.bg} ${s.text} flex items-center justify-center shrink-0`}>
                      {s.icon}
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white w-[72px] shrink-0">{rc.role}</span>
                    <span className={`text-sm flex-1 ${rc.filled ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500 italic'}`}>
                      {rc.name ?? 'Vacant'}
                    </span>
                    {rc.filled ? (
                      <CheckCircle className="w-5 h-5 text-[#77CF97] shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team Resources */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-4">Team Resources</h3>
            <div className="space-y-3">
              {t.resources.map((r, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0">
                      {r.icon === 'git' && <Database className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
                      {r.icon === 'chat' && <MessageSquare className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
                      {r.icon === 'board' && <Monitor className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
                      {r.icon === 'doc' && <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-slate-800 dark:text-white">{r.label}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{r.sublabel}</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Hauptseite: waehlt Ansicht basierend auf der Rolle */
export default function TeamsPage() {
  const {role} = useDashboard();
  if (role === 'admin') return <AdminTeams />;
  return <UserTeams />;
}
