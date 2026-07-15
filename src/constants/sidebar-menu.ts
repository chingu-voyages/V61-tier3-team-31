import {
  Home,
  FileText,
  Users,
  Network,
  UsersRound,
  ClipboardList,
  Compass,
  Megaphone,
  CalendarDays,
  BarChart3,
  Layers,
  User,
} from "lucide-react";

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
    view: "courses",
    label: "Courses",
    icon: Compass,
  },
  {
    view: "applications",
    label: "Applications",
    icon: FileText,
    badge: "312",
  },
  {
    view: "participants",
    label: "Participants",
    icon: Users,
    badge: "128",
  },
  {
    view: "matching",
    label: "Matching",
    icon: Network,
  },
  {
    view: "analytics",
    label: "Analytics",
    icon: BarChart3,
  },
  {
    view: "teams",
    label: "Teams",
    icon: UsersRound,
    badge: "18",
  },
  {
    view: "announcements",
    label: "Announcements",
    icon: Megaphone,
  },
  {
    view: "calendar",
    label: "Calendar",
    icon: CalendarDays,
  },
  {
    view: "ui-components",
    label: "UI Kit",
    icon: Layers,
  },
];

export const applicantMenu: SidebarItem[] = [
  {
    view: "apply",
    label: "Application Form",
    icon: FileText,
  },
  {
    view: "overview",
    label: "Application Status",
    icon: Home,
  },
];

export const participantMenu: SidebarItem[] = [
  {
    view: "overview",
    label: "Dashboard",
    icon: Home,
  },
  {
    view: "teams",
    label: "Team Space",
    icon: UsersRound,
  },
  {
    view: "onboarding",
    label: "Onboarding",
    icon: ClipboardList,
  },
  {
    view: "calendar",
    label: "Calendar",
    icon: CalendarDays,
  },
];

export const defaultMenu: SidebarItem[] = [
  {
    view: "overview",
    label: "Overview",
    icon: Home,
  },
  {
    view: "apply",
    label: "Apply",
    icon: FileText,
  },
  {
    view: "onboarding",
    label: "Onboarding",
    icon: ClipboardList,
  },
  {
    view: "calendar",
    label: "Calendar",
    icon: CalendarDays,
  },
  {
    view: "profile",
    label: "Profile",
    icon: User,
  },
];
