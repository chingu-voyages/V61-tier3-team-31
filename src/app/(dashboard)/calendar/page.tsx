'use client';

import {useState, useMemo, useCallback} from 'react';
import {
  CalendarDays, ChevronLeft, ChevronRight, Plus, Clock,
  Users, X, Pin, Calendar, List, LayoutGrid,
  Target, Trash2, Pencil,
} from 'lucide-react';
import type {CalendarEvent, EventType, Voyage, DashboardView} from '@/types';
import {useDashboard} from '@/lib/auth-context';
import {useRouter} from 'next/navigation';

// ---------------------------------------------------------------------------
// Konfiguration
// ---------------------------------------------------------------------------

/** Farbkonfiguration je Event-Typ */
const EVENT_TYPE_CONFIG: Record<EventType, {
  label: string;
  bg: string;
  text: string;
  border: string;
  dot: string;
  badge: string;
}> = {
  deadline: {
    label: 'Deadline',
    bg: 'bg-rose-50 dark:bg-rose-500/10',
    text: 'text-rose-500',
    border: 'border-rose-200 dark:border-rose-500/20',
    dot: 'bg-rose-500',
    badge: 'bg-rose-50 dark:bg-rose-500/10 text-rose-500 border border-rose-100 dark:border-rose-500/20',
  },
  meeting: {
    label: 'Meeting',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    text: 'text-blue-500',
    border: 'border-blue-200 dark:border-blue-500/20',
    dot: 'bg-blue-500',
    badge: 'bg-blue-50 dark:bg-blue-500/10 text-blue-500 border border-blue-100 dark:border-blue-500/20',
  },
  milestone: {
    label: 'Milestone',
    bg: 'bg-[#77CF97]/10',
    text: 'text-[#77CF97]',
    border: 'border-[#77CF97]/20',
    dot: 'bg-[#77CF97]',
    badge: 'bg-[#77CF97]/10 text-[#77CF97] border border-[#77CF97]/20',
  },
  social: {
    label: 'Social',
    bg: 'bg-purple-50 dark:bg-purple-500/10',
    text: 'text-purple-500',
    border: 'border-purple-200 dark:border-purple-500/20',
    dot: 'bg-purple-500',
    badge: 'bg-purple-50 dark:bg-purple-500/10 text-purple-500 border border-purple-100 dark:border-purple-500/20',
  },
  demo: {
    label: 'Demo',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    text: 'text-amber-500',
    border: 'border-amber-200 dark:border-amber-500/20',
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 dark:bg-amber-500/10 text-amber-500 border border-amber-100 dark:border-amber-500/20',
  },
};

/** Mock-Voyages fuer den Selector */
const VOYAGES: Voyage[] = [
  {id: '51', name: 'Voyage 51', number: 51, status: 'active', startDate: '2026-04-20', endDate: '2026-06-20', applicationDeadline: '2026-04-01', participants: 128, teams: 18, description: 'Current active cohort.'},
  {id: '52', name: 'Voyage 52', number: 52, status: 'planning', startDate: '2026-07-15', endDate: '2026-10-01', applicationDeadline: '2026-06-30', participants: 0, teams: 0, description: 'Next summer cohort.'},
];

/** Moegliche Teilnehmer fuer die Teilnehmerauswahl */
const ATTENDEES_LIST = [
  'Jane Cooper', 'Daniel Martinez', 'Olivia Chen', 'Emma Wilson',
  'Michael Davis', 'Sophia Taylor', 'Alex Morgan', 'Sarah Kim',
  'Marcus Lee', 'Team Atlas', 'Team Pioneers', 'Mentors',
];

