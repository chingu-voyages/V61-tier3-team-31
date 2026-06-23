'use client';

import {useState} from 'react';
import {FileText, FileSearch, Clock, CheckCircle, XCircle, X, Download} from 'lucide-react';
import {useRouter} from 'next/navigation';
import type {Application, ApplicationStatus} from '@/types';

/** Mock-Bewerbungsdaten mit vollstaendigen Details */
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
    bio: 'Experienced full-stack developer with a passion for building scalable web applications. Previously worked at a SaaS startup leading frontend architecture.',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'],
    availability: '20 hours/week',
    motivation: 'Looking to collaborate with diverse teams and contribute to meaningful open-source projects during this cohort.',
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
    bio: 'Frontend developer specializing in React and modern CSS. Passionate about accessible UI and design systems.',
    skills: ['React', 'CSS', 'Figma', 'Storybook', 'Tailwind'],
    availability: '15 hours/week',
    motivation: 'Want to improve my teamwork skills and learn from experienced developers in a real project setting.',
    portfolio: 'github.com/mchang',
    timezone: 'UTC+8 (SGT)',
    reviewNotes: 'Strong frontend skills. Good cultural fit. Accepted into Voyage 51.',
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
    bio: 'Aspiring backend developer learning Rust and Python. Currently completing online courses in distributed systems.',
    skills: ['Python', 'Rust', 'Git'],
    availability: '10 hours/week',
    motivation: 'Eager to gain hands-on experience with real-world projects and mentorship.',
    portfolio: 'github.com/drust',
    timezone: 'UTC+1 (CET)',
    reviewNotes: 'Insufficient experience for current cohort requirements. Recommend applying to Voyage 52.',
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
    bio: 'Senior frontend engineer with expertise in React ecosystems. Led teams of 5+ developers at previous companies.',
    skills: ['React', 'Next.js', 'TypeScript', 'GraphQL', 'Testing'],
    availability: '25 hours/week',
    motivation: 'Seeking a collaborative environment where I can both contribute and learn from international teams.',
    portfolio: 'github.com-chen',
    timezone: 'UTC+8 (CST)',
    reviewNotes: '',
  },
];

/** Konfiguration fuer ApplicationStatus Badges */
const STATUS_CONFIG: Record<ApplicationStatus, {label: string; icon: React.ElementType; style: string}> = {
  pending_review: {label: 'Pending Review', icon: Clock, style: 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-white/10'},
  accepted: {label: 'Accepted', icon: CheckCircle, style: 'bg-[#77CF97]/10 text-[#77CF97] border border-[#77CF97]/20'},
  rejected: {label: 'Rejected', icon: XCircle, style: 'bg-rose-50 dark:bg-rose-500/10 text-rose-500 border border-rose-100 dark:border-rose-500/20'},
  incomplete: {label: 'Incomplete', icon: Clock, style: 'bg-amber-50 dark:bg-amber-500/10 text-amber-500 border border-amber-100 dark:border-amber-500/20'},
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
 * Bewerbungsseite mit Tabelle, Filtern und Tabs.
 * Zeigt eine Liste aller eingegangenen Voyage-Bewerbungen.
 * Klick auf eine Zeile fuert zur Detail-Ansicht.
 */
export default function ApplicationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ApplicationStatus | 'all'>('all');

  const counts = {
    all: MOCK_APPLICATIONS.length,
    pending_review: MOCK_APPLICATIONS.filter((a) => a.status === 'pending_review').length,
    accepted: MOCK_APPLICATIONS.filter((a) => a.status === 'accepted').length,
    rejected: MOCK_APPLICATIONS.filter((a) => a.status === 'rejected').length,
    incomplete: MOCK_APPLICATIONS.filter((a) => a.status === 'incomplete').length,
  };

  const filtered = activeTab === 'all'
    ? MOCK_APPLICATIONS
    : MOCK_APPLICATIONS.filter((a) => a.status === activeTab);

  /**
   * Exportiert die gefilterte Bewerbungsliste als CSV-Datei.
   * Beruecksichtigt alle sichtbaren Spalten und aktiven Filter.
   */
  const exportCSV = () => {
    /** Escape-Funktion fuer CSV-Felder mit Kommas oder Anfuehrungszeichen */
    const escape = (val: string) => {
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };

    /** Kopfzeile der CSV-Datei */
    const headers = [
      'Name', 'Email', 'Role', 'Experience', 'Years', 'Status',
      'Voyage', 'Availability', 'Timezone', 'Skills', 'Applied Date',
    ];

    /** Datenzeilen aus den gefilterten Bewerbungen */
    const rows = filtered.map((app) => [
      escape(app.name),
      escape(app.email),
      app.role,
      app.experience,
      app.years,
      STATUS_CONFIG[app.status].label,
      app.voyage,
      app.availability,
      app.timezone,
      escape(app.skills.join('; ')),
      app.date,
    ]);

    /** CSV-String zusammenbauen (UTF-8 BOM fuer Excel-Kompatibilitaet) */
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    /** Blob erstellen und Download ausloesen */
    const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `applications-${activeTab}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
  };

  return (
    <div className="space-y-6">
      {/* Seitenkopf */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-outfit font-medium text-slate-900 dark:text-white mb-1 tracking-tight">Applications</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage and review incoming voyage applications.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white dark:bg-[#1a1b24] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
            <FileSearch className="w-4 h-4" /> Filters
          </button>
          <button
            onClick={exportCSV}
            disabled={filtered.length === 0}
            className="px-4 py-2 bg-[#0b0c10] dark:bg-[#77CF97] text-white dark:text-[#0b0c10] rounded-xl text-sm font-medium hover:bg-slate-800 dark:hover:bg-[#5ab87e] transition-colors shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" /> Export CSV {filtered.length > 0 && `(${filtered.length})`}
          </button>
        </div>
      </div>

      {/* Filter-Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-white/10 pb-px">
        {([
          {key: 'all' as const, label: `All (${counts.all})`},
          {key: 'pending_review' as const, label: `Pending Review (${counts.pending_review})`},
          {key: 'accepted' as const, label: `Accepted (${counts.accepted})`},
          {key: 'rejected' as const, label: `Rejected (${counts.rejected})`},
          {key: 'incomplete' as const, label: `Incomplete (${counts.incomplete})`},
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

      {/* Tabelle */}
      <div className="bg-white dark:bg-[#1a1b24] rounded-[24px] border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Applicant</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Experience</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Applied</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {filtered.map((app) => {
              const statusConf = STATUS_CONFIG[app.status];
              const StatusIcon = statusConf.icon;
              return (
                <tr
                  key={app.id}
                  onClick={() => router.push(`/applications/${app.id}`)}
                  className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={app.avatar} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10" alt="" />
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{app.name}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{app.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${ROLE_COLORS[app.role]}`}>{app.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700 dark:text-slate-300">{app.experience}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{app.years}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConf.style}`}>
                      <StatusIcon className="w-3 h-3" /> {statusConf.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{formatDate(app.date)}</td>
                  <td className="px-6 py-4 text-right">
                    {app.status === 'pending_review' && (
                      <span className="text-sm font-medium transition-colors cursor-pointer px-3 py-1.5 rounded-lg text-[#77CF97] hover:text-[#5ab87e] bg-[#77CF97]/10 hover:bg-[#77CF97]/20">Review</span>
                    )}
                    {app.status !== 'pending_review' && (
                      <span className="text-sm font-medium transition-colors cursor-pointer px-3 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">View</span>
                    )}
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
