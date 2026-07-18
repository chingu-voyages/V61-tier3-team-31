"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod/v4";
import { requireUser } from "@/lib/auth/queries";
import { createClient } from "@/lib/supabase/server";
import type { ApplyFormData } from "@/lib/schemas/apply-schema";
import { applyFormSchema } from "@/lib/schemas/apply-schema";
import { applyProfileSync, prepareProfileSync } from "@/lib/applications/profile-draft";
import type { ProfileSyncDiff, ProfileSyncField } from "@/lib/applications/profile-sync";
import { normalizeSkillKey } from "@/lib/applications/skill-normalization";
import { ACTIVE_VOYAGE_COOKIE } from "@/lib/voyages/constants";

const submitApplicationSchema = applyFormSchema.extend({
  voyage: z.string().uuid().or(z.literal("")).optional(),
});

const roleMap = {
  Frontend: "frontend",
  Backend: "backend",
  Fullstack: "fullstack",
  Design: "design",
  Product: "product",
} as const;

const experienceMap = {
  Beginner: "beginner",
  Intermediate: "intermediate",
  Advanced: "advanced",
} as const;

export type SubmitApplicationResult = { ok: true } | { error: string };
export type PrepareProfileSyncResult =
  | {
      ok: true;
      autoSyncedFields: ProfileSyncField[];
      syncCandidate: ProfileSyncDiff[] | null;
    }
  | { error: string };

export async function submitApplication(data: ApplyFormData): Promise<SubmitApplicationResult> {
  const user = await requireUser();
  const parsed = submitApplicationSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please review your application fields." };
  }

  const normalizedSkills = Array.from(
    new Map(
      parsed.data.skills
        .map((skill) => skill.trim())
        .filter((skill) => normalizeSkillKey(skill).length > 0)
        .map((skill) => [normalizeSkillKey(skill), skill] as const),
    ).values(),
  );

  if (normalizedSkills.length === 0) {
    return { error: "Please add at least one valid skill." };
  }

  const supabase = await createClient();
  const { data: applicationId, error } = await supabase.rpc("submit_application", {
    p_user_id: user.id,
    p_voyage_id: parsed.data.voyage?.trim() || null,
    p_preferred_role: roleMap[parsed.data.role],
    p_experience: experienceMap[parsed.data.experience],
    p_skills: normalizedSkills,
    p_weekly_hours: parsed.data.hoursPerWeek,
    p_timezone: parsed.data.timezone.trim(),
    p_motivation: parsed.data.motivation.trim(),
    p_bio_snapshot: parsed.data.bio.trim(),
    p_portfolio_url_snapshot: parsed.data.portfolio?.trim() || null,
  });

  if (error || !applicationId) {
    const message = error?.message ?? "Something went wrong while saving your application.";

    if (error?.code === "23505") {
      return { error: "You already have an application for this course." };
    }

    return { error: message };
  }

  let activeVoyageId = parsed.data.voyage?.trim() || null;

  if (!activeVoyageId) {
    const { data: application } = await supabase
      .from("applications")
      .select("voyage_id")
      .eq("id", applicationId)
      .maybeSingle();
    activeVoyageId = application?.voyage_id ?? null;
  }

  if (activeVoyageId) {
    const cookieStore = await cookies();
    cookieStore.set(ACTIVE_VOYAGE_COOKIE, activeVoyageId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
  }

  revalidatePath("/app", "layout");
  return { ok: true };
}

export async function prepareProfileSyncFromApplication(
  data: ApplyFormData,
): Promise<PrepareProfileSyncResult> {
  const user = await requireUser();
  const parsed = submitApplicationSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please review your application fields." };
  }

  try {
    const syncPlan = await prepareProfileSync(user.id, parsed.data);

    if (syncPlan.autoSyncedFields.length > 0) {
      await applyProfileSync(user.id, parsed.data, syncPlan.autoSyncedFields);
    }

    return {
      ok: true,
      autoSyncedFields: syncPlan.autoSyncedFields,
      syncCandidate: syncPlan.differentFields.length > 0 ? syncPlan.differentFields : null,
    };
  } catch {
    return { error: "Application submitted, but we could not prepare profile sync right now." };
  }
}

export async function syncProfileFromApplication(
  data: ApplyFormData,
  fields?: ProfileSyncField[],
): Promise<SubmitApplicationResult> {
  const user = await requireUser();
  const parsed = submitApplicationSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please review your application fields." };
  }

  try {
    const syncPlan = await prepareProfileSync(user.id, parsed.data);
    const fieldsToSync = fields ?? syncPlan.differentFields.map((field) => field.field);

    if (fieldsToSync.length === 0) {
      return { ok: true };
    }

    await applyProfileSync(user.id, parsed.data, fieldsToSync);
    return { ok: true };
  } catch {
    return { error: "We could not update your profile right now." };
  }
}
