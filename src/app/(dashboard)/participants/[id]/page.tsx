'use client';

import {useState, useEffect, use} from 'react';
import {useRouter} from 'next/navigation';
import {
  ArrowLeft, Mail, Calendar, Briefcase, MapPin, Clock,
  Tag, Users, Globe, MessageSquare, UserPlus, MessageCircle,
  Ban, Activity, CheckCircle, ExternalLink,
} from 'lucide-react';
import type {Participant, ParticipantRole} from '@/types';
import {useDashboard} from '@/lib/auth-context';

/**
 * Mock-Teilnehmerdaten mit vollstaendigen Details.
 * In der Produktion werden diese Daten aus Supabase geladen.
 */
const MOCK_PARTICIPANTS: Participant[] = [
  {
    id: 'ptc-001',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    avatar: 'https://i.pravatar.cc/150?img=12',
    role: 'Fullstack',
    experience: 'Advanced',
    voyage: 'Voyage 51',
    teamId: 'team-03',
    teamName: 'Team Phoenix',
    status: 'active',
    onboardingProgress: 85,
    joinedDate: '2026-05-01',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
    bio: 'Erfahrene Full-Stack-Entwicklerin mit Leidenschaft fuer skalierbare Webanwendungen. Fuehrte zuvor die Frontend-Architektur bei einem SaaS-Startup. Spezialisiert auf Performance-Optimierung und saubere Software-Architektur.',
    timezone: 'UTC-5 (EST)',
    availability: '20 Stunden/Woche',
    github: 'github.com/sjenkins',
  },
  {
    id: 'ptc-002',
    name: 'Michael Chang',
    email: 'm.chang@example.com',
    avatar: 'https://i.pravatar.cc/150?img=15',
    role: 'Frontend',
    experience: 'Intermediate',
    voyage: 'Voyage 51',
    teamId: 'team-07',
    teamName: 'Team Aurora',
    status: 'active',
    onboardingProgress: 60,
    joinedDate: '2026-05-03',
    skills: ['React', 'CSS', 'Figma', 'Storybook', 'Tailwind'],
    bio: 'Frontend-Entwickler mit Schwerpunkt React und modernem CSS. Leidenschaftlich fuer barrierefreie UI und Design-Systeme. Aktuell lerne ich TypeScript tiefergehend.',
    timezone: 'UTC+8 (SGT)',
    availability: '15 Stunden/Woche',
    github: 'github.com/mchang',
  },
  {
    id: 'ptc-003',
    name: 'Emily Chen',
    email: 'emily.chen@example.com',
    avatar: 'https://i.pravatar.cc/150?img=47',
    role: 'Frontend',
    experience: 'Advanced',
    voyage: 'Voyage 51',
    teamId: null,
    teamName: null,
    status: 'pending',
    onboardingProgress: 25,
    joinedDate: '2026-06-10',
    skills: ['React', 'Next.js', 'TypeScript', 'GraphQL', 'Testing', 'CI/CD'],
    bio: 'Senior Frontend-Ingenieurin mit Expertise in React-Ecosystems. Fuehrte zuvor Teams von 5+ Entwicklern. Sucht eine kooperative Umgebung zum Lernen und Beisteuern.',
    timezone: 'UTC+8 (CST)',
    availability: '25 Stunden/Woche',
    github: 'github.com-chen',
  },
];

/** Typ fuer einen einzelnen Timeline-Eintrag der Teamhistorie */
interface TeamHistoryEntry {
  teamName: string;
  joined: string;
  left: string | null;
  role: string;
}

/**
 * Mock-Timeline fuer Team-Zuweisungen.
 * In Produktion wird dies aus Supabase geladen.
 */
const MOCK_TEAM_HISTORY: Record<string, TeamHistoryEntry[]> = {
  'ptc-001': [
    {teamName: 'Team Phoenix', joined: '2026-05-05', left: null, role: 'Fullstack'},
    {teamName: 'Team Delta', joined: '2026-04-20', left: '2026-05-04', role: 'Fullstack'},
  ],
  'ptc-002': [
    {teamName: 'Team Aurora', joined: '2026-05-10', left: null, role: 'Frontend'},
  ],
  'ptc-003': [],
};

/** Typ fuer einen Aktivitaets-Eintrag */
interface ActivityEntry {
  id: string;
  type: string;
  text: string;
  date: string;
  icon: React.ElementType;
  color: string;
}

/**
 * Mock-Aktivitaetsfeed fuer Teilnehmer.
 * In Produktion wird dies aus Supabase Realtime geladen.
 */
