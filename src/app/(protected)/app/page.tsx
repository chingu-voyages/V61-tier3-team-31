import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/queries";
import { resolveActiveVoyage } from "@/lib/voyages/resolve-active-voyage";

export default async function DashboardPage() {
  const user = await requireUser();
  const { active } = await resolveActiveVoyage(user.id);

  if (!active || active.relation === "open_apply") {
    redirect("/app/apply");
  }

  redirect("/app/overview");
}
