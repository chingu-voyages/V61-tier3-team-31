import type { Course, Deadline } from "@/types/dashboard";

export function getDeadlines(course: Course | null): Deadline[] {
  if (!course) return [];

  const startsAt = new Date(course.starts_at);

  const subtractDays = (days: number) => {
    const date = new Date(startsAt);
    date.setDate(date.getDate() - days);
    return date.toISOString();
  };

  return [
    {
      title: "Review applications",
      date: subtractDays(21),
      badgeColor: "bg-destructive/5 text-destructive",
    },
    {
      title: "Confirm teams",
      date: subtractDays(14),
      badgeColor: "bg-amber-50 dark:bg-amber-500/10 text-amber-600",
    },
    {
      title: "Onboarding check",
      date: subtractDays(7),
      badgeColor: "bg-blue-50 dark:bg-blue-500/10 text-blue-500",
    },
    {
      title: "Voyage starts",
      date: course.starts_at,
      badgeColor: "bg-primary/10 text-primary",
    },
  ];
}
