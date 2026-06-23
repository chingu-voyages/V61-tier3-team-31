'use client';

import {useState, useCallback, useMemo} from 'react';
import {Settings, Network, Search, Users, CheckCircle, Plus, ChevronRight, ChevronDown, MoreHorizontal, ShieldAlert} from 'lucide-react';
import {MatchingRulesModal} from '@/components/matching-rules-modal';

/** Unbesetzte Teilnehmer im Pool */
const unassignedPool = [
  {name: 'Robert Fox', role: 'Frontend', exp: 'L3', av: '22', avail: '20hrs/wk'},
  {name: 'Jane Cooper', role: 'Backend', exp: 'L4', av: '43', avail: '15hrs/wk'},
  {name: 'Wade Warren', role: 'Fullstack', exp: 'L5', av: '13', avail: '30hrs/wk'},
  {name: 'Esther Howard', role: 'Design', exp: 'L2', av: '9', avail: '20hrs/wk'},
  {name: 'Cameron Williamson', role: 'Frontend', exp: 'L3', av: '6', avail: '25hrs/wk'},
  {name: 'Brooklyn Simmons', role: 'Backend', exp: 'L4', av: '34', avail: '10hrs/wk'},
  {name: 'Leslie Alexander', role: 'Product', exp: 'L3', av: '41', avail: '20hrs/wk'},
];

/** Verfügbare Rollenfilter für den Pool */
const roleFilters = [
  {key: 'all', label: 'All'},
  {key: 'Frontend', label: 'Frontend (24)'},
  {key: 'Backend', label: 'Backend (19)'},
  {key: 'Design', label: 'Design (8)'},
] as const;

