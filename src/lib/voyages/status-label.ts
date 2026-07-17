import type { UserVoyage } from "@/lib/voyages/types";

export function formatVoyageDateRange(startsAt: string | null, endsAt: string | null): string {
  if (!startsAt && !endsAt) return "Dates TBD";

  const format = (value: string) =>
    new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  if (startsAt && endsAt) return `${format(startsAt)} – ${format(endsAt)}`;
  if (startsAt) return `From ${format(startsAt)}`;
  return `Until ${format(endsAt!)}`;
}

export function getVoyageStatusLabel(voyage: UserVoyage): string {
  if (voyage.relation === "open_apply") return "Applications open";
  if (voyage.enrollmentStatus === "active") return "In progress";
  if (voyage.enrollmentStatus === "invited") return "Onboarding";
  if (voyage.enrollmentStatus === "completed") return "Completed";
  if (voyage.applicationStatus === "accepted") return "Accepted";
  if (voyage.applicationStatus === "under_review" || voyage.applicationStatus === "submitted") {
    return "Application review";
  }
  if (voyage.applicationStatus === "rejected") return "Not accepted";
  if (voyage.applicationStatus === "withdrawn") return "Withdrawn";
  if (voyage.status === "applications_open") return "Applications open";
  return "Course";
}
