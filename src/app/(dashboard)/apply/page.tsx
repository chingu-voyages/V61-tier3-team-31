'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {
  User, Briefcase, Code, Clock, Globe, MessageSquare,
  FileText, Link2, CheckCircle, ArrowLeft, ArrowRight,
  Send, AlertCircle, Sparkles, ChevronDown,
} from 'lucide-react';
import {useDashboard} from '@/lib/auth-context';
import type {ParticipantRole, ExperienceLevel} from '@/types';

/**
 * Konfiguration der einzelnen Formularschritte.
 * Jeder Schritt enthaelt Titel, Icon und Beschreibung.
 */
const STEPS = [
  {id: 1, title: 'Personal Info', icon: User, description: 'Your basic details'},
  {id: 2, title: 'Role & Experience', icon: Briefcase, description: 'What you do best'},
  {id: 3, title: 'Skills', icon: Code, description: 'Your tech stack'},
  {id: 4, title: 'Availability', icon: Clock, description: 'When you can work'},
  {id: 5, title: 'Motivation', icon: MessageSquare, description: 'Why you want to join'},
  {id: 6, title: 'Review', icon: CheckCircle, description: 'Confirm & submit'},
] as const;

/** Verfuegbare Rollen */
const ROLES: {value: ParticipantRole; label: string; desc: string; emoji: string}[] = [
  {value: 'Frontend', label: 'Frontend', desc: 'React, Vue, Angular, CSS, UI/UX', emoji: '🎨'},
  {value: 'Backend', label: 'Backend', desc: 'Node.js, Python, Go, APIs, Databases', emoji: '⚙️'},
  {value: 'Fullstack', label: 'Fullstack', desc: 'End-to-end development', emoji: '🔧'},
  {value: 'Design', label: 'Design', desc: 'UI/UX, Figma, Branding', emoji: '✨'},
  {value: 'Product', label: 'Product', desc: 'Strategy, Roadmaps, User Research', emoji: '📋'},
];

/** Erfahrungsstufen */
const EXPERIENCES: {value: ExperienceLevel; label: string; desc: string}[] = [
  {value: 'Beginner', label: 'Beginner', desc: '0-2 years'},
  {value: 'Intermediate', label: 'Intermediate', desc: '2-5 years'},
  {value: 'Advanced', label: 'Advanced', desc: '5+ years'},
];

/** Verfuegbare Voyages */
const VOYAGES = [
  {id: 'voyage-51', name: 'Voyage 51', deadline: 'Jul 15, 2026'},
  {id: 'voyage-52', name: 'Voyage 52', deadline: 'Sep 1, 2026'},
];

/** Formularfeld-Daten */
interface FormData {
  fullName: string;
  email: string;
  role: ParticipantRole | '';
  experience: ExperienceLevel | '';
  skills: string[];
  customSkill: string;
  availability: string;
  timezone: string;
  motivation: string;
  bio: string;
  portfolio: string;
  voyage: string;
}

/** Initiale Formulardaten */
const INITIAL_FORM: FormData = {
  fullName: '',
  email: '',
  role: '',
  experience: '',
  skills: [],
  customSkill: '',
  availability: '',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  motivation: '',
  bio: '',
  portfolio: '',
  voyage: '',
};

/**
 * Oeffentliche Bewerbungsformular-Seite (SCRUM-35).
 * Mehrstufiges Formular fuer neue Teilnehmer nach der Registrierung.
 */
