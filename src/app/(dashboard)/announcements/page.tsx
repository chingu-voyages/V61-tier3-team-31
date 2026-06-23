'use client';

import {useState, useEffect} from 'react';
import {
  Megaphone, Plus, Search, MoreHorizontal, Pencil, Trash2,
  Pin, PinOff, Archive, Send, FileText,
} from 'lucide-react';
import type {Announcement, AnnouncementStatus, AnnouncementTarget} from '@/types';
import {useDashboard} from '@/lib/auth-context';
import {useRouter} from 'next/navigation';

/** Mock-Daten fuer die Announcement-Verwaltung */
const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-001',
    title: 'Welcome to Voyage 51!',
    content: 'We are excited to kick off Voyage 51! This cohort brings together 128 talented participants from around the world. Over the next 10 weeks, you will collaborate in cross-functional teams to build impactful projects. Make sure to complete your onboarding steps as soon as possible.',
    author: 'Jane Cooper',
    target: 'all',
    status: 'published',
    createdAt: '2026-04-20T09:00:00Z',
    updatedAt: '2026-04-20T09:00:00Z',
    pinned: true,
  },
  {
    id: 'ann-002',
    title: 'Onboarding Deadline Extended',
    content: 'Due to popular request, the onboarding deadline has been extended to May 10. Please ensure all forms are submitted before then. Reach out to your team lead if you encounter any issues.',
    author: 'Jane Cooper',
    target: 'participants',
    status: 'published',
    createdAt: '2026-05-02T14:30:00Z',
    updatedAt: '2026-05-02T14:30:00Z',
    pinned: false,
  },
  {
    id: 'ann-003',
    title: 'Team Formation Guidelines',
    content: 'Teams should consist of 4-6 members with a mix of roles: at least one Frontend, one Backend, one Design, and one Product owner. Use the matching tool in the dashboard to find collaborators.',
    author: 'Jane Cooper',
    target: 'teams',
    status: 'published',
    createdAt: '2026-04-25T11:00:00Z',
    updatedAt: '2026-04-25T11:00:00Z',
    pinned: false,
  },
  {
    id: 'ann-004',
    title: 'Application Review Update',
    content: 'We are currently processing applications for Voyage 52. If you have already applied, expect to hear back within 2 weeks. In the meantime, feel free to update your application with any new information.',
    author: 'Jane Cooper',
    target: 'applicants',
    status: 'draft',
    createdAt: '2026-05-10T08:00:00Z',
    updatedAt: '2026-05-10T08:00:00Z',
    pinned: false,
  },
  {
    id: 'ann-005',
    title: 'Weekly Standup Schedule Change',
    content: 'Starting next week, all team standups will move from 18:00 to 19:00 UTC to better accommodate participants across time zones. Please update your calendars accordingly.',
    author: 'Jane Cooper',
    target: 'participants',
    status: 'published',
    createdAt: '2026-05-15T16:00:00Z',
    updatedAt: '2026-05-15T16:00:00Z',
    pinned: false,
  },
  {
    id: 'ann-006',
    title: 'Mentorship Program Launch',
    content: 'We are launching a mentorship program pairing experienced developers with newer participants. Sign up through the onboarding portal if you are interested in becoming a mentor or mentee.',
    author: 'Jane Cooper',
    target: 'all',
    status: 'draft',
    createdAt: '2026-05-18T10:00:00Z',
    updatedAt: '2026-05-18T10:00:00Z',
    pinned: false,
  },
  {
    id: 'ann-007',
    title: 'Voyage 50 Retrospective Summary',
    content: 'Voyage 50 concluded with an 87% completion rate, the highest to date. Key takeaways: early team formation, regular mentor check-ins, and shared documentation were the biggest success factors.',
    author: 'Jane Cooper',
    target: 'all',
    status: 'archived',
    createdAt: '2026-03-16T09:00:00Z',
    updatedAt: '2026-03-20T14:00:00Z',
    pinned: false,
  },
  {
    id: 'ann-008',
    title: 'Holiday Schedule Notice',
    content: 'The Amigo platform will have reduced support during the holiday period from December 20 to January 5. Core features remain available, but response times for support tickets may be delayed.',
    author: 'Jane Cooper',
    target: 'all',
    status: 'archived',
    createdAt: '2025-12-15T08:00:00Z',
    updatedAt: '2025-12-15T08:00:00Z',
    pinned: false,
  },
];

