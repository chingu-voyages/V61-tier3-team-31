export type UserRole = "admin" | "user";
export type UserStatus = "applicant" | "accepted" | "participant" | "inactive";

export type DashboardView =
  | "overview"
  | "applications"
  | "matching"
  | "analytics"
  | "teams"
  | "onboarding"
  | "forms"
  | "settings"
  | "profile"
  | "voyages"
  | "participants"
  | "announcements"
  | "calendar"
  | "ui-components"
  | "apply";

export type ParticipantRole = "Frontend" | "Backend" | "Fullstack" | "Design" | "Product";
export type ExperienceLevel = "Beginner" | "Intermediate" | "Advanced";

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