/** Hilfsfunktion: Datum zu String im Format YYYY-MM-DD */
function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Hilfsfunktion: Zeitstring (HH:MM) aus Date-Objekt */
function toTimeString(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** Hilfsfunktion: Formatierung fuer Kalenderanzeige */
function formatMonthYear(d: Date): string {
  return d.toLocaleDateString('en-US', {month: 'long', year: 'numeric'});
}

/** Hilfsfunktion: Formatierung fuer Wochentag */
function formatWeekday(d: Date): string {
  return d.toLocaleDateString('en-US', {weekday: 'short'});
}

// ---------------------------------------------------------------------------
// Mock-Daten
// ---------------------------------------------------------------------------

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();
const today = toDateStr(now);

/** Hilfsfunktion: Datum relativ zum aktuellen Monat erzeugen */
function relDate(dayOffset: number, hour: number = 10, minute: number = 0): {start: string; startTime: string; end: string; endTime: string} {
  const d = new Date(currentYear, currentMonth, now.getDate() + dayOffset);
  const dateStr = toDateStr(d);
  const startTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  const endD = new Date(d);
  endD.setHours(hour + 1);
  const endTime = toTimeString(endD);
  return {start: dateStr, startTime, end: dateStr, endTime};
}

/** Mock-Kalender-Events: 15 Events ueber aktuellen und naechsten Monat */
const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: 'Daily Standup',
    description: 'Taegliches Team-Standup fuer Voyage 51. Kurze Updates zu Fortschritt und Blockern.',
    type: 'meeting',
    startDate: relDate(0, 9, 0).start,
    startTime: '09:00',
    endDate: relDate(0, 9, 30).end,
    endTime: '09:30',
    allDay: false,
    voyage: '51',
    attendees: ['Team Atlas', 'Team Pioneers', 'Mentors'],
    pinned: true,
  },
  {
    id: '2',
    title: 'Application Review Deadline',
    description: 'Frist fuer die Bewertung aller offenen Bewerbungen. Alle Admins muessen ihre Reviews abschliessen.',
    type: 'deadline',
    startDate: relDate(2, 23, 59).start,
    startTime: '23:59',
    endDate: relDate(2, 23, 59).end,
    endTime: '23:59',
    allDay: false,
    voyage: '51',
    attendees: ['Jane Cooper', 'Daniel Martinez'],
    pinned: true,
  },
  {
    id: '3',
    title: 'Sprint Planning',
    description: 'Planung des naechsten Sprints. User Stories aufteilen und Kapazitaeten schaetzen.',
    type: 'meeting',
    startDate: relDate(3, 10, 0).start,
    startTime: '10:00',
    endDate: relDate(3, 11, 30).end,
    endTime: '11:30',
    allDay: false,
    voyage: '51',
    attendees: ['Team Atlas', 'Team Pioneers'],
    pinned: false,
  },
  {
    id: '4',
    title: 'Team Formation Complete',
    description: 'Alle Teams muessen bis zu diesem Zeitpunkt finalisiert und bestaetigt sein.',
    type: 'milestone',
    startDate: relDate(5, 0, 0).start,
    startTime: '00:00',
    endDate: relDate(5, 23, 59).end,
    endTime: '23:59',
    allDay: true,
    voyage: '51',
    attendees: ['Jane Cooper'],
    pinned: false,
  },
  {
    id: '5',
    title: 'Mentor Match Session',
    description: 'Mentoren werden den Teams zugewiesen. Jedes Team erhaelt einen Mentor.',
    type: 'meeting',
    startDate: relDate(7, 14, 0).start,
    startTime: '14:00',
    endDate: relDate(7, 15, 30).end,
    endTime: '15:30',
    allDay: false,
    voyage: '51',
    attendees: ['Mentors', 'Team Atlas', 'Team Pioneers'],
    pinned: false,
  },
  {
    id: '6',
    title: 'Onboarding Check',
    description: 'Ueberpruefung des Onboarding-Fortschritts aller Teilnehmer.',
    type: 'deadline',
    startDate: relDate(10, 17, 0).start,
    startTime: '17:00',
    endDate: relDate(10, 17, 30).end,
    endTime: '17:30',
    allDay: false,
    voyage: '51',
    attendees: ['Jane Cooper', 'Olivia Chen', 'Daniel Martinez'],
    pinned: false,
  },
  {
    id: '7',
    title: 'Social: Team Dinner',
    description: 'Gemeinsames Abendessen fuer alle Voyage-51-Teilnehmer. Informeller Austausch.',
    type: 'social',
    startDate: relDate(12, 19, 0).start,
    startTime: '19:00',
    endDate: relDate(12, 21, 0).end,
    endTime: '21:00',
    allDay: false,
    voyage: '51',
    attendees: ['Team Atlas', 'Team Pioneers', 'Mentors', 'Jane Cooper'],
    pinned: false,
  },
  {
    id: '8',
    title: 'Milestone: Voyage Kickoff',
    description: 'Offizieller Start von Voyage 51. Praesentation der Ziele und Timeline.',
    type: 'milestone',
    startDate: relDate(14, 10, 0).start,
    startTime: '10:00',
    endDate: relDate(14, 12, 0).end,
    endTime: '12:00',
    allDay: false,
    voyage: '51',
    attendees: ['All Participants'],
    pinned: true,
  },
  {
    id: '9',
    title: 'First Sprint Demo',
    description: 'Demo der ersten Sprint-Ergebnisse. Teams praesentieren ihren Fortschritt.',
    type: 'demo',
    startDate: relDate(18, 15, 0).start,
    startTime: '15:00',
    endDate: relDate(18, 16, 30).end,
    endTime: '16:30',
    allDay: false,
    voyage: '51',
    attendees: ['Team Atlas', 'Team Pioneers', 'Jane Cooper', 'Mentors'],
    pinned: false,
  },
  {
    id: '10',
    title: 'Application Deadline Voyage 52',
    description: 'Bewerbungsfrist fuer das naechste Voyage. Alle Bewerbungen muessen eingereicht sein.',
    type: 'deadline',
    startDate: relDate(20, 23, 59).start,
    startTime: '23:59',
    endDate: relDate(20, 23, 59).end,
    endTime: '23:59',
    allDay: false,
    voyage: '52',
    attendees: ['Jane Cooper'],
    pinned: false,
  },
  {
    id: '11',
    title: 'Sprint Retrospective',
    description: 'Retrospektive fuer Sprint 1. Was lief gut, was kann verbessert werden?',
    type: 'meeting',
    startDate: relDate(21, 14, 0).start,
    startTime: '14:00',
    endDate: relDate(21, 15, 0).end,
    endTime: '15:00',
    allDay: false,
    voyage: '51',
    attendees: ['Team Atlas', 'Team Pioneers'],
    pinned: false,
  },
  {
    id: '12',
    title: 'Social: Game Night',
    description: 'Virtuelles Spielabend fuer alle Teilnehmer. Teambuilding und Spass.',
    type: 'social',
    startDate: relDate(24, 18, 0).start,
    startTime: '18:00',
    endDate: relDate(24, 20, 0).end,
    endTime: '20:00',
    allDay: false,
    voyage: '51',
    attendees: ['All Participants'],
    pinned: false,
  },
  {
    id: '13',
    title: 'Mid-Voyage Demo',
    description: 'Demo der laufenden Projekte in der Mitte des Voyages. Feedback-Runde.',
    type: 'demo',
    startDate: relDate(28, 15, 0).start,
    startTime: '15:00',
    endDate: relDate(28, 17, 0).end,
    endTime: '17:00',
    allDay: false,
    voyage: '51',
    attendees: ['Team Atlas', 'Team Pioneers', 'Jane Cooper', 'Mentors'],
    pinned: false,
  },
  {
    id: '14',
    title: 'Mentor Check-in',
    description: 'Regulaeres Meeting zwischen Mentoren und Teams. Fortschritts-Update.',
    type: 'meeting',
    startDate: relDate(30, 11, 0).start,
    startTime: '11:00',
    endDate: relDate(30, 11, 30).end,
    endTime: '11:30',
    allDay: false,
    voyage: '51',
    attendees: ['Mentors', 'Team Atlas', 'Team Pioneers'],
    pinned: false,
  },
  {
    id: '15',
    title: 'Final Demo Day',
    description: 'Abschluss-Demo aller Projekte. Oeffentliche Praesentation der Ergebnisse.',
    type: 'demo',
    startDate: relDate(35, 14, 0).start,
    startTime: '14:00',
    endDate: relDate(35, 17, 0).end,
    endTime: '17:00',
    allDay: false,
    voyage: '51',
    attendees: ['All Participants', 'Jane Cooper', 'Mentors'],
    pinned: true,
  },
];

