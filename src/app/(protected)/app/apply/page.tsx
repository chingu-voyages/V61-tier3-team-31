import { ApplyPageClient } from "@/app/(protected)/app/apply/apply-page-client";
import { listActiveSkills } from "@/lib/applications/skills";
import { listOpenVoyages } from "@/lib/applications/voyages";

export default async function ApplyPage() {
  const [popularSkills, openVoyages] = await Promise.all([listActiveSkills(), listOpenVoyages()]);

  return <ApplyPageClient popularSkills={popularSkills} openVoyages={openVoyages} />;
}
