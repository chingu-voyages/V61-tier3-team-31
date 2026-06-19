'use client';

import {
  CheckCircle, AlertTriangle, Clock, Search, Plus,
  MessageSquare, ChevronRight, UserPlus, Database,
  Monitor, History, Copy, Check, ArrowUpRight,
} from 'lucide-react';
import {useDashboard} from '@/lib/auth-context';

/** Mock-Teams fuer Admin-Ansicht */
const adminTeams = [
  {name: 'Nebula Builders', tier: 'Tier 2', domain: 'E-Commerce', emoji: '🌌', bg: 'bg-indigo-50 dark:bg-indigo-500/10', textColor: 'text-indigo-600 dark:text-indigo-400', status: 'Active', statusStyle: 'bg-[#1CB368]/10 text-[#1CB368] border border-[#1CB368]/20', statusIcon: CheckCircle, description: 'Building a decentralized marketplace for digital assets with cross-chain compatibility and zero gas fees.', progress: 75, barColor: 'bg-indigo-500', members: ['11', '12', '13'], extra: '+1'},
  {name: 'Apollo Strike', tier: 'Tier 3', domain: 'Developer Tools', emoji: '🚀', bg: 'bg-rose-50 dark:bg-rose-500/10', textColor: 'text-rose-600 dark:text-rose-400', status: 'At Risk', statusStyle: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20', statusIcon: AlertTriangle, description: 'An AI-powered VS Code extension for real-time refactoring and style guide enforcement for Next.js.', progress: 30, barColor: 'bg-rose-500', members: ['14', '15'], extra: ''},
  {name: 'Flora Health', tier: 'Tier 1', domain: 'HealthTech', emoji: '🌿', bg: 'bg-emerald-50 dark:bg-emerald-500/10', textColor: 'text-emerald-600 dark:text-emerald-400', status: 'Active', statusStyle: 'bg-[#1CB368]/10 text-[#1CB368] border border-[#1CB368]/20', statusIcon: CheckCircle, description: 'Mental health journal app utilizing sentiment analysis to track mood trends and recommend mindfulness exercises.', progress: 90, barColor: 'bg-emerald-500', members: ['17', '18', '19'], extra: ''},
  {name: 'Bolt Finance', tier: 'Tier 2', domain: 'FinTech', emoji: '⚡️', bg: 'bg-amber-50 dark:bg-amber-500/10', textColor: 'text-amber-600 dark:text-amber-400', status: 'Active', statusStyle: 'bg-[#1CB368]/10 text-[#1CB368] border border-[#1CB368]/20', statusIcon: CheckCircle, description: 'Micro-budgeting tool aiming to help college students automatically round up savings across multiple bank accounts.', progress: 55, barColor: 'bg-amber-500', members: ['20', '21', '22', '23'], extra: ''},
  {name: 'Ocean Data', tier: 'Tier 3', domain: 'Data Vis', emoji: '🌊', bg: 'bg-cyan-50 dark:bg-cyan-500/10', textColor: 'text-cyan-600 dark:text-cyan-400', status: 'Forming', statusStyle: 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-white/10', statusIcon: Clock, description: 'Visualizing open-source marine data to track coral bleaching events and climate impact.', progress: 10, barColor: 'bg-cyan-500', members: ['24', '25'], extra: ''},
  {name: 'Pixel Pirates', tier: 'Tier 2', domain: 'Gaming', emoji: '🎮', bg: 'bg-purple-50 dark:bg-purple-500/10', textColor: 'text-purple-600 dark:text-purple-400', status: 'Active', statusStyle: 'bg-[#1CB368]/10 text-[#1CB368] border border-[#1CB368]/20', statusIcon: CheckCircle, description: 'Browser-based multiplayer trivia game using web sockets and real-time question generation via LLM.', progress: 100, barColor: 'bg-purple-500', members: ['26', '27', '28'], extra: ''},
];

/** Admin-Ansicht: Team-Verzeichnis mit Karten */
function AdminTeams() {
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
          <button className="px-4 py-2 bg-[#0b0c10] dark:bg-[#1CB368] text-white rounded-xl text-sm font-medium hover:bg-slate-800 dark:hover:bg-[#189958] transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
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
            <div key={i} className="bg-white dark:bg-[#1a1b24] rounded-[24px] border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-slate-300 dark:hover:border-white/20 transition-all p-6 flex flex-col">
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
                  <button className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">View Details</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** User-Ansicht: Team Space mit Aufgaben, Repo und Velocity */
function UserTeams() {
  return (
    <div className="space-y-6">
      {/* Kopf */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-[28px] font-outfit font-medium text-slate-900 dark:text-white tracking-tight">Pixel Pioneers</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1CB368]/10 text-[#1CB368] text-xs font-semibold border border-[#1CB368]/20">
              <CheckCircle className="w-3 h-3" /> Active
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Tier 2 • E-Commerce tooling</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3 mr-4">
            {['11', '12', '13', '14'].map((id, i) => (
              <img key={i} src={`https://i.pravatar.cc/100?img=${id}`} className="w-10 h-10 rounded-full border-2 border-[#f8f9fc] dark:border-[#0f0f0f] hover:z-10 transition-transform hover:scale-110 cursor-pointer shadow-sm" alt="team member" />
            ))}
          </div>
          <button className="px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
            <MessageSquare className="w-4 h-4" /> Team Chat
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Hauptinhalt */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#1a1b24] p-6 rounded-[24px] border border-slate-200 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Sprint 3 Goal</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
              Integrate Stripe payment forms and finalize the responsive cart states. All end-to-end tests for checkout must be passing.
            </p>
          </div>

          <div className="bg-white dark:bg-[#1a1b24] rounded-[24px] border border-slate-200 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 dark:text-white">My Tasks</h3>
              <button className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">View All</button>
            </div>
            <div className="p-2 space-y-1">
              <div className="p-4 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl flex items-start gap-4 transition-colors group cursor-pointer">
                <button className="w-5 h-5 rounded-md border border-slate-300 dark:border-white/20 mt-0.5 group-hover:border-indigo-400 transition-colors flex items-center justify-center"></button>
                <div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white leading-tight">Design empty cart state</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex gap-2">
                    <span className="text-orange-500 font-medium">Medium</span> • <span>Due Today</span>
                  </div>
                </div>
              </div>
              <div className="p-4 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl flex items-start gap-4 transition-colors group cursor-pointer">
                <button className="w-5 h-5 rounded-md border border-slate-300 dark:border-white/20 mt-0.5 group-hover:border-indigo-400 transition-colors flex items-center justify-center"></button>
                <div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white leading-tight">Implement Stripe Elements hook</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex gap-2">
                    <span className="text-rose-500 font-medium">High</span> • <span>Due Tomorrow</span>
                  </div>
                </div>
              </div>
              <div className="p-4 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl flex items-start gap-4 transition-colors">
                <button className="w-5 h-5 rounded-md border text-white bg-[#1CB368] border-[#1CB368] mt-0.5 flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </button>
                <div>
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400 line-through leading-tight">Configure Next.js API route for payments</div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium flex gap-1 items-center">
                    <CheckCircle className="w-3 h-3" /> Completed Oct 23
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seitenleiste */}
        <div className="space-y-6">
          {/* Repo-Info */}
          <div className="bg-[#0b0c10] p-6 rounded-[24px] border border-[#1a1b24] shadow-xl text-white">
            <h3 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <Database className="w-4 h-4 text-slate-400" /> Repository
            </h3>
            <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-3 mb-4">
              <div className="flex gap-2 items-center min-w-0">
                <Monitor className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-sm text-slate-300 truncate font-mono">nexus/pixel-pioneers</span>
              </div>
              <button className="text-slate-400 hover:text-white transition-colors shrink-0">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 flex items-center gap-1.5"><History className="w-3.5 h-3.5" /> main branch</span>
              <span className="text-[#1CB368] font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" /> passing</span>
            </div>
          </div>

          {/* Velocity */}
          <div className="bg-white dark:bg-[#1a1b24] p-6 rounded-[24px] border border-slate-200 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-5">Sprint Velocity</h3>
            <div className="space-y-4">
              {[
                {label: 'To Do', pts: '12 pts', width: '40%', color: 'bg-slate-400'},
                {label: 'In Progress', pts: '8 pts', width: '60%', color: 'bg-blue-400'},
                {label: 'Done', pts: '24 pts', width: '100%', color: 'bg-[#1CB368]'},
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                    <span>{item.label}</span>
                    <span>{item.pts}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{width: item.width}}></div>
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

/** Hauptseite: waehlt Ansicht basierend auf der Rolle */
export default function TeamsPage() {
  const {role} = useDashboard();
  if (role === 'admin') return <AdminTeams />;
  if (role === 'participant') return <UserTeams />;
  return null;
}
