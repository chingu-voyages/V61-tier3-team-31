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
export type ApplicationStatus = "pending_review" | "accepted" | "rejected" | "incomplete";

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
  bio: string;
  skills: string[];
  availability: string;
  motivation: string;
  portfolio: string;
  timezone: string;
  reviewNotes: string;
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
