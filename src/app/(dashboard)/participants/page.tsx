'use client';

import {useState, useEffect, useMemo} from 'react';
import {
  Users, Search, UserCheck, UserX, UserPlus,
  Shield, Code, Palette, Briefcase, Layers,
} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useDashboard} from '@/lib/auth-context';
import type {Participant, ParticipantRole, ExperienceLevel} from '@/types';

/** Mock-Daten fuer Teilnehmerverwaltung */
const MOCK_PARTICIPANTS: Participant[] = [
  {
    id: 'p-001',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    avatar: 'https://i.pravatar.cc/100?img=12',
    role: 'Fullstack',
    experience: 'Advanced',
    voyage: 'Voyage 51',
    teamId: 't-01',
    teamName: 'Alpha Team',
    status: 'active',
    onboardingProgress: 92,
    joinedDate: '2026-04-20',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    bio: 'Erfahrene Fullstack-Entwicklerin mit Leidenschaft fuer skalierbare Webanwendungen.',
    timezone: 'UTC-5 (EST)',
    availability: '20h/Woche',
    github: 'github.com/sjenkins',
  },
  {
    id: 'p-002',
    name: 'Michael Chang',
    email: 'm.chang@example.com',
    avatar: 'https://i.pravatar.cc/100?img=15',
    role: 'Frontend',
    experience: 'Intermediate',
    voyage: 'Voyage 51',
    teamId: 't-01',
    teamName: 'Alpha Team',
    status: 'active',
    onboardingProgress: 85,
    joinedDate: '2026-04-20',
    skills: ['React', 'CSS', 'Tailwind', 'Storybook'],
    bio: 'Frontend-Entwickler spezialisiert auf React und modernes CSS.',
    timezone: 'UTC+8 (SGT)',
    availability: '15h/Woche',
    github: 'github.com/mchang',
  },
  {
    id: 'p-003',
    name: 'Emily Chen',
    email: 'emily.chen@example.com',
    avatar: 'https://i.pravatar.cc/100?img=47',
    role: 'Frontend',
    experience: 'Advanced',
    voyage: 'Voyage 51',
    teamId: 't-02',
    teamName: 'Bravo Team',
    status: 'active',
    onboardingProgress: 100,
    joinedDate: '2026-04-20',
    skills: ['React', 'Next.js', 'TypeScript', 'GraphQL'],
    bio: 'Senior Frontend-Ingenieurin mit Expertise in React-Ökosystemen.',
    timezone: 'UTC+8 (CST)',
    availability: '25h/Woche',
    github: 'github.com-chen',
  },
  {
    id: 'p-004',
    name: 'David Rust',
    email: 'david.r@example.com',
    avatar: 'https://i.pravatar.cc/100?img=32',
    role: 'Backend',
    experience: 'Beginner',
    voyage: 'Voyage 51',
    teamId: null,
    teamName: null,
    status: 'pending',
    onboardingProgress: 30,
    joinedDate: '2026-05-01',
    skills: ['Python', 'Rust', 'Git'],
    bio: 'Aufstrebender Backend-Entwickler, lernt Rust und Python.',
    timezone: 'UTC+1 (CET)',
    availability: '10h/Woche',
    github: 'github.com/drust',
  },
  {
    id: 'p-005',
    name: 'Anna Kowalski',
    email: 'anna.k@example.com',
    avatar: 'https://i.pravatar.cc/100?img=23',
    role: 'Design',
    experience: 'Intermediate',
    voyage: 'Voyage 51',
    teamId: 't-02',
    teamName: 'Bravo Team',
    status: 'active',
    onboardingProgress: 78,
    joinedDate: '2026-04-21',
    skills: ['Figma', 'CSS', 'Prototyping', 'User Research'],
    bio: 'UI/UX-Designerin mit Fokus auf barrierefreie Gestaltung.',
    timezone: 'UTC+1 (CET)',
    availability: '20h/Woche',
    github: 'github.com/akowalski',
  },
  {
    id: 'p-006',
    name: 'Marcus Williams',
    email: 'marcus.w@example.com',
    avatar: 'https://i.pravatar.cc/100?img=53',
    role: 'Backend',
    experience: 'Advanced',
    voyage: 'Voyage 51',
    teamId: 't-03',
    teamName: 'Charlie Team',
    status: 'active',
    onboardingProgress: 95,
    joinedDate: '2026-04-20',
    skills: ['Go', 'PostgreSQL', 'Docker', 'Kubernetes'],
    bio: 'Backend-Architekt mit umfangreicher Erfahrung in Cloud-Infrastruktur.',
    timezone: 'UTC-8 (PST)',
    availability: '25h/Woche',
    github: 'github.com/mwilliams',
  },
  {
    id: 'p-007',
    name: 'Lena Schmidt',
    email: 'lena.s@example.com',
    avatar: 'https://i.pravatar.cc/100?img=26',
    role: 'Fullstack',
    experience: 'Intermediate',
    voyage: 'Voyage 51',
    teamId: 't-03',
    teamName: 'Charlie Team',
    status: 'active',
    onboardingProgress: 72,
    joinedDate: '2026-04-22',
    skills: ['Vue.js', 'Node.js', 'MongoDB', 'Redis'],
    bio: 'Fullstack-Entwicklerin mit Vorliebe fuer die JavaScript-Ökosysteme.',
    timezone: 'UTC+1 (CET)',
    availability: '18h/Woche',
    github: 'github.com/lschmidt',
  },
  {
    id: 'p-008',
    name: 'Tom Nguyen',
    email: 'tom.n@example.com',
    avatar: 'https://i.pravatar.cc/100?img=60',
    role: 'Product',
    experience: 'Advanced',
    voyage: 'Voyage 51',
    teamId: 't-01',
    teamName: 'Alpha Team',
    status: 'active',
    onboardingProgress: 88,
    joinedDate: '2026-04-20',
    skills: ['Product Strategy', 'Analytics', 'Agile', 'Roadmapping'],
    bio: 'Produktmanager mit Fokus auf datengetriebene Entscheidungen.',
    timezone: 'UTC-5 (EST)',
    availability: '20h/Woche',
    github: 'github.com/tnguyen',
  },
  {
    id: 'p-009',
    name: 'Priya Patel',
    email: 'priya.p@example.com',
    avatar: 'https://i.pravatar.cc/100?img=44',
    role: 'Frontend',
    experience: 'Beginner',
    voyage: 'Voyage 51',
    teamId: null,
    teamName: null,
    status: 'inactive',
    onboardingProgress: 15,
    joinedDate: '2026-05-05',
    skills: ['HTML', 'CSS', 'JavaScript'],
    bio: 'Einsteigerin im Webentwicklung mit Grundkenntnissen in HTML und CSS.',
    timezone: 'UTC+5:30 (IST)',
    availability: '12h/Woche',
    github: 'github.com/ppatel',
  },
  {
    id: 'p-010',
    name: 'Carlos Mendez',
    email: 'carlos.m@example.com',
    avatar: 'https://i.pravatar.cc/100?img=52',
    role: 'Backend',
    experience: 'Intermediate',
    voyage: 'Voyage 51',
    teamId: 't-02',
    teamName: 'Bravo Team',
    status: 'active',
    onboardingProgress: 68,
    joinedDate: '2026-04-23',
    skills: ['Java', 'Spring Boot', 'MySQL', 'AWS'],
    bio: 'Backend-Entwickler mit Erfahrung in Enterprise-Java-Anwendungen.',
    timezone: 'UTC-6 (CST)',
    availability: '15h/Woche',
    github: 'github.com/cmendez',
  },
  {
    id: 'p-011',
    name: 'Sophie Laurent',
    email: 'sophie.l@example.com',
    avatar: 'https://i.pravatar.cc/100?img=45',
    role: 'Design',
    experience: 'Advanced',
    voyage: 'Voyage 51',
    teamId: 't-03',
    teamName: 'Charlie Team',
    status: 'active',
    onboardingProgress: 90,
    joinedDate: '2026-04-20',
    skills: ['Figma', 'Illustration', 'Motion Design', 'Brand'],
    bio: 'Kreative Designerin mit Expertise in visuellen Identitaeten.',
    timezone: 'UTC+1 (CET)',
    availability: '22h/Woche',
    github: 'github.com/slaurent',
  },
  {
    id: 'p-012',
    name: 'James O\'Brien',
    email: 'james.ob@example.com',
    avatar: 'https://i.pravatar.cc/100?img=57',
    role: 'Fullstack',
    experience: 'Intermediate',
    voyage: 'Voyage 51',
    teamId: null,
    teamName: null,
    status: 'pending',
    onboardingProgress: 42,
    joinedDate: '2026-05-10',
    skills: ['React', 'Python', 'Django', 'PostgreSQL'],
    bio: 'Fullstack-Entwickler mit Interesse an Open-Source-Projekten.',
    timezone: 'UTC+0 (GMT)',
    availability: '16h/Woche',
    github: 'github.com/jobrien',
  },
];

