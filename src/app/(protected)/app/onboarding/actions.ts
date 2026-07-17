"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod/v4";
import { requireUser } from "@/lib/auth/queries";
import { createClient } from "@/lib/supabase/server";

const toggleOnboardingProgressSchema = z.object({
  enrollmentId: z.string().uuid(),
  stepId: z.string().uuid(),
  completed: z.boolean(),
});

export type ToggleOnboardingProgressResult = { ok: true; completed: boolean } | { error: string };

export async function toggleOnboardingProgress(
  input: unknown,
): Promise<ToggleOnboardingProgressResult> {
  const user = await requireUser();
  const parsed = toggleOnboardingProgressSchema.safeParse(input);

  if (!parsed.success) {
    return { error: "We could not update this onboarding item." };
  }

  const { enrollmentId, stepId, completed } = parsed.data;
  const supabase = await createClient();

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id, voyage_id, status")
    .eq("id", enrollmentId)
    .eq("account_id", user.id)
    .in("status", ["invited", "active"])
    .maybeSingle();

  if (!enrollment) {
    return { error: "This onboarding checklist is not available right now." };
  }

  const { data: step } = await supabase
    .from("onboarding_steps")
    .select("id")
    .eq("id", stepId)
    .eq("voyage_id", enrollment.voyage_id)
    .eq("active", true)
    .maybeSingle();

  if (!step) {
    return { error: "This onboarding item is no longer available." };
  }

  const { error } = await supabase.from("onboarding_progress").upsert(
    {
      enrollment_id: enrollment.id,
      step_id: step.id,
      status: completed ? "completed" : "not_started",
      completed_at: completed ? new Date().toISOString() : null,
      completed_by: completed ? user.id : null,
    },
    { onConflict: "enrollment_id,step_id" },
  );

  if (error) {
    return { error: "We could not save your change. Please try again." };
  }

  revalidatePath("/app/onboarding");
  revalidatePath("/app/overview");

  return { ok: true, completed };
}
