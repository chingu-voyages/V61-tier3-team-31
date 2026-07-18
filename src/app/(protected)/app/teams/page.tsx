import { PlaceholderPage } from "@/components/placeholder-page";
import { requireUser } from "@/lib/auth/queries";
import { requireMemberVoyage } from "@/lib/voyages/require-member-voyage";

export default async function TeamsPage() {
  const user = await requireUser();
  await requireMemberVoyage(user.id);

  return (
    <PlaceholderPage
      eyebrow="Participant workspace"
      title="Team space"
      description="Participant team collaboration and delivery updates will live in this route."
    />
  );
}
