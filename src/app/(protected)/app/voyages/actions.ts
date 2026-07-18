"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod/v4";
import { requireUser } from "@/lib/auth/queries";
import { ACTIVE_VOYAGE_COOKIE } from "@/lib/voyages/constants";
import { getSelectableVoyages } from "@/lib/voyages/get-user-voyages";

const setActiveVoyageSchema = z.object({
  voyageId: z.string().uuid(),
});

export type SetActiveVoyageResult = { ok: true; mode: "apply" | "member" } | { error: string };

export async function setActiveVoyage(voyageId: string): Promise<SetActiveVoyageResult> {
  const user = await requireUser();
  const parsed = setActiveVoyageSchema.safeParse({ voyageId });

  if (!parsed.success) {
    return { error: "Invalid course id." };
  }

  const voyages = await getSelectableVoyages(user.id);
  const target = voyages.find((voyage) => voyage.id === parsed.data.voyageId);

  if (!target) {
    return { error: "You do not have access to this course." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_VOYAGE_COOKIE, parsed.data.voyageId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  revalidatePath("/app", "layout");
  return {
    ok: true,
    mode: target.relation === "open_apply" ? "apply" : "member",
  };
}
