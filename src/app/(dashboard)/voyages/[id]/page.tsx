'use client';

import {useState, useEffect, use} from 'react';
import {useRouter} from 'next/navigation';
import {
  ArrowLeft, Users, Calendar, Compass, Search,
  CheckCircle, Clock, Play, Archive, Target,
  UserPlus, Plus, Settings, ChevronRight, Mail,
  Activity, AlertTriangle, Star, CircleCheck,
  FileText, Trash2, Pencil, ListTodo,
} from 'lucide-react';
import type {
  Voyage, VoyageStatus, Participant, ParticipantRole,
  Team, TeamStatus,
} from '@/types';
import {useDashboard} from '@/lib/auth-context';

/**
 * Mock-Voyages fuer die Detailansicht.
 * In der Produktion werden diese Daten aus Supabase geladen.
 */
const MOCK_VOYAGES: Voyage[] = [
  {
    id: '51',
    name: 'Voyage 51',
    number: 51,
    status: 'active',
    startDate: '2026-04-20',
    endDate: '2026-06-20',
    applicationDeadline: '2026-04-01',
    participants: 128,
    teams: 18,
    description: 'Current active cohort. Application review phase with matched teams forming.',
  },
  {
    id: '50',
    name: 'Voyage 50',
    number: 50,
    status: 'completed',
    startDate: '2026-01-10',
    endDate: '2026-03-15',
    applicationDeadline: '2025-12-20',
    participants: 112,
    teams: 16,
    description: 'Winter cohort focused on full-stack projects with 16 delivered products.',
  },
  {
    id: '49',
    name: 'Voyage 49',
    number: 49,
    status: 'completed',
    startDate: '2025-10-05',
    endDate: '2025-12-20',
    applicationDeadline: '2025-09-15',
    participants: 98,
    teams: 14,
    description: 'Fall cohort. Highest completion rate to date at 87%.',
  },
  {
    id: '52',
    name: 'Voyage 52',
    number: 52,
    status: 'planning',
    startDate: '2026-07-15',
    endDate: '2026-10-01',
    applicationDeadline: '2026-06-30',
    participants: 0,
    teams: 0,
    description: 'Next summer cohort. Currently in the planning and outreach phase.',
  },
];

/**
 * Mock-Teilnehmer, die diesem Voyage zugeordnet sind.
 * In der Produktion werden diese Daten ueber die Voyage-ID gefiltert.
 */
