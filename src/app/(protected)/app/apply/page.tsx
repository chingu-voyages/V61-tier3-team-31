import { ApplyPageClient } from "@/app/(protected)/app/apply/apply-page-client";
import { requireUser } from "@/lib/auth/queries";
import { getApplyProfileDraft } from "@/lib/applications/profile-draft";
import { listActiveSkills } from "@/lib/applications/skills";
import { listOpenVoyages } from "@/lib/applications/voyages";
import { resolveActiveVoyage } from "@/lib/voyages/resolve-active-voyage";

export default async function ApplyPage() {
  const user = await requireUser();
  const { active } = await resolveActiveVoyage(user.id);
  const preferredVoyageId = active?.relation === "open_apply" ? active.id : null;

  const [popularSkills, openVoyages, initialProfileDraft] = await Promise.all([
    listActiveSkills(),
    listOpenVoyages(user.id),
    getApplyProfileDraft(user.id),
  ]);

  return (
    <ApplyPageClient
      popularSkills={popularSkills}
      openVoyages={openVoyages}
      initialProfileDraft={initialProfileDraft}
      preferredVoyageId={preferredVoyageId}
    />
  );
}
