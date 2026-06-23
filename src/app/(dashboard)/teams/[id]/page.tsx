'use client';

import {useState, useEffect, use} from 'react';
import {useRouter} from 'next/navigation';
import {
  ArrowLeft, Users, Clock, CheckCircle, AlertTriangle, Calendar,
  UserPlus, Edit3, Archive, ChevronRight, Mail, Target, Activity,
  Info, Star, User, Shield,
} from 'lucide-react';
import type {Team, TeamMember, TeamStatus} from '@/types';
import {useDashboard} from '@/lib/auth-context';

/**
 * Mock-Teams fuer die Detailansicht.
 * In der Produktion werden diese Daten aus Supabase geladen.
 */
const MOCK_TEAMS: Team[] = [
  {
    id: 'team-nebula',
    name: 'Nebula Builders',
    status: 'active',
    voyage: 'Voyage 51',
    members: [
      {id: 'm1', name: 'Alice Smith', avatar: '11', role: 'Frontend', email: 'alice.s@email.com', isLead: true},
      {id: 'm2', name: 'Bob Jones', avatar: '12', role: 'Backend', email: 'bob.j@email.com', isLead: false},
      {id: 'm3', name: 'Charlie Davis', avatar: '13', role: 'Fullstack', email: 'charlie.d@email.com', isLead: false},
      {id: 'm13', name: 'Diana Lee', avatar: '43', role: 'Design', email: 'diana.l@email.com', isLead: false},
    ],
    createdAt: '2026-04-01',
    description: 'Building a decentralized marketplace for digital assets with cross-chain compatibility and zero gas fees.',
    sharedOverlap: '4.5h/Tag',
    mentor: 'Dr. Sarah Connor',
  },
  {
    id: 'team-apollo',
    name: 'Apollo Strike',
    status: 'at_risk',
    voyage: 'Voyage 51',
    members: [
      {id: 'm4', name: 'Eve Wilson', avatar: '14', role: 'Fullstack', email: 'eve.w@email.com', isLead: true},
      {id: 'm5', name: 'Frank Miller', avatar: '15', role: 'Backend', email: 'frank.m@email.com', isLead: false},
    ],
    createdAt: '2026-04-15',
    description: 'An AI-powered VS Code extension for real-time refactoring and style guide enforcement for Next.js.',
    sharedOverlap: '3h/Tag',
    mentor: 'Prof. James Wright',
  },
  {
    id: 'team-flora',
    name: 'Flora Health',
    status: 'active',
    voyage: 'Voyage 51',
    members: [
      {id: 'm6', name: 'Grace Hall', avatar: '17', role: 'Frontend', email: 'grace.h@email.com', isLead: true},
      {id: 'm7', name: 'Henry Scott', avatar: '18', role: 'Backend', email: 'henry.s@email.com', isLead: false},
      {id: 'm8', name: 'Ivy Young', avatar: '19', role: 'Design', email: 'ivy.y@email.com', isLead: false},
    ],
    createdAt: '2026-04-10',
    description: 'Mental health journal app utilizing sentiment analysis to track mood trends and recommend mindfulness exercises.',
    sharedOverlap: '5h/Tag',
    mentor: 'Dr. Emily Chen',
  },
  {
    id: 'team-bolt',
    name: 'Bolt Finance',
    status: 'active',
    voyage: 'Voyage 51',
    members: [
      {id: 'm9', name: 'Jack Adams', avatar: '20', role: 'Fullstack', email: 'jack.a@email.com', isLead: true},
      {id: 'm10', name: 'Karen Baker', avatar: '21', role: 'Frontend', email: 'karen.b@email.com', isLead: false},
      {id: 'm11', name: 'Leo Carter', avatar: '22', role: 'Backend', email: 'leo.c@email.com', isLead: false},
      {id: 'm14', name: 'Mia Davis', avatar: '23', role: 'Design', email: 'mia.d@email.com', isLead: false},
    ],
    createdAt: '2026-04-05',
    description: 'Micro-budgeting tool aiming to help college students automatically round up savings across multiple bank accounts.',
    sharedOverlap: '4h/Tag',
    mentor: 'Dr. Sarah Connor',
  },
  {
    id: 'team-ocean',
    name: 'Ocean Data',
    status: 'forming',
    voyage: 'Voyage 51',
    members: [
      {id: 'm15', name: 'Nina Evans', avatar: '24', role: 'Frontend', email: 'nina.e@email.com', isLead: true},
      {id: 'm16', name: 'Oscar Fisher', avatar: '25', role: 'Backend', email: 'oscar.f@email.com', isLead: false},
    ],
    createdAt: '2026-05-10',
    description: 'Visualizing open-source marine data to track coral bleaching events and climate impact.',
    sharedOverlap: '2.5h/Tag',
    mentor: 'Prof. James Wright',
  },
  {
    id: 'team-pixel',
    name: 'Pixel Pirates',
    status: 'completed',
    voyage: 'Voyage 51',
    members: [
      {id: 'm17', name: 'Paul Green', avatar: '26', role: 'Fullstack', email: 'paul.g@email.com', isLead: true},
      {id: 'm18', name: 'Quinn Hill', avatar: '27', role: 'Frontend', email: 'quinn.h@email.com', isLead: false},
      {id: 'm19', name: 'Rita Ines', avatar: '28', role: 'Design', email: 'rita.i@email.com', isLead: false},
    ],
    createdAt: '2026-03-20',
    description: 'Browser-based multiplayer trivia game using web sockets and real-time question generation via LLM.',
    sharedOverlap: '6h/Tag',
    mentor: 'Dr. Emily Chen',
  },
];

