import { GraduationCap, Users, Bell, LayoutGrid, ShieldCheck, User } from "lucide-react";

type FeaturesProp = {
  label: string;
  text: string;
  icon: React.ElementType;
};

export const FEATURES: FeaturesProp[] = [
  {
    label: "Personal profile",
    text: "Your data, achievements and full course journey in one place.",
    icon: User,
  },
  {
    label: "Course progress",
    text: "Clear modules, tasks and completion status for every step.",
    icon: GraduationCap,
  },
  {
    label: "News & updates",
    text: "Fresh announcements, deadlines and course updates in your feed.",
    icon: Bell,
  },
  {
    label: "Group collaboration",
    text: "See your group, mentors and chat with your classmates.",
    icon: Users,
  },
  {
    label: "Simple registration",
    text: "One form and you're in the flow. No extra steps.",
    icon: LayoutGrid,
  },
  {
    label: "Security",
    text: "Roles and permissions/: students see their own, admins see everything they need.",
    icon: ShieldCheck,
  },
];