// ---------------------------------------------------------------------------
// Formular-Zustand
// ---------------------------------------------------------------------------

interface EventForm {
  title: string;
  description: string;
  type: EventType;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  allDay: boolean;
  voyage: string;
  attendees: string[];
}

const EMPTY_FORM: EventForm = {
  title: '',
  description: '',
  type: 'meeting',
  startDate: today,
  startTime: '09:00',
  endDate: today,
  endTime: '10:00',
  allDay: false,
  voyage: '51',
  attendees: [],
};

// ---------------------------------------------------------------------------
// Hilfsfunktionen fuer Kalender-Berechnung
// ---------------------------------------------------------------------------

/** Gibt ein Array der Tage zurueck, die in einem Monatsgrid angezeigt werden */
function getMonthGrid(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const startDow = firstDay.getDay();
  const gridStart = new Date(year, month, 1 - startDow);
  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    cells.push(d);
  }
  return cells;
}

/** Gibt die Tage der Woche fuer ein gegebenes Datum zurueck */
function getWeekDays(date: Date): Date[] {
  const d = new Date(date);
  const dow = d.getDay();
  const weekStart = new Date(d);
  weekStart.setDate(d.getDate() - dow);
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    days.push(day);
  }
  return days;
}

/** Zeitfenster fuer Week-View (9:00 bis 18:00) */
const TIME_SLOTS = Array.from({length: 10}, (_, i) => i + 9);

// ---------------------------------------------------------------------------
// Komponenten
// ---------------------------------------------------------------------------