const MOCK_VOYAGE_PARTICIPANTS: Record<string, Participant[]> = {
  '51': [
    {
      id: 'ptc-001',
      name: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      avatar: 'https://i.pravatar.cc/150?img=12',
      role: 'Fullstack',
      experience: 'Advanced',
      voyage: 'Voyage 51',
      teamId: 'team-nebula',
      teamName: 'Nebula Builders',
      status: 'active',
      onboardingProgress: 85,
      joinedDate: '2026-04-15',
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
      bio: 'Erfahrene Full-Stack-Entwicklerin mit Leidenschaft fuer skalierbare Webanwendungen.',
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
      teamId: 'team-flora',
      teamName: 'Flora Health',
      status: 'active',
      onboardingProgress: 60,
      joinedDate: '2026-04-22',
      skills: ['React', 'CSS', 'Figma', 'Storybook', 'Tailwind'],
      bio: 'Frontend-Entwickler mit Schwerpunkt React und modernem CSS.',
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
      skills: ['React', 'Next.js', 'TypeScript', 'GraphQL'],
      bio: 'Senior Frontend-Ingenieurin mit Expertise in React-Ecosystems.',
      timezone: 'UTC+8 (CST)',
      availability: '25 Stunden/Woche',
      github: 'github.com-chen',
    },
    {
      id: 'ptc-004',
      name: 'Bob Jones',
      email: 'bob.j@email.com',
      avatar: 'https://i.pravatar.cc/150?img=33',
      role: 'Backend',
      experience: 'Advanced',
      voyage: 'Voyage 51',
      teamId: 'team-nebula',
      teamName: 'Nebula Builders',
      status: 'active',
      onboardingProgress: 90,
      joinedDate: '2026-04-12',
      skills: ['Node.js', 'PostgreSQL', 'Redis', 'Docker', 'Go'],
      bio: 'Backend-Entwickler mit Erfahrung in verteilten Systemen und Mikroservices.',
      timezone: 'UTC+1 (CET)',
      availability: '22 Stunden/Woche',
      github: 'github.com/bjones',
    },
    {
      id: 'ptc-005',
      name: 'Charlie Davis',
      email: 'charlie.d@email.com',
      avatar: 'https://i.pravatar.cc/150?img=52',
      role: 'Fullstack',
      experience: 'Intermediate',
      voyage: 'Voyage 51',
      teamId: 'team-nebula',
      teamName: 'Nebula Builders',
      status: 'active',
      onboardingProgress: 70,
      joinedDate: '2026-04-18',
      skills: ['React', 'Python', 'FastAPI', 'MongoDB'],
      bio: 'Fullstack-Entwickler mit Leidenschaft fuer KI-gestuetzte Anwendungen.',
      timezone: 'UTC-6 (CST)',
      availability: '18 Stunden/Woche',
      github: 'github.com/cdavis',
    },
    {
      id: 'ptc-006',
      name: 'Diana Lee',
      email: 'diana.l@email.com',
      avatar: 'https://i.pravatar.cc/150?img=44',
      role: 'Design',
      experience: 'Advanced',
      voyage: 'Voyage 51',
      teamId: 'team-nebula',
      teamName: 'Nebula Builders',
      status: 'active',
      onboardingProgress: 80,
      joinedDate: '2026-04-14',
      skills: ['Figma', 'UI/UX', 'Design Systems', 'Prototyping', 'Tailwind'],
      bio: 'Designerin mit Fokus auf barrierefreie und skalierbare Design-Systeme.',
      timezone: 'UTC+9 (JST)',
      availability: '16 Stunden/Woche',
      github: 'github.com/dlee',
    },
    {
      id: 'ptc-007',
      name: 'Eve Wilson',
      email: 'eve.w@email.com',
      avatar: 'https://i.pravatar.cc/150?img=45',
      role: 'Fullstack',
      experience: 'Advanced',
      voyage: 'Voyage 51',
      teamId: 'team-apollo',
      teamName: 'Apollo Strike',
      status: 'active',
      onboardingProgress: 95,
      joinedDate: '2026-04-10',
      skills: ['TypeScript', 'React', 'Node.js', 'Prisma', 'AWS'],
      bio: 'Technische Teamleiterin mit 5+ Jahren Erfahrung in agilen Teams.',
      timezone: 'UTC+0 (GMT)',
      availability: '24 Stunden/Woche',
      github: 'github.com/ewilson',
    },
    {
      id: 'ptc-008',
      name: 'Frank Miller',
      email: 'frank.m@email.com',
      avatar: 'https://i.pravatar.cc/150?img=53',
      role: 'Backend',
      experience: 'Intermediate',
      voyage: 'Voyage 51',
      teamId: 'team-apollo',
      teamName: 'Apollo Strike',
      status: 'active',
      onboardingProgress: 55,
      joinedDate: '2026-04-25',
      skills: ['Java', 'Spring Boot', 'Kubernetes', 'PostgreSQL'],
      bio: 'Backend-Ingenieur mit Schwerpunkt auf Cloud-native Architekturen.',
      timezone: 'UTC-7 (PST)',
      availability: '15 Stunden/Woche',
      github: 'github.com/fmiller',
    },
    {
      id: 'ptc-009',
      name: 'Grace Hall',
      email: 'grace.h@email.com',
      avatar: 'https://i.pravatar.cc/150?img=26',
      role: 'Frontend',
      experience: 'Intermediate',
      voyage: 'Voyage 51',
      teamId: 'team-flora',
      teamName: 'Flora Health',
      status: 'active',
      onboardingProgress: 75,
      joinedDate: '2026-04-16',
      skills: ['React', 'Vue.js', 'TypeScript', 'Tailwind CSS'],
      bio: 'Frontend-Entwicklerin mit Leidenschaft fuer saubere, komponentenbasierte Architekturen.',
      timezone: 'UTC+1 (CET)',
      availability: '20 Stunden/Woche',
      github: 'github.com/ghall',
    },
    {
      id: 'ptc-010',
      name: 'Henry Scott',
      email: 'henry.s@email.com',
      avatar: 'https://i.pravatar.cc/150?img=57',
      role: 'Backend',
      experience: 'Beginner',
      voyage: 'Voyage 51',
      teamId: 'team-flora',
      teamName: 'Flora Health',
      status: 'active',
      onboardingProgress: 40,
      joinedDate: '2026-05-01',
      skills: ['Python', 'Django', 'REST APIs'],
      bio: 'Einstiegs-Backend-Entwickler, begeistert von Datenbankdesign und API-Architektur.',
      timezone: 'UTC+0 (GMT)',
      availability: '12 Stunden/Woche',
      github: 'github.com/hscott',
    },
    {
      id: 'ptc-011',
      name: 'Ivy Young',
      email: 'ivy.y@email.com',
      avatar: 'https://i.pravatar.cc/150?img=23',
      role: 'Design',
      experience: 'Intermediate',
      voyage: 'Voyage 51',
      teamId: 'team-flora',
      teamName: 'Flora Health',
      status: 'active',
      onboardingProgress: 65,
      joinedDate: '2026-04-20',
      skills: ['Figma', 'Adobe XD', 'Motion Design', 'Accessibility'],
      bio: 'UI/Designerin mit Fokus auf emotionale Benutzererfahrung.',
      timezone: 'UTC-3 (ART)',
      availability: '18 Stunden/Woche',
      github: 'github.com/iyoung',
    },
    {
      id: 'ptc-012',
      name: 'Jack Adams',
      email: 'jack.a@email.com',
      avatar: 'https://i.pravatar.cc/150?img=59',
      role: 'Fullstack',
      experience: 'Advanced',
      voyage: 'Voyage 51',
      teamId: 'team-bolt',
      teamName: 'Bolt Finance',
      status: 'active',
      onboardingProgress: 88,
      joinedDate: '2026-04-11',
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Stripe'],
      bio: 'Fullstack-Ingenieur mit FinTech-Erfahrung und Leidenschaft fuer Payments.',
      timezone: 'UTC-5 (EST)',
      availability: '22 Stunden/Woche',
      github: 'github.com/jadams',
    },
  ],
  '50': [
    {
      id: 'ptc-050',
      name: 'Nina Evans',
      email: 'nina.e@email.com',
      avatar: 'https://i.pravatar.cc/150?img=24',
      role: 'Frontend',
      experience: 'Advanced',
      voyage: 'Voyage 50',
      teamId: 'team-050-a',
      teamName: 'Team Horizon',
      status: 'inactive',
      onboardingProgress: 100,
      joinedDate: '2026-01-12',
      skills: ['React', 'Next.js', 'TypeScript', 'Storybook'],
      bio: 'Senior Frontend-Ingenieurin.',
      timezone: 'UTC+1 (CET)',
      availability: '20 Stunden/Woche',
      github: 'github.com/nevans',
    },
    {
      id: 'ptc-051',
      name: 'Oscar Fisher',
      email: 'oscar.f@email.com',
      avatar: 'https://i.pravatar.cc/150?img=60',
      role: 'Backend',
      experience: 'Advanced',
      voyage: 'Voyage 50',
      teamId: 'team-050-a',
      teamName: 'Team Horizon',
      status: 'inactive',
      onboardingProgress: 100,
      joinedDate: '2026-01-15',
      skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
      bio: 'Backend-Entwickler mit DevOps-Erfahrung.',
      timezone: 'UTC+0 (GMT)',
      availability: '18 Stunden/Woche',
      github: 'github.com/ofisher',
    },
  ],
};

