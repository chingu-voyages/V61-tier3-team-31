'use client';

import {useState, useEffect, use} from 'react';
import {useRouter} from 'next/navigation';
import {
  ArrowLeft, CheckCircle, XCircle, Edit3, Bell, Clock, MapPin,
  Users, Globe, Star, AlertTriangle, Sparkles, BarChart3, Shield,
} from 'lucide-react';
import type {MatchResult, MatchMember, ParticipantRole} from '@/types';
import {useDashboard} from '@/lib/auth-context';

/**
 * Konfiguration fuer Match-Status Badges.
 * Definiert Label, Farbe und Hintergrund fuer jeden Status.
 */
const STATUS_CONFIG: Record<MatchResult['status'], {label: string; color: string; bgColor: string; icon: React.ElementType}> = {
  suggested: {label: 'Suggested', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20', icon: Sparkles},
  confirmed: {label: 'Confirmed', color: 'text-[#77CF97]', bgColor: 'bg-[#77CF97]/10 border border-[#77CF97]/20', icon: CheckCircle},
  rejected: {label: 'Rejected', color: 'text-rose-500', bgColor: 'bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20', icon: XCircle},
};

/**
 * Rollenfarben fuer Teilnehmer-Badges.
 */
const ROLE_COLORS: Record<ParticipantRole, string> = {
  Fullstack: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400',
  Frontend: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
  Backend: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Design: 'bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400',
  Product: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
};

/**
 * Mock-Match-Daten fuer die Detailansicht.
 * In der Produktion werden diese Daten aus Supabase geladen.
 */
const MOCK_MATCHES: MatchResult[] = [
  {
    id: 'match-001',
    teamName: 'Alpha Core',
    voyage: 'Voyage 51',
    compatibilityScore: 92,
    matchedAt: '2026-06-20T14:30:00Z',
    status: 'confirmed',
    skillsOverlap: 85,
    timezoneAlignment: 95,
    experienceBalance: 88,
    rationale:
      'Dieses Team wurde aufgrund einer hohen technischen Komplementaritaet gebildet. Alice bringt starke Frontend-Expertise in React und TypeScript mit, waehrend Bob als Backend-Spezialist die API- und Datenbank-Architektur uebernimmt. Charlie als Fullstack-Entwickler verbindet beide Bereiche und sorgt fuer reibungslose Integration. Alle drei haben ueberlappende Erfahrung mit Node.js, was die Zusammenarbeit erleichtert. Die Zeitzone EST/CST ermoeglicht ueberlappende Arbeitszeiten von mindestens 6 Stunden pro Tag.',
    members: [
      {
        participantId: 'p-001',
        name: 'Alice Smith',
        avatar: 'https://i.pravatar.cc/100?img=1',
        role: 'Frontend',
        experience: 'Advanced',
        skills: ['React', 'TypeScript', 'CSS', 'Figma', 'Next.js'],
        timezone: 'UTC-5 (EST)',
        matchContribution: 32,
      },
      {
        participantId: 'p-002',
        name: 'Bob Jones',
        avatar: 'https://i.pravatar.cc/100?img=2',
        role: 'Backend',
        experience: 'Advanced',
        skills: ['Node.js', 'PostgreSQL', 'Docker', 'AWS', 'GraphQL'],
        timezone: 'UTC-6 (CST)',
        matchContribution: 30,
      },
      {
        participantId: 'p-003',
        name: 'Charlie Davis',
        avatar: 'https://i.pravatar.cc/100?img=3',
        role: 'Fullstack',
        experience: 'Intermediate',
        skills: ['React', 'Node.js', 'TypeScript', 'Tailwind', 'Git'],
        timezone: 'UTC-5 (EST)',
        matchContribution: 22,
      },
      {
        participantId: 'p-004',
        name: 'Diana Prince',
        avatar: 'https://i.pravatar.cc/100?img=4',
        role: 'Design',
        experience: 'Intermediate',
        skills: ['Figma', 'CSS', 'Tailwind', 'Accessibility', 'Motion Design'],
        timezone: 'UTC-5 (EST)',
        matchContribution: 16,
      },
    ],
  },
  {
    id: 'match-002',
    teamName: 'Beta Squad',
    voyage: 'Voyage 51',
    compatibilityScore: 74,
    matchedAt: '2026-06-21T09:15:00Z',
    status: 'suggested',
    skillsOverlap: 68,
    timezoneAlignment: 60,
    experienceBalance: 82,
    rationale:
      'Dieses Team kombiniert Backend-Expertise mit Product-Management-Faehigkeiten. Eve bringt erfahrene Backend-Entwicklung mit, waehrend Frank als Frontend-Spezialist die UI-Seite abdeckt. Grace als Product Owner definiert Anforderungen und priorisiert Aufgaben. Die Zeitzone-Unterschiede (PST vs. GMT+1) sind eine Herausforderung, aber die Erfahrungsverteilung ist gut ausbalanciert mit einer Mischung aus Senior und Mid-Level Entwicklern.',
    members: [
      {
        participantId: 'p-005',
        name: 'Eve Martin',
        avatar: 'https://i.pravatar.cc/100?img=5',
        role: 'Backend',
        experience: 'Advanced',
        skills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Kubernetes'],
        timezone: 'UTC-8 (PST)',
        matchContribution: 35,
      },
      {
        participantId: 'p-006',
        name: 'Frank Wilson',
        avatar: 'https://i.pravatar.cc/100?img=6',
        role: 'Frontend',
        experience: 'Intermediate',
        skills: ['Vue.js', 'TypeScript', 'Tailwind', 'Storybook', 'Cypress'],
        timezone: 'UTC-8 (PST)',
        matchContribution: 28,
      },
      {
        participantId: 'p-007',
        name: 'Grace Kim',
        avatar: 'https://i.pravatar.cc/100?img=7',
        role: 'Product',
        experience: 'Advanced',
        skills: ['Figma', 'Analytics', 'User Research', 'Jira', 'Confluence'],
        timezone: 'UTC+1 (CET)',
        matchContribution: 22,
      },
      {
        participantId: 'p-008',
        name: 'Henry Lee',
        avatar: 'https://i.pravatar.cc/100?img=8',
        role: 'Fullstack',
        experience: 'Beginner',
        skills: ['React', 'Node.js', 'MongoDB', 'Git', 'REST APIs'],
        timezone: 'UTC-5 (EST)',
        matchContribution: 15,
      },
    ],
  },
  {
    id: 'match-003',
    teamName: 'Gamma Ray',
    voyage: 'Voyage 51',
    compatibilityScore: 63,
    matchedAt: '2026-06-22T11:45:00Z',
    status: 'rejected',
    skillsOverlap: 55,
    timezoneAlignment: 72,
    experienceBalance: 60,
    rationale:
      'Dieses Team wurde urspruenglich vorgeschlagen, aber aufgrund geringer Faehigkeitsueberlappung abgelehnt. Die Teilnehmer bringen zwar vielfaeltige Skills mit, aber es fehlt ein gemeinsamer Kern aus Technologien. Irene als Backend-Spezialistin und Jack als Frontend-Entwickler haben wenig ueberlappende Erfahrung. Kate bringt Design-Expertise mit, aber die Zeitzone UTC+8 ermoeglicht nur minimale Ueberlappung mit den US-Zeitzonen. Empfehlung: Alternative Kombination mit staerkerer technischer Ausrichtung pruefen.',
    members: [
      {
        participantId: 'p-009',
        name: 'Irene Zhang',
        avatar: 'https://i.pravatar.cc/100?img=9',
        role: 'Backend',
        experience: 'Intermediate',
        skills: ['Go', 'gRPC', 'Kubernetes', 'Terraform', 'PostgreSQL'],
        timezone: 'UTC+8 (SGT)',
        matchContribution: 25,
      },
      {
        participantId: 'p-010',
        name: 'Jack Brown',
        avatar: 'https://i.pravatar.cc/100?img=10',
        role: 'Frontend',
        experience: 'Beginner',
        skills: ['Svelte', 'JavaScript', 'HTML/CSS', 'Git'],
        timezone: 'UTC-5 (EST)',
        matchContribution: 20,
      },
      {
        participantId: 'p-011',
        name: 'Kate Johnson',
        avatar: 'https://i.pravatar.cc/100?img=11',
        role: 'Design',
        experience: 'Advanced',
        skills: ['Figma', 'Sketch', 'Illustrator', 'Motion Design', 'Prototyping'],
        timezone: 'UTC+8 (CST)',
        matchContribution: 18,
      },
    ],
  },
];

/**
 * Hilfsfunktion zur Formatierung von Datumsstrings.
 * Gibt ein lokalisiertes deutsches Datum zurueck.
 */
function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('de-DE', {day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'});
}

/**
 * Hilfsfunktion fuer die Score-Farbgebung.
 * Gibt basierend auf dem Score eine CSS-Klasse zurueck.
 */
function getScoreColor(score: number): string {
  if (score >= 80) return 'text-[#77CF97]';
  if (score >= 65) return 'text-amber-500';
  return 'text-rose-500';
}

/**
 * Hilfsfunktion fuer Score-Progress-Balken-Farbgebung.
 */
function getScoreBarColor(score: number): string {
  if (score >= 80) return 'bg-[#77CF97]';
  if (score >= 65) return 'bg-amber-500';
  return 'bg-rose-500';
}

/**
 * Detailseite fuer ein einzelnes Match-Ergebnis (Admin-Ansicht).
 * Zeigt zugeordnete Teilnehmer, Kompatibilitaets-Scores,
 * Matching-Begruendung und Skills-Matrix.
 */
export default function MatchDetailPage({params}: {params: Promise<{id: string}>}) {
  const {id} = use(params);
  const router = useRouter();
  const {role} = useDashboard();
  const [match, setMatch] = useState<MatchResult | null>(null);

  /** Nur Admin hat Zugriff */
  useEffect(() => {
    if (role !== 'admin') {
      router.push('/overview');
    }
  }, [role, router]);

  /** Mock-Daten laden */
  useEffect(() => {
    const found = MOCK_MATCHES.find((m) => m.id === id);
    if (found) setMatch(found);
  }, [id]);

  if (!match || role !== 'admin') return null;

  const statusConf = STATUS_CONFIG[match.status];
  const StatusIcon = statusConf.icon;

  /** Alle einzigartigen Skills ueber alle Mitglieder sammeln */
  const allSkills = Array.from(new Set(match.members.flatMap((m) => m.skills)));

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      {/* Zurueck-Navigation */}
      <button
        onClick={() => router.push('/matching')}
        className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Matching
      </button>

      {/* Kopfbereich */}
      <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-[28px] font-outfit font-medium text-slate-900 dark:text-white tracking-tight">{match.teamName}</h1>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConf.bgColor} ${statusConf.color}`}>
                <StatusIcon className="w-3 h-3" /> {statusConf.label}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1"><BarChart3 className="w-3.5 h-3.5" /> {match.voyage}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {formatDate(match.matchedAt)}</span>
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {match.members.length} Members</span>
            </div>
          </div>
          {/* Grosser Kompatibilitaets-Score */}
          <div className="text-right shrink-0">
            <div className={`text-5xl font-outfit font-bold leading-none ${getScoreColor(match.compatibilityScore)}`}>
              {match.compatibilityScore}%
            </div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Compatibility</div>
          </div>
        </div>
      </div>

      {/* Zwei-Spalten-Layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Linke Spalte (2/3): Teilnehmer, Begruendung, Skills-Matrix */}
        <div className="col-span-2 space-y-6">
          {/* Zugeordnete Teilnehmer */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" /> Zugeordnete Teilnehmer
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {match.members.map((member) => (
                <div key={member.participantId} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-white/10 hover:border-slate-200 dark:hover:border-white/20 transition-colors">
                  <img
                    src={member.avatar}
                    className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10"
                    alt={member.name}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{member.name}</span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${ROLE_COLORS[member.role]}`}>{member.role}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{member.experience}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {member.skills.map((skill) => (
                        <span key={skill} className="px-2 py-0.5 bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded text-[10px] font-medium text-slate-600 dark:text-slate-400">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {member.timezone}</span>
                    </div>
                    {/* Match-Beitrag Fortschrittsbalken */}
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">Contribution</span>
                      <div className="flex-1 h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${getScoreBarColor(member.matchContribution * (100 / 35))}`}
                          style={{width: `${member.matchContribution}%`}}
                        />
                      </div>
                      <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300">{member.matchContribution}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Matching-Begruendung */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#77CF97]" /> Matching-Begruendung
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{match.rationale}</p>
          </div>

          {/* Skills-Matrix */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-slate-400" /> Skills-Matrix
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/10">
                    <th className="text-left py-2 pr-4 text-slate-500 dark:text-slate-400 font-medium">Skill</th>
                    {match.members.map((m) => (
                      <th key={m.participantId} className="text-center py-2 px-2 text-slate-500 dark:text-slate-400 font-medium">{m.name.split(' ')[0]}</th>
                    ))}
                    <th className="text-center py-2 pl-2 text-slate-500 dark:text-slate-400 font-medium">Coverage</th>
                  </tr>
                </thead>
                <tbody>
                  {allSkills.map((skill) => {
                    const coveredBy = match.members.filter((m) => m.skills.includes(skill));
                    const coverage = coveredBy.length / match.members.length;
                    return (
                      <tr key={skill} className="border-b border-slate-50 dark:border-white/5 last:border-0">
                        <td className="py-2 pr-4 text-slate-700 dark:text-slate-300 font-medium">{skill}</td>
                        {match.members.map((m) => (
                          <td key={m.participantId} className="text-center py-2 px-2">
                            {m.skills.includes(skill) ? (
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#77CF97]/20 text-[#77CF97]">
                                <CheckCircle className="w-3 h-3" />
                              </span>
                            ) : (
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-300 dark:text-slate-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              </span>
                            )}
                          </td>
                        ))}
                        <td className="text-center py-2 pl-2">
                          <div className="flex items-center gap-1 justify-center">
                            <div className="w-12 h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${coverage >= 0.5 ? 'bg-[#77CF97]' : 'bg-amber-400'}`} style={{width: `${coverage * 100}%`}} />
                            </div>
                            <span className="text-slate-500 dark:text-slate-400">{Math.round(coverage * 100)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Luecken-Hinweis */}
            {allSkills.filter((s) => match.members.filter((m) => m.skills.includes(s)).length === 0).length > 0 && (
              <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs text-amber-600 dark:text-amber-400">Einige Skills werden von keinem Mitglied abgedeckt</span>
              </div>
            )}
          </div>
        </div>

        {/* Rechte Spalte (1/3): Scores, Details, Aktionen */}
        <div className="space-y-6">
          {/* Match-Scores */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-slate-400" /> Match-Scores
            </h2>
            {/* Gesamt-Kompatibilitaet */}
            <div className="text-center mb-5 pb-5 border-b border-slate-100 dark:border-white/10">
              <div className={`text-4xl font-outfit font-bold leading-none ${getScoreColor(match.compatibilityScore)}`}>
                {match.compatibilityScore}%
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Overall Compatibility</div>
            </div>

            {/* Einzelne Scores */}
            <div className="space-y-4">
              {/* Skills-Overlap */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Skills Overlap</span>
                  <span className={`text-xs font-bold ${getScoreColor(match.skillsOverlap)}`}>{match.skillsOverlap}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${getScoreBarColor(match.skillsOverlap)}`} style={{width: `${match.skillsOverlap}%`}} />
                </div>
              </div>

              {/* Timezone-Alignment */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Timezone Alignment</span>
                  <span className={`text-xs font-bold ${getScoreColor(match.timezoneAlignment)}`}>{match.timezoneAlignment}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${getScoreBarColor(match.timezoneAlignment)}`} style={{width: `${match.timezoneAlignment}%`}} />
                </div>
              </div>

              {/* Experience-Balance */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Experience Balance</span>
                  <span className={`text-xs font-bold ${getScoreColor(match.experienceBalance)}`}>{match.experienceBalance}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${getScoreBarColor(match.experienceBalance)}`} style={{width: `${match.experienceBalance}%`}} />
                </div>
              </div>
            </div>
          </div>

          {/* Match-Details */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Match-Details</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Erstellt am</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{formatDate(match.matchedAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Voyage</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{match.voyage}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Status</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConf.bgColor} ${statusConf.color}`}>
                  <StatusIcon className="w-3 h-3" /> {statusConf.label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Mitglieder</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{match.members.length}</span>
              </div>
            </div>
          </div>

          {/* Schnell-Aktionen */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-400" /> Aktionen
            </h2>
            <div className="space-y-2">
              {match.status === 'suggested' && (
                <>
                  <button className="w-full px-4 py-2.5 bg-[#77CF97] text-white rounded-xl text-sm font-medium hover:bg-[#5ab87e] transition-colors flex items-center justify-center gap-2 cursor-pointer">
                    <CheckCircle className="w-4 h-4" /> Match bestaetigen
                  </button>
                  <button className="w-full px-4 py-2.5 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-xl text-sm font-medium hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors flex items-center justify-center gap-2 cursor-pointer border border-rose-200 dark:border-rose-500/20">
                    <XCircle className="w-4 h-4" /> Match ablehnen
                  </button>
                </>
              )}
              <button className="w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                <Edit3 className="w-4 h-4" /> Match bearbeiten
              </button>
              <button className="w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                <Bell className="w-4 h-4" /> Teilnehmer benachrichtigen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
