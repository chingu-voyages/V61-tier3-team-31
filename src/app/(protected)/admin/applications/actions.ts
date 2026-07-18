"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod/v4";
import { requireStaff } from "@/lib/auth/queries";
import { createClient } from "@/lib/supabase/server";

const applicationIdSchema = z.object({
  applicationId: z.string().uuid(),
});

export type ApplicationDecisionResult = { ok: true } | { error: string };

export async function acceptApplication(input: unknown): Promise<ApplicationDecisionResult> {
  await requireStaff();
  const parsed = applicationIdSchema.safeParse(input);

  if (!parsed.success) {
    return { error: "We could not accept this application." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("accept_application", {
    p_application_id: parsed.data.applicationId,
  });

  if (error) {
    return { error: error.message || "We could not accept this application." };
  }

  revalidatePath("/admin/applications");
  revalidatePath("/app/overview");
  revalidatePath("/app/onboarding");

  return { ok: true };
}

export async function rejectApplication(input: unknown): Promise<ApplicationDecisionResult> {
  await requireStaff();
  const parsed = applicationIdSchema.safeParse(input);

  if (!parsed.success) {
    return { error: "We could not reject this application." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("reject_application", {
    p_application_id: parsed.data.applicationId,
  });

  if (error) {
    return { error: error.message || "We could not reject this application." };
  }

  revalidatePath("/admin/applications");
  revalidatePath("/app/overview");
  revalidatePath("/app/onboarding");

  return { ok: true };
}
