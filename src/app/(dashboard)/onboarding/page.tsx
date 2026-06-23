'use client';

import {useState, useEffect} from 'react';
import {
  CheckCircle, Check, Lock, ArrowUpRight, Users, Clock,
  TrendingUp, AlertTriangle, Search, ChevronRight, Mail,
  Send, Pencil, Plus, BarChart3,
} from 'lucide-react';
import {useDashboard} from '@/lib/auth-context';
import {useRouter} from 'next/navigation';
import type {ParticipantRole} from '@/types';

/** Konfiguration der Onboarding-Schritte */
interface OnboardingStep {
  title: string;
  desc: string;
  order: number;
}

/** Admin-Onboarding-Schritte (konfigurierbar) */
const ADMIN_ONBOARDING_STEPS: OnboardingStep[] = [
  {title: 'Accept Invitation & Terms', desc: 'Review and accept the Amigo Operation guidelines.', order: 1},
  {title: 'Complete Profile Form', desc: 'Fill out skills, availability, and preferred project types.', order: 2},
  {title: 'Link GitHub Account', desc: 'Connect GitHub to sync repositories and track sprint points.', order: 3},
  {title: 'Team Introduction', desc: 'Join the #general Discord channel and introduce yourself.', order: 4},
  {title: 'Verify Email Address', desc: 'Confirm your email address for notifications.', order: 5},
  {title: 'Set Availability', desc: 'Mark your available hours for team scheduling.', order: 6},
];

/** Mock-Teilnehmer-Onboarding-Daten */
interface ParticipantOnboarding {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role: ParticipantRole;
  teamName: string | null;
  completedSteps: number;
  totalSteps: number;
  lastActivity: string;
  status: 'completed' | 'in_progress' | 'not_started';
}

const MOCK_PARTICIPANTS: ParticipantOnboarding[] = [
  {id: 'p1', name: 'Sarah Jenkins', avatar: '12', email: 'sarah.j@example.com', role: 'Fullstack', teamName: 'Team Atlas', completedSteps: 6, totalSteps: 6, lastActivity: '2h ago', status: 'completed'},
  {id: 'p2', name: 'Michael Chang', avatar: '15', email: 'm.chang@example.com', role: 'Frontend', teamName: 'Team Atlas', completedSteps: 4, totalSteps: 6, lastActivity: '1d ago', status: 'in_progress'},
  {id: 'p3', name: 'Emily Chen', avatar: '47', email: 'emily.chen@example.com', role: 'Frontend', teamName: null, completedSteps: 2, totalSteps: 6, lastActivity: '3d ago', status: 'in_progress'},
  {id: 'p4', name: 'Daniel Martinez', avatar: '11', email: 'daniel.m@example.com', role: 'Product', teamName: 'Team Nova', completedSteps: 6, totalSteps: 6, lastActivity: '5h ago', status: 'completed'},
  {id: 'p5', name: 'Emma Wilson', avatar: '5', email: 'emma.w@example.com', role: 'Design', teamName: 'Team Atlas', completedSteps: 3, totalSteps: 6, lastActivity: '2d ago', status: 'in_progress'},
  {id: 'p6', name: 'James Liu', avatar: '14', email: 'james.l@example.com', role: 'Fullstack', teamName: 'Team Phoenix', completedSteps: 5, totalSteps: 6, lastActivity: '12h ago', status: 'in_progress'},
  {id: 'p7', name: 'Robert Fox', avatar: '22', email: 'robert.f@example.com', role: 'Frontend', teamName: null, completedSteps: 0, totalSteps: 6, lastActivity: '5d ago', status: 'not_started'},
  {id: 'p8', name: 'Brooklyn Simmons', avatar: '34', email: 'brooklyn.s@example.com', role: 'Backend', teamName: 'Team Nova', completedSteps: 6, totalSteps: 6, lastActivity: '1d ago', status: 'completed'},
  {id: 'p9', name: 'Leslie Alexander', avatar: '41', email: 'leslie.a@example.com', role: 'Product', teamName: null, completedSteps: 1, totalSteps: 6, lastActivity: '4d ago', status: 'in_progress'},
  {id: 'p10', name: 'Cameron Williamson', avatar: '6', email: 'cameron.w@example.com', role: 'Frontend', teamName: 'Team Phoenix', completedSteps: 4, totalSteps: 6, lastActivity: '6h ago', status: 'in_progress'},
];

/** Rollenfarben */
const ROLE_COLORS: Record<string, string> = {
  Fullstack: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400',
  Frontend: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
  Backend: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Design: 'bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400',
  Product: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
};

