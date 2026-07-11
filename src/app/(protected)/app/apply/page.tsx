import { ApplyPageClient } from "@/app/(protected)/app/apply/apply-page-client";
import { requireUser } from "@/lib/auth/queries";
import { getApplyProfileDraft } from "@/lib/applications/profile-draft";
import { listActiveSkills } from "@/lib/applications/skills";
import { listOpenVoyages } from "@/lib/applications/voyages";

export default async function ApplyPage() {
  const user = await requireUser();
  const [popularSkills, openVoyages, initialProfileDraft] = await Promise.all([
    listActiveSkills(),
    listOpenVoyages(),
    getApplyProfileDraft(user.id),
  ]);

  return (
    <ApplyPageClient
      popularSkills={popularSkills}
      openVoyages={openVoyages}
      initialProfileDraft={initialProfileDraft}
    />
  );
}