/** Typ-badge fuer ein Event */
function EventTypeBadge({type, small = false}: {type: EventType; small?: boolean}) {
  const cfg = EVENT_TYPE_CONFIG[type];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${cfg.badge} ${small ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

/** Einzelne Event-Karte in der Sidebar */
function EventCard({
  event, compact = false, onClick,
}: {
  event: CalendarEvent;
  compact?: boolean;
  onClick?: () => void;
}) {
  const cfg = EVENT_TYPE_CONFIG[event.type];
  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`w-full text-left p-2.5 rounded-xl border ${cfg.border} ${cfg.bg} hover:opacity-80 transition-opacity cursor-pointer`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`} />
          <span className={`text-xs font-semibold ${cfg.text} truncate`}>{event.title}</span>
        </div>
        {!event.allDay && (
          <div className="text-[10px] text-slate-400 dark:text-slate-500 ml-3.5">
            {event.startTime} — {event.endTime}
          </div>
        )}
        {event.allDay && (
          <div className="text-[10px] text-slate-400 dark:text-slate-500 ml-3.5">All Day</div>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-2xl border ${cfg.border} ${cfg.bg} hover:shadow-md transition-shadow cursor-pointer`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {event.pinned && <Pin className="w-3 h-3 text-amber-500 shrink-0" />}
          <span className={`text-sm font-semibold ${cfg.text}`}>{event.title}</span>
        </div>
        <EventTypeBadge type={event.type} small />
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">{event.description}</p>
      <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500">
        {!event.allDay ? (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {event.startTime} — {event.endTime}
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            All Day
          </span>
        )}
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {event.attendees.length}
        </span>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Monats-Ansicht
// ---------------------------------------------------------------------------

function MonthView({
  currentDate, events, selectedDate, onSelectDate, onSelectEvent,
}: {
  currentDate: Date;
  events: CalendarEvent[];
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  onSelectEvent: (event: CalendarEvent) => void;
}) {
  const grid = useMemo(
    () => getMonthGrid(currentDate.getFullYear(), currentDate.getMonth()),
    [currentDate],
  );
  const month = currentDate.getMonth();

  /** Events fuer ein bestimmtes Datum */
  const eventsForDate = useCallback(
    (dateStr: string) => events.filter((e) => e.startDate === dateStr),
    [events],
  );

  return (
    <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] overflow-hidden">
      {/* Kopfzeile: Wochentage */}
      <div className="grid grid-cols-7 border-b border-slate-100 dark:border-white/10">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {d}
          </div>
        ))}
      </div>

      {/* Tageszellen */}
      <div className="grid grid-cols-7">
        {grid.map((date, i) => {
          const dateStr = toDateStr(date);
          const isCurrentMonth = date.getMonth() === month;
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDate;
          const dayEvents = eventsForDate(dateStr);

          return (
            <button
              key={i}
              onClick={() => onSelectDate(dateStr)}
              className={`relative min-h-[80px] p-2 text-left border-b border-r border-slate-50 dark:border-white/5 transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[#77CF97]/5 dark:bg-[#77CF97]/10'
                  : isToday
                  ? 'bg-slate-50 dark:bg-white/5'
                  : 'hover:bg-slate-50/50 dark:hover:bg-white/[0.02]'
              } ${!isCurrentMonth ? 'opacity-40' : ''}`}
            >
              {/* Tagesnummer */}
              <div className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium mb-1 ${
                isToday
                  ? 'bg-[#0b0c10] dark:bg-[#77CF97] text-white dark:text-[#0b0c10]'
                  : isSelected
                  ? 'bg-[#77CF97]/20 text-[#77CF97]'
                  : 'text-slate-700 dark:text-slate-300'
              }`}>
                {date.getDate()}
              </div>

              {/* Event-Dots */}
              {dayEvents.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {dayEvents.slice(0, 3).map((ev) => (
                    <div
                      key={ev.id}
                      onClick={(e) => { e.stopPropagation(); onSelectEvent(ev); }}
                      className={`w-1.5 h-1.5 rounded-full ${EVENT_TYPE_CONFIG[ev.type].dot}`}
                      title={ev.title}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">+{dayEvents.length - 3}</span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Wochen-Ansicht
// ---------------------------------------------------------------------------

function WeekView({
  currentDate, events, selectedDate, onSelectDate, onSelectEvent,
}: {
  currentDate: Date;
  events: CalendarEvent[];
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  onSelectEvent: (event: CalendarEvent) => void;
}) {
  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);

  return (
    <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] overflow-hidden">
      {/* Kopfzeile: Datums-Header */}
      <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-slate-100 dark:border-white/10">
        <div />
        {weekDays.map((d) => {
          const dateStr = toDateStr(d);
          const isTodayDate = dateStr === today;
          const isSelected = dateStr === selectedDate;
          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={`py-3 text-center transition-colors cursor-pointer ${
                isSelected ? 'bg-[#77CF97]/5' : isTodayDate ? 'bg-slate-50 dark:bg-white/5' : ''
              }`}
            >
              <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{formatWeekday(d)}</div>
              <div className={`text-lg font-outfit font-semibold mt-0.5 ${
                isTodayDate ? 'text-[#77CF97]' : 'text-slate-800 dark:text-white'
              }`}>{d.getDate()}</div>
            </button>
          );
        })}
      </div>

      {/* Zeitfenster */}
      <div className="grid grid-cols-[60px_repeat(7,1fr)] relative" style={{minHeight: `${TIME_SLOTS.length * 64}px`}}>
        {/* Zeitbeschriftung */}
        <div className="relative">
          {TIME_SLOTS.map((h) => (
            <div key={h} className="h-16 flex items-start justify-end pr-2 pt-0">
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">{h}:00</span>
            </div>
          ))}
        </div>

        {/* Spalten fuer jeden Tag */}
        {weekDays.map((d) => {
          const dateStr = toDateStr(d);
          const isTodayCol = dateStr === today;
          const dayEvents = events.filter((e) => e.startDate === dateStr && !e.allDay);

          return (
            <div
              key={dateStr}
              className={`relative border-l border-slate-50 dark:border-white/5 ${isTodayCol ? 'bg-[#77CF97]/[0.02]' : ''}`}
            >
              {TIME_SLOTS.map((h) => (
                <div key={h} className="h-16 border-b border-slate-50 dark:border-white/5" />
              ))}

              {/* Events als farbige Bloecke */}
              {dayEvents.map((ev) => {
                const cfg = EVENT_TYPE_CONFIG[ev.type];
                const startParts = ev.startTime.split(':');
                const endParts = ev.endTime.split(':');
                const startMin = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
                const endMin = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
                const topOffset = ((startMin - 9 * 60) / 60) * 64;
                const height = Math.max(((endMin - startMin) / 60) * 64, 24);

                return (
                  <button
                    key={ev.id}
                    onClick={() => onSelectEvent(ev)}
                    className={`absolute left-1 right-1 rounded-lg ${cfg.bg} ${cfg.border} border px-2 py-1 text-left overflow-hidden cursor-pointer hover:opacity-80 transition-opacity z-10`}
                    style={{top: `${topOffset}px`, height: `${height}px`}}
                  >
                    <div className={`text-[10px] font-semibold ${cfg.text} truncate`}>{ev.title}</div>
                    <div className="text-[9px] text-slate-400 dark:text-slate-500">{ev.startTime}</div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Listen-Ansicht
// ---------------------------------------------------------------------------

function ListView({
  events, selectedDate, onSelectEvent,
}: {
  events: CalendarEvent[];
  selectedDate: string;
  onSelectEvent: (event: CalendarEvent) => void;
}) {
  /** Gruppiere Events nach Datum */
  const grouped = useMemo(() => {
    const sorted = [...events].sort((a, b) => {
      const dateComp = a.startDate.localeCompare(b.startDate);
      if (dateComp !== 0) return dateComp;
      return a.startTime.localeCompare(b.startTime);
    });
    const map = new Map<string, CalendarEvent[]>();
    for (const ev of sorted) {
      const arr = map.get(ev.startDate) ?? [];
      arr.push(ev);
      map.set(ev.startDate, arr);
    }
    return Array.from(map.entries());
  }, [events]);

  /** Formatierung des Datums */
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    const isTodayDate = dateStr === today;
    const tomorrowStr = toDateStr(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1));
    const isTomorrow = tomorrowStr === dateStr;
    const label = isTodayDate ? 'Today' : isTomorrow ? 'Tomorrow' : d.toLocaleDateString('en-US', {weekday: 'long', month: 'short', day: 'numeric'});
    return {label, isToday: isTodayDate, isTomorrow};
  };

  return (
    <div className="space-y-4">
      {grouped.map(([dateStr, dayEvents]) => {
        const {label, isToday: isTodayDate} = formatDate(dateStr);
        return (
          <div key={dateStr}>
            {/* Datums-Header */}
            <div className={`flex items-center gap-2 mb-2 ${isTodayDate ? 'text-[#77CF97]' : 'text-slate-600 dark:text-slate-400'}`}>
              <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
              <div className="flex-1 h-px bg-slate-100 dark:bg-white/10" />
            </div>

            {/* Events */}
            <div className="space-y-2">
              {dayEvents.map((ev) => {
                const cfg = EVENT_TYPE_CONFIG[ev.type];
                return (
                  <button
                    key={ev.id}
                    onClick={() => onSelectEvent(ev)}
                    className={`w-full text-left p-4 rounded-2xl border ${cfg.border} ${cfg.bg} hover:shadow-md transition-shadow cursor-pointer`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Zeit-Spalte */}
                      {!ev.allDay ? (
                        <div className="w-14 text-center shrink-0">
                          <div className={`text-xs font-bold ${cfg.text}`}>{ev.startTime}</div>
                          <div className="text-[9px] text-slate-400 dark:text-slate-500">{ev.endTime}</div>
                        </div>
                      ) : (
                        <div className="w-14 text-center shrink-0">
                          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500">ALL DAY</div>
                        </div>
                      )}

                      {/* Trennlinie */}
                      <div className={`w-px h-10 ${cfg.dot} opacity-40 shrink-0`} />

                      {/* Inhalt */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {ev.pinned && <Pin className="w-3 h-3 text-amber-500 shrink-0" />}
                          <span className="text-sm font-semibold text-slate-800 dark:text-white truncate">{ev.title}</span>
                          <EventTypeBadge type={ev.type} small />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{ev.description}</p>
                      </div>

                      {/* Teilnehmer-Anzeige */}
                      <div className="flex items-center gap-1 shrink-0">
                        <Users className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{ev.attendees.length}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {grouped.length === 0 && (
        <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 p-12 text-center">
          <CalendarDays className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400 text-sm">No upcoming events.</p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modal-Formular
// ---------------------------------------------------------------------------

function EventFormModal({
  form, setForm, onSave, onCancel, editingEvent,
}: {
  form: EventForm;
  setForm: React.Dispatch<React.SetStateAction<EventForm>>;
  onSave: () => void;
  onCancel: () => void;
  editingEvent: CalendarEvent | null;
}) {
  /** Teilnehmer hinzufuegen/entfernen */
  const toggleAttendee = (name: string) => {
    setForm((f) => ({
      ...f,
      attendees: f.attendees.includes(name)
        ? f.attendees.filter((a) => a !== name)
        : [...f.attendees, name],
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Kopf */}
        <div className="p-6 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {editingEvent ? 'Update event details and schedule.' : 'Add a new event to the calendar.'}
            </p>
          </div>
          <button onClick={onCancel} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formularfelder */}
        <div className="p-6 space-y-4">
          {/* Titel */}
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({...f, title: e.target.value}))}
              placeholder="e.g. Sprint Planning"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#77CF97]/30 focus:border-[#77CF97]/50 transition-all"
            />
          </div>

          {/* Beschreibung */}
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({...f, description: e.target.value}))}
              placeholder="Describe the event..."
              rows={3}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#77CF97]/30 focus:border-[#77CF97]/50 transition-all resize-none"
            />
          </div>

          {/* Event-Typ */}
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Event Type</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(EVENT_TYPE_CONFIG) as EventType[]).map((t) => {
                const cfg = EVENT_TYPE_CONFIG[t];
                const active = form.type === t;
                return (
                  <button
                    key={t}
                    onClick={() => setForm((f) => ({...f, type: t}))}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                      active ? `${cfg.bg} ${cfg.text} ${cfg.border}` : 'border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${cfg.dot} ${active ? '' : 'opacity-40'}`} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* All-Day Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">All Day Event</span>
            </div>
            <button
              onClick={() => setForm((f) => ({...f, allDay: !f.allDay}))}
              className={`rounded-full transition-colors cursor-pointer relative ${form.allDay ? 'bg-[#77CF97]' : 'bg-slate-200 dark:bg-white/10'}`}
              style={{width: '40px', height: '22px'}}
            >
              <div className={`absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white shadow transition-transform ${form.allDay ? 'translate-x-[20px]' : 'translate-x-[2px]'}`} />
            </button>
          </div>

          {/* Start/End Datum + Zeit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((f) => ({...f, startDate: e.target.value}))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#77CF97]/30 focus:border-[#77CF97]/50 transition-all"
              />
            </div>
            {!form.allDay && (
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Start Time</label>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => setForm((f) => ({...f, startTime: e.target.value}))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#77CF97]/30 focus:border-[#77CF97]/50 transition-all"
                />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">End Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm((f) => ({...f, endDate: e.target.value}))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#77CF97]/30 focus:border-[#77CF97]/50 transition-all"
              />
            </div>
            {!form.allDay && (
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">End Time</label>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => setForm((f) => ({...f, endTime: e.target.value}))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#77CF97]/30 focus:border-[#77CF97]/50 transition-all"
                />
              </div>
            )}
          </div>

          {/* Voyage-Auswahl */}
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Voyage</label>
            <select
              value={form.voyage}
              onChange={(e) => setForm((f) => ({...f, voyage: e.target.value}))}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#77CF97]/30 focus:border-[#77CF97]/50 transition-all cursor-pointer"
            >
              {VOYAGES.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>

          {/* Teilnehmer */}
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Attendees</label>
            <div className="flex flex-wrap gap-2">
              {ATTENDEES_LIST.map((name) => {
                const active = form.attendees.includes(name);
                return (
                  <button
                    key={name}
                    onClick={() => toggleAttendee(name)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all cursor-pointer ${
                      active
                        ? 'bg-[#77CF97]/10 text-[#77CF97] border-[#77CF97]/20'
                        : 'border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Aktionen */}
        <div className="p-6 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!form.title || !form.startDate}
            className="px-5 py-2 bg-[#0b0c10] dark:bg-[#77CF97] text-white dark:text-[#0b0c10] rounded-xl text-sm font-medium hover:bg-slate-800 dark:hover:bg-[#5ab87e] transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editingEvent ? 'Save Changes' : 'Create Event'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hauptseite: CalendarPage
// ---------------------------------------------------------------------------

type ViewMode = 'month' | 'week' | 'list';

/** Kalender-Seite fuer Verwaltung von Voyages, Deadlines und Events */
export default function CalendarPage() {
  const {role, setCurrentView} = useDashboard();
  const router = useRouter();
  const isAdmin = role === 'admin';

  // Zustand
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(now);
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [form, setForm] = useState<EventForm>(EMPTY_FORM);

  /** Navigation zwischen Dashbaord-Ansichten */
  const navigateTo = (view: DashboardView) => {
    setCurrentView(view);
    router.push(`/${view}`);
  };

  /** Vorheriger Monat / Woche */
  const prevPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
      setCurrentDate(new Date(currentDate.getTime() - 7 * 86400000));
    }
  };

  /** Naechster Monat / Woche */
  const nextPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {
      setCurrentDate(new Date(currentDate.getTime() + 7 * 86400000));
    }
  };

  /** Zurueck zum heutigen Datum */
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(today);
  };

  /** Events fuer ausgewaehltes Datum */
  const selectedDateEvents = useMemo(
    () => events.filter((e) => e.startDate === selectedDate).sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [events, selectedDate],
  );

  /** Events diese Woche */
  const weekEvents = useMemo(() => {
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    return events.filter((e) => {
      const d = new Date(e.startDate + 'T00:00:00');
      return d >= weekStart && d < weekEnd;
    });
  }, [events, currentDate]);

  /** Naechste Deadlines */
  const upcomingDeadlines = useMemo(
    () => events.filter((e) => e.type === 'deadline' && e.startDate >= today).sort((a, b) => a.startDate.localeCompare(b.startDate)),
    [events],
  );

  /** Wochentage fuer Header */
  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);

  /** Formular oeffnen zum Erstellen */
  const openCreateForm = (dateStr?: string) => {
    setEditingEvent(null);
    setForm({...EMPTY_FORM, startDate: dateStr ?? today, endDate: dateStr ?? today});
    setShowForm(true);
  };

  /** Formular oeffnen zum Bearbeiten */
  const openEditForm = (event: CalendarEvent) => {
    setEditingEvent(event);
    setForm({
      title: event.title,
      description: event.description,
      type: event.type,
      startDate: event.startDate,
      startTime: event.startTime || '09:00',
      endDate: event.endDate,
      endTime: event.endTime || '10:00',
      allDay: event.allDay,
      voyage: event.voyage,
      attendees: event.attendees,
    });
    setShowForm(true);
    setSelectedEvent(null);
  };

  /** Event speichern (erstellen oder aktualisieren) */
  const handleSave = () => {
    if (!form.title || !form.startDate) return;

    if (editingEvent) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === editingEvent.id
            ? {
                ...e,
                title: form.title,
                description: form.description,
                type: form.type,
                startDate: form.startDate,
                startTime: form.allDay ? '00:00' : form.startTime,
                endDate: form.endDate,
                endTime: form.allDay ? '23:59' : form.endTime,
                allDay: form.allDay,
                voyage: form.voyage,
                attendees: form.attendees,
              }
            : e,
        ),
      );
    } else {
      const newEvent: CalendarEvent = {
        id: String(Date.now()),
        title: form.title,
        description: form.description,
        type: form.type,
        startDate: form.startDate,
        startTime: form.allDay ? '00:00' : form.startTime,
        endDate: form.endDate,
        endTime: form.allDay ? '23:59' : form.endTime,
        allDay: form.allDay,
        voyage: form.voyage,
        attendees: form.attendees,
        pinned: false,
      };
      setEvents((prev) => [...prev, newEvent]);
    }
    setShowForm(false);
    setEditingEvent(null);
    setForm(EMPTY_FORM);
  };

  /** Event loeschen */
  const handleDelete = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setSelectedEvent(null);
  };

  return (
    <div className="space-y-6">
      {/* Seitenkopf */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-outfit font-medium text-slate-900 dark:text-white mb-1 tracking-tight">
            Calendar
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Manage voyage schedules, deadlines, and events.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Aktuelles Datum */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10">
            <CalendarDays className="w-4 h-4 text-[#77CF97]" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {now.toLocaleDateString('en-US', {weekday: 'long', month: 'short', day: 'numeric', year: 'numeric'})}
            </span>
          </div>
          {/* Neues Event (nur Admin) */}
          {isAdmin && (
            <button
              onClick={() => openCreateForm(selectedDate)}
              className="px-4 py-2 bg-[#0b0c10] dark:bg-[#77CF97] text-white dark:text-[#0b0c10] rounded-xl text-sm font-medium hover:bg-slate-800 dark:hover:bg-[#5ab87e] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> New Event
            </button>
          )}
        </div>
      </div>

      {/* Hauptinhalt: Kalender + Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        {/* Linke Spalte: Kalender */}
        <div className="space-y-4">
          {/* Navigationsleiste */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={prevPeriod}
                className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </button>
              <h2 className="text-lg font-outfit font-semibold text-slate-900 dark:text-white min-w-[180px] text-center">
                {viewMode === 'month'
                  ? formatMonthYear(currentDate)
                  : `${formatWeekday(weekDays[0])} ${weekDays[0].getDate()} — ${formatWeekday(weekDays[6])} ${weekDays[6].getDate()}, ${weekDays[6].getFullYear()}`}
              </h2>
              <button
                onClick={nextPeriod}
                className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </button>
              <button
                onClick={goToToday}
                className="px-3 py-1.5 text-xs font-medium text-[#77CF97] border border-[#77CF97]/20 rounded-xl hover:bg-[#77CF97]/10 transition-colors cursor-pointer"
              >
                Today
              </button>
            </div>

            {/* Ansicht-Umschalter */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10">
              {([
                {mode: 'month' as ViewMode, icon: LayoutGrid, label: 'Month'},
                {mode: 'week' as ViewMode, icon: CalendarDays, label: 'Week'},
                {mode: 'list' as ViewMode, icon: List, label: 'List'},
              ]).map(({mode, icon: Icon, label}) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    viewMode === mode
                      ? 'bg-white dark:bg-[#1a1b24] text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Kalender-Ansicht */}
          {viewMode === 'month' && (
            <MonthView
              currentDate={currentDate}
              events={events}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onSelectEvent={setSelectedEvent}
            />
          )}
          {viewMode === 'week' && (
            <WeekView
              currentDate={currentDate}
              events={events}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onSelectEvent={setSelectedEvent}
            />
          )}
          {viewMode === 'list' && (
            <ListView
              events={events}
              selectedDate={selectedDate}
              onSelectEvent={setSelectedEvent}
            />
          )}
        </div>

        {/* Rechte Sidebar */}
        <div className="space-y-4">
          {/* Ausgewaehltes Datum / Event-Details */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-5">
            {selectedEvent ? (
              /* Event-Details */
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm text-slate-800 dark:text-white">Event Details</h3>
                  <button onClick={() => setSelectedEvent(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {selectedEvent.pinned && <Pin className="w-4 h-4 text-amber-500" />}
                    <h4 className="text-base font-semibold text-slate-900 dark:text-white">{selectedEvent.title}</h4>
                  </div>
                  <EventTypeBadge type={selectedEvent.type} />
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{selectedEvent.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(selectedEvent.startDate + 'T00:00:00').toLocaleDateString('en-US', {weekday: 'long', month: 'short', day: 'numeric', year: 'numeric'})}</span>
                    </div>
                    {!selectedEvent.allDay && (
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{selectedEvent.startTime} — {selectedEvent.endTime}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <Target className="w-3.5 h-3.5" />
                      <span>Voyage {VOYAGES.find((v) => v.id === selectedEvent.voyage)?.name ?? selectedEvent.voyage}</span>
                    </div>
                  </div>

                  {/* Teilnehmer */}
                  <div>
                    <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Attendees</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedEvent.attendees.map((a) => (
                        <span key={a} className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-[10px] font-medium text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-white/10">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Aktionen (Admin) */}
                  {isAdmin && (
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
                      <button
                        onClick={() => openEditForm(selectedEvent)}
                        className="flex-1 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Pencil className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(selectedEvent.id)}
                        className="px-3 py-2 text-xs font-medium text-rose-500 border border-rose-200 dark:border-rose-500/20 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Tages-Events */
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm text-slate-800 dark:text-white">
                    {selectedDate === today ? 'Today' : new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'})}
                  </h3>
                  <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                    {selectedDateEvents.length} event{selectedDateEvents.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {selectedDateEvents.length === 0 ? (
                  <div className="py-8 text-center">
                    <CalendarDays className="w-8 h-8 text-slate-200 dark:text-slate-700 mx-auto mb-2" />
                    <p className="text-xs text-slate-400 dark:text-slate-500">No events this day.</p>
                    {isAdmin && (
                      <button
                        onClick={() => openCreateForm(selectedDate)}
                        className="mt-3 px-3 py-1.5 text-[11px] font-medium text-[#77CF97] border border-[#77CF97]/20 rounded-xl hover:bg-[#77CF97]/10 transition-colors cursor-pointer"
                      >
                        + Add Event
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedDateEvents.map((ev) => (
                      <EventCard
                        key={ev.id}
                        event={ev}
                        compact
                        onClick={() => setSelectedEvent(ev)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Schnellstatistiken */}
          <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-5">
            <h3 className="font-semibold text-sm text-slate-800 dark:text-white mb-4">Quick Stats</h3>
            <div className="space-y-3">
              {/* Events diese Woche */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                  <CalendarDays className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <div className="text-lg font-outfit font-bold text-slate-800 dark:text-white">{weekEvents.length}</div>
                  <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Events this week</div>
                </div>
              </div>

              {/* Naechste Deadlines */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-rose-500" />
                </div>
                <div>
                  <div className="text-lg font-outfit font-bold text-slate-800 dark:text-white">{upcomingDeadlines.length}</div>
                  <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Upcoming deadlines</div>
                </div>
              </div>

              {/* Gesamt Events */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                <div className="w-8 h-8 rounded-lg bg-[#77CF97]/10 flex items-center justify-center shrink-0">
                  <Target className="w-4 h-4 text-[#77CF97]" />
                </div>
                <div>
                  <div className="text-lg font-outfit font-bold text-slate-800 dark:text-white">{events.length}</div>
                  <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Total events</div>
                </div>
              </div>
            </div>
          </div>

          {/* Naechste Deadlines */}
          {upcomingDeadlines.length > 0 && (
            <div className="bg-white dark:bg-[#1a1b24] rounded-2xl border border-slate-100 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-slate-800 dark:text-white">Upcoming Deadlines</h3>
              </div>
              <div className="space-y-2">
                {upcomingDeadlines.slice(0, 4).map((ev) => {
                  const cfg = EVENT_TYPE_CONFIG[ev.type];
                  const d = new Date(ev.startDate + 'T00:00:00');
                  const daysUntil = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <div
                      key={ev.id}
                      onClick={() => setSelectedEvent(ev)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <div className={`w-9 h-9 rounded-lg ${cfg.bg} border ${cfg.border} flex flex-col items-center justify-center shrink-0`}>
                        <span className={`text-[8px] font-bold uppercase leading-none ${cfg.text}`}>
                          {d.toLocaleDateString('en-US', {month: 'short'})}
                        </span>
                        <span className={`text-xs font-bold leading-none mt-0.5 ${cfg.text}`}>{d.getDate()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-800 dark:text-white truncate">{ev.title}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500">
                          {daysUntil <= 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal-Formular */}
      {showForm && (
        <EventFormModal
          form={form}
          setForm={setForm}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingEvent(null); }}
          editingEvent={editingEvent}
        />
      )}
    </div>
  );
}
