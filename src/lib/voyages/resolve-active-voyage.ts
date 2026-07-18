import { cache } from "react";
import { cookies } from "next/headers";
import { ACTIVE_VOYAGE_COOKIE } from "@/lib/voyages/constants";
import { getSelectableVoyages } from "@/lib/voyages/get-user-voyages";
import type { UserVoyage } from "@/lib/voyages/types";

export type ActiveVoyageContext = {
  active: UserVoyage | null;
  voyages: UserVoyage[];
};

function pickDefaultVoyage(voyages: UserVoyage[]): UserVoyage | null {
  if (voyages.length === 0) return null;

  const member = voyages.find((voyage) => voyage.relation === "member");
  if (member) return member;

  return voyages.find((voyage) => voyage.relation === "open_apply") ?? voyages[0] ?? null;
}

export const resolveActiveVoyage = cache(async function resolveActiveVoyage(
  userId: string,
): Promise<ActiveVoyageContext> {
  const voyages = await getSelectableVoyages(userId);

  if (voyages.length === 0) {
    return { active: null, voyages };
  }

  const cookieStore = await cookies();
  const cookieVoyageId = cookieStore.get(ACTIVE_VOYAGE_COOKIE)?.value;
  const fromCookie = cookieVoyageId
    ? voyages.find((voyage) => voyage.id === cookieVoyageId)
    : undefined;

  return {
    active: fromCookie ?? pickDefaultVoyage(voyages),
    voyages,
  };
});