export default function ApplyPage() {
  const router = useRouter();
  const {setCurrentView} = useDashboard();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  /** Aktualisiert ein einzelnes Formularfeld */
  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({...prev, [key]: value}));
    setErrors((prev) => ({...prev, [key]: ''}));
  };

  /** Fuegt ein Skill hinzu */
  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !form.skills.includes(trimmed) && form.skills.length < 15) {
      update('skills', [...form.skills, trimmed]);
    }
  };

  /** Entfernt ein Skill */
  const removeSkill = (skill: string) => {
    update('skills', form.skills.filter((s) => s !== skill));
  };

  /** Validerung fuer den aktuellen Schritt */
  const validateStep = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!form.fullName.trim() || form.fullName.trim().length < 2) e.fullName = 'Name must be at least 2 characters.';
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email.';
    } else if (step === 2) {
      if (!form.role) e.role = 'Please select a role.';
      if (!form.experience) e.experience = 'Please select your experience level.';
    } else if (step === 3) {
      if (form.skills.length === 0) e.skills = 'Please add at least one skill.';
    } else if (step === 4) {
      if (!form.availability) e.availability = 'Please enter your availability.';
      if (!form.timezone) e.timezone = 'Please select your timezone.';
    } else if (step === 5) {
      if (!form.motivation.trim() || form.motivation.trim().length < 20) e.motivation = 'Please write at least 20 characters.';
      if (!form.bio.trim() || form.bio.trim().length < 10) e.bio = 'Please write at least 10 characters.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /** Naechster Schritt */
  const next = () => {
    if (validateStep()) {
      setStep((s) => Math.min(s + 1, STEPS.length));
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  };

  /** Vorheriger Schritt */
  const prev = () => {
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  /** Formular absenden */
  const handleSubmit = async () => {
    setLoading(true);
    // Simulierte API-Anfrage
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    setSubmitted(true);
  };

  /** Klassen fuer Eingabefelder */
  const inputCls = (hasError: boolean) =>
    `w-full bg-slate-50 dark:bg-white/5 border ${hasError ? 'border-rose-400 dark:border-rose-500' : 'border-slate-200 dark:border-white/10'} rounded-xl py-3 px-4 text-sm text-slate-900 dark:text-white focus:outline-none ${hasError ? 'focus:border-rose-500 focus:ring-1 focus:ring-rose-500' : 'focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'} transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500`;

  /* ================================================================
   * Erfolgsmeldung nach dem Absenden
   * ================================================================ */
  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white dark:bg-[#1a1b24] rounded-[24px] border border-slate-200 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-[#77CF97]/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[#77CF97]" />
          </div>
          <h1 className="text-2xl font-outfit font-bold text-slate-900 dark:text-white mb-3">
            Application Submitted!
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 max-w-md mx-auto">
            Your application for <span className="font-semibold text-slate-700 dark:text-slate-200">{form.voyage || 'Voyage 51'}</span> has been received.
            Our team will review it within 3-5 business days.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-8">
            You&apos;ll receive an email at <span className="font-medium">{form.email}</span> with updates.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setCurrentView('overview');
                router.push('/overview');
              }}
              className="px-6 py-2.5 bg-[#0b0c10] dark:bg-[#77CF97] text-white dark:text-[#0b0c10] rounded-xl text-sm font-medium hover:bg-slate-800 dark:hover:bg-[#5ab87e] transition-colors shadow-sm cursor-pointer"
            >
              View Application Status
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ================================================================
   * Haapt-Formular
   * ================================================================ */
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Kopfbereich */}
      <div className="mb-8">
        <h1 className="text-[28px] font-outfit font-medium text-slate-900 dark:text-white tracking-tight mb-1">
          Apply for Voyage
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Complete the form below to apply for the next Amigo Voyage cohort.
        </p>
      </div>

      {/* Fortschrittsbalken */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((s, i) => {
            const StepIcon = s.icon;
            const isActive = s.id === step;
            const isCompleted = s.id < step;
            return (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    isCompleted ? 'bg-[#77CF97] text-white' :
                    isActive ? 'bg-[#0b0c10] dark:bg-[#77CF97] text-white dark:text-[#0b0c10] ring-2 ring-[#77CF97]/30' :
                    'bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-slate-500'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
                  </div>
                  <span className={`text-[10px] mt-1.5 font-medium whitespace-nowrap ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                    {s.title}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mt-[-18px] rounded-full ${s.id < step ? 'bg-[#77CF97]' : 'bg-slate-200 dark:bg-white/10'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Formularfelder */}
      <div className="bg-white dark:bg-[#1a1b24] rounded-[24px] border border-slate-200 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-8">

        {/* Schritt 1: Persoenliche Daten */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 font-outfit">Personal Information</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Tell us about yourself.</p>
            </div>
            <div className="space-y-1.5 text-left">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name *</label>
              <input type="text" placeholder="Jane Cooper" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} className={inputCls(!!errors.fullName)} />
              {errors.fullName && <p className="text-xs text-rose-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.fullName}</p>}
            </div>
            <div className="space-y-1.5 text-left">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address *</label>
              <input type="email" placeholder="name@company.com" value={form.email} onChange={(e) => update('email', e.target.value)} className={inputCls(!!errors.email)} />
              {errors.email && <p className="text-xs text-rose-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
            </div>
          </div>
        )}

        {/* Schritt 2: Rolle & Erfahrung */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 font-outfit">Role & Experience</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">What do you do best?</p>
            </div>

            {/* Rollen-Auswahl */}
            <div className="space-y-2 text-left">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Role *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => update('role', r.value)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      form.role === r.value
                        ? 'border-[#77CF97] bg-[#77CF97]/5 dark:bg-[#77CF97]/10'
                        : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    <span className="text-lg">{r.emoji}</span>
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white">{r.label}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{r.desc}</div>
                    </div>
                    {form.role === r.value && <CheckCircle className="w-4 h-4 text-[#77CF97] ml-auto shrink-0" />}
                  </button>
                ))}
              </div>
              {errors.role && <p className="text-xs text-rose-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.role}</p>}
            </div>

            {/* Erfahrungsstufe */}
            <div className="space-y-2 text-left">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Experience Level *</label>
              <div className="grid grid-cols-3 gap-2">
                {EXPERIENCES.map((exp) => (
                  <button
                    key={exp.value}
                    type="button"
                    onClick={() => update('experience', exp.value)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      form.experience === exp.value
                        ? 'border-[#77CF97] bg-[#77CF97]/5 dark:bg-[#77CF97]/10'
                        : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    <div className="text-sm font-medium text-slate-900 dark:text-white">{exp.label}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{exp.desc}</div>
                  </button>
                ))}
              </div>
              {errors.experience && <p className="text-xs text-rose-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.experience}</p>}
            </div>
          </div>
        )}

        {/* Schritt 3: Faehigkeiten */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 font-outfit">Skills & Tech Stack</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Add the technologies and skills you work with.</p>
            </div>

            {/* Hinzugefuegte Skills */}
            {form.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.skills.map((skill) => (
                  <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#77CF97]/10 text-[#77CF97] border border-[#77CF97]/20 rounded-lg text-xs font-medium">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="hover:text-rose-500 transition-colors cursor-pointer ml-0.5">&times;</button>
                  </span>
                ))}
              </div>
            )}

            {/* Skill-Eingabe */}
            <div className="space-y-1.5 text-left">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Add a skill</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. React, Python, Figma..."
                  value={form.customSkill}
                  onChange={(e) => update('customSkill', e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill(form.customSkill);
                      update('customSkill', '');
                    }
                  }}
                  className={inputCls(false)}
                />
                <button
                  type="button"
                  onClick={() => {addSkill(form.customSkill); update('customSkill', '');}}
                  className="px-4 py-2 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-200 dark:hover:bg-white/15 transition-colors cursor-pointer shrink-0"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Vorgeschlagene Skills */}
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Popular Skills</span>
              <div className="flex flex-wrap gap-1.5">
                {['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'AWS', 'Figma', 'Next.js', 'Go', 'GraphQL', 'Tailwind CSS', 'Redis', 'Kubernetes', 'Swift'].map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => addSkill(skill)}
                    disabled={form.skills.includes(skill)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${
                      form.skills.includes(skill)
                        ? 'bg-[#77CF97]/10 text-[#77CF97] border-[#77CF97]/20 cursor-default'
                        : 'border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                  >
                    {form.skills.includes(skill) ? <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" />{skill}</span> : `+ ${skill}`}
                  </button>
                ))}
              </div>
            </div>
            {errors.skills && <p className="text-xs text-rose-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.skills}</p>}
          </div>
        )}

        {/* Schritt 4: Verfuegbarkeit */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 font-outfit">Availability</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">When can you contribute?</p>
            </div>
            <div className="space-y-1.5 text-left">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Hours per Week *</label>
              <select value={form.availability} onChange={(e) => update('availability', e.target.value)} className={`${inputCls(!!errors.availability)} cursor-pointer`}>
                <option value="">Select availability...</option>
                <option value="5-10 hours/week">5-10 hours/week</option>
                <option value="10-15 hours/week">10-15 hours/week</option>
                <option value="15-20 hours/week">15-20 hours/week</option>
                <option value="20-30 hours/week">20-30 hours/week</option>
                <option value="30+ hours/week">30+ hours/week</option>
              </select>
              {errors.availability && <p className="text-xs text-rose-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.availability}</p>}
            </div>
            <div className="space-y-1.5 text-left">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Timezone *</label>
              <div className="relative">
                <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <select value={form.timezone} onChange={(e) => update('timezone', e.target.value)} className={`${inputCls(!!errors.timezone)} pl-10 cursor-pointer`}>
                  <option value="UTC">UTC</option>
                  <option value="UTC-8">UTC-8 (Pacific)</option>
                  <option value="UTC-7">UTC-7 (Mountain)</option>
                  <option value="UTC-6">UTC-6 (Central)</option>
                  <option value="UTC-5">UTC-5 (Eastern)</option>
                  <option value="UTC+0">UTC+0 (London)</option>
                  <option value="UTC+1">UTC+1 (Berlin)</option>
                  <option value="UTC+2">UTC+2 (Cairo)</option>
                  <option value="UTC+3">UTC+3 (Moscow)</option>
                  <option value="UTC+5:30">UTC+5:30 (India)</option>
                  <option value="UTC+8">UTC+8 (Singapore)</option>
                  <option value="UTC+9">UTC+9 (Tokyo)</option>
                  <option value="UTC+10">UTC+10 (Sydney)</option>
                </select>
              </div>
              {errors.timezone && <p className="text-xs text-rose-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.timezone}</p>}
            </div>
            <div className="space-y-1.5 text-left">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Preferred Voyage</label>
              <div className="relative">
                <Sparkles className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <select value={form.voyage} onChange={(e) => update('voyage', e.target.value)} className={`${inputCls(false)} pl-10 cursor-pointer`}>
                  <option value="">Select a voyage...</option>
                  {VOYAGES.map((v) => (
                    <option key={v.id} value={v.name}>{v.name} — Deadline: {v.deadline}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Schritt 5: Motivation */}
        {step === 5 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 font-outfit">Motivation</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Why do you want to join Amigo?</p>
            </div>
            <div className="space-y-1.5 text-left">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Why do you want to participate? *</label>
              <textarea
                placeholder="Tell us what motivates you to join this Voyage cohort..."
                rows={4}
                value={form.motivation}
                onChange={(e) => update('motivation', e.target.value)}
                className={`${inputCls(!!errors.motivation)} resize-none`}
              />
              <div className="flex justify-between">
                {errors.motivation && <p className="text-xs text-rose-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.motivation}</p>}
                <span className="text-[10px] text-slate-400 ml-auto">{form.motivation.length}/500</span>
              </div>
            </div>
            <div className="space-y-1.5 text-left">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">About you *</label>
              <textarea
                placeholder="A short bio about yourself, your background, and what you're looking for..."
                rows={3}
                value={form.bio}
                onChange={(e) => update('bio', e.target.value)}
                className={`${inputCls(!!errors.bio)} resize-none`}
              />
              {errors.bio && <p className="text-xs text-rose-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.bio}</p>}
            </div>
            <div className="space-y-1.5 text-left">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Portfolio / GitHub</label>
              <div className="relative">
                <Link2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="url"
                  placeholder="https://github.com/yourusername"
                  value={form.portfolio}
                  onChange={(e) => update('portfolio', e.target.value)}
                  className={`${inputCls(false)} pl-10`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Schritt 6: Ueberpruefung */}
        {step === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 font-outfit">Review Your Application</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Please review your information before submitting.</p>
            </div>

            {/* Zusammenfassung */}
            <div className="space-y-4">
              {/* Persoenliche Daten */}
              <div className="bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Personal Info</h3>
                  <button onClick={() => setStep(1)} className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 cursor-pointer">Edit</button>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-slate-500 dark:text-slate-400">Name:</span> <span className="font-medium text-slate-900 dark:text-white ml-1">{form.fullName}</span></div>
                  <div><span className="text-slate-500 dark:text-slate-400">Email:</span> <span className="font-medium text-slate-900 dark:text-white ml-1">{form.email}</span></div>
                </div>
              </div>

              {/* Rolle & Erfahrung */}
              <div className="bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role & Experience</h3>
                  <button onClick={() => setStep(2)} className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 cursor-pointer">Edit</button>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-slate-500 dark:text-slate-400">Role:</span> <span className="font-medium text-slate-900 dark:text-white ml-1">{form.role || '—'}</span></div>
                  <div><span className="text-slate-500 dark:text-slate-400">Experience:</span> <span className="font-medium text-slate-900 dark:text-white ml-1">{form.experience || '—'}</span></div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Skills</h3>
                  <button onClick={() => setStep(3)} className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 cursor-pointer">Edit</button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.skills.map((s) => (
                    <span key={s} className="px-2 py-0.5 bg-[#77CF97]/10 text-[#77CF97] rounded text-xs font-medium">{s}</span>
                  ))}
                </div>
              </div>

              {/* Verfuegbarkeit */}
              <div className="bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Availability</h3>
                  <button onClick={() => setStep(4)} className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 cursor-pointer">Edit</button>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-slate-500 dark:text-slate-400">Hours:</span> <span className="font-medium text-slate-900 dark:text-white ml-1">{form.availability || '—'}</span></div>
                  <div><span className="text-slate-500 dark:text-slate-400">Timezone:</span> <span className="font-medium text-slate-900 dark:text-white ml-1">{form.timezone}</span></div>
                  {form.voyage && <div><span className="text-slate-500 dark:text-slate-400">Voyage:</span> <span className="font-medium text-slate-900 dark:text-white ml-1">{form.voyage}</span></div>}
                </div>
              </div>

              {/* Motivation */}
              <div className="bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Motivation</h3>
                  <button onClick={() => setStep(5)} className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 cursor-pointer">Edit</button>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Motivation:</span>
                    <p className="text-slate-700 dark:text-slate-200 mt-1">{form.motivation || '—'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">About:</span>
                    <p className="text-slate-700 dark:text-slate-200 mt-1">{form.bio || '—'}</p>
                  </div>
                  {form.portfolio && (
                    <div><span className="text-slate-500 dark:text-slate-400">Portfolio:</span> <a href={form.portfolio} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-500 hover:text-blue-600 ml-1">{form.portfolio}</a></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigationsbuttons */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={step === 1 ? () => router.push('/overview') : prev}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {step === 1 ? 'Cancel' : 'Back'}
        </button>

        {step < STEPS.length ? (
          <button
            onClick={next}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#0b0c10] dark:bg-[#77CF97] text-white dark:text-[#0b0c10] rounded-xl text-sm font-medium hover:bg-slate-800 dark:hover:bg-[#5ab87e] transition-colors shadow-sm cursor-pointer"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#77CF97] text-white rounded-xl text-sm font-semibold hover:bg-[#5ab87e] transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Application
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