/** Konfiguration fuer Teamstatus Badges */
const STATUS_CONFIG: Record<TeamStatus, {label: string; icon: React.ElementType; color: string; bgColor: string}> = {
  active: {label: 'Active', icon: CheckCircle, color: 'text-[#77CF97]', bgColor: 'bg-[#77CF97]/10 text-[#77CF97] border border-[#77CF97]/20'},
  at_risk: {label: 'At Risk', icon: AlertTriangle, color: 'text-rose-500', bgColor: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20'},
  forming: {label: 'Forming', icon: Clock, color: 'text-slate-600 dark:text-slate-300', bgColor: 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-white/10'},
  completed: {label: 'Completed', icon: Star, color: 'text-amber-500', bgColor: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20'},
};

/** Rollenfarben */
const ROLE_COLORS: Record<string, string> = {
  Fullstack: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400',
  Frontend: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
  Backend: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Design: 'bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400',
  Product: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
};

/**
 * Mock-Aktivitaeten fuer die Timeline des Teams.
 */
const MOCK_ACTIVITIES = [
  {id: 'a1', type: 'member_joined' as const, text: 'Sophia Taylor ist dem Team beigetreten', date: '2026-05-20', time: '14:30'},
  {id: 'a2', type: 'milestone' as const, text: 'Sprint 2 abgeschlossen — 75% Fortschritt', date: '2026-05-18', time: '10:00'},
  {id: 'a3', type: 'member_joined' as const, text: 'Michael Davis ist dem Team beigetreten', date: '2026-05-10', time: '09:15'},
  {id: 'a4', type: 'status_change' as const, text: 'Team-Status auf "Active" gesetzt', date: '2026-05-05', time: '11:00'},
  {id: 'a5', type: 'member_joined' as const, text: 'Emma Wilson ist dem Team beigetreten', date: '2026-04-28', time: '16:45'},
  {id: 'a6', type: 'created' as const, text: 'Team wurde erstellt', date: '2026-04-01', time: '08:00'},
];

/**
 * Mock-Ziele / Aufgaben fuer das Team.
 */
const MOCK_GOALS = [
  {id: 'g1', text: 'MVP-Prototyp fertigstellen', done: true},
  {id: 'g2', text: 'CI/CD-Pipeline einrichten', done: true},
  {id: 'g3', text: 'API-Design-Dokumentation', done: false},
  {id: 'g4', text: 'Benutzertest mit 10 Teilnehmern', done: false},
  {id: 'g5', text: 'Performance-Optimierung (LCP < 2s)', done: false},
];

/**
 * Mock-Verfuegbarkeitsdaten fuer das Ueberlappungs-Schema.
 */
const OVERLAP_SCHEDULE = [
  {day: 'Mo', hours: '18:00–22:00', available: true},
  {day: 'Di', hours: '17:00–21:00', available: true},
  {day: 'Mi', hours: '18:00–22:00', available: true},
  {day: 'Do', hours: '17:00–21:00', available: true},
  {day: 'Fr', hours: '16:00–20:00', available: true},
  {day: 'Sa', hours: '10:00–14:00', available: true},
  {day: 'So', hours: '—', available: false},
];

/**
 * Detailseite fuer ein einzelnes Team (Admin-Ansicht).
 * Zeigt Mitglieder, Aktivitaeten, Ziele und Metadaten.
 */
export default function TeamDetailPage({params}: {params: Promise<{id: string}>}) {
  const {id} = use(params);
  const router = useRouter();
  const {role} = useDashboard();
  const [team, setTeam] = useState<Team | null>(null);
  const [checkedGoals, setCheckedGoals] = useState<Record<string, boolean>>({});

  /** Nur Admin hat Zugriff */
  useEffect(() => {
    if (role !== 'admin') {
      router.push('/overview');
    }
  }, [role, router]);

  /** Mock-Daten laden */
  useEffect(() => {
    const found = MOCK_TEAMS.find((t) => t.id === id);
    if (found) {
      setTeam(found);
      /** Bestehende Ziele initialisieren */
      const initial: Record<string, boolean> = {};
      MOCK_GOALS.forEach((g) => { initial[g.id] = g.done; });
      setCheckedGoals(initial);
    }
  }, [id]);

  /** Ziel-Status umschalten */
  const toggleGoal = (goalId: string) => {
    setCheckedGoals((prev) => ({...prev, [goalId]: !prev[goalId]}));
  };

  /** Datumsformatierung */
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('de-DE', {day: '2-digit', month: 'long', year: 'numeric'});
  };

  if (!team || role !== 'admin') return null;

  const statusConf = STATUS_CONFIG[team.status];
  const StatusIcon = statusConf.icon;

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      {/* Zurueck-Navigation */}
      <button
        onClick={() => router.push('/teams')}
        className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Teams
      </button>

      {/* Kopfbereich */}
      <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-[28px] font-outfit font-medium text-slate-900 dark:text-white tracking-tight">
                {team.name}
              </h1>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConf.bgColor}`}>
                <StatusIcon className="w-3 h-3" /> {statusConf.label}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {team.voyage}</span>
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {team.members.length} Members</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Overlap: {team.sharedOverlap}</span>
              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> Mentor: {team.mentor}</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed max-w-2xl">
              {team.description}
            </p>
          </div>
        </div>
      </div>

      {/* Zwei-Spalten-Layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Linke Spalte: Hauptinhalt (2/3) */}
        <div className="col-span-2 space-y-6">
          {/* Team-Mitglieder */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" /> Team Members
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {team.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl hover:shadow-md dark:hover:shadow-lg transition-shadow"
                >
                  <img
                    src={`https://i.pravatar.cc/100?img=${member.avatar}`}
                    className="w-11 h-11 rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10"
                    alt={member.name}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {member.name}
                      </span>
                      {member.isLead && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#77CF97]/10 text-[#77CF97] border border-[#77CF97]/20">
                          <Shield className="w-2.5 h-2.5" /> Lead
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${ROLE_COLORS[member.role]}`}>
                        {member.role}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate flex items-center gap-1">
                        <Mail className="w-2.5 h-2.5 shrink-0" /> {member.email}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team-Aktivitaeten */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-400" /> Team Activity
            </h2>
            <div className="space-y-0">
              {MOCK_ACTIVITIES.map((activity, i) => {
                const isLast = i === MOCK_ACTIVITIES.length - 1;
                const dotColor = activity.type === 'member_joined'
                  ? 'bg-blue-400'
                  : activity.type === 'milestone'
                    ? 'bg-[#77CF97]'
                    : activity.type === 'status_change'
                      ? 'bg-amber-400'
                      : 'bg-slate-300 dark:bg-slate-600';

                return (
                  <div key={activity.id} className="flex gap-3">
                    {/* Zeitlinie */}
                    <div className="flex flex-col items-center">
                      <div className={`w-2.5 h-2.5 rounded-full ${dotColor} shrink-0 mt-1.5`} />
                      {!isLast && (
                        <div className="w-px flex-1 bg-slate-200 dark:bg-white/10 my-1" />
                      )}
                    </div>
                    {/* Inhalt */}
                    <div className="pb-4">
                      <p className="text-sm text-slate-800 dark:text-white">{activity.text}</p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                        {formatDate(activity.date)} um {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team-Ziele */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-slate-400" /> Team Goals
            </h2>
            <div className="space-y-3">
              {MOCK_GOALS.map((goal) => {
                const isChecked = checkedGoals[goal.id] ?? goal.done;
                return (
                  <label
                    key={goal.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <button
                      type="button"
                      onClick={() => toggleGoal(goal.id)}
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isChecked
                          ? 'bg-[#77CF97] border-[#77CF97]'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {isChecked && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                    </button>
                    <span className={`text-sm ${isChecked ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-800 dark:text-white'}`}>
                      {goal.text}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rechte Spalte: Metadaten (1/3) */}
        <div className="space-y-6">
          {/* Basis-Informationen */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-slate-400" /> Team Info
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Erstellt</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{formatDate(team.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Voyage</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{team.voyage}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Status</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConf.bgColor}`}>
                  <StatusIcon className="w-3 h-3" /> {statusConf.label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Mitglieder</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{team.members.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Mentor</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{team.mentor}</span>
              </div>
            </div>
          </div>

          {/* Ueberlappungs-Schema */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" /> Overlap Schedule
            </h2>
            <div className="space-y-2">
              {OVERLAP_SCHEDULE.map((day) => (
                <div
                  key={day.day}
                  className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                    day.available
                      ? 'bg-[#77CF97]/5 dark:bg-[#77CF97]/5'
                      : 'bg-slate-50 dark:bg-white/5 opacity-50'
                  }`}
                >
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{day.day}</span>
                  <span className={`text-xs ${day.available ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'}`}>
                    {day.hours}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#77CF97]" />
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Best shared overlap: {team.sharedOverlap}
                </span>
              </div>
            </div>
          </div>

          {/* Schnellaktionen */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between px-4 py-3 bg-[#77CF97]/10 dark:bg-[#77CF97]/10 text-[#77CF97] rounded-xl text-sm font-medium hover:bg-[#77CF97]/20 dark:hover:bg-[#77CF97]/20 transition-colors cursor-pointer border border-[#77CF97]/20">
                <span className="flex items-center gap-2"><UserPlus className="w-4 h-4" /> Add Member</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer border border-slate-200 dark:border-white/10">
                <span className="flex items-center gap-2"><Edit3 className="w-4 h-4" /> Edit Team</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button className="w-full flex items-center justify-between px-4 py-3 bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 rounded-xl text-sm font-medium hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors cursor-pointer border border-rose-100 dark:border-rose-500/20">
                <span className="flex items-center gap-2"><Archive className="w-4 h-4" /> Archive Team</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
