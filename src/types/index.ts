/**
 * Benutzerrolle in der Anwendung.
 * `admin` = vollstaendiger Zugriff auf das Admin-Dashboard.
 * `user` = gewoehnlicher Benutzer (kann applicant oder participant sein).
 */
export type UserRole = 'admin' | 'user';

/**
 * Lebenszyklus-Status eines Benutzers.
 * Bestimmt, welche Views und Navigation dem Benutzer angezeigt werden.
 */
export type UserStatus = 'applicant' | 'accepted' | 'participant' | 'inactive';

/** Verfügbare Ansichten im Dashboard */
export type DashboardView =
  | 'overview'
  | 'applications'
  | 'matching'
  | 'analytics'
  | 'teams'
  | 'onboarding'
  | 'forms'
  | 'settings'
  | 'profile'
  | 'voyages'
  | 'participants'
  | 'announcements'
  | 'calendar'
  | 'ui-components';

/** Verfügbare Tabs in den Einstellungen */
export type SettingsTab =
  | 'general'
  | 'team'
  | 'layout'
  | 'notifications'
  | 'voyage'
  | 'integrations'
  | 'security';

/** Anwendungsstatus für Bewerbungen */
export type ApplicationStatus =
  | 'pending_review'
  | 'accepted'
  | 'rejected'
  | 'incomplete';

/** Teamstatus */
export type TeamStatus = 'active' | 'at_risk' | 'forming' | 'completed';

/** Teilnehmer-Rolle */
export type ParticipantRole =
  | 'Frontend'
  | 'Backend'
  | 'Fullstack'
  | 'Design'
  | 'Product';

/** Erfahrungsstufe */
export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

/** Formularstatus */
export type FormStatus = 'collecting' | 'draft' | 'closed';

/** Voyage-Status */
export type VoyageStatus = 'planning' | 'active' | 'review' | 'completed';

/** Zielgruppe fuer ein Announcement */
export type AnnouncementTarget = 'all' | 'participants' | 'teams' | 'applicants';

/** Status eines Announcements */
export type AnnouncementStatus = 'published' | 'draft' | 'archived';

/** Einzelnes Announcement-Objekt */
export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  target: AnnouncementTarget;
  status: AnnouncementStatus;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
}

/** Einzelnes Bewerbungsobjekt */
export interface Application {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: ParticipantRole;
  experience: ExperienceLevel;
  years: string;
  status: ApplicationStatus;
  date: string;
  voyage: string;
  /** Kurze Beschreibung des Bewerbers */
  bio: string;
  /** Fähigkeiten / Tech-Stack */
  skills: string[];
  /** Verfuegbare Stunden pro Woche */
  availability: string;
  /** Motivation / Antwort auf Frage */
  motivation: string;
  /** GitHub / Portfolio */
  portfolio: string;
  /** Zeitzone */
  timezone: string;
  /** Review-Notizen des Admins */
  reviewNotes: string;
}

/** Einzelnes Voyage-Objekt */
export interface Voyage {
  id: string;
  name: string;
  number: number;
  status: VoyageStatus;
  startDate: string;
  endDate: string;
  applicationDeadline: string;
  participants: number;
  teams: number;
  description: string;
}

/** Einzelner Teilnehmer */
export interface Participant {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: ParticipantRole;
  experience: ExperienceLevel;
  voyage: string;
  teamId: string | null;
  teamName: string | null;
  status: 'active' | 'inactive' | 'pending';
  onboardingProgress: number;
  joinedDate: string;
  skills: string[];
  /** Kurze Biografie des Teilnehmers */
  bio: string;
  /** Zeitzone */
  timezone: string;
  /** Verfuegbare Stunden pro Woche */
  availability: string;
  /** GitHub-Profil */
  github: string;
}

/** Einzelnes Team */
export interface Team {
  id: string;
  name: string;
  status: TeamStatus;
  voyage: string;
  members: TeamMember[];
  createdAt: string;
  description: string;
  sharedOverlap: string;
  mentor: string;
}

/** Team-Mitglied */
export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: ParticipantRole;
  email: string;
  isLead: boolean;
}

/** Typ eines Kalender-Events */
export type EventType = 'deadline' | 'meeting' | 'milestone' | 'social' | 'demo';

/** Einzelnes Kalender-Event */
export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  startDate: string;
  /** Uhrzeit des Beginns (HH:MM) */
  startTime: string;
  endDate: string;
  /** Uhrzeit des Endes (HH:MM) */
  endTime: string;
  allDay: boolean;
  voyage: string;
  /** Beteiligte Teilnehmer/Teams */
  attendees: string[];
  /** Ob das Event angepinnt ist */
  pinned: boolean;
}

/** Einzelnes Match-Ergebnis */
export interface MatchResult {
  id: string;
  teamName: string;
  voyage: string;
  compatibilityScore: number;
  matchedAt: string;
  status: 'suggested' | 'confirmed' | 'rejected';
  members: MatchMember[];
  rationale: string;
  skillsOverlap: number;
  timezoneAlignment: number;
  experienceBalance: number;
}

/** Mitglied in einem Match */
export interface MatchMember {
  participantId: string;
  name: string;
  avatar: string;
  role: ParticipantRole;
  experience: ExperienceLevel;
  skills: string[];
  timezone: string;
  matchContribution: number;
}

export interface DashboardCtx {
  role: UserRole;
  setRole: (role: UserRole) => void;
  status: UserStatus;
  setStatus: (status: UserStatus) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  currentView: DashboardView;
  setCurrentView: (view: DashboardView) => void;
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: (val: boolean) => void;
  isInitialized: boolean;
}

/** Metrik-Typ fuer Analytics */
export interface MetricCard {
  label: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
}

/** Datenpunkt fuer Charts */
export interface ChartDataPoint {
  name: string;
  value?: number;
}

/** Datenpunkt fuer vergleichende Charts mit mehreren Metriken */
export interface MultiMetricDataPoint {
  name: string;
  [key: string]: string | number;
}

/** Konfigurierbare Matching-Regel fuer das Team-Matching */
export interface MatchingRule {
  /** Eindeutige Kennung */
  id: string;
  /** Anzeigename der Regel */
  name: string;
  /** Beschreibung der Regel */
  description: string;
  /** Gewichtung in Prozent (0-100) */
  weight: number;
  /** Icon-Komponente aus lucide-react */
  icon: string;
  /** Farbakzent-Klasse */
  color: string;
  /** Ob die Regel aktiv ist */
  enabled: boolean;
}
