'use client';

import {useState, useCallback, type KeyboardEvent} from 'react';
import {useDashboard} from '@/lib/auth-context';
import {
  Mail, MapPin, ExternalLink, Edit3, Plus, Pencil, X,
  CheckCircle2, Circle, ChevronLeft, User, Code2,
  Activity, MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import {Dialog, DialogPopup, DialogTitle, DialogClose} from '@/components/ui/dialog';

/** Typ fuer ein einzelnes Aktivitaets-Logging-Eintrag */
interface ActivityEntry {
  color: 'blue' | 'green' | 'grey';
  text: string;
  by: string;
  date: string;
}

/** Typ fuer die Profil-Daten des aktuellen Benutzers */
interface ProfileData {
  name: string;
  email: string;
  role: string;
  timezone: string;
  bio: string;
  skills: string[];
  github: string;
  linkedin: string;
  status: string;
  onboarding: {
    percentage: number;
    steps: {label: string; date: string; done: boolean}[];
  };
  activity: ActivityEntry[];
}

/** Mock-Daten fuer ein Participant-Profil */
const MOCK_PROFILE: ProfileData = {
  name: 'Anna Kowalski',
  email: 'anna.kowalski@email.com',
  role: 'Frontend' as const,
  timezone: 'Europe/Berlin',
  bio: 'Frontend developer with a passion for building accessible, performant, and delightful user experiences. I love working with React and modern web technologies.',
  skills: ['React', 'TypeScript', 'Next.js', 'Tailwind', 'Supabase', 'UI Components'],
  github: 'https://github.com/annakowalski',
  linkedin: 'https://linkedin.com/in/annakowalski',
  status: 'In Progress',
  onboarding: {
    percentage: 68,
    steps: [
      {label: 'Profile completed', date: 'May 10, 2024', done: true},
      {label: 'GitHub connected', date: 'May 10, 2024', done: true},
      {label: 'LinkedIn added', date: 'May 11, 2024', done: true},
      {label: 'Availability confirmed', date: '', done: true},
      {label: 'Team assignment pending', date: '', done: false},
      {label: 'Welcome guide read', date: '', done: false},
    ],
  },
  activity: [
    {color: 'blue', text: 'Onboarding started', by: 'Anna Kowalski', date: 'May 10, 2024 at 10:24 AM'},
    {color: 'green', text: 'Availability confirmed', by: 'Anna Kowalski', date: 'May 12, 2024 at 02:15 PM'},
    {color: 'grey', text: 'Team assignment pending', by: 'Anna Kowalski', date: 'May 12, 2024 at 02:15 PM'},
  ],
};

/** Verfuegbare Rollen fuer das Auswahlfeld */
const AVAILABLE_ROLES = ['Frontend', 'Backend', 'Fullstack', 'Design', 'Product'] as const;

/** Verfuegbare Zeitzonen fuer das Auswahlfeld */
const AVAILABLE_TIMEZONES = [
  'Europe/Berlin',
  'Europe/London',
  'Europe/Paris',
  'America/New_York',
  'America/Los_Angeles',
  'Asia/Tokyo',
] as const;

/**
 * Formatiert ein Date-Objekt als lesbaren Zeitstempel.
 * @param date - Das zu formatierende Datum
 * @returns Formatierter Zeitstempel (z.B. "Jun 23, 2026 at 12:00 PM")
 */
function formatTimestamp(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }) + ' at ' + date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Extrahiert die Initialen aus einem vollstaendigen Namen.
 * @param name - Der vollstaendige Name
 * @returns Initialen (max. 2 Zeichen, grossgeschrieben)
 */
function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

/** Kompakter Fortschrittskreis */
function ProgressRing({percentage}: {percentage: number}) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const offset = c - (percentage / 100) * c;

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="64" cy="64" r={r} fill="none" stroke="#77CF97" strokeWidth="10"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-900 dark:text-white">{percentage}%</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">Complete</span>
      </div>
    </div>
  );
}

/** Badge fuer Team-Rolle */
function RoleBadge({role}: {role: string}) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      {role}
    </span>
  );
}

/** Status-Badge */
function StatusBadge({status}: {status: string}) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
      {status}
    </span>
  );
}

