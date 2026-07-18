import { PlaceholderPage } from "@/components/placeholder-page";
import { requireUser } from "@/lib/auth/queries";
import { requireMemberVoyage } from "@/lib/voyages/require-member-voyage";

export default async function AnnouncementsPage() {
  const user = await requireUser();
  await requireMemberVoyage(user.id);

  return (
    <PlaceholderPage
      eyebrow="Participant workspace"
      title="Announcements"
      description="Important updates for applicants and participants will surface here."
    />
  );
}