/**
 * Admin-Ansicht: Onboarding-Dashboard mit Fortschritt aller Teilnehmer,
 * Verwaltung der Schritte und Uebersichtsstatistiken.
 */
function AdminOnboarding() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in_progress' | 'not_started'>('all');

  /** Statistik-Zahlen */
  const counts = {
    total: MOCK_PARTICIPANTS.length,
    completed: MOCK_PARTICIPANTS.filter((p) => p.status === 'completed').length,
    inProgress: MOCK_PARTICIPANTS.filter((p) => p.status === 'in_progress').length,
    notStarted: MOCK_PARTICIPANTS.filter((p) => p.status === 'not_started').length,
  };

  const completionRate = Math.round((counts.completed / counts.total) * 100);

  /** Gefilterte Teilnehmer */
  const filtered = MOCK_PARTICIPANTS.filter((p) => {
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.teamName && p.teamName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Seitenkopf */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[28px] font-outfit font-medium text-slate-900 dark:text-white mb-1 tracking-tight">Onboarding</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Track participant onboarding progress and manage steps.</p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button className="px-4 py-2 bg-white dark:bg-[#1a1b24] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
            <Mail className="w-4 h-4" /> Send Reminders
          </button>
          <button className="px-4 py-2 bg-[#0b0c10] dark:bg-[#77CF97] text-white dark:text-[#0b0c10] rounded-xl text-sm font-medium hover:bg-slate-800 dark:hover:bg-[#5ab87e] transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
            <Plus className="w-4 h-4" /> Add Step
          </button>
        </div>
      </div>

      {/* Statistik-Karten */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {label: 'Total Participants', value: counts.total, icon: Users, accent: 'text-slate-700 dark:text-slate-200'},
          {label: 'Completed', value: counts.completed, icon: CheckCircle, accent: 'text-[#77CF97]'},
          {label: 'In Progress', value: counts.inProgress, icon: Clock, accent: 'text-blue-500'},
          {label: 'Not Started', value: counts.notStarted, icon: AlertTriangle, accent: 'text-rose-500'},
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</span>
              <stat.icon className={`w-4 h-4 ${stat.accent}`} />
            </div>
            <div className="text-2xl font-outfit font-semibold text-slate-900 dark:text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Fortschrittsbalken */}
      <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-semibold text-slate-800 dark:text-white">Overall Completion</span>
          </div>
          <span className="text-sm font-bold text-[#77CF97]">{completionRate}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-[#77CF97] rounded-full transition-all" style={{width: `${completionRate}%`}} />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-slate-400">{counts.completed} completed</span>
          <span className="text-[10px] text-slate-400">{counts.total} total</span>
        </div>
      </div>

      {/* Filter + Suche */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-2 border-b border-slate-200 dark:border-white/10 pb-px flex-1 overflow-x-auto">
          {([
            {key: 'all' as const, label: `All (${counts.total})`},
            {key: 'completed' as const, label: `Completed (${counts.completed})`},
            {key: 'in_progress' as const, label: `In Progress (${counts.inProgress})`},
            {key: 'not_started' as const, label: `Not Started (${counts.notStarted})`},
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-4 py-2 border-b-2 font-medium text-sm cursor-pointer transition-colors whitespace-nowrap ${
                statusFilter === tab.key
                  ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search participants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white dark:bg-[#1a1b24] border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#77CF97]/30 focus:border-[#77CF97]/50 transition-all w-64"
          />
        </div>
      </div>

      {/* Teilnehmer-Tabelle */}
      <div className="bg-white dark:bg-[#1a1b24] rounded-[24px] border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Participant</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Team</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Progress</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Last Active</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {filtered.map((p) => {
              const progress = Math.round((p.completedSteps / p.totalSteps) * 100);
              const statusColor = p.status === 'completed' ? 'bg-[#77CF97]/10 text-[#77CF97] border border-[#77CF97]/20'
                : p.status === 'in_progress' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-500 border border-blue-100 dark:border-blue-500/20'
                : 'bg-slate-100 dark:bg-white/10 text-slate-500 border border-slate-200 dark:border-white/10';
              const statusLabel = p.status === 'completed' ? 'Completed' : p.status === 'in_progress' ? 'In Progress' : 'Not Started';

              return (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={`https://i.pravatar.cc/100?img=${p.avatar}`} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10" alt="" />
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">{p.name}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{p.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${ROLE_COLORS[p.role]}`}>{p.role}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                    {p.teamName || <span className="text-slate-400 dark:text-slate-500 italic">Unassigned</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[120px]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{p.completedSteps}/{p.totalSteps}</span>
                          <span className="text-[10px] font-bold text-slate-700 dark:text-white">{progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-[#77CF97] rounded-full transition-all" style={{width: `${progress}%`}} />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{p.lastActivity}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                        {p.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                        {p.status === 'in_progress' && <Clock className="w-3 h-3" />}
                        {statusLabel}
                      </span>
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer">
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Onboarding-Schritte verwalten */}
      <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Pencil className="w-4 h-4 text-slate-400" /> Onboarding Steps Configuration
          </h2>
          <button className="text-xs font-medium text-[#77CF97] hover:text-[#5ab87e] transition-colors cursor-pointer">Edit Steps</button>
        </div>
        <div className="space-y-3">
          {ADMIN_ONBOARDING_STEPS.map((step, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
                {step.order}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-800 dark:text-white">{step.title}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{step.desc}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-medium text-slate-400">
                  {MOCK_PARTICIPANTS.filter((p) => p.completedSteps >= step.order).length}/{MOCK_PARTICIPANTS.length}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Participant-Ansicht: persoenliche Onboarding-Checkliste mit
 * Fortschrittsring und Hilfe-Sidebar.
 */

/** Onboarding-Schritte */
const PARTICIPANT_STEPS = [
  {done: true, title: 'Accept Invitation & Terms', desc: 'Review and accept the Amigo Operation guidelines.', date: 'Completed Oct 20'},
  {done: false, active: true, title: 'Complete Profile Form', desc: 'Please fill out your skills, availability, and preferred project types so we can match you to the best team.'},
  {done: false, title: 'Link GitHub Account', desc: 'Connect your GitHub to sync repositories and track sprint points.'},
  {done: false, title: 'Team Introduction', desc: 'Join the #general Discord channel and introduce yourself to the community.'},
];

function ParticipantOnboarding() {
  return (
    <div className="space-y-6">
      {/* Seitenkopf */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-outfit font-medium text-slate-900 dark:text-white mb-1 tracking-tight">Onboarding Checklist</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Complete these steps to gain full access to the Amigo workspace.</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-xl text-sm font-semibold border border-indigo-100 dark:border-indigo-500/20 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> 1 / 4 Completed
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-4">
          {PARTICIPANT_STEPS.map((step, i) => (
            <div
              key={i}
              className={`bg-white dark:bg-[#1a1b24] p-6 rounded-[20px] flex items-start gap-4 ${
                step.active ? 'border-2 border-indigo-500 shadow-md dark:shadow-[0_4px_20px_rgba(99,102,241,0.15)]' : step.done ? 'border border-slate-200 dark:border-white/10 shadow-sm' : 'border border-slate-200 dark:border-white/10 shadow-sm opacity-75'
              }`}
            >
              <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                step.done ? 'bg-[#77CF97] text-white' : step.active ? 'border-2 border-indigo-500 shadow-sm' : 'border-2 border-slate-300 dark:border-slate-600'
              }`}>
                {step.done && <Check className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <h3 className={`font-bold ${step.done ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-900 dark:text-white'}`}>{step.title}</h3>
                <p className={`text-sm mt-1 ${step.done ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-500 dark:text-slate-400'} ${step.active ? 'mb-4' : ''}`}>{step.desc}</p>
                {step.active && (
                  <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2">
                    Start Form <ArrowUpRight className="w-4 h-4" />
                  </button>
                )}
              </div>
              {step.date && <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{step.date}</span>}
              {step.active && <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-md">Action Required</span>}
              {!step.done && !step.active && <Lock className="w-4 h-4 text-slate-300 dark:text-slate-600" />}
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-teal-50 via-sky-50 to-indigo-50 dark:from-teal-500/10 dark:via-sky-500/10 dark:to-indigo-500/10 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10">
            <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">Need help?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 relative z-10">
              If you&apos;re stuck on any of the onboarding steps, reach out to the moderation team.
            </p>
            <button className="w-full py-2.5 bg-slate-800 dark:bg-white/10 hover:bg-slate-700 dark:hover:bg-white/15 text-white rounded-xl text-sm font-medium transition-colors border border-slate-700 dark:border-white/10 relative z-10">
              Read the Guides
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Onboarding-Seite: waehlt Ansicht basierend auf der Rolle.
 * Admin sieht ein Verwaltungs-Dashboard, User die eigene Checkliste.
 */
export default function OnboardingPage() {
  const {role} = useDashboard();
  if (role === 'admin') return <AdminOnboarding />;
  return <ParticipantOnboarding />;
}
