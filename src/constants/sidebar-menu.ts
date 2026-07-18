import { Home, FileText, UsersRound, ClipboardList } from "lucide-react";

export type DashboardView =
  | "overview"
  | "courses"
  | "applications"
  | "participants"
  | "matching"
  | "analytics"
  | "teams"
  | "announcements"
  | "calendar"
  | "ui-components"
  | "apply"
  | "onboarding"
  | "profile"
  | "settings";

export interface SidebarItem {
  view: DashboardView;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export const adminMenu: SidebarItem[] = [
  {
    view: "overview",
    label: "Overview",
    icon: Home,
  },
  {
    view: "applications",
    label: "Applications",
    icon: FileText,
  },
  {
    view: "teams",
    label: "Teams",
    icon: UsersRound,
  },
];

export const applyOnlyMenu: SidebarItem[] = [
  {
    view: "apply",
    label: "Apply",
    icon: FileText,
  },
];

export const applicantMenu: SidebarItem[] = [
  {
    view: "apply",
    label: "Application Form",
    icon: FileText,
  },
];

export const participantMenu: SidebarItem[] = [
  {
    view: "overview",
    label: "Dashboard",
    icon: Home,
  },
  {
    view: "onboarding",
    label: "Onboarding",
    icon: ClipboardList,
  },
];