const MOCK_ACTIVITIES: Record<string, ActivityEntry[]> = {
  'ptc-001': [
    {id: 'a1', type: 'team_joined', text: 'Team Phoenix beigetreten', date: '2026-05-05', icon: Users, color: 'text-[#77CF97] bg-[#77CF97]/10'},
    {id: 'a2', type: 'onboarding', text: 'Onboarding-Schritt 4 abgeschlossen', date: '2026-05-12', icon: CheckCircle, color: 'text-blue-500 bg-blue-500/10'},
    {id: 'a3', type: 'team_switch', text: 'Von Team Delta zu Team Phoenix gewechselt', date: '2026-05-05', icon: Activity, color: 'text-amber-500 bg-amber-500/10'},
    {id: 'a4', type: 'onboarding', text: 'Onboarding-Schritt 3 abgeschlossen', date: '2026-05-08', icon: CheckCircle, color: 'text-blue-500 bg-blue-500/10'},
    {id: 'a5', type: 'joined', text: 'Am Voyage 51 teilgenommen', date: '2026-05-01', icon: UserPlus, color: 'text-[#77CF97] bg-[#77CF97]/10'},
  ],
  'ptc-002': [
    {id: 'a6', type: 'team_joined', text: 'Team Aurora beigetreten', date: '2026-05-10', icon: Users, color: 'text-[#77CF97] bg-[#77CF97]/10'},
    {id: 'a7', type: 'onboarding', text: 'Onboarding-Schritt 2 abgeschlossen', date: '2026-05-15', icon: CheckCircle, color: 'text-blue-500 bg-blue-500/10'},
    {id: 'a8', type: 'joined', text: 'Am Voyage 51 teilgenommen', date: '2026-05-03', icon: UserPlus, color: 'text-[#77CF97] bg-[#77CF97]/10'},
  ],
  'ptc-003': [
    {id: 'a9', type: 'joined', text: 'Am Voyage 51 teilgenommen', date: '2026-06-10', icon: UserPlus, color: 'text-[#77CF97] bg-[#77CF97]/10'},
  ],
};

/** Konfiguration fuer Teilnehmer-Status Badges */
const STATUS_CONFIG: Record<Participant['status'], {label: string; color: string; bgColor: string}> = {
  active: {label: 'Active', color: 'text-[#77CF97]', bgColor: 'bg-[#77CF97]/10 border border-[#77CF97]/20'},
  inactive: {label: 'Inactive', color: 'text-slate-500', bgColor: 'bg-slate-100 dark:bg-white/10 border border-slate-200/50 dark:border-white/10'},
  pending: {label: 'Pending', color: 'text-amber-500', bgColor: 'bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20'},
};

/** Rollenfarben */
const ROLE_COLORS: Record<ParticipantRole, string> = {
  Fullstack: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400',
  Frontend: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
  Backend: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Design: 'bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400',
  Product: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
};

/**
 * Detailseite fuer einen einzelnen Teilnehmer (Admin-Ansicht).
 * Zeigt Profil, Faehigkeiten, Team-Historie, Aktivitaeten und Schnellaktionen.
 */