/** Karte mit Ueberschrift */
function Card({title, icon, children, className = '', headerAction}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}) {
  return (
    <div className={`bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/10">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-white">
          {icon}
          {title}
        </div>
        {headerAction}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

/**
 * Profil-Seite mit vollstaendiger Bearbeitungsfunktion.
 * Ermöglicht das Editieren von Profil-Details, Skills und
 * zeigt eine Aktivitaets-Logging-Liste an.
 */
export default function ProfilePage() {
  const {role} = useDashboard();
  const isAdmin = role === 'admin';

  const [profile, setProfile] = useState<ProfileData>(MOCK_PROFILE);
  const [note, setNote] = useState('');

  /** Zustandsverwaltung fuer das Profil-Bearbeitungs-Dialog */
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editTimezone, setEditTimezone] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editGithub, setEditGithub] = useState('');
  const [editLinkedin, setEditLinkedin] = useState('');
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});

  /** Zustandsverwaltung fuer das Skills-Bearbeitungs-Dialog */
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const [editSkills, setEditSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  /**
   * Oeffnet das Profil-Bearbeitungs-Dialog und befuellt die Formularfelder.
   */
  const openProfileEdit = useCallback(() => {
    setEditName(profile.name);
    setEditEmail(profile.email);
    setEditRole(profile.role);
    setEditTimezone(profile.timezone);
    setEditBio(profile.bio);
    setEditGithub(profile.github);
    setEditLinkedin(profile.linkedin);
    setProfileErrors({});
    setIsProfileOpen(true);
  }, [profile]);

  /**
   * Validiert die Formularfelder des Profil-Dialogs.
   * @returns true, wenn alle Felder gueltig sind
   */
  const validateProfile = useCallback((): boolean => {
    const errors: Record<string, string> = {};
    if (editName.length < 2) {
      errors.name = 'Name muss mindestens 2 Zeichen lang sein.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail)) {
      errors.email = 'Bitte eine gueltige E-Mail-Adresse eingeben.';
    }
    if (!editRole) {
      errors.role = 'Bitte eine Rolle auswaehlen.';
    }
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  }, [editName, editEmail, editRole]);

  /**
   * Speichert die geaenderten Profil-Daten und fuegt einen
   * Aktivitaets-Logging-Eintrag hinzu.
   */
  const saveProfile = useCallback(() => {
    if (!validateProfile()) return;

    const timestamp = formatTimestamp(new Date());
    const updatedProfile: ProfileData = {
      ...profile,
      name: editName,
      email: editEmail,
      role: editRole,
      timezone: editTimezone,
      bio: editBio,
      github: editGithub,
      linkedin: editLinkedin,
      activity: [
        {color: 'green', text: 'Profile updated', by: editName, date: timestamp},
        ...profile.activity,
      ],
    };
    setProfile(updatedProfile);
    setIsProfileOpen(false);
  }, [profile, editName, editEmail, editRole, editTimezone, editBio, editGithub, editLinkedin, validateProfile]);

  /**
   * Oeffnet das Skills-Bearbeitungs-Dialog mit den aktuellen Skills.
   */
  const openSkillsEdit = useCallback(() => {
    setEditSkills([...profile.skills]);
    setNewSkill('');
    setIsSkillsOpen(true);
  }, [profile.skills]);

  /**
   * Fuegt einen neuen Skill zur Liste hinzu (per Enter oder Button).
   * Verhindert doppelte Skills.
   */
  const addSkill = useCallback(() => {
    const trimmed = newSkill.trim();
    if (trimmed && !editSkills.includes(trimmed)) {
      setEditSkills((prev) => [...prev, trimmed]);
      setNewSkill('');
    }
  }, [newSkill, editSkills]);

  /**
   * Entfernt einen Skill aus der Bearbeitungsliste.
   * @param skillToRemove - Der zu entfernende Skill
   */
  const removeSkill = useCallback((skillToRemove: string) => {
    setEditSkills((prev) => prev.filter((s) => s !== skillToRemove));
  }, []);

  /**
   * Speichert die geaenderten Skills und fuegt einen
   * Aktivitaets-Logging-Eintrag hinzu.
   */
  const saveSkills = useCallback(() => {
    const timestamp = formatTimestamp(new Date());
    const updatedProfile: ProfileData = {
      ...profile,
      skills: editSkills,
      activity: [
        {color: 'blue', text: 'Skills updated', by: profile.name, date: timestamp},
        ...profile.activity,
      ],
    };
    setProfile(updatedProfile);
    setIsSkillsOpen(false);
  }, [profile, editSkills]);

  /**
   * Verarbeitet Tastatur-Eingaben im Skills-Eingabefeld.
   * Enter-Taste fuegt einen neuen Skill hinzu.
   */
  const handleSkillKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  }, [addSkill]);

  /** Dynamische Initialen aus dem Profilnamen generieren */
  const initials = getInitials(profile.name);

  return (
    <div className="space-y-6 max-w-[1200px]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <Link href="/overview" className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" />
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-white font-medium">Profile</span>
      </div>

      {/* Kopfbereich — horizontal */}
      <div className="flex items-start gap-5 mb-15">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-xl font-bold text-indigo-600 dark:text-indigo-400">
            {initials}
          </div>
          <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0f0f0f]" />
        </div>

        {/* Info + Badges */}
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{profile.name}</h1>
            <button
              onClick={openProfileEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Pencil className="w-3 h-3" />
              {isAdmin ? 'Admin edit' : 'Edit profile'}
            </button>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {profile.email}
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" title="Kopieren">
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <RoleBadge role={profile.role} />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">
              <MapPin className="w-3 h-3" />
              {profile.timezone}
            </span>
            <StatusBadge status={profile.status} />
          </div>
        </div>

        {/* Externe Links */}
        <div className="flex items-center gap-2 shrink-0 pt-1">
          <a href={profile.github} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
            GitHub <ExternalLink className="w-3 h-3" />
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
            LinkedIn <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Zwei-Spalten-Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Linke Spalte */}
        <div className="lg:col-span-7 space-y-6">
          <Card title="Profile details" icon={<User className="w-4 h-4" />}
            headerAction={
              <button
                onClick={openProfileEdit}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" /> Edit profile
              </button>
            }>
            <dl className="space-y-4">
              {[
                {label: 'Full name', value: profile.name},
                {label: 'Email', value: profile.email},
                {label: 'Team role', value: profile.role, badge: true},
                {label: 'Timezone', value: profile.timezone, link: true},
                {label: 'Bio', value: profile.bio, full: true},
              ].map((item) => (
                <div key={item.label} className={`flex ${item.full ? 'flex-col' : 'items-start'} gap-2 ${!item.full ? 'justify-between' : ''}`}>
                  <dt className="text-sm text-slate-500 dark:text-slate-400 shrink-0 w-28">{item.label}</dt>
                  <dd className={`text-sm font-medium text-slate-800 dark:text-slate-200 ${item.full ? 'mt-0.5' : ''} ${item.badge ? 'text-emerald-600 dark:text-emerald-400' : ''} ${item.link ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card title="Skills" icon={<Code2 className="w-4 h-4" />}
            headerAction={
              <div className="flex items-center gap-1">
                <button
                  onClick={openSkillsEdit}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add skill
                </button>
                <button
                  onClick={openSkillsEdit}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer ml-2"
                >
                  <Pencil className="w-3 h-3" />
                </button>
              </div>
            }>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span key={skill} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                  {skill}
                </span>
              ))}
            </div>
          </Card>

          <Card title="Admin notes" icon={<MessageSquare className="w-4 h-4" />}>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note about this participant..."
              className="w-full h-24 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
            />
            <button className="mt-3 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors cursor-pointer">
              Save note
            </button>
          </Card>
        </div>

        {/* Rechte Spalte */}
        <div className="lg:col-span-5 space-y-6">
          <Card title="Onboarding status" icon={<CheckCircle2 className="w-4 h-4" />}
            headerAction={
              <button className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer">
                View onboarding
              </button>
            }>
            <div className="flex items-start gap-6">
              <ProgressRing percentage={profile.onboarding.percentage} />
              <div className="flex-1 space-y-3">
                {profile.onboarding.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {step.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                      <span className={`text-sm ${step.done ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                        {step.label}
                      </span>
                      {step.date && (
                        <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">{step.date}</span>
                      )}
                      {!step.date && step.done && (
                        <span className="text-xs text-emerald-500 shrink-0">In progress</span>
                      )}
                      {!step.done && (
                        <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">Pending</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card title="Recent activity" icon={<Activity className="w-4 h-4" />}>
            <div className="space-y-3">
              {profile.activity.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${
                    a.color === 'blue' ? 'bg-blue-500' : a.color === 'green' ? 'bg-emerald-500' : 'bg-slate-400'
                  }`} />
                  <div className="min-w-0">
                    <p className="text-sm text-slate-800 dark:text-slate-200">
                      {a.text} <span className="text-slate-500 dark:text-slate-400">by {a.by}</span>
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{a.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Profil-Bearbeitungs-Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogPopup className="max-w-xl">
          <div className="px-6 pt-6 pb-2">
            <DialogTitle>{isAdmin ? 'Admin edit profile' : 'Edit profile'}</DialogTitle>
            <DialogClose />
          </div>
          <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Full Name *
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                placeholder="Vollstaendiger Name"
              />
              {profileErrors.name && (
                <p className="text-xs text-red-500">{profileErrors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Email *
              </label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                placeholder="name@beispiel.de"
              />
              {profileErrors.email && (
                <p className="text-xs text-red-500">{profileErrors.email}</p>
              )}
            </div>

            {/* Rolle (nur fuer Admins editierbar) */}
            {isAdmin && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Role *
                </label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 cursor-pointer"
                >
                  <option value="">Rolle auswaehlen</option>
                  {AVAILABLE_ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                {profileErrors.role && (
                  <p className="text-xs text-red-500">{profileErrors.role}</p>
                )}
              </div>
            )}

            {/* Zeitzone */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Timezone
              </label>
              <select
                value={editTimezone}
                onChange={(e) => setEditTimezone(e.target.value)}
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 cursor-pointer"
              >
                {AVAILABLE_TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Bio
              </label>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                rows={3}
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none"
                placeholder="Kurze Beschreibung ueber dich..."
              />
            </div>

            {/* GitHub */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                GitHub
              </label>
              <input
                type="url"
                value={editGithub}
                onChange={(e) => setEditGithub(e.target.value)}
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                placeholder="https://github.com/benutzername"
              />
            </div>

            {/* LinkedIn */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                LinkedIn
              </label>
              <input
                type="url"
                value={editLinkedin}
                onChange={(e) => setEditLinkedin(e.target.value)}
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                placeholder="https://linkedin.com/in/benutzername"
              />
            </div>
          </div>
          <div className="px-6 py-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-3">
            <button
              onClick={() => setIsProfileOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={saveProfile}
              className="bg-[#0b0c10] dark:bg-[#77CF97] text-white dark:text-[#0b0c10] rounded-xl text-sm font-semibold hover:bg-slate-800 dark:hover:bg-[#5ab87e] transition-colors shadow-sm cursor-pointer px-4 py-2"
            >
              Save
            </button>
          </div>
        </DialogPopup>
      </Dialog>

      {/* Skills-Bearbeitungs-Dialog */}
      <Dialog open={isSkillsOpen} onOpenChange={setIsSkillsOpen}>
        <DialogPopup className="max-w-xl">
          <div className="px-6 pt-6 pb-2">
            <DialogTitle>Edit skills</DialogTitle>
            <DialogClose />
          </div>
          <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
            {/* Aktuelle Skills als entfernbarer Tags */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Current skills
              </label>
              <div className="flex flex-wrap gap-2 min-h-[42px]">
                {editSkills.length === 0 && (
                  <span className="text-sm text-slate-400 dark:text-slate-500">
                    Noch keine Skills hinzugefuegt.
                  </span>
                )}
                {editSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                      title="Skill entfernen"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Neuen Skill hinzufuegen */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Add new skill
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  className="flex-1 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  placeholder="Skill-Name eingeben..."
                />
                <button
                  onClick={addSkill}
                  disabled={!newSkill.trim()}
                  className="bg-[#0b0c10] dark:bg-[#77CF97] text-white dark:text-[#0b0c10] rounded-xl text-sm font-semibold hover:bg-slate-800 dark:hover:bg-[#5ab87e] transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-3">
            <button
              onClick={() => setIsSkillsOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={saveSkills}
              className="bg-[#0b0c10] dark:bg-[#77CF97] text-white dark:text-[#0b0c10] rounded-xl text-sm font-semibold hover:bg-slate-800 dark:hover:bg-[#5ab87e] transition-colors shadow-sm cursor-pointer px-4 py-2"
            >
              Save
            </button>
          </div>
        </DialogPopup>
      </Dialog>
    </div>
  );
}
