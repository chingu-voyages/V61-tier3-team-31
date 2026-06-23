'use client';

import {useState, useEffect, use} from 'react';
import {useRouter} from 'next/navigation';
import {
  ArrowLeft, Clock, CheckCircle, XCircle, Mail, Globe,
  Calendar, Briefcase, MapPin, MessageSquare, Tag,
  ChevronDown, Send, ExternalLink,
} from 'lucide-react';
import type {Application, ApplicationStatus} from '@/types';
import {useDashboard} from '@/lib/auth-context';

/**
 * Mock-Bewerbungsdaten mit vollstaendigen Details.
 * In der Produktion werden diese Daten aus Supabase geladen.
 */
const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app-001',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    avatar: 'https://i.pravatar.cc/100?img=12',
    role: 'Fullstack',
    experience: 'Advanced',
    years: '4 years',
    status: 'pending_review',
    date: '2026-05-01',
    voyage: 'Voyage 51',
    bio: 'Erfahrene Full-Stack-Entwicklerin mit Leidenschaft fuer skalierbare Webanwendungen. Fuehrte zuvor die Frontend-Architektur bei einem SaaS-Startup.',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
    availability: '20 Stunden/Woche',
    motivation: 'Sucht die Zusammenarbeit mit diversen Teams und moechte zu bedeutenden Open-Source-Projekten waehrend dieses Cohorts beitragen.',
    portfolio: 'github.com/sjenkins',
    timezone: 'UTC-5 (EST)',
    reviewNotes: '',
  },
  {
    id: 'app-002',
    name: 'Michael Chang',
    email: 'm.chang@example.com',
    avatar: 'https://i.pravatar.cc/100?img=15',
    role: 'Frontend',
    experience: 'Intermediate',
    years: '2 years',
    status: 'accepted',
    date: '2026-05-01',
    voyage: 'Voyage 51',
    bio: 'Frontend-Entwickler mit Schwerpunkt React und modernem CSS. Leidenschaftlich fuer barrierefreie UI und Design-Systeme.',
    skills: ['React', 'CSS', 'Figma', 'Storybook', 'Tailwind'],
    availability: '15 Stunden/Woche',
    motivation: 'Moechte Teamwork-Faehigkeiten verbessern und von erfahrenen Entwicklern in einem echten Projektsetting lernen.',
    portfolio: 'github.com/mchang',
    timezone: 'UTC+8 (SGT)',
    reviewNotes: 'Starke Frontend-Skills. Passt gut ins Team. Fuer Voyage 51 angenommen.',
  },
  {
    id: 'app-003',
    name: 'David Rust',
    email: 'david.r@example.com',
    avatar: 'https://i.pravatar.cc/100?img=32',
    role: 'Backend',
    experience: 'Beginner',
    years: '1 year',
    status: 'rejected',
    date: '2026-04-30',
    voyage: 'Voyage 51',
    bio: 'Aspirierender Backend-Entwickler, der Rust und Python erlernt. Derzeit Online-Kurse in verteilten Systemen abschliessend.',
    skills: ['Python', 'Rust', 'Git'],
    availability: '10 Stunden/Woche',
    motivation: 'Brennt darauf, praktische Erfahrung in realen Projekten und Mentoring zu sammeln.',
    portfolio: 'github.com/drust',
    timezone: 'UTC+1 (CET)',
    reviewNotes: 'Unzureichende Erfahrung fuer das aktuelle Cohort. Empfehlung: Bewerbung fuer Voyage 52.',
  },
  {
    id: 'app-004',
    name: 'Emily Chen',
    email: 'emily.chen@example.com',
    avatar: 'https://i.pravatar.cc/100?img=47',
    role: 'Frontend',
    experience: 'Advanced',
    years: '5+ years',
    status: 'pending_review',
    date: '2026-04-30',
    voyage: 'Voyage 51',
    bio: 'Senior Frontend-Ingenieurin mit Expertise in React-Ecosystems. Fuehrte zuvor Teams von 5+ Entwicklern.',
    skills: ['React', 'Next.js', 'TypeScript', 'GraphQL', 'Testing', 'CI/CD'],
    availability: '25 Stunden/Woche',
    motivation: 'Sucht eine kooperative Umgebung, in der ich beitragen und von internationalen Teams lernen kann.',
    portfolio: 'github.com-chen',
    timezone: 'UTC+8 (CST)',
    reviewNotes: '',
  },
];