/**
 * Mock-Teams, die diesem Voyage zugeordnet sind.
 * In der Produktion werden diese Daten ueber die Voyage-ID gefiltert.
 */
const MOCK_VOYAGE_TEAMS: Record<string, Team[]> = {
  '51': [
    {
      id: 'team-nebula',
      name: 'Nebula Builders',
      status: 'active',
      voyage: 'Voyage 51',
      members: [
        {id: 'm1', name: 'Sarah Jenkins', avatar: '12', role: 'Fullstack', email: 'sarah.j@example.com', isLead: true},
        {id: 'm2', name: 'Bob Jones', avatar: '33', role: 'Backend', email: 'bob.j@email.com', isLead: false},
        {id: 'm3', name: 'Charlie Davis', avatar: '52', role: 'Fullstack', email: 'charlie.d@email.com', isLead: false},
        {id: 'm13', name: 'Diana Lee', avatar: '44', role: 'Design', email: 'diana.l@email.com', isLead: false},
      ],
      createdAt: '2026-04-01',
      description: 'Building a decentralized marketplace for digital assets with cross-chain compatibility.',
      sharedOverlap: '4.5h/Tag',
      mentor: 'Dr. Sarah Connor',
    },
    {
      id: 'team-apollo',
      name: 'Apollo Strike',
      status: 'at_risk',
      voyage: 'Voyage 51',
      members: [
        {id: 'm4', name: 'Eve Wilson', avatar: '45', role: 'Fullstack', email: 'eve.w@email.com', isLead: true},
        {id: 'm5', name: 'Frank Miller', avatar: '53', role: 'Backend', email: 'frank.m@email.com', isLead: false},
      ],
      createdAt: '2026-04-15',
      description: 'AI-powered VS Code extension for real-time refactoring and style guide enforcement.',
      sharedOverlap: '3h/Tag',
      mentor: 'Prof. James Wright',
    },
    {
      id: 'team-flora',
      name: 'Flora Health',
      status: 'active',
      voyage: 'Voyage 51',
      members: [
        {id: 'm6', name: 'Grace Hall', avatar: '26', role: 'Frontend', email: 'grace.h@email.com', isLead: true},
        {id: 'm7', name: 'Henry Scott', avatar: '57', role: 'Backend', email: 'henry.s@email.com', isLead: false},
        {id: 'm8', name: 'Ivy Young', avatar: '23', role: 'Design', email: 'ivy.y@email.com', isLead: false},
        {id: 'm88', name: 'Michael Chang', avatar: '15', role: 'Frontend', email: 'm.chang@example.com', isLead: false},
      ],
      createdAt: '2026-04-10',
      description: 'Mental health journal app utilizing sentiment analysis to track mood trends.',
      sharedOverlap: '5h/Tag',
      mentor: 'Dr. Emily Chen',
    },
    {
      id: 'team-bolt',
      name: 'Bolt Finance',
      status: 'active',
      voyage: 'Voyage 51',
      members: [
        {id: 'm9', name: 'Jack Adams', avatar: '59', role: 'Fullstack', email: 'jack.a@email.com', isLead: true},
      ],
      createdAt: '2026-04-05',
      description: 'Micro-budgeting tool for college students with automatic round-up savings.',
      sharedOverlap: '4h/Tag',
      mentor: 'Dr. Sarah Connor',
    },
  ],
  '50': [
    {
      id: 'team-050-a',
      name: 'Team Horizon',
      status: 'completed',
      voyage: 'Voyage 50',
      members: [
        {id: 'm50a', name: 'Nina Evans', avatar: '24', role: 'Frontend', email: 'nina.e@email.com', isLead: true},
        {id: 'm50b', name: 'Oscar Fisher', avatar: '60', role: 'Backend', email: 'oscar.f@email.com', isLead: false},
      ],
      createdAt: '2026-01-10',
      description: 'Full-stack project management tool for remote teams.',
      sharedOverlap: '4h/Tag',
      mentor: 'Dr. Sarah Connor',
    },
  ],
};

