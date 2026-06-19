/** Benutzerrolle in der Anwendung */
export type UserRole = 'admin' | 'applicant' | 'participant';

/** Verfügbare Ansichten im Dashboard */
export type DashboardView =
  | 'overview'
  | 'applications'
  | 'matching'
  | 'teams'
  | 'onboarding'
  | 'forms'
  | 'settings'
  | 'profile';

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

export interface DashboardCtx {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  currentView: DashboardView;
  setCurrentView: (view: DashboardView) => void;
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: (val: boolean) => void;
  isInitialized: boolean;
}