/** Konfiguration fuer ApplicationStatus Badges */
const STATUS_CONFIG: Record<ApplicationStatus, {label: string; icon: React.ElementType; color: string; bgColor: string}> = {
  pending_review: {label: 'Pending Review', icon: Clock, color: 'text-slate-600 dark:text-slate-300', bgColor: 'bg-slate-100 dark:bg-white/10 border border-slate-200/50 dark:border-white/10'},
  accepted: {label: 'Accepted', icon: CheckCircle, color: 'text-[#77CF97]', bgColor: 'bg-[#77CF97]/10 border border-[#77CF97]/20'},
  rejected: {label: 'Rejected', icon: XCircle, color: 'text-rose-500', bgColor: 'bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20'},
  incomplete: {label: 'Incomplete', icon: Clock, color: 'text-amber-500', bgColor: 'bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20'},
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
 * Detailseite fuer eine einzelne Bewerbung (Admin-Review).
 * Zeigt Profil, Antwortdaten und ermoeglicht Statusaenderungen.
 */
export default function ApplicationDetailPage({params}: {params: Promise<{id: string}>}) {
  const {id} = use(params);
  const router = useRouter();
  const {role} = useDashboard();
  const [application, setApplication] = useState<Application | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Nur Admin hat Zugriff
  useEffect(() => {
    if (role !== 'admin') {
      router.push('/overview');
    }
  }, [role, router]);

  // Mock-Daten laden
  useEffect(() => {
    const found = MOCK_APPLICATIONS.find((a) => a.id === id);
    if (found) {
      setApplication(found);
      setReviewNotes(found.reviewNotes);
    }
  }, [id]);

  if (!application || role !== 'admin') return null;

  const statusConf = STATUS_CONFIG[application.status];
  const StatusIcon = statusConf.icon;

  /** Datumsformatierung */
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('de-DE', {day: '2-digit', month: 'long', year: 'numeric'});
  };

  /** Status aendern */
  const handleStatusChange = (newStatus: ApplicationStatus) => {
    setApplication((prev) => prev ? {...prev, status: newStatus} : null);
    setShowStatusDropdown(false);
  };

  /** Notizen speichern (Mock) */
  const handleSaveNotes = () => {
    setIsSaving(true);
    setApplication((prev) => prev ? {...prev, reviewNotes} : null);
    setTimeout(() => setIsSaving(false), 600);
  };

  /** Status-Aktionen: Accept / Reject */
  const handleAccept = () => {
    handleStatusChange('accepted');
  };

  const handleReject = () => {
    handleStatusChange('rejected');
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      {/* Zurueck-Navigation */}
      <button
        onClick={() => router.push('/applications')}
        className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Applications
      </button>

      {/* Kopfbereich */}
      <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
        <div className="flex items-start justify-between gap-6">
          {/* Profil */}
          <div className="flex items-center gap-4">
            <img
              src={application.avatar}
              className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10"
              alt={application.name}
            />
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">{application.name}</h1>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConf.bgColor} ${statusConf.color}`}>
                  <StatusIcon className="w-3 h-3" /> {statusConf.label}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {application.email}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Applied {formatDate(application.date)}</span>
                <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {application.voyage}</span>
              </div>
            </div>
          </div>

          {/* Aktionen */}
          <div className="flex items-center gap-3 shrink-0">
            {application.status === 'pending_review' && (
              <>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-xl text-sm font-medium hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors flex items-center gap-2 cursor-pointer border border-rose-200 dark:border-rose-500/20"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
                <button
                  onClick={handleAccept}
                  className="px-4 py-2 bg-[#77CF97] text-white rounded-xl text-sm font-medium hover:bg-[#5ab87e] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" /> Accept
                </button>
              </>
            )}
            {application.status !== 'pending_review' && (
              <div className="relative">
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="px-4 py-2 bg-white dark:bg-[#1a1b24] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  Change Status <ChevronDown className="w-4 h-4" />
                </button>
                {showStatusDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-[#1a1b24] border border-white/10 rounded-xl shadow-xl z-20 p-1">
                    {(['pending_review', 'accepted', 'rejected', 'incomplete'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(s)}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors ${
                          application.status === s
                            ? 'bg-white/10 text-white'
                            : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        {STATUS_CONFIG[s].label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Zwei-Spalten-Layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Linke Spalte: Profil-Details (2/3) */}
        <div className="col-span-2 space-y-6">
          {/* Ueber mich */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-400" /> Ueber mich
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{application.bio}</p>
          </div>

          {/* Motivation */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-400" /> Motivation
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-2 border-[#77CF97]/30 pl-4">
              &ldquo;{application.motivation}&rdquo;
            </p>
          </div>

          {/* Faehigkeiten */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-slate-400" /> Faehigkeiten & Tech-Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {application.skills.map((skill) => (
                <span key={skill} className="px-3 py-1.5 bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Admin-Notizen */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-400" /> Review-Notizen (intern)
            </h2>
            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Notizen zur Bewertung dieses Bewerbers hinzufuegen..."
              rows={4}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#77CF97]/30 focus:border-[#77CF97]/50 transition-all resize-none"
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={handleSaveNotes}
                disabled={isSaving}
                className="px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Send className="w-3.5 h-3.5" /> {isSaving ? 'Gespeichert...' : 'Notizen speichern'}
              </button>
            </div>
          </div>
        </div>

        {/* Rechte Spalte: Metadaten (1/3) */}
        <div className="space-y-6">
          {/* Basis-Informationen */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Bewerbungs-Details</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Rolle</span>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${ROLE_COLORS[application.role]}`}>{application.role}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Erfahrung</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{application.experience} ({application.years})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Verfuegbarkeit</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{application.availability}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Zeitzone</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-1"><MapPin className="w-3 h-3" /> {application.timezone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Voyage</span>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{application.voyage}</span>
              </div>
            </div>
          </div>

          {/* Portfolio */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Portfolio</h2>
            <a
              href={`https://${application.portfolio}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              <Globe className="w-4 h-4" /> {application.portfolio} <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Status-Historie (Mock) */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Status-Historie</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 mt-1.5 shrink-0" />
                <div>
                  <div className="text-xs font-medium text-slate-900 dark:text-white">Bewerbung eingereicht</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{formatDate(application.date)}</div>
                </div>
              </div>
              {application.status === 'pending_review' && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-slate-900 dark:text-white">Review ausstehend</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Wartet auf Admin-Bewertung</div>
                  </div>
                </div>
              )}
              {application.status === 'accepted' && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#77CF97] mt-1.5 shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-slate-900 dark:text-white">Akzeptiert</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Fuer {application.voyage} angenommen</div>
                  </div>
                </div>
              )}
              {application.status === 'rejected' && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-slate-900 dark:text-white">Abgelehnt</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Bewerbung wurde abgelehnt</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