/**
 * Mock-Meilensteine fuer die Voyage-Timeline.
 * In der Produktion werden diese Daten aus Supabase geladen.
 */
const MOCK_MILESTONES: Record<string, {id: string; title: string; date: string; completed: boolean; icon: React.ElementType}[]> = {
  '51': [
    {id: 'ms1', title: 'Application Period Opens', date: '2026-03-15', completed: true, icon: FileText},
    {id: 'ms2', title: 'Application Deadline', date: '2026-04-01', completed: true, icon: Clock},
    {id: 'ms3', title: 'Review Phase Complete', date: '2026-04-15', completed: true, icon: CheckCircle},
    {id: 'ms4', title: 'Voyage Kickoff', date: '2026-04-20', completed: true, icon: Play},
    {id: 'ms5', title: 'Team Formation Deadline', date: '2026-05-01', completed: true, icon: Users},
    {id: 'ms6', title: 'Sprint 1 Review', date: '2026-05-15', completed: true, icon: Target},
    {id: 'ms7', title: 'Mid-Voyage Check-in', date: '2026-05-30', completed: false, icon: Activity},
    {id: 'ms8', title: 'Sprint 3 Review', date: '2026-06-10', completed: false, icon: Target},
    {id: 'ms9', title: 'Demo Day', date: '2026-06-18', completed: false, icon: Star},
    {id: 'ms10', title: 'Voyage End', date: '2026-06-20', completed: false, icon: Archive},
  ],
  '50': [
    {id: 'ms50-1', title: 'Application Deadline', date: '2025-12-20', completed: true, icon: Clock},
    {id: 'ms50-2', title: 'Voyage Kickoff', date: '2026-01-10', completed: true, icon: Play},
    {id: 'ms50-3', title: 'Team Formation', date: '2026-01-20', completed: true, icon: Users},
    {id: 'ms50-4', title: 'Mid-Voyage Review', date: '2026-02-10', completed: true, icon: Activity},
    {id: 'ms50-5', title: 'Demo Day', date: '2026-03-10', completed: true, icon: Star},
    {id: 'ms50-6', title: 'Voyage End', date: '2026-03-15', completed: true, icon: Archive},
  ],
};

