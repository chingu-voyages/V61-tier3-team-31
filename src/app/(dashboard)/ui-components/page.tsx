'use client';

import {useState} from 'react';
import {
  Layers, Home, FileText, Users, Settings, Search, Plus,
  CheckCircle, AlertTriangle, Clock, User, ChevronRight,
  Sun, Moon, Monitor, Eye, EyeOff, Bell, Mail, Phone,
  Calendar, Download, Upload, Trash2, Edit2, Copy, Save,
  Info, X, ChevronDown, ChevronUp, Star, Heart, Bookmark,
  TrendingUp, TrendingDown, BarChart3, Activity, Zap,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area,
} from 'recharts';

/* -----------------------------------------------------------------------
 * Design Tokens — Farben, Typografie, Abstaende, Schatten, Radien
 * ----------------------------------------------------------------------- */

const COLORS = {
  primary: {name: 'Green Accent', value: '#77CF97', dark: '#5ab87e'},
  dark: {name: 'Nexus Dark', value: '#0b0c10'},
  sidebar: {name: 'Sidebar', value: '#13151a'},
  card: {name: 'Card Dark', value: '#1a1b24'},
  page: {name: 'Page Light', value: '#f8f9fc'},
  white: {name: 'White', value: '#ffffff'},
  black: {name: 'Background Dark', value: '#0a0a0a'},
} as const;

const ROLE_COLORS = {
  Fullstack: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400',
  Frontend: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
  Backend: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Design: 'bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400',
  Product: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
};

const STATUS_STYLES = {
  active: 'bg-[#77CF97]/10 text-[#77CF97] border border-[#77CF97]/20',
  atRisk: 'bg-rose-50 dark:bg-rose-500/10 text-rose-500 border border-rose-100 dark:border-rose-500/20',
  forming: 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-white/10',
  pending: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20',
  inactive: 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-white/10',
  completed: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20',
};

const CHART_COLORS = ['#77CF97', '#6366f1', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6'];

/* -----------------------------------------------------------------------
 * Chart-Daten fuer Demonstrationszwecke
 * ----------------------------------------------------------------------- */

const sampleLineData = [
  {name: 'Jan', applications: 42, participants: 35},
  {name: 'Feb', applications: 58, participants: 48},
  {name: 'Mar', applications: 73, participants: 62},
  {name: 'Apr', applications: 95, participants: 80},
  {name: 'May', applications: 88, participants: 75},
  {name: 'Jun', applications: 112, participants: 98},
];

const samplePieData = [
  {name: 'Frontend', value: 98},
  {name: 'Backend', value: 76},
  {name: 'Fullstack', value: 54},
  {name: 'Design', value: 48},
  {name: 'Product', value: 36},
];

const sampleBarData = [
  {name: 'Applied', value: 312},
  {name: 'Reviewed', value: 248},
  {name: 'Accepted', value: 128},
  {name: 'Onboarded', value: 95},
];

/* -----------------------------------------------------------------------
 * Navigation — Sprung zu Sektionen
 * ----------------------------------------------------------------------- */

const SECTIONS = [
  {id: 'tokens', label: 'Design Tokens'},
  {id: 'buttons', label: 'Buttons'},
  {id: 'cards', label: 'Cards'},
  {id: 'badges', label: 'Badges'},
  {id: 'forms', label: 'Forms'},
  {id: 'navigation', label: 'Navigation'},
  {id: 'icons', label: 'Icons'},
  {id: 'charts', label: 'Charts'},
  {id: 'duplication', label: 'Duplication'},
] as const;

/* -----------------------------------------------------------------------
 * Hilfskomponenten
 * ----------------------------------------------------------------------- */

/** Sektionstitel mit Anker-ID fuer die Navigation */
function SectionTitle({id, title, subtitle}: {id: string; title: string; subtitle: string}) {
  return (
    <div id={id} className="scroll-mt-24 mb-8">
      <h2 className="text-2xl font-outfit font-semibold text-slate-900 dark:text-white mb-1">{title}</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
    </div>
  );
}

/** Kachel fuer die Anzeige einer Komponente */
function ComponentCard({label, children, className = ''}: {label: string; children: React.ReactNode; className?: string}) {
  return (
    <div className={`bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm p-6 ${className}`}>
      <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">{label}</div>
      {children}
    </div>
  );
}

/** Farbfeld-Swatches fuer die Darstellung von Design Tokens */
function ColorSwatch({name, hex, darkHex}: {name: string; hex: string; darkHex?: string}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl shrink-0 shadow-sm border border-slate-100 dark:border-white/10" style={{backgroundColor: hex}} />
      <div className="min-w-0">
        <div className="text-sm font-medium text-slate-800 dark:text-white">{name}</div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{hex}{darkHex ? ` / ${darkHex}` : ''}</div>
      </div>
    </div>
  );
}

