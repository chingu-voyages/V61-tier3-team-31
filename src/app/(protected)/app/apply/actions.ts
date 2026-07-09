"use server";

import { z } from "zod/v4";
import { requireUser } from "@/lib/auth/queries";
import { createClient } from "@/lib/supabase/server";
import type { ApplyFormData } from "@/lib/schemas/apply-schema";
import { applyFormSchema } from "@/lib/schemas/apply-schema";

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

export async function submitApplication(data: ApplyFormData): Promise<SubmitApplicationResult> {
  const user = await requireUser();
  const parsed = submitApplicationSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please review your application fields." };
  }

  if (parsed.data.email.trim().toLowerCase() !== user.email.trim().toLowerCase()) {
    return { error: "The email on the form must match the signed-in account." };
  }

  const normalizedSkills = Array.from(
    new Set(parsed.data.skills.map((skill) => skill.trim()).filter((skill) => skill.length > 0)),
  );

  const supabase = await createClient();
  const { data: applicationId, error } = await supabase.rpc("submit_application", {
    p_user_id: user.id,
    p_voyage_id: parsed.data.voyage?.trim() || null,
    p_full_name: parsed.data.fullName.trim(),
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
      return { error: "You already have an application for this voyage." };
    }

    return { error: message };
  }

  return { ok: true };
}
