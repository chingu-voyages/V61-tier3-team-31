import { redirect } from "next/navigation";
import { resolveActiveVoyage } from "@/lib/voyages/resolve-active-voyage";
import type { UserVoyage } from "@/lib/voyages/types";

export async function requireMemberVoyage(userId: string): Promise<UserVoyage> {
  const { active } = await resolveActiveVoyage(userId);

  if (!active || active.relation === "open_apply") {
    redirect("/app/apply");
  }

  return active;
}
