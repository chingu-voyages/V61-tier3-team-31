'use client';

import {useState, useEffect} from 'react';
import {
  Compass, Plus, Calendar, Users,
  Search, MoreHorizontal, Pencil, Trash2, Eye,
  CircleCheck, Clock, Archive, Play,
} from 'lucide-react';
import type {Voyage, VoyageStatus} from '@/types';
import {useDashboard} from '@/lib/auth-context';
import {useRouter} from 'next/navigation';

/** Mock-Daten fuer die Voyage-Verwaltung */
const INITIAL_VOYAGES: Voyage[] = [
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
  {
    id: '53',
    name: 'Voyage 53',
    number: 53,
    status: 'planning',
    startDate: '2026-11-01',
    endDate: '2027-01-15',
    applicationDeadline: '2026-10-10',
    participants: 0,
    teams: 0,
    description: 'Fall/Winter cohort. Early-stage planning.',
  },
];

/** Konfiguration fuer Voyage-Status Badges */
const STATUS_CONFIG: Record<VoyageStatus, {label: string; icon: React.ElementType; color: string}> = {
  planning: {label: 'Planning', icon: Clock, color: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20'},
  active: {label: 'Active', icon: Play, color: 'bg-[#77CF97]/10 text-[#77CF97] border border-[#77CF97]/20'},
  review: {label: 'Review', icon: CircleCheck, color: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20'},
  completed: {label: 'Completed', icon: Archive, color: 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-white/10'},
};

/** Formular-Zustand fuer das Erstellen/Bearbeiten */
interface VoyageForm {
  name: string;
  startDate: string;
  endDate: string;
  applicationDeadline: string;
  description: string;
}

const EMPTY_FORM: VoyageForm = {
  name: '',
  startDate: '',
  endDate: '',
  applicationDeadline: '',
  description: '',
};

/**
 * Verwaltungsseite fuer Voyages (nur Admin).
 * Bietet vollstaendige CRUD-Operationen fuer Voyage-Lebenszyklen.
 */
export default function VoyagesPage() {
  const {role} = useDashboard();
  const router = useRouter();
  const [voyages, setVoyages] = useState<Voyage[]>(INITIAL_VOYAGES);
  const [statusFilter, setStatusFilter] = useState<VoyageStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingVoyage, setEditingVoyage] = useState<Voyage | null>(null);
  const [form, setForm] = useState<VoyageForm>(EMPTY_FORM);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Nur Admin hat Zugriff
  useEffect(() => {
    if (role !== 'admin') {
      router.push('/overview');
    }
  }, [role, router]);

  if (role !== 'admin') return null;

  /** Gefilterte Voyages berechnen */
  const filtered = voyages.filter((v) => {
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  /** Statistik-Zahlen */
  const counts = {
    all: voyages.length,
    active: voyages.filter((v) => v.status === 'active').length,
    planning: voyages.filter((v) => v.status === 'planning').length,
    completed: voyages.filter((v) => v.status === 'completed').length,
  };

  /** Formular oeffnen zum Erstellen */
  const openCreateForm = () => {
    setEditingVoyage(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  /** Formular oeffnen zum Bearbeiten */
  const openEditForm = (voyage: Voyage) => {
    setEditingVoyage(voyage);
    setForm({
      name: voyage.name,
      startDate: voyage.startDate,
      endDate: voyage.endDate,
      applicationDeadline: voyage.applicationDeadline,
      description: voyage.description,
    });
    setShowForm(true);
    setActiveMenu(null);
  };

  /** Voyage speichern (erstellen oder aktualisieren) */
  const handleSave = () => {
    if (!form.name || !form.startDate || !form.endDate) return;

    if (editingVoyage) {
      setVoyages((prev) =>
        prev.map((v) =>
          v.id === editingVoyage.id
            ? {...v, ...form}
            : v,
        ),
      );
    } else {
      const maxNum = Math.max(...voyages.map((v) => v.number), 0);
      const newVoyage: Voyage = {
        id: String(maxNum + 1),
        name: form.name || `Voyage ${maxNum + 1}`,
        number: maxNum + 1,
        status: 'planning',
        startDate: form.startDate,
        endDate: form.endDate,
        applicationDeadline: form.applicationDeadline,
        participants: 0,
        teams: 0,
        description: form.description,
      };
      setVoyages((prev) => [newVoyage, ...prev]);
    }
    setShowForm(false);
    setEditingVoyage(null);
    setForm(EMPTY_FORM);
  };

  /** Voyage loeschen */
  const handleDelete = (id: string) => {
    setVoyages((prev) => prev.filter((v) => v.id !== id));
    setActiveMenu(null);
  };

  /** Status aendern */
  const handleStatusChange = (id: string, newStatus: VoyageStatus) => {
    setVoyages((prev) =>
      prev.map((v) => (v.id === id ? {...v, status: newStatus} : v)),
    );
    setActiveMenu(null);
  };

  /** Datumsformatierung */
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
  };

  /** Dauer in Wochen berechnen */
  const durationWeeks = (start: string, end: string) => {
    if (!start || !end) return '—';
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return `${Math.ceil(diff / (1000 * 60 * 60 * 24 * 7))} weeks`;
  };

  return (
    <div className="space-y-6">
      {/* Seitenkopf */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-outfit font-medium text-slate-900 dark:text-white mb-1 tracking-tight">
            Voyages
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Manage voyage lifecycles — create, configure, and track cohorts.
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="px-4 py-2 bg-[#0b0c10] dark:bg-[#77CF97] text-white dark:text-[#0b0c10] rounded-xl text-sm font-medium hover:bg-slate-800 dark:hover:bg-[#5ab87e] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> New Voyage
        </button>
      </div>

      {/* Statistik-Karten */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {label: 'Total', value: counts.all, icon: Compass, accent: 'text-slate-700 dark:text-slate-200'},
          {label: 'Active', value: counts.active, icon: Play, accent: 'text-[#77CF97]'},
          {label: 'Planning', value: counts.planning, icon: Clock, accent: 'text-amber-500'},
          {label: 'Completed', value: counts.completed, icon: Archive, accent: 'text-slate-500'},
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
          {(['all', 'active', 'planning', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 border-b-2 font-medium text-sm cursor-pointer transition-colors ${
                statusFilter === status
                  ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {status === 'all' ? `All (${counts.all})` : `${STATUS_CONFIG[status].label} (${counts[status]})`}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search voyages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white dark:bg-[#1a1b24] border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#77CF97]/30 focus:border-[#77CF97]/50 transition-all w-64"
          />
        </div>
      </div>

      {/* Voyages-Liste als Cards */}
      <div className="grid gap-4">
        {filtered.length === 0 && (
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 p-12 text-center">
            <Compass className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">No voyages found matching your criteria.</p>
          </div>
        )}
        {filtered.map((voyage) => {
          const statusConf = STATUS_CONFIG[voyage.status];
          const StatusIcon = statusConf.icon;
          return (
            <div
              key={voyage.id}
              onClick={() => router.push(`/voyages/${voyage.id}`)}
              className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:border-slate-200 dark:hover:border-white/20 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Linke Spalte */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#77CF97]/10 flex items-center justify-center shrink-0">
                      <Compass className="w-5 h-5 text-[#77CF97]" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white truncate">{voyage.name}</h3>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConf.color}`}>
                          <StatusIcon className="w-3 h-3" /> {statusConf.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{voyage.description}</p>
                    </div>
                  </div>

                  {/* Metriken */}
                  <div className="flex items-center gap-6 mt-4 ml-[52px]">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(voyage.startDate)} — {formatDate(voyage.endDate)}</span>
                      <span className="text-slate-400 dark:text-slate-600 ml-1">({durationWeeks(voyage.startDate, voyage.endDate)})</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <Users className="w-3.5 h-3.5" />
                      <span>{voyage.participants} participants · {voyage.teams} teams</span>
                    </div>
                  </div>

                  {/* Fortschrittsbalken */}
                  {voyage.status === 'active' && (
                    <div className="ml-[52px] mt-3">
                      <div className="w-full max-w-md h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#77CF97] rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, Math.max(0, ((Date.now() - new Date(voyage.startDate).getTime()) / (new Date(voyage.endDate).getTime() - new Date(voyage.startDate).getTime())) * 100))}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-[10px] text-slate-400">{formatDate(voyage.startDate)}</span>
                        <span className="text-[10px] text-slate-400">{formatDate(voyage.endDate)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Rechte Spalte — Aktionen */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); openEditForm(voyage); }}
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <div className="relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === voyage.id ? null : voyage.id); }}
                      className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                      title="More"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {activeMenu === voyage.id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-[#1a1b24] border border-white/10 rounded-xl shadow-xl z-20 p-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); openEditForm(voyage); }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-200 hover:bg-white/5 rounded-lg cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Edit Details
                        </button>
                        <button
                          onClick={() => { setActiveMenu(null); router.push(`/voyages/${voyage.id}`); }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-200 hover:bg-white/5 rounded-lg cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Details
                        </button>
                        {voyage.status === 'planning' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleStatusChange(voyage.id, 'active'); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#77CF97] hover:bg-[#77CF97]/10 rounded-lg cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5" /> Start Voyage
                          </button>
                        )}
                        {voyage.status === 'active' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleStatusChange(voyage.id, 'completed'); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-400 hover:bg-blue-400/10 rounded-lg cursor-pointer"
                          >
                            <Archive className="w-3.5 h-3.5" /> Complete Voyage
                          </button>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(voyage.id); }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-400 hover:bg-rose-400/10 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete Voyage
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

      {/* Modal: Voyage erstellen/bearbeiten */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-100 dark:border-white/10">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {editingVoyage ? `Edit ${editingVoyage.name}` : 'Create New Voyage'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {editingVoyage ? 'Update the voyage configuration and dates.' : 'Set up a new cohort voyage with its lifecycle dates.'}
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Voyage Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({...f, name: e.target.value}))}
                  placeholder="e.g. Voyage 54"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#77CF97]/30 focus:border-[#77CF97]/50 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Start Date</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((f) => ({...f, startDate: e.target.value}))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#77CF97]/30 focus:border-[#77CF97]/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">End Date</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm((f) => ({...f, endDate: e.target.value}))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#77CF97]/30 focus:border-[#77CF97]/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Application Deadline</label>
                <input
                  type="date"
                  value={form.applicationDeadline}
                  onChange={(e) => setForm((f) => ({...f, applicationDeadline: e.target.value}))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#77CF97]/30 focus:border-[#77CF97]/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({...f, description: e.target.value}))}
                  placeholder="Brief description of this voyage's focus and goals..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#77CF97]/30 focus:border-[#77CF97]/50 transition-all resize-none"
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-3">
              <button
                onClick={() => { setShowForm(false); setEditingVoyage(null); }}
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name || !form.startDate || !form.endDate}
                className="px-5 py-2 bg-[#0b0c10] dark:bg-[#77CF97] text-white dark:text-[#0b0c10] rounded-xl text-sm font-medium hover:bg-slate-800 dark:hover:bg-[#5ab87e] transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingVoyage ? 'Save Changes' : 'Create Voyage'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