/** Team-Definitionen mit Mitgliedern und Metadaten */
const teamDefinitions = [
  {
    id: 'alpha',
    code: 'T1',
    name: 'Alpha Core',
    timezone: 'EST/CST',
    match: '100%',
    badgeStyle: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 dark:text-indigo-400',
    borderClass: 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20',
    complete: true,
    members: [
      {name: 'Alice Smith', avatar: '1', role: 'Frontend', roleStyle: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10'},
      {name: 'Bob Jones', avatar: '2', role: 'Backend', roleStyle: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10'},
      {name: 'Charlie Davis', avatar: '3', role: 'Fullstack', roleStyle: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10'},
    ],
  },
  {
    id: 'beta',
    code: 'T2',
    name: 'Beta Squad',
    timezone: 'PST',
    match: '66%',
    badgeStyle: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    borderClass: 'border-rose-200 dark:border-rose-500/30 hover:border-rose-300 dark:hover:border-rose-500/40',
    complete: false,
    missingSlot: 'Backend',
    members: [
      {name: 'Diana Prince', avatar: '4', role: 'Frontend', roleStyle: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10'},
      {name: 'Evan Wright', avatar: '5', role: 'Design', roleStyle: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10'},
    ],
  },
  {
    id: 'gamma',
    code: 'T3',
    name: 'Gamma Ray',
    timezone: 'GMT',
    match: '100%',
    badgeStyle: 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    borderClass: 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20',
    complete: true,
    members: [
      {name: 'Fiona Gallagher', avatar: '6', role: 'Product', roleStyle: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'},
      {name: 'George Clark', avatar: '7', role: 'Fullstack', roleStyle: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10'},
      {name: 'Hannah Lee', avatar: '8', role: 'Fullstack', roleStyle: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10'},
    ],
  },
];

/**
 * Team-Karte mit ein-/ausklappbarer Mitgliederliste.
 * Zeigt beim Zuklappen die Anzahl der Mitglieder.
 */
function TeamCard({team, isExpanded, onToggle}: {
  team: typeof teamDefinitions[number];
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`bg-white dark:bg-[#1a1b24] rounded-[24px] border shadow-sm p-5 transition-colors relative ${team.borderClass}`}>
      {team.missingSlot && (
        <div className="absolute top-0 right-6 -translate-y-1/2">
          <span className="bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">Missing Slot</span>
        </div>
      )}
      {/* Kopfbereich zum Umschalten */}
      <div
        className="flex items-center justify-between mb-4 mt-1 cursor-pointer select-none"
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onToggle(); }}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${team.badgeStyle}`}>{team.code}</div>
          <div>
            <div className="text-sm font-bold text-slate-800 dark:text-white">{team.name}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Timezone: {team.timezone} • {team.match} Match
              {!isExpanded && <span className="ml-2 text-slate-400 dark:text-slate-500">• {team.members.length} members</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ChevronDown className={`w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          <button
            className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 p-1"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Ausklappbarer Mitgliederbereich */}
      <div className={`space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        {team.members.map((m, j) => (
          <div key={j} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2.5">
              <img src={`https://i.pravatar.cc/100?img=${m.avatar}`} className="w-7 h-7 rounded-full" alt="" />
              <div className="text-sm font-medium text-slate-800 dark:text-white">{m.name}</div>
            </div>
            <div className={`text-xs font-semibold px-2 py-0.5 rounded ${m.roleStyle}`}>{m.role}</div>
          </div>
        ))}
        {team.missingSlot && (
          <div className="flex items-center justify-between p-3 rounded-lg border-2 border-dashed border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full border border-slate-300 dark:border-white/20 bg-white dark:bg-white/10 flex items-center justify-center">
                <Plus className="w-3 h-3 text-slate-400 dark:text-slate-500" />
              </div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200">Add {team.missingSlot}...</div>
            </div>
          </div>
        )}
      </div>

      {/* Fußbereich */}
      {team.complete ? (
        <div className={`flex items-center justify-between border-t border-slate-100 dark:border-white/10 ${isExpanded ? 'mt-4 pt-3' : 'mt-3 pt-3'}`}>
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#77CF97]">
            <CheckCircle className="w-3.5 h-3.5" /> Team Complete
          </div>
          <button className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Confirm Team</button>
        </div>
      ) : (
        <div className={`flex items-center gap-2 border-t border-slate-100 dark:border-white/10 ${isExpanded ? 'mt-4 pt-4' : 'mt-3 pt-3'}`}>
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span className="text-xs text-rose-500 font-medium">Cannot confirm until team is full</span>
        </div>
      )}
    </div>
  );
}

/**
 * Team-Matching-Seite mit Pool und Draft-Teams.
 * Ermöglicht das Ein-/Ausklappen von Teams, Filtern des
 * unbesetzten Pools und die Konfiguration von Matching-Regeln.
 */
export default function MatchingPage() {
  // Zustand für die Ein-/Ausklapp-Status der einzelnen Teams
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({
    alpha: true,
    beta: true,
    gamma: true,
  });

  // Zustand für die globale „Alle ein-/ausklappen"-Aktion
  const [allExpanded, setAllExpanded] = useState(true);

  // Suchbegriff für den unbesetzten Pool
  const [searchQuery, setSearchQuery] = useState('');

  // Aktiver Rollenfilter
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Sichtbarkeit des Matching-Regeln-Modals
  const [rulesModalOpen, setRulesModalOpen] = useState(false);

  /** Einzelnes Team umschalten */
  const toggleTeam = useCallback((id: string) => {
    setExpandedTeams((prev) => ({...prev, [id]: !prev[id]}));
  }, []);

  /** Alle Teams ein- oder ausklappen */
  const toggleAll = useCallback(() => {
    const newState = !allExpanded;
    setAllExpanded(newState);
    const updated: Record<string, boolean> = {};
    for (const team of teamDefinitions) {
      updated[team.id] = newState;
    }
    setExpandedTeams(updated);
  }, [allExpanded]);

  /** Gefilterter Pool basierend auf Suche und aktivem Rollenfilter */
  const filteredPool = useMemo(() => {
    let result = unassignedPool;

    if (activeFilter !== 'all') {
      result = result.filter((p) => p.role === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q)
      );
    }

    return result;
  }, [searchQuery, activeFilter]);

  return (
    <div className="space-y-6">
      {/* Seitenkopf */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-outfit font-medium text-slate-900 dark:text-white mb-1 tracking-tight">Team Matching</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Review unassigned participants and form squads for Voyage 51.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setRulesModalOpen(true)}
            className="px-4 py-2 bg-white dark:bg-[#1a1b24] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Settings className="w-4 h-4" /> Matching Rules
          </button>
          <button className="px-4 py-2 bg-[#77CF97] text-white rounded-xl text-sm font-medium hover:bg-[#5ab87e] transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
            <Network className="w-4 h-4" /> Auto-Match All
          </button>
        </div>
      </div>

      {/* Statistikreihe */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {icon: <Users />, bg: 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300', value: '72', label: 'Unassigned'},
          {icon: <Network />, bg: 'bg-blue-50 dark:bg-blue-500/10 text-blue-500 dark:text-blue-400', value: '34', label: 'Partial Matches'},
          {icon: <Users />, bg: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400', value: '18', label: 'Drafted Teams'},
          {icon: <CheckCircle />, bg: 'bg-[#77CF97]/10 text-[#77CF97]', value: '56', label: 'Matched'},
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-[#1a1b24] p-4 rounded-[20px] border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${s.bg}`}>{s.icon}</div>
            <div>
              <div className="text-2xl font-outfit font-bold text-slate-800 dark:text-white leading-tight">{s.value}</div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Matching-Arbeitsbereich */}
      <div className="flex gap-6 items-start">
        {/* Unbesetzter Pool */}
        <div className="w-1/3 bg-white dark:bg-[#1a1b24] rounded-[24px] border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col h-[700px]">
          <div className="p-5 border-b border-slate-100 dark:border-white/10">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
              Unassigned Pool
              <span className="bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full text-xs font-bold">{filteredPool.length}</span>
            </h3>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search by name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-300 dark:focus:border-white/20 transition-colors"
              />
            </div>
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {roleFilters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    activeFilter === f.key
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredPool.map((p, i) => (
              <div key={i} className="flex gap-3 items-center p-3 rounded-xl border border-slate-100 dark:border-white/10 hover:border-slate-200 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-white/5 cursor-grab transition-all">
                <img src={`https://i.pravatar.cc/100?img=${p.av}`} className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/10" alt="" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-800 dark:text-white truncate">{p.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">{p.role}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{p.exp}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 mb-1">{p.avail}</div>
                  <button className="w-6 h-6 rounded-md bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-white/20 transition-colors ml-auto">
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
            {filteredPool.length === 0 && (
              <div className="text-center py-8 text-sm text-slate-400 dark:text-slate-500">
                Keine Teilnehmer gefunden.
              </div>
            )}
          </div>
        </div>

        {/* Entwurfsteams */}
        <div className="w-2/3 flex flex-col h-[700px]">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-semibold text-slate-900 dark:text-white">Drafted Teams</h3>
            <button
              onClick={toggleAll}
              className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              {allExpanded ? 'Collapse All' : 'Expand All'}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 pb-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
            {teamDefinitions.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                isExpanded={expandedTeams[team.id] ?? true}
                onToggle={() => toggleTeam(team.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal fuer Matching-Regeln */}
      <MatchingRulesModal open={rulesModalOpen} onOpenChange={setRulesModalOpen} />
    </div>
  );
}
