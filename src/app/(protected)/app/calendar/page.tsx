import { PlaceholderPage } from "@/components/placeholder-page";
import { requireUser } from "@/lib/auth/queries";
import { requireMemberVoyage } from "@/lib/voyages/require-member-voyage";

export default async function CalendarPage() {
  const user = await requireUser();
  await requireMemberVoyage(user.id);

  return (
    <PlaceholderPage
      eyebrow="Participant workspace"
      title="Calendar"
      description="Upcoming sessions, deadlines, and course events will live in this participant calendar."
    />
  );
}