/** Fortschrittsbalken — zeigt einen prozentualen Wert */
function ProgressBar({percent, color = 'bg-[#77CF97]'}: {percent: number; color?: string}) {
  return (
    <div className="w-full h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all ${color}`} style={{width: `${percent}%`}} />
    </div>
  );
}

/** Fortschrittsring — SVG-basiert fuer prozentuale Anzeige */
function ProgressRing({percent, size = 80, strokeWidth = 5}: {percent: number; size?: number; strokeWidth?: number}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{width: size, height: size}}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-slate-100 dark:text-white/10" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#77CF97" strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-500" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-lg font-bold text-slate-800 dark:text-white">{percent}%</span>
      </div>
    </div>
  );
}

/* -----------------------------------------------------------------------
 *auptseite — UI-Components Showcase
 * ----------------------------------------------------------------------- */

export default function UIComponentsPage() {
  const [activeSection, setActiveSection] = useState('tokens');

  return (
    <div className="space-y-12">
      {/* Seitenkopf */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#77CF97]/10 flex items-center justify-center">
            <Layers className="w-5 h-5 text-[#77CF97]" />
          </div>
          <div>
            <h1 className="text-[28px] font-outfit font-medium text-slate-900 dark:text-white tracking-tight">
              UI Kit
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Amigo Cohort Management — Design-System & Komponentenuebersicht
            </p>
          </div>
        </div>

        {/* Sektions-Navigation */}
        <div className="flex flex-wrap gap-2 mt-6 border-b border-slate-200 dark:border-white/10 pb-px">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={() => setActiveSection(s.id)}
              className={`px-4 py-2 border-b-2 font-medium text-sm cursor-pointer transition-colors ${
                activeSection === s.id
                  ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* ================================================================ */}
      {/* SEKTION 1: Design Tokens */}
      {/* ================================================================ */}
      <section>
        <SectionTitle id="tokens" title="Design Tokens" subtitle="Grundsaetzliche Farben, Typografie, Abstaende und Schatten des Amigo-Design-Systems." />

        {/* Farbpalette */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ComponentCard label="Primärfarben">
            <div className="space-y-3">
              <ColorSwatch name="Green Accent" hex="#77CF97" darkHex="#5ab87e" />
              <ColorSwatch name="Nexus Dark" hex="#0b0c10" />
              <ColorSwatch name="Card Dark" hex="#1a1b24" />
              <ColorSwatch name="Sidebar" hex="#13151a" />
            </div>
          </ComponentCard>
          <ComponentCard label="Semantic Statusfarben">
            <div className="space-y-3">
              <ColorSwatch name="Success" hex="#77CF97" />
              <ColorSwatch name="Info / Primary" hex="#6366f1" />
              <ColorSwatch name="Warning" hex="#f59e0b" />
              <ColorSwatch name="Danger" hex="#ef4444" />
              <ColorSwatch name="Pink" hex="#ec4899" />
            </div>
          </ComponentCard>
        </div>

        {/* Rollenfarben */}
        <ComponentCard label="Rollenfarben" className="mb-8">
          <div className="flex flex-wrap gap-3">
            {Object.entries(ROLE_COLORS).map(([role, style]) => (
              <span key={role} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium ${style}`}>
                {role}
              </span>
            ))}
          </div>
        </ComponentCard>

        {/* Typografie */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ComponentCard label="Typografie — Schriftarten">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Outfit (Headlines)</span>
                <div className="font-outfit text-3xl font-semibold text-slate-900 dark:text-white">Amigo Platform</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Inter / Sans (Body)</span>
                <div className="text-lg text-slate-700 dark:text-slate-300">Die Standard-Schrift fuer Fliesstext und UI-Elemente.</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Geist Mono (Code)</span>
                <div className="font-mono text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-white/5 px-3 py-2 rounded-lg border border-slate-100 dark:border-white/10">
                  font-family: var(--font-sans);
                </div>
              </div>
            </div>
          </ComponentCard>
          <ComponentCard label="Typografie — Skala">
            <div className="space-y-3">
              <div className="text-[28px] font-outfit font-medium text-slate-900 dark:text-white">H1 — text-[28px]</div>
              <div className="text-lg font-semibold text-slate-800 dark:text-white">H2 — text-lg font-semibold</div>
              <div className="text-sm font-semibold text-slate-800 dark:text-white">H3 — text-sm font-semibold</div>
              <div className="text-sm text-slate-700 dark:text-slate-300">Body — text-sm</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Caption — text-xs</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Label — text-[10px] uppercase tracking-wider</div>
            </div>
          </ComponentCard>
        </div>

        {/* Border Radius, Schatten, Abstaende */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ComponentCard label="Border Radius">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-white/10" />
                <span className="text-xs text-slate-500">rounded-lg (8px)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/10" />
                <span className="text-xs text-slate-500">rounded-xl (12px)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/10" />
                <span className="text-xs text-slate-500">rounded-2xl (16px)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[24px] bg-slate-100 dark:bg-white/10" />
                <span className="text-xs text-slate-500">rounded-[24px] — Hauptkarten</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/10" />
                <span className="text-xs text-slate-500">rounded-full — Avatare, Badges</span>
              </div>
            </div>
          </ComponentCard>
          <ComponentCard label="Schatten">
            <div className="space-y-3">
              <div className="p-4 bg-white dark:bg-[#1a1b24] rounded-xl shadow-sm border border-slate-100 dark:border-white/10 text-xs text-slate-500">shadow-sm — Karten Hover</div>
              <div className="p-4 bg-white dark:bg-[#1a1b24] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-white/10 text-xs text-slate-500">shadow-[0_4px_20px...] — Standard-Karte</div>
              <div className="p-4 bg-white dark:bg-[#1a1b24] rounded-xl shadow-xl border border-slate-100 dark:border-white/10 text-xs text-slate-500">shadow-xl — Dropdowns</div>
            </div>
          </ComponentCard>
          <ComponentCard label="Abstaende (Spacing)">
            <div className="space-y-2">
              {[
                {label: 'gap-2 (8px)', cls: 'gap-2'},
                {label: 'gap-3 (12px)', cls: 'gap-3'},
                {label: 'gap-4 (16px)', cls: 'gap-4'},
                {label: 'gap-6 (24px)', cls: 'gap-6'},
                {label: 'gap-8 (32px)', cls: 'gap-8'},
              ].map((s) => (
                <div key={s.label} className={`flex items-center ${s.cls}`}>
                  <div className="w-6 h-3 rounded bg-[#77CF97]/30" />
                  <div className="w-6 h-3 rounded bg-[#77CF97]/30" />
                  <span className="text-xs text-slate-500 ml-2">{s.label}</span>
                </div>
              ))}
            </div>
          </ComponentCard>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SEKTION 2: Buttons */}
      {/* ================================================================ */}
      <section>
        <SectionTitle id="buttons" title="Buttons" subtitle="Verschiedene Button-Varianten des Amigo-Systems: Primär, Secondary, Ghost, Icon und deaktiviert." />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <ComponentCard label="Primary Buttons">
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-[#0b0c10] dark:bg-[#77CF97] text-white dark:text-[#0b0c10] rounded-xl text-sm font-medium hover:bg-slate-800 dark:hover:bg-[#5ab87e] transition-colors shadow-sm cursor-pointer">
                Default
              </button>
              <button className="px-4 py-2 bg-[#77CF97] text-white rounded-xl text-sm font-medium hover:bg-[#5ab87e] transition-colors shadow-sm cursor-pointer">
                Green Accent
              </button>
              <button className="px-4 py-2 bg-[#0b0c10] dark:bg-[#77CF97] text-white dark:text-[#0b0c10] rounded-xl text-sm font-medium hover:bg-slate-800 dark:hover:bg-[#5ab87e] transition-colors shadow-sm cursor-pointer flex items-center gap-2">
                <Plus className="w-4 h-4" /> With Icon
              </button>
            </div>
          </ComponentCard>
          <ComponentCard label="Secondary / Outline Buttons">
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-white dark:bg-[#1a1b24] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors shadow-sm cursor-pointer">
                Secondary
              </button>
              <button className="px-4 py-2 bg-white dark:bg-[#1a1b24] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors shadow-sm cursor-pointer flex items-center gap-2">
                <FileText className="w-4 h-4" /> With Icon
              </button>
            </div>
          </ComponentCard>
          <ComponentCard label="Ghost Buttons">
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
                Ghost
              </button>
              <button className="text-xs font-medium text-[#77CF97] hover:text-[#5ab87e] transition-colors cursor-pointer">
                Link Style
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </ComponentCard>
          <ComponentCard label="Icon Buttons">
            <div className="flex flex-wrap gap-3">
              <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 shadow-sm text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer">
                <Plus className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer">
                <Bell className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#77CF97]/10 text-[#77CF97] hover:bg-[#77CF97]/20 transition-colors cursor-pointer">
                <Star className="w-4 h-4" />
              </button>
            </div>
          </ComponentCard>
          <ComponentCard label="Disabled State">
            <div className="flex flex-wrap gap-3">
              <button disabled className="px-4 py-2 bg-[#0b0c10] dark:bg-[#77CF97] text-white dark:text-[#0b0c10] rounded-xl text-sm font-medium opacity-50 cursor-not-allowed shadow-sm">
                Disabled
              </button>
              <button disabled className="px-4 py-2 bg-white dark:bg-[#1a1b24] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 opacity-50 cursor-not-allowed shadow-sm">
                Disabled
              </button>
            </div>
          </ComponentCard>
          <ComponentCard label="Toggle Button Group">
            <div className="flex gap-1 bg-slate-100 dark:bg-white/5 rounded-xl p-1 border border-slate-200 dark:border-white/10">
              {['Week', 'Month', 'Quarter'].map((opt, i) => (
                <button
                  key={opt}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    i === 1
                      ? 'bg-white dark:bg-[#1a1b24] text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </ComponentCard>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SEKTION 3: Cards */}
      {/* ================================================================ */}
      <section>
        <SectionTitle id="cards" title="Cards" subtitle="Kartenkomponenten fuer Dashboard-Inhalte: Standard-Karte, Stat-Karte, Team-Karte und Listeneintraege." />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Standard-Karte */}
          <ComponentCard label="Standard Card — rounded-[24px]">
            <div className="bg-white dark:bg-[#1a1b24] rounded-[24px] border border-slate-200 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-2">Upcoming Deadlines</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Review applications and confirm teams before the deadline.</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400">4 deadlines</span>
                <button className="text-xs font-medium text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer">View all</button>
              </div>
            </div>
          </ComponentCard>

          {/* Stat-Karte */}
          <ComponentCard label="Stat Card — KPI">
            <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#77CF97]/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#77CF97]" />
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-[#77CF97]">
                  <TrendingUp className="w-3 h-3" /> +12%
                </div>
              </div>
              <div className="font-outfit text-2xl font-bold text-slate-900 dark:text-white mb-1">128</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Active Participants</div>
            </div>
          </ComponentCard>

          {/* Team-Karte */}
          <ComponentCard label="Team Card">
            <div className="bg-white dark:bg-[#1a1b24] rounded-[24px] border border-slate-200 dark:border-white/10 shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-3 items-center">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-xl">🌌</div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">Nebula Builders</h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Tier 2 • E-Commerce</div>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#77CF97]/10 text-[#77CF97] border border-[#77CF97]/20">
                  <CheckCircle className="w-3 h-3" /> Active
                </span>
              </div>
              <div className="flex items-center gap-2 mt-4">
                {[11, 12, 13].map((id) => (
                  <img key={id} src={`https://i.pravatar.cc/100?img=${id}`} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#1a1b24]" alt="" />
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#1a1b24] bg-slate-50 dark:bg-white/10 text-slate-500 text-[10px] font-medium flex items-center justify-center">+1</div>
              </div>
            </div>
          </ComponentCard>

          {/* Listeneintraege */}
          <ComponentCard label="List Items — in Karte">
            <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-sm divide-y divide-slate-50 dark:divide-white/5">
              {[
                {icon: CheckCircle, color: 'text-[#77CF97] bg-[#77CF97]/10', title: 'Voyage started', time: '3 hours ago'},
                {icon: Users, color: 'text-purple-500 bg-purple-50 dark:bg-purple-500/10', title: 'Team created', time: '15 min ago'},
                {icon: FileText, color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10', title: 'Onboarding submitted', time: '1 hour ago'},
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-4 px-5 py-3">
                    <div className={`p-2.5 rounded-xl ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-800 dark:text-white">{item.title}</div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500">{item.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ComponentCard>

          {/* Karte mit Gradient-Hintergrund */}
          <ComponentCard label="Gradient Card">
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm p-6 bg-gradient-to-r from-teal-50 via-sky-50 to-indigo-50 dark:from-teal-500/10 dark:via-sky-500/10 dark:to-indigo-500/10">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-2">Team Atlas</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Full-stack product team — Voyage 54</p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Users className="w-3.5 h-3.5" /> 6 Members
                <span className="w-px h-3 bg-slate-200 dark:bg-white/10" />
                <Clock className="w-3.5 h-3.5" /> UTC-5
              </div>
            </div>
          </ComponentCard>

          {/* Pipeline-Karte */}
          <ComponentCard label="Pipeline Card">
            <div className="bg-white dark:bg-[#1a1b24] rounded-[24px] border border-slate-200 dark:border-white/10 shadow-sm p-6 relative">
              <div className="flex gap-3.5 items-start mb-4">
                <div className="font-outfit text-[40px] leading-none tracking-tighter font-light text-[#77CF97]">01</div>
                <div className="pt-1">
                  <div className="font-semibold text-slate-800 dark:text-white text-sm">Applications</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Collect & review</div>
                </div>
              </div>
              <ProgressBar percent={100} color="bg-[#77CF97]" />
              <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-wider">312 TOTAL</div>
            </div>
          </ComponentCard>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SEKTION 4: Badges & Status */}
      {/* ================================================================ */}
      <section>
        <SectionTitle id="badges" title="Badges & Status" subtitle="Statusanzeigen, Rollen-Badges, Zaehler und farbcodierte Indikatoren." />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ComponentCard label="Status Badges">
            <div className="flex flex-wrap gap-3">
              {Object.entries(STATUS_STYLES).map(([status, style]) => (
                <span key={status} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${style}`}>
                  {status === 'active' && <CheckCircle className="w-3 h-3" />}
                  {status === 'atRisk' && <AlertTriangle className="w-3 h-3" />}
                  {status === 'forming' && <Clock className="w-3 h-3" />}
                  {status === 'pending' && <Clock className="w-3 h-3" />}
                  {status === 'inactive' && <User className="w-3 h-3" />}
                  {status === 'completed' && <CheckCircle className="w-3 h-3" />}
                  {status === 'atRisk' ? 'At Risk' : status}
                </span>
              ))}
            </div>
          </ComponentCard>

          <ComponentCard label="Rollen-Badges">
            <div className="flex flex-wrap gap-3">
              {Object.entries(ROLE_COLORS).map(([role, style]) => (
                <span key={role} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${style}`}>
                  {role}
                </span>
              ))}
            </div>
          </ComponentCard>

          <ComponentCard label="Count Badges">
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold">
                312
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#77CF97]/10 text-[#77CF97] text-xs font-bold">
                <CheckCircle className="w-3 h-3" /> 18
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-500 text-xs font-bold">
                <AlertTriangle className="w-3 h-3" /> 3
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-500 text-xs font-bold">
                64
              </span>
            </div>
          </ComponentCard>

          <ComponentCard label="Color Dots / Indicators">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#77CF97]" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Published / Active</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Warning / Planning</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Danger / Rejected</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Neutral / Draft</span>
              </div>
            </div>
          </ComponentCard>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SEKTION 5: Forms & Inputs */}
      {/* ================================================================ */}
      <section>
        <SectionTitle id="forms" title="Forms & Inputs" subtitle="Eingabefeldern, Textareas, Selects, Suchfelder und Toggle-Schalter." />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ComponentCard label="Text Input">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Standard Input</label>
                <input
                  type="text"
                  placeholder="e.g. Voyage 54"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#77CF97]/30 focus:border-[#77CF97]/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Input mit Focus-Ring</label>
                <input
                  type="text"
                  defaultValue="Active input field"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border-2 border-[#77CF97]/50 ring-2 ring-[#77CF97]/20 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none transition-all"
                />
              </div>
            </div>
          </ComponentCard>

          <ComponentCard label="Search Input">
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  placeholder="Search teams..."
                  className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-slate-300 dark:focus:border-white/20 transition-colors"
                />
              </div>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search participants..."
                  className="pl-9 pr-4 py-2 bg-white dark:bg-[#1a1b24] border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#77CF97]/30 focus:border-[#77CF97]/50 transition-all w-full"
                />
              </div>
            </div>
          </ComponentCard>

          <ComponentCard label="Textarea">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Beschreibung</label>
              <textarea
                placeholder="Describe the event..."
                rows={3}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#77CF97]/30 focus:border-[#77CF97]/50 transition-all resize-none"
              />
            </div>
          </ComponentCard>

          <ComponentCard label="Select / Dropdown">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Voyage</label>
                <select className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#77CF97]/30 focus:border-[#77CF97]/50 transition-all cursor-pointer">
                  <option>Voyage 51</option>
                  <option>Voyage 52</option>
                  <option>Voyage 53</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Event Type Selector</label>
                <div className="flex flex-wrap gap-2">
                  {['Meeting', 'Deadline', 'Milestone', 'Social'].map((type, i) => (
                    <button
                      key={type}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                        i === 0 ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-500 border-blue-200 dark:border-blue-500/20' : 'border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </ComponentCard>

          <ComponentCard label="Toggle Switch">
            <div className="space-y-4">
              {[
                {label: 'Skills Matching', enabled: true},
                {label: 'Timezone Alignment', enabled: true},
                {label: 'Experience Balance', enabled: false},
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-slate-700 dark:text-slate-300">{item.label}</span>
                  <button className={`relative w-10 h-[22px] rounded-full transition-colors cursor-pointer ${item.enabled ? 'bg-[#77CF97]' : 'bg-slate-200 dark:bg-white/10'}`}>
                    <span className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${item.enabled ? 'left-[22px]' : 'left-[3px]'}`} />
                  </button>
                </div>
              ))}
            </div>
          </ComponentCard>

          <ComponentCard label="Slider / Range">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-700 dark:text-slate-300">Weight</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-white">85%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  defaultValue={85}
                  className="w-full h-1.5 rounded-full appearance-none bg-slate-100 dark:bg-white/10 outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#77CF97] [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
            </div>
          </ComponentCard>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SEKTION 6: Navigation */}
      {/* ================================================================ */}
      <section>
        <SectionTitle id="navigation" title="Navigation" subtitle="Sidebar-Navigation, Tab-Navigation und Filterleisten." />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ComponentCard label="Sidebar Nav Items">
            <div className="space-y-1 bg-[#0b0c10] rounded-xl p-3">
              {[
                {icon: Home, label: 'Overview', active: true},
                {icon: FileText, label: 'Applications', badge: '312'},
                {icon: Users, label: 'Participants', badge: '128'},
                {icon: BarChart3, label: 'Analytics'},
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
                      item.active ? 'bg-white/10 text-white font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#77CF97] rounded-r-full" />}
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </ComponentCard>

          <ComponentCard label="Tab Navigation">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Underline Tabs</span>
                <div className="flex gap-2 border-b border-slate-200 dark:border-white/10 pb-px mt-2">
                  {['All (312)', 'Pending (64)', 'Accepted (128)', 'Rejected (28)'].map((tab, i) => (
                    <button
                      key={tab}
                      className={`px-4 py-2 border-b-2 font-medium text-sm cursor-pointer transition-colors ${
                        i === 0 ? 'border-slate-900 dark:border-white text-slate-900 dark:text-white' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Pill Tabs (Matching Pool)</span>
                <div className="flex gap-2 mt-2">
                  {['All', 'Frontend (24)', 'Backend (19)', 'Design (8)'].map((filter, i) => (
                    <button
                      key={filter}
                      className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        i === 0 ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/20'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </ComponentCard>

          <ComponentCard label="Filter Bar">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-px">
              <div className="flex gap-2">
                <button className="px-4 py-2 border-b-2 border-slate-900 dark:border-white text-slate-900 dark:text-white font-medium text-sm cursor-pointer">All Teams (18)</button>
                <button className="px-4 py-2 border-b-2 border-transparent text-slate-500 dark:text-slate-400 font-medium text-sm cursor-pointer">Active (15)</button>
                <button className="px-4 py-2 border-b-2 border-transparent text-slate-500 dark:text-slate-400 font-medium text-sm cursor-pointer">At Risk (2)</button>
              </div>
              <div className="relative mb-2">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search teams..." className="w-64 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none transition-colors" />
              </div>
            </div>
          </ComponentCard>

          <ComponentCard label="Breadcrumbs / View Switcher">
            <div className="flex items-center gap-2">
              {['Home', 'Teams', 'Nebula Builders'].map((crumb, i) => (
                <div key={crumb} className="flex items-center gap-2">
                  <span className={`text-sm ${i < 2 ? 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer' : 'text-slate-800 dark:text-white font-medium'}`}>
                    {crumb}
                  </span>
                  {i < 2 && <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" />}
                </div>
              ))}
            </div>
          </ComponentCard>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SEKTION 7: Icons */}
      {/* ================================================================ */}
      <section>
        <SectionTitle id="icons" title="Icons" subtitle="Lucide-React Icons, die im Projekt verwendet werden — in verschiedenen Groessen und Farben." />

        <ComponentCard label="Verwendete Lucide-React Icons" className="mb-8">
          <div className="grid grid-cols-6 md:grid-cols-10 gap-4">
            {[
              {Icon: Home, name: 'Home'},
              {Icon: FileText, name: 'FileText'},
              {Icon: Users, name: 'Users'},
              {Icon: Settings, name: 'Settings'},
              {Icon: Search, name: 'Search'},
              {Icon: Plus, name: 'Plus'},
              {Icon: CheckCircle, name: 'CheckCircle'},
              {Icon: AlertTriangle, name: 'AlertTriangle'},
              {Icon: Clock, name: 'Clock'},
              {Icon: User, name: 'User'},
              {Icon: ChevronRight, name: 'ChevronRight'},
              {Icon: ChevronDown, name: 'ChevronDown'},
              {Icon: Sun, name: 'Sun'},
              {Icon: Moon, name: 'Moon'},
              {Icon: Monitor, name: 'Monitor'},
              {Icon: Eye, name: 'Eye'},
              {Icon: Bell, name: 'Bell'},
              {Icon: Mail, name: 'Mail'},
              {Icon: Calendar, name: 'Calendar'},
              {Icon: Download, name: 'Download'},
              {Icon: Upload, name: 'Upload'},
              {Icon: Trash2, name: 'Trash2'},
              {Icon: Edit2, name: 'Edit2'},
              {Icon: Copy, name: 'Copy'},
              {Icon: Save, name: 'Save'},
              {Icon: Info, name: 'Info'},
              {Icon: X, name: 'X'},
              {Icon: Star, name: 'Star'},
              {Icon: Heart, name: 'Heart'},
              {Icon: Bookmark, name: 'Bookmark'},
              {Icon: TrendingUp, name: 'TrendingUp'},
              {Icon: TrendingDown, name: 'TrendingDown'},
              {Icon: BarChart3, name: 'BarChart3'},
              {Icon: Activity, name: 'Activity'},
              {Icon: Zap, name: 'Zap'},
              {Icon: Layers, name: 'Layers'},
            ].map(({Icon, name}) => (
              <div key={name} className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-default">
                <Icon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                <span className="text-[9px] text-slate-400 dark:text-slate-500 text-center leading-tight">{name}</span>
              </div>
            ))}
          </div>
        </ComponentCard>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ComponentCard label="Icon Größen">
            <div className="flex items-end gap-6">
              <div className="flex flex-col items-center gap-1">
                <Search className="w-3 h-3 text-slate-500" />
                <span className="text-[9px] text-slate-400">w-3 (12px)</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Search className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[9px] text-slate-400">w-3.5 (14px)</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Search className="w-4 h-4 text-slate-500" />
                <span className="text-[9px] text-slate-400">w-4 (16px)</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Search className="w-5 h-5 text-slate-500" />
                <span className="text-[9px] text-slate-400">w-5 (20px)</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Search className="w-6 h-6 text-slate-500" />
                <span className="text-[9px] text-slate-400">w-6 (24px)</span>
              </div>
            </div>
          </ComponentCard>

          <ComponentCard label="Icon Farben">
            <div className="flex flex-wrap gap-4">
              {[
                {color: 'text-[#77CF97]', label: 'Green'},
                {color: 'text-blue-500', label: 'Blue'},
                {color: 'text-purple-500', label: 'Purple'},
                {color: 'text-amber-500', label: 'Amber'},
                {color: 'text-rose-500', label: 'Rose'},
                {color: 'text-slate-400', label: 'Slate'},
              ].map(({color, label}) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <CheckCircle className={`w-5 h-5 ${color}`} />
                  <span className="text-[9px] text-slate-400">{label}</span>
                </div>
              ))}
            </div>
          </ComponentCard>

          <ComponentCard label="Icon in Buttons">
            <div className="space-y-3">
              <button className="px-4 py-2 bg-[#77CF97] text-white rounded-xl text-sm font-medium flex items-center gap-2 cursor-pointer">
                <Download className="w-4 h-4" /> Export Report
              </button>
              <button className="px-4 py-2 bg-white dark:bg-[#1a1b24] border border-slate-200 dark:border-white/10 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 cursor-pointer">
                <Mail className="w-4 h-4" /> Send Reminders
              </button>
            </div>
          </ComponentCard>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SEKTION 8: Charts & Data Viz */}
      {/* ================================================================ */}
      <section>
        <SectionTitle id="charts" title="Charts & Data Visualization" subtitle="Recharts-Bibliothek fuer Linien-, Balken- und Kreisdiagramme, sowie Fortschrittsanzeigen." />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ComponentCard label="Area Chart — Applications Over Time">
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sampleLineData}>
                  <defs>
                    <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#77CF97" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#77CF97" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1b24',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Area type="monotone" dataKey="applications" stroke="#77CF97" strokeWidth={2.5} fill="url(#colorGreen)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ComponentCard>

          <ComponentCard label="Pie Chart — Role Distribution">
            <div className="h-[260px] flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={samplePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {samplePieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1b24',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ComponentCard>

          <ComponentCard label="Bar Chart — Acceptance Funnel">
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sampleBarData} layout="vertical" margin={{left: 10}}>
                  <XAxis type="number" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1b24',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="value" fill="#77CF97" radius={[0, 6, 6, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ComponentCard>

          <ComponentCard label="Progress Bars & Rings">
            <div className="space-y-6">
              {/* Fortschrittsbalken */}
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Progress Bars</span>
                <div className="space-y-3 mt-3">
                  {[
                    {label: 'Onboarding', percent: 61, color: 'bg-[#77CF97]'},
                    {label: 'Sprint 2', percent: 75, color: 'bg-indigo-500'},
                    {label: 'Review', percent: 30, color: 'bg-rose-500'},
                  ].map((p) => (
                    <div key={p.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500 dark:text-slate-400">{p.label}</span>
                        <span className="text-xs font-bold text-slate-700 dark:text-white">{p.percent}%</span>
                      </div>
                      <ProgressBar percent={p.percent} color={p.color} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Fortschrittsring */}
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Progress Rings</span>
                <div className="flex items-center gap-6 mt-3">
                  <ProgressRing percent={61} size={80} strokeWidth={6} />
                  <ProgressRing percent={85} size={80} strokeWidth={6} />
                  <ProgressRing percent={100} size={80} strokeWidth={6} />
                </div>
              </div>
            </div>
          </ComponentCard>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SEKTION 9: Komponenten-Duplizierung */}
      {/* ================================================================ */}
      <section>
        <SectionTitle id="duplication" title="Component Duplication Report" subtitle="Identifizierte Duplikate und Konsolidierungsmoeglichkeiten im gesamten Codebase." />

        <div className="space-y-4">
          {[
            {
              title: 'ROLE_COLORS Map — 6x dupliziert',
              files: ['applications/page.tsx', 'participants/page.tsx', 'onboarding/page.tsx', 'matching/page.tsx', 'teams/page.tsx', 'announcements/page.tsx'],
              description: 'Die identische Map `{Fullstack: "...", Frontend: "...", Backend: "...", Design: "...", Product: "..."}` wird in mindestens 6 Dateien wiederholt definiert.',
              recommendation: 'In eine zentrale Konfigurationsdatei auslagern, z.B. `src/lib/design-tokens.ts` oder `src/lib/constants.ts`.',
              severity: 'high',
            },
            {
              title: 'STATUS_CONFIG Map — 4x dupliziert',
              files: ['applications/page.tsx', 'participants/page.tsx', 'voyages/page.tsx', 'calendar/page.tsx'],
              description: 'Status-Konfigurationen mit Label, Icon und Styles werden pro Seite neu definiert.',
              recommendation: 'Zentrale Status-Config in `src/lib/design-tokens.ts` mit den Typen `ApplicationStatus`, `Participant.status`, `VoyageStatus`.',
              severity: 'high',
            },
            {
              title: 'Stat Card Pattern — 8x dupliziert',
              files: ['overview/page.tsx', 'analytics/page.tsx', 'matching/page.tsx', 'participants/page.tsx', 'onboarding/page.tsx', 'voyages/page.tsx', 'calendar/page.tsx', 'teams/page.tsx'],
              description: 'Das gleiche Karten-Layout mit Icon, Label, Wert und Accent-Farbe wird in fast jeder Seite dupliziert.',
              recommendation: 'Eigene `StatCard`-Komponente erstellen, die als Props `icon`, `value`, `label`, `accent` und optionale `change`-Werte akzeptiert.',
              severity: 'medium',
            },
            {
              title: 'Tab Navigation Pattern — 6x dupliziert',
              files: ['applications/page.tsx', 'participants/page.tsx', 'onboarding/page.tsx', 'voyages/page.tsx', 'matching/page.tsx', 'forms/page.tsx'],
              description: 'Der gleiche Underline-Tab-Style mit `border-b-2` wird in jeder Liste kopiert.',
              recommendation: 'Eine reusable `TabBar`-Komponente mit Props `tabs`, `activeTab`, `onSelect` und `counts` erstellen.',
              severity: 'medium',
            },
            {
              title: 'Search Input — 4x dupliziert',
              files: ['participants/page.tsx', 'onboarding/page.tsx', 'voyages/page.tsx', 'matching/page.tsx'],
              description: 'Das Suchfeld mit `pl-9` und Search-Icon wird mit fast identischem Code wiederholt.',
              recommendation: 'Eine `SearchInput`-Komponente mit Props `placeholder`, `value`, `onChange` und optional `className`.',
              severity: 'low',
            },
            {
              title: 'Modal/Dialog Pattern — 3x dupliziert',
              files: ['calendar/page.tsx', 'voyages/page.tsx', 'matching-rules-modal.tsx'],
              description: 'Modal-Overlays mit backdrop-blur, rounded-2xl und Border-Styles werden manuell erstellt, obwohl eine Dialog-Komponente existiert.',
              recommendation: 'Bestehende `Dialog`-Komponente aus `src/components/ui/dialog.tsx` konsistent verwenden.',
              severity: 'medium',
            },
            {
              title: 'Avatar-Stack Pattern — 3x dupliziert',
              files: ['overview/page.tsx', 'teams/page.tsx', 'matching/page.tsx'],
              description: 'Avatar-Gruppen mit `-space-x-2` und "+N"-Badge werden manuell gebaut.',
              recommendation: 'Eine `AvatarStack`-Komponente mit Props `avatars`, `maxVisible` und `size` erstellen.',
              severity: 'low',
            },
            {
              title: 'Progress Bar — 5x dupliziert',
              files: ['overview/page.tsx', 'onboarding/page.tsx', 'participants/page.tsx', 'teams/page.tsx', 'matching/page.tsx'],
              description: 'Der Fortschrittsbalken mit `h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden` wird in vielen Varianten kopiert.',
              recommendation: 'Eine zentrale `ProgressBar`-Komponente mit Props `percent`, `color` und `size`.',
              severity: 'low',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    item.severity === 'high' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500' :
                    item.severity === 'medium' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-500' :
                    'bg-blue-50 dark:bg-blue-500/10 text-blue-500'
                  }`}>
                    {item.severity === 'high' ? <AlertTriangle className="w-4 h-4" /> :
                     item.severity === 'medium' ? <Info className="w-4 h-4" /> :
                     <Info className="w-4 h-4" />}
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-white">{item.title}</h4>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                  item.severity === 'high' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500' :
                  item.severity === 'medium' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-500' :
                  'bg-blue-50 dark:bg-blue-500/10 text-blue-500'
                }`}>
                  {item.severity}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">{item.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {item.files.map((f) => (
                  <span key={f} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    {f}
                  </span>
                ))}
              </div>
              <div className="p-3 bg-[#77CF97]/5 dark:bg-[#77CF97]/[0.03] rounded-xl border border-[#77CF97]/10">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#77CF97] mt-0.5 shrink-0" />
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{item.recommendation}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