/** Konfiguration fuer Voyage-Status Badges */
const VOYAGE_STATUS_CONFIG: Record<VoyageStatus, {label: string; icon: React.ElementType; color: string}> = {
  planning: {label: 'Planning', icon: Clock, color: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20'},
  active: {label: 'Active', icon: Play, color: 'bg-[#77CF97]/10 text-[#77CF97] border border-[#77CF97]/20'},
  review: {label: 'Review', icon: CircleCheck, color: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20'},
  completed: {label: 'Completed', icon: Archive, color: 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-white/10'},
};

/** Konfiguration fuer Teilnehmer-Status Badges */
const PARTICIPANT_STATUS_CONFIG: Record<Participant['status'], {label: string; color: string; bgColor: string}> = {
  active: {label: 'Active', color: 'text-[#77CF97]', bgColor: 'bg-[#77CF97]/10 border border-[#77CF97]/20'},
  inactive: {label: 'Inactive', color: 'text-slate-500', bgColor: 'bg-slate-100 dark:bg-white/10 border border-slate-200/50 dark:border-white/10'},
  pending: {label: 'Pending', color: 'text-amber-500', bgColor: 'bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20'},
};

/** Konfiguration fuer Teamstatus Badges */
const TEAM_STATUS_CONFIG: Record<TeamStatus, {label: string; icon: React.ElementType; color: string; bgColor: string}> = {
  active: {label: 'Active', icon: CheckCircle, color: 'text-[#77CF97]', bgColor: 'bg-[#77CF97]/10 text-[#77CF97] border border-[#77CF97]/20'},
  at_risk: {label: 'At Risk', icon: AlertTriangle, color: 'text-rose-500', bgColor: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20'},
  forming: {label: 'Forming', icon: Clock, color: 'text-slate-600 dark:text-slate-300', bgColor: 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-white/10'},
  completed: {label: 'Completed', icon: Star, color: 'text-amber-500', bgColor: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20'},
};

/** Rollenfarben fuer Teilnehmer */
const ROLE_COLORS: Record<ParticipantRole, string> = {
  Fullstack: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400',
  Frontend: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
  Backend: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Design: 'bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400',
  Product: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
};

/**
 * Detailseite fuer ein einzelnes Voyage (Admin-Ansicht).
 * Zeigt Uebersicht, Statistiken, Teilnehmer, Teams, Meilensteine und Aktionen.
 */
export default function VoyageDetailPage({params}: {params: Promise<{id: string}>}) {
  const {id} = use(params);
  const router = useRouter();
  const {role} = useDashboard();
  const [voyage, setVoyage] = useState<Voyage | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [milestones, setMilestones] = useState<{id: string; title: string; date: string; completed: boolean; icon: React.ElementType}[]>([]);
  const [participantSearch, setParticipantSearch] = useState('');
  const [participantRoleFilter, setParticipantRoleFilter] = useState<ParticipantRole | 'all'>('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({name: '', description: '', startDate: '', endDate: '', applicationDeadline: ''});

  /** Nur Admin hat Zugriff */
  useEffect(() => {
    if (role !== 'admin') {
      router.push('/overview');
    }
  }, [role, router]);

  /** Mock-Daten laden basierend auf der ID */
  useEffect(() => {
    const found = MOCK_VOYAGES.find((v) => v.id === id);
    if (found) {
      setVoyage(found);
      setParticipants(MOCK_VOYAGE_PARTICIPANTS[id] || []);
      setTeams(MOCK_VOYAGE_TEAMS[id] || []);
      setMilestones(MOCK_MILESTONES[id] || []);
      setEditForm({
        name: found.name,
        description: found.description,
        startDate: found.startDate,
        endDate: found.endDate,
        applicationDeadline: found.applicationDeadline,
      });
    }
  }, [id]);

  /** Datumsformatierung */
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
  };

  /** Tage bis zum Ende berechnen */
  const daysRemaining = (end: string) => {
    const diff = new Date(end).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  /** Fortschrittsprozentsatz berechnen */
  const voyageProgress = (start: string, end: string) => {
    const now = Date.now();
    const startMs = new Date(start).getTime();
    const endMs = new Date(end).getTime();
    return Math.min(100, Math.max(0, ((now - startMs) / (endMs - startMs)) * 100));
  };

  /** Durchschnittlichen Onboarding-Fortschritt berechnen */
  const avgOnboarding = participants.length > 0
    ? Math.round(participants.reduce((sum, p) => sum + p.onboardingProgress, 0) / participants.length)
    : 0;

  /** Gefilterte Teilnehmer */
  const filteredParticipants = participants.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(participantSearch.toLowerCase()) ||
      p.email.toLowerCase().includes(participantSearch.toLowerCase());
    const matchesRole = participantRoleFilter === 'all' || p.role === participantRoleFilter;
    return matchesSearch && matchesRole;
  });

  /** Edit-Modal oeffnen */
  const openEditModal = () => {
    if (voyage) {
      setEditForm({
        name: voyage.name,
        description: voyage.description,
        startDate: voyage.startDate,
        endDate: voyage.endDate,
        applicationDeadline: voyage.applicationDeadline,
      });
      setShowEditModal(true);
    }
  };

  /** Voyage speichern */
  const handleSaveEdit = () => {
    if (voyage) {
      setVoyage((prev) => prev ? {...prev, ...editForm} : prev);
      setShowEditModal(false);
    }
  };

  /** Fortschritt pro Team (deterministisch basierend auf Status) */
  const teamProgress = (team: Team) => {
    if (team.status === 'completed') return 100;
    if (team.status === 'active') return 55;
    if (team.status === 'forming') return 15;
    return 0;
  };

  if (!voyage || role !== 'admin') return null;

  const statusConf = VOYAGE_STATUS_CONFIG[voyage.status];
  const StatusIcon = statusConf.icon;
  const progress = voyageProgress(voyage.startDate, voyage.endDate);
  const remaining = daysRemaining(voyage.endDate);

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      {/* Zurueck-Navigation */}
      <button
        onClick={() => router.push('/voyages')}
        className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Voyages
      </button>

      {/* Kopfbereich */}
      <div className="bg-white dark:bg-[#1a1b24] rounded-[24px] border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-[#77CF97]/10 flex items-center justify-center shrink-0">
                <Compass className="w-6 h-6 text-[#77CF97]" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-[28px] font-outfit font-medium text-slate-900 dark:text-white tracking-tight">
                    {voyage.name}
                  </h1>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConf.color}`}>
                    <StatusIcon className="w-3 h-3" /> {statusConf.label}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(voyage.startDate)} — {formatDate(voyage.endDate)}
                  </span>
                  {voyage.status === 'active' && (
                    <span className="flex items-center gap-1 text-[#77CF97]">
                      <Clock className="w-3.5 h-3.5" />
                      {remaining} days remaining
                    </span>
                  )}
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed max-w-2xl">
              {voyage.description}
            </p>
          </div>

          {/* Aktionen (nur Admin) */}
          {role === 'admin' && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={openEditModal}
                className="px-4 py-2 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-200 dark:hover:bg-white/10 transition-colors flex items-center gap-2 cursor-pointer border border-slate-200 dark:border-white/10"
              >
                <Pencil className="w-4 h-4" /> Edit
              </button>
              <button
                className="px-4 py-2 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-xl text-sm font-medium hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors flex items-center gap-2 cursor-pointer border border-rose-100 dark:border-rose-500/20"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          )}
        </div>

        {/* Fortschrittsbalken fuer aktive Voyages */}
        {voyage.status === 'active' && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Voyage Progress</span>
              <span className="text-xs font-semibold text-slate-900 dark:text-white">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#77CF97] rounded-full transition-all duration-500"
                style={{width: `${progress}%`}}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-slate-400">{formatDate(voyage.startDate)}</span>
              <span className="text-[10px] text-slate-400">{formatDate(voyage.endDate)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Statistik-Karten */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {label: 'Participants', value: voyage.participants, icon: Users, accent: 'text-slate-700 dark:text-slate-200'},
          {label: 'Teams Formed', value: voyage.teams, icon: Target, accent: 'text-[#77CF97]'},
          {label: 'Avg. Onboarding', value: `${avgOnboarding}%`, icon: ListTodo, accent: 'text-blue-500'},
          {label: voyage.status === 'active' ? 'Days Remaining' : 'Duration', value: voyage.status === 'active' ? remaining : `${Math.ceil((new Date(voyage.endDate).getTime() - new Date(voyage.startDate).getTime()) / (1000 * 60 * 60 * 24))}d`, icon: Clock, accent: 'text-amber-500'},
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

      {/* Zwei-Spalten-Layout: 2/3 + 1/3 */}
      <div className="grid grid-cols-3 gap-6">
        {/* Linke Spalte (2/3) */}
        <div className="col-span-2 space-y-6">
          {/* Teilnehmer-Liste */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-[24px] border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 font-outfit">
                <Users className="w-4 h-4 text-slate-400" /> Participants ({filteredParticipants.length})
              </h2>
              {role === 'admin' && (
                <button className="px-3 py-1.5 bg-[#77CF97]/10 text-[#77CF97] rounded-lg text-xs font-medium hover:bg-[#77CF97]/20 transition-colors flex items-center gap-1.5 cursor-pointer border border-[#77CF97]/20">
                  <UserPlus className="w-3.5 h-3.5" /> Add
                </button>
              )}
            </div>

            {/* Suche und Filter */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search participants..."
                  value={participantSearch}
                  onChange={(e) => setParticipantSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#77CF97]/30 focus:border-[#77CF97]/50 transition-all"
                />
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {(['all', 'Frontend', 'Backend', 'Fullstack', 'Design'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setParticipantRoleFilter(r)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      participantRoleFilter === r
                        ? 'bg-[#77CF97]/10 text-[#77CF97] border border-[#77CF97]/20'
                        : 'bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-transparent hover:bg-slate-100 dark:hover:bg-white/10'
                    }`}
                  >
                    {r === 'all' ? 'All' : r}
                  </button>
                ))}
              </div>
            </div>

            {/* Teilnehmer-Liste */}
            <div className="space-y-2">
              {filteredParticipants.length === 0 && (
                <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-6">No participants found.</p>
              )}
              {filteredParticipants.map((p) => {
                const pStatusConf = PARTICIPANT_STATUS_CONFIG[p.status];
                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <img
                      src={p.avatar}
                      className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 shrink-0"
                      alt={p.name}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-900 dark:text-white truncate">{p.name}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${ROLE_COLORS[p.role]}`}>
                          {p.role}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${pStatusConf.bgColor} ${pStatusConf.color}`}>
                          {pStatusConf.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                          <Mail className="w-2.5 h-2.5" /> {p.email}
                        </span>
                        {p.teamName && (
                          <span className="text-[11px] text-[#77CF97] font-medium flex items-center gap-1">
                            <Users className="w-2.5 h-2.5" /> {p.teamName}
                          </span>
                        )}
                        {!p.teamName && (
                          <span className="text-[11px] text-slate-400 italic">Unassigned</span>
                        )}
                      </div>
                    </div>
                    {/* Onboarding-Fortschritt */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-20 h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#77CF97] rounded-full transition-all"
                          style={{width: `${p.onboardingProgress}%`}}
                        />
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 w-8 text-right">{p.onboardingProgress}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Teams-Liste */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-[24px] border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 font-outfit">
                <Target className="w-4 h-4 text-slate-400" /> Teams ({teams.length})
              </h2>
              {role === 'admin' && (
                <button className="px-3 py-1.5 bg-[#77CF97]/10 text-[#77CF97] rounded-lg text-xs font-medium hover:bg-[#77CF97]/20 transition-colors flex items-center gap-1.5 cursor-pointer border border-[#77CF97]/20">
                  <Plus className="w-3.5 h-3.5" /> Create Team
                </button>
              )}
            </div>
            <div className="space-y-3">
              {teams.length === 0 && (
                <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-6">No teams formed yet.</p>
              )}
              {teams.map((team) => {
                const tStatusConf = TEAM_STATUS_CONFIG[team.status];
                const TeamStatusIcon = tStatusConf.icon;
                return (
                  <button
                    key={team.id}
                    onClick={() => router.push(`/teams/${team.id}`)}
                    className="w-full text-left p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl hover:shadow-md dark:hover:shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-[#77CF97] transition-colors">
                            {team.name}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${tStatusConf.bgColor}`}>
                            <TeamStatusIcon className="w-2.5 h-2.5" /> {tStatusConf.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">{team.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                            <Users className="w-3 h-3" /> {team.members.length} members
                          </span>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Overlap: {team.sharedOverlap}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#77CF97] transition-colors shrink-0 mt-1" />
                    </div>
                    {/* Fortschrittsbalken */}
                    <div className="mt-3">
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#77CF97] rounded-full transition-all"
                          style={{width: `${teamProgress(team)}%`}}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rechte Spalte (1/3) */}
        <div className="space-y-6">
          {/* Meilenstein-Timeline */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-[24px] border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2 font-outfit">
              <Activity className="w-4 h-4 text-slate-400" /> Milestones
            </h2>
            <div className="space-y-0">
              {milestones.map((ms, i) => {
                const isLast = i === milestones.length - 1;
                const MsIcon = ms.icon;
                return (
                  <div key={ms.id} className="flex gap-3">
                    {/* Zeitlinie */}
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        ms.completed
                          ? 'bg-[#77CF97]/20 text-[#77CF97]'
                          : 'bg-slate-100 dark:bg-white/5 text-slate-400'
                      }`}>
                        <MsIcon className="w-3 h-3" />
                      </div>
                      {!isLast && (
                        <div className={`w-px flex-1 my-1 ${ms.completed ? 'bg-[#77CF97]/30' : 'bg-slate-200 dark:bg-white/10'}`} />
                      )}
                    </div>
                    {/* Inhalt */}
                    <div className="pb-4">
                      <p className={`text-xs font-medium ${ms.completed ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                        {ms.title}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                        {formatDate(ms.date)}
                        {ms.completed && (
                          <span className="ml-1.5 text-[#77CF97]">Completed</span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Voyage-Details */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-[24px] border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2 font-outfit">
              <Settings className="w-4 h-4 text-slate-400" /> Voyage Details
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Status</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConf.color}`}>
                  <StatusIcon className="w-3 h-3" /> {statusConf.label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Number</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">#{voyage.number}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Start</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{formatDate(voyage.startDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">End</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{formatDate(voyage.endDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Application Deadline</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{formatDate(voyage.applicationDeadline)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Participants</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{voyage.participants}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Teams</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{voyage.teams}</span>
              </div>
            </div>
          </div>

          {/* Schnellaktionen */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-[24px] border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 font-outfit">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between px-4 py-3 bg-[#77CF97]/10 dark:bg-[#77CF97]/10 text-[#77CF97] rounded-xl text-sm font-medium hover:bg-[#77CF97]/20 dark:hover:bg-[#77CF97]/20 transition-colors cursor-pointer border border-[#77CF97]/20">
                <span className="flex items-center gap-2"><UserPlus className="w-4 h-4" /> Add Participant</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer border border-slate-200 dark:border-white/10">
                <span className="flex items-center gap-2"><Plus className="w-4 h-4" /> Create Team</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={openEditModal}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer border border-slate-200 dark:border-white/10"
              >
                <span className="flex items-center gap-2"><Settings className="w-4 h-4" /> Edit Settings</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Voyage bearbeiten */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-100 dark:border-white/10">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Edit {voyage.name}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Update the voyage configuration and dates.
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Voyage Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm((f) => ({...f, name: e.target.value}))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#77CF97]/30 focus:border-[#77CF97]/50 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Start Date</label>
                  <input
                    type="date"
                    value={editForm.startDate}
                    onChange={(e) => setEditForm((f) => ({...f, startDate: e.target.value}))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#77CF97]/30 focus:border-[#77CF97]/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">End Date</label>
                  <input
                    type="date"
                    value={editForm.endDate}
                    onChange={(e) => setEditForm((f) => ({...f, endDate: e.target.value}))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#77CF97]/30 focus:border-[#77CF97]/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Application Deadline</label>
                <input
                  type="date"
                  value={editForm.applicationDeadline}
                  onChange={(e) => setEditForm((f) => ({...f, applicationDeadline: e.target.value}))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#77CF97]/30 focus:border-[#77CF97]/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm((f) => ({...f, description: e.target.value}))}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#77CF97]/30 focus:border-[#77CF97]/50 transition-all resize-none"
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={!editForm.name || !editForm.startDate || !editForm.endDate}
                className="px-5 py-2 bg-[#0b0c10] dark:bg-[#77CF97] text-white dark:text-[#0b0c10] rounded-xl text-sm font-medium hover:bg-slate-800 dark:hover:bg-[#5ab87e] transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