/** Konfiguration fuer Rollenfarben */
const ROLE_COLORS: Record<ParticipantRole, string> = {
  Fullstack: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400',
  Frontend: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
  Backend: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Design: 'bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400',
  Product: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
};

/** Konfiguration fuer Rollen-Icons */
const ROLE_ICONS: Record<ParticipantRole, React.ElementType> = {
  Fullstack: Layers,
  Frontend: Code,
  Backend: Shield,
  Design: Palette,
  Product: Briefcase,
};

/** Konfiguration fuer Status-Badges */
const STATUS_CONFIG: Record<Participant['status'], {label: string; icon: React.ElementType; style: string}> = {
  active: {label: 'Active', icon: UserCheck, style: 'bg-[#77CF97]/10 text-[#77CF97] border border-[#77CF97]/20'},
  inactive: {label: 'Inactive', icon: UserX, style: 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-white/10'},
  pending: {label: 'Pending', icon: UserPlus, style: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20'},
};

/** Erfahrungsstufen-Konfiguration */
const EXPERIENCE_CONFIG: Record<ExperienceLevel, {label: string; style: string}> = {
  Beginner: {label: 'Beginner', style: 'text-slate-500 dark:text-slate-400'},
  Intermediate: {label: 'Intermediate', style: 'text-blue-500 dark:text-blue-400'},
  Advanced: {label: 'Advanced', style: 'text-[#77CF97]'},
};

/**
 * Teilnehmerverwaltungsseite (nur Admin).
 * Zeigt eine gefilterte Liste aller Voyage-Teilnehmer mit Statistiken.
 * Klick auf eine Zeile fueert zur Detail-Ansicht (Platzhalter).
 */
export default function ParticipantsPage() {
  const {role} = useDashboard();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Participant['status'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Nur Admin hat Zugriff
  useEffect(() => {
    if (role !== 'admin') {
      router.push('/overview');
    }
  }, [role, router]);

  if (role !== 'admin') return null;

  /** Statistik-Zahlen */
  const stats = useMemo(() => ({
    total: MOCK_PARTICIPANTS.length,
    active: MOCK_PARTICIPANTS.filter((p) => p.status === 'active').length,
    withTeam: MOCK_PARTICIPANTS.filter((p) => p.teamId !== null).length,
    withoutTeam: MOCK_PARTICIPANTS.filter((p) => p.teamId === null).length,
  }), []);

  /** Tab-Zaehler */
  const counts = useMemo(() => ({
    all: MOCK_PARTICIPANTS.length,
    active: MOCK_PARTICIPANTS.filter((p) => p.status === 'active').length,
    inactive: MOCK_PARTICIPANTS.filter((p) => p.status === 'inactive').length,
    pending: MOCK_PARTICIPANTS.filter((p) => p.status === 'pending').length,
  }), []);

  /** Gefilterte Teilnehmer */
  const filtered = useMemo(() => {
    return MOCK_PARTICIPANTS.filter((p) => {
      const matchesTab = activeTab === 'all' || p.status === activeTab;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(query) ||
        p.email.toLowerCase().includes(query) ||
        p.role.toLowerCase().includes(query) ||
        p.skills.some((s) => s.toLowerCase().includes(query)) ||
        (p.teamName && p.teamName.toLowerCase().includes(query));
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  /** Datumsformatierung */
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
  };

  return (
    <div className="space-y-6">
      {/* Seitenkopf */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-outfit font-medium text-slate-900 dark:text-white mb-1 tracking-tight">
            Participants
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Manage and track all voyage participants and their onboarding progress.
          </p>
        </div>
      </div>

      {/* Statistik-Karten */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {label: 'Total', value: stats.total, icon: Users, accent: 'text-slate-700 dark:text-slate-200'},
          {label: 'Active', value: stats.active, icon: UserCheck, accent: 'text-[#77CF97]'},
          {label: 'With Team', value: stats.withTeam, icon: Users, accent: 'text-blue-500'},
          {label: 'Without Team', value: stats.withoutTeam, icon: UserPlus, accent: 'text-amber-500'},
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</span>
              <stat.icon className={`w-4 h-4 ${stat.accent}`} />
            </div>
            <div className="text-2xl font-outfit font-semibold text-slate-900 dark:text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filter-Tabs + Suche */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2 border-b border-slate-200 dark:border-white/10 pb-px flex-1">
          {([
            {key: 'all' as const, label: `All (${counts.all})`},
            {key: 'active' as const, label: `Active (${counts.active})`},
            {key: 'inactive' as const, label: `Inactive (${counts.inactive})`},
            {key: 'pending' as const, label: `Pending (${counts.pending})`},
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 border-b-2 font-medium text-sm cursor-pointer transition-colors ${
                activeTab === tab.key
                  ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative">
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

      {/* Tabelle */}
      <div className="bg-white dark:bg-[#1a1b24] rounded-[24px] border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Experience</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Team</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Onboarding</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <Users className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400 text-sm">No participants found matching your criteria.</p>
                </td>
              </tr>
            )}
            {filtered.map((participant) => {
              const statusConf = STATUS_CONFIG[participant.status];
              const StatusIcon = statusConf.icon;
              const experienceConf = EXPERIENCE_CONFIG[participant.experience];
              const RoleIcon = ROLE_ICONS[participant.role];
              return (
                <tr
                  key={participant.id}
                  onClick={() => router.push(`/participants/${participant.id}`)}
                  className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={participant.avatar}
                        className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10"
                        alt=""
                      />
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {participant.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{participant.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${ROLE_COLORS[participant.role]}`}>
                      <RoleIcon className="w-3 h-3" /> {participant.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${experienceConf.style}`}>{experienceConf.label}</span>
                  </td>
                  <td className="px-6 py-4">
                    {participant.teamName ? (
                      <span className="text-sm text-slate-700 dark:text-slate-300">{participant.teamName}</span>
                    ) : (
                      <span className="text-sm text-slate-400 dark:text-slate-500 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConf.style}`}>
                      <StatusIcon className="w-3 h-3" /> {statusConf.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-20 h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#77CF97] rounded-full transition-all"
                          style={{width: `${participant.onboardingProgress}%`}}
                        />
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                        {participant.onboardingProgress}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                    {formatDate(participant.joinedDate)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