/** Konfiguration fuer Announcement-Status Badges */
const STATUS_CONFIG: Record<AnnouncementStatus, {label: string; color: string}> = {
  published: {label: 'Published', color: 'bg-[#77CF97]/10 text-[#77CF97] border border-[#77CF97]/20'},
  draft: {label: 'Draft', color: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20'},
  archived: {label: 'Archived', color: 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-white/10'},
};

/** Konfiguration fuer Zielgruppen-Badges */
const TARGET_CONFIG: Record<AnnouncementTarget, {label: string; color: string}> = {
  all: {label: 'All', color: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20'},
  participants: {label: 'Participants', color: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20'},
  teams: {label: 'Teams', color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20'},
  applicants: {label: 'Applicants', color: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20'},
};

/** Formular-Zustand fuer das Erstellen/Bearbeiten */
interface AnnouncementForm {
  title: string;
  content: string;
  target: AnnouncementTarget;
  status: 'published' | 'draft';
  pinned: boolean;
}

const EMPTY_FORM: AnnouncementForm = {
  title: '',
  content: '',
  target: 'all',
  status: 'draft',
  pinned: false,
};

/**
 * Verwaltungsseite fuer Announcements (nur Admin).
 * Bietet vollstaendige CRUD-Operationen fuer Ankündigungen.
 * Erstellt, bearbeitet, laescht und archiviert Announcements.
 */
export default function AnnouncementsPage() {
  const {role} = useDashboard();
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [statusFilter, setStatusFilter] = useState<AnnouncementStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [form, setForm] = useState<AnnouncementForm>(EMPTY_FORM);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Nur Admin hat Zugriff
  useEffect(() => {
    if (role !== 'admin') {
      router.push('/overview');
    }
  }, [role, router]);

  if (role !== 'admin') return null;

  /** Gefilterte Announcements berechnen */
  const filtered = announcements.filter((a) => {
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  /** Statistik-Zahlen */
  const counts = {
    all: announcements.length,
    published: announcements.filter((a) => a.status === 'published').length,
    draft: announcements.filter((a) => a.status === 'draft').length,
    archived: announcements.filter((a) => a.status === 'archived').length,
  };

  /** Formular oeffnen zum Erstellen */
  const openCreateForm = () => {
    setEditingAnnouncement(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  /** Formular oeffnen zum Bearbeiten */
  const openEditForm = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setForm({
      title: announcement.title,
      content: announcement.content,
      target: announcement.target,
      status: announcement.status === 'archived' ? 'draft' : announcement.status,
      pinned: announcement.pinned,
    });
    setShowForm(true);
    setActiveMenu(null);
  };

  /** Announcement speichern (erstellen oder aktualisieren) */
  const handleSave = () => {
    if (!form.title || !form.content) return;

    if (editingAnnouncement) {
      setAnnouncements((prev) =>
        prev.map((a) =>
          a.id === editingAnnouncement.id
            ? {
                ...a,
                title: form.title,
                content: form.content,
                target: form.target,
                status: form.status,
                pinned: form.pinned,
                updatedAt: new Date().toISOString(),
              }
            : a,
        ),
      );
    } else {
      const now = new Date().toISOString();
      const newAnnouncement: Announcement = {
        id: `ann-${String(Date.now()).slice(-6)}`,
        title: form.title,
        content: form.content,
        author: 'Jane Cooper',
        target: form.target,
        status: form.status,
        createdAt: now,
        updatedAt: now,
        pinned: form.pinned,
      };
      setAnnouncements((prev) => [newAnnouncement, ...prev]);
    }
    setShowForm(false);
    setEditingAnnouncement(null);
    setForm(EMPTY_FORM);
  };

  /** Announcement loeschen */
  const handleDelete = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    setActiveMenu(null);
  };

  /** Pin/Unpin umschalten */
  const handleTogglePin = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? {...a, pinned: !a.pinned, updatedAt: new Date().toISOString()} : a)),
    );
    setActiveMenu(null);
  };

  /** Announcement archivieren */
  const handleArchive = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) =>
        a.id === id
          ? {...a, status: 'archived' as AnnouncementStatus, updatedAt: new Date().toISOString()}
          : a,
      ),
    );
    setActiveMenu(null);
  };

  /** Datumsformatierung */
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
  };

  /** Inhalt auf 2 Zeilen kuerzen */
  const truncateContent = (text: string, maxLength = 120) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trimEnd() + '…';
  };

  return (
    <div className="space-y-6">
      {/* Seitenkopf */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[28px] font-outfit font-medium text-slate-900 dark:text-white mb-1 tracking-tight">
            Announcements
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Create and manage announcements for participants, teams, and applicants.
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="px-4 py-2 bg-[#0b0c10] dark:bg-[#77CF97] text-white dark:text-[#0b0c10] rounded-xl text-sm font-medium hover:bg-slate-800 dark:hover:bg-[#5ab87e] transition-colors shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      {/* Statistik-Karten */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {label: 'Total', value: counts.all, icon: Megaphone, accent: 'text-slate-700 dark:text-slate-200'},
          {label: 'Published', value: counts.published, icon: Send, accent: 'text-[#77CF97]'},
          {label: 'Drafts', value: counts.draft, icon: FileText, accent: 'text-amber-500'},
          {label: 'Archived', value: counts.archived, icon: Archive, accent: 'text-slate-500'},
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

      {/* Filter + Suche */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2 border-b border-slate-200 dark:border-white/10 pb-px flex-1">
          {(['all', 'published', 'draft', 'archived'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 border-b-2 font-medium text-sm cursor-pointer transition-colors ${
                statusFilter === status
                  ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {status === 'all'
                ? `All (${counts.all})`
                : `${status.charAt(0).toUpperCase() + status.slice(1)} (${counts[status]})`}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white dark:bg-[#1a1b24] border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#77CF97]/30 focus:border-[#77CF97]/50 transition-all w-64"
          />
        </div>
      </div>

      {/* Announcements-Liste */}
      <div className="grid gap-4">
        {filtered.length === 0 && (
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 p-12 text-center">
            <Megaphone className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">No announcements found matching your criteria.</p>
          </div>
        )}
        {filtered.map((announcement) => {
          const statusConf = STATUS_CONFIG[announcement.status];
          const targetConf = TARGET_CONFIG[announcement.target];
          return (
            <div
              key={announcement.id}
              className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:border-slate-200 dark:hover:border-white/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Linke Spalte */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#77CF97]/10 flex items-center justify-center shrink-0">
                      <Megaphone className="w-5 h-5 text-[#77CF97]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white truncate">
                          {announcement.title}
                        </h3>
                        {announcement.pinned && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-semibold border border-amber-100 dark:border-amber-500/20">
                            <Pin className="w-2.5 h-2.5" /> Pinned
                          </span>
                        )}
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConf.color}`}>
                          {statusConf.label}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${targetConf.color}`}>
                          {targetConf.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {truncateContent(announcement.content)}
                      </p>
                    </div>
                  </div>

                  {/* Metriken */}
                  <div className="flex items-center gap-4 mt-3 ml-[52px]">
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      By <span className="font-medium text-slate-600 dark:text-slate-300">{announcement.author}</span>
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      Created {formatDate(announcement.createdAt)}
                    </span>
                    {announcement.updatedAt !== announcement.createdAt && (
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        Updated {formatDate(announcement.updatedAt)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Rechte Spalte — Aktionen */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEditForm(announcement)}
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setActiveMenu(activeMenu === announcement.id ? null : announcement.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                      title="More"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {activeMenu === announcement.id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-[#1a1b24] border border-white/10 rounded-xl shadow-xl z-20 p-1">
                        <button
                          onClick={() => openEditForm(announcement)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-200 hover:bg-white/5 rounded-lg cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Edit Announcement
                        </button>
                        <button
                          onClick={() => handleTogglePin(announcement.id)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-200 hover:bg-white/5 rounded-lg cursor-pointer"
                        >
                          {announcement.pinned ? (
                            <><PinOff className="w-3.5 h-3.5" /> Unpin</>
                          ) : (
                            <><Pin className="w-3.5 h-3.5" /> Pin Announcement</>
                          )}
                        </button>
                        {announcement.status !== 'archived' && (
                          <button
                            onClick={() => handleArchive(announcement.id)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-400 hover:bg-blue-400/10 rounded-lg cursor-pointer"
                          >
                            <Archive className="w-3.5 h-3.5" /> Archive
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(announcement.id)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-400 hover:bg-rose-400/10 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Announcement erstellen/bearbeiten */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-100 dark:border-white/10">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {editingAnnouncement
                  ? 'Update the announcement content and settings.'
                  : 'Compose an announcement to share with your audience.'}
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({...f, title: e.target.value}))}
                  placeholder="e.g. Important Update"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#77CF97]/30 focus:border-[#77CF97]/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Content</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => ({...f, content: e.target.value}))}
                  placeholder="Write your announcement content here..."
                  rows={5}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#77CF97]/30 focus:border-[#77CF97]/50 transition-all resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Target Audience</label>
                  <select
                    value={form.target}
                    onChange={(e) => setForm((f) => ({...f, target: e.target.value as AnnouncementTarget}))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#77CF97]/30 focus:border-[#77CF97]/50 transition-all"
                  >
                    <option value="all">All</option>
                    <option value="participants">Participants</option>
                    <option value="teams">Teams</option>
                    <option value="applicants">Applicants</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({...f, status: e.target.value as 'published' | 'draft'}))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#77CF97]/30 focus:border-[#77CF97]/50 transition-all"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Pin Announcement</label>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({...f, pinned: !f.pinned}))}
                  className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
                    form.pinned ? 'bg-[#77CF97]' : 'bg-slate-200 dark:bg-white/10'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      form.pinned ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
                {form.pinned && (
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                    <Pin className="w-3 h-3" /> Will appear at top
                  </span>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-3">
              <button
                onClick={() => { setShowForm(false); setEditingAnnouncement(null); }}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.title || !form.content}
                className="px-5 py-2 bg-[#0b0c10] dark:bg-[#77CF97] text-white dark:text-[#0b0c10] rounded-xl text-sm font-medium hover:bg-slate-800 dark:hover:bg-[#5ab87e] transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingAnnouncement ? 'Save Changes' : 'Create Announcement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