export default function ParticipantDetailPage({params}: {params: Promise<{id: string}>}) {
  const {id} = use(params);
  const router = useRouter();
  const {role} = useDashboard();
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [teamHistory, setTeamHistory] = useState<TeamHistoryEntry[]>([]);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);

  // Nur Admin hat Zugriff
  useEffect(() => {
    if (role !== 'admin') {
      router.push('/overview');
    }
  }, [role, router]);

  // Mock-Daten laden
  useEffect(() => {
    const found = MOCK_PARTICIPANTS.find((p) => p.id === id);
    if (found) {
      setParticipant(found);
      setTeamHistory(MOCK_TEAM_HISTORY[found.id] || []);
      setActivities(MOCK_ACTIVITIES[found.id] || []);
    }
  }, [id]);

  /** Datumsformatierung */
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('de-DE', {day: '2-digit', month: 'long', year: 'numeric'});
  };

  if (!participant || role !== 'admin') return null;

  const statusConf = STATUS_CONFIG[participant.status];

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      {/* Zurueck-Navigation */}
      <button
        onClick={() => router.push('/participants')}
        className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Participants
      </button>

      {/* Kopfbereich: Profil */}
      <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
        <div className="flex items-start gap-5">
          <img
            src={participant.avatar}
            className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 shrink-0"
            alt={participant.name}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-xl font-semibold text-slate-900 dark:text-white font-outfit">{participant.name}</h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[participant.role]}`}>
                {participant.role}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConf.bgColor} ${statusConf.color}`}>
                {statusConf.label}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 flex-wrap mt-1">
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {participant.email}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Joined {formatDate(participant.joinedDate)}</span>
              <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {participant.voyage}</span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {participant.teamName ? (
                  <span className="text-[#77CF97] font-medium">{participant.teamName}</span>
                ) : (
                  <span className="italic">Unassigned</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Zwei-Spalten-Layout: 2/3 + 1/3 */}
      <div className="grid grid-cols-3 gap-6">
        {/* Linke Spalte (2/3) */}
        <div className="col-span-2 space-y-6">
          {/* Ueber mich */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2 font-outfit">
              <MessageSquare className="w-4 h-4 text-slate-400" /> Ueber mich
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{participant.bio}</p>
          </div>

          {/* Faehigkeiten */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2 font-outfit">
              <Tag className="w-4 h-4 text-slate-400" /> Faehigkeiten
            </h2>
            <div className="flex flex-wrap gap-2">
              {participant.skills.map((skill) => (
                <span key={skill} className="px-3 py-1.5 bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Team-Historie */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2 font-outfit">
              <Users className="w-4 h-4 text-slate-400" /> Team-Historie
            </h2>
            {teamHistory.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500 italic">Noch keiner Zuweisung zugeordnet.</p>
            ) : (
              <div className="space-y-3">
                {teamHistory.map((entry, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${entry.left ? 'bg-slate-300 dark:bg-slate-600' : 'bg-[#77CF97]'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-900 dark:text-white">{entry.teamName}</span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">({entry.role})</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {formatDate(entry.joined)} — {entry.left ? formatDate(entry.left) : 'Heute'}
                        {entry.left ? (
                          <span className="ml-1.5 text-slate-400 italic">Verlassen</span>
                        ) : (
                          <span className="ml-1.5 text-[#77CF97] italic">Aktuell</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Aktivitaets-Feed */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2 font-outfit">
              <Activity className="w-4 h-4 text-slate-400" /> Aktivitaeten
            </h2>
            {activities.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500 italic">Keine Aktivitaeten vorhanden.</p>
            ) : (
              <div className="space-y-3">
                {activities.map((act) => {
                  const ActIcon = act.icon;
                  return (
                    <div key={act.id} className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${act.color}`}>
                        <ActIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-slate-900 dark:text-white">{act.text}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{formatDate(act.date)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Rechte Spalte (1/3) */}
        <div className="space-y-6">
          {/* Details-Karte */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 font-outfit">Details</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Rolle</span>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${ROLE_COLORS[participant.role]}`}>{participant.role}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Erfahrung</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{participant.experience}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Voyage</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{participant.voyage}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Zeitzone</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {participant.timezone}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Verfuegbarkeit</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {participant.availability}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Beigetreten</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{formatDate(participant.joinedDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Status</span>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${statusConf.bgColor} ${statusConf.color}`}>{statusConf.label}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">GitHub</span>
                <a
                  href={`https://${participant.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center gap-1"
                >
                  <Globe className="w-3 h-3" /> {participant.github} <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Onboarding-Fortschritt */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 font-outfit">Onboarding-Fortschritt</h2>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">Fortschritt</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{participant.onboardingProgress}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#77CF97] rounded-full transition-all duration-500"
                style={{width: `${participant.onboardingProgress}%`}}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] text-slate-400">0%</span>
              <span className="text-[10px] text-slate-400">100%</span>
            </div>
          </div>

          {/* Schnellaktionen */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 font-outfit">Schnellaktionen</h2>
            <div className="space-y-2">
              <button className="w-full px-4 py-2.5 bg-[#77CF97]/10 text-[#77CF97] rounded-xl text-sm font-medium hover:bg-[#77CF97]/20 transition-colors flex items-center gap-2 cursor-pointer border border-[#77CF97]/20">
                <UserPlus className="w-4 h-4" /> Team zuweisen
              </button>
              <button className="w-full px-4 py-2.5 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-200 dark:hover:bg-white/10 transition-colors flex items-center gap-2 cursor-pointer border border-slate-200 dark:border-white/10">
                <MessageCircle className="w-4 h-4" /> Nachricht senden
              </button>
              <button className="w-full px-4 py-2.5 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-xl text-sm font-medium hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors flex items-center gap-2 cursor-pointer border border-rose-200 dark:border-rose-500/20">
                <Ban className="w-4 h-4" /> Deaktivieren
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
