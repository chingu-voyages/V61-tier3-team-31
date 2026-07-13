import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { ProfileFormData } from "@/schemas/profile.schema";
import { getProfileFormDefaults } from "@/lib/profile/profile-form-defaults";
import { normalizeSkillKey } from "@/lib/applications/skill-normalization";

type ProfileUpdateRow = Pick<
  Database["public"]["Tables"]["profiles"]["Update"],
  "full_name" | "preferred_role" | "timezone" | "portfolio_url" | "bio"
>;

function buildProfileUpdate(payload: ProfileFormData): ProfileUpdateRow {
  return {
    full_name: payload.fullName.trim(),
    preferred_role: payload.preferredRole || null,
    timezone: payload.timezone.trim(),
    portfolio_url: payload.portfolioUrl.trim() || null,
    bio: payload.bio.trim(),
  };
}

function normalizeProfileSkillNames(skillNames: string[]): string[] {
  return Array.from(
    new Map(
      skillNames
        .map((skill) => skill.trim())
        .filter((skill) => normalizeSkillKey(skill).length > 0)
        .map((skill) => [normalizeSkillKey(skill), skill] as const),
    ).values(),
  ).sort((a, b) => a.localeCompare(b));
}

function createSkillSlug(skillName: string): string {
  return skillName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function replaceProfileSkills(userId: string, skillNames: string[]): Promise<string[]> {
  const supabase = await createClient();
  const normalizedSkillNames = normalizeProfileSkillNames(skillNames);

  const { data: existingSkills, error: existingSkillsError } = await supabase
    .from("skills")
    .select("id, name, slug");

  if (existingSkillsError) {
    throw existingSkillsError;
  }

  const skillIdByKey = new Map<string, number>();
  for (const skill of existingSkills ?? []) {
    skillIdByKey.set(normalizeSkillKey(skill.name), skill.id);
    skillIdByKey.set(normalizeSkillKey(skill.slug), skill.id);
  }

  const missingSkillNames = normalizedSkillNames.filter(
    (skillName) => !skillIdByKey.has(normalizeSkillKey(skillName)),
  );

  if (missingSkillNames.length > 0) {
    const { error: insertSkillsError } = await supabase.from("skills").insert(
      missingSkillNames.map((skillName) => ({
        name: skillName,
        slug: createSkillSlug(skillName),
        active: true,
        custom: true,
      })),
    );

    if (insertSkillsError) {
      throw insertSkillsError;
    }
  }

  const { data: nextSkills, error: nextSkillsError } = await supabase
    .from("skills")
    .select("id, name, slug");

  if (nextSkillsError) {
    throw nextSkillsError;
  }

  const nextSkillIdByKey = new Map<string, number>();
  for (const skill of nextSkills ?? []) {
    nextSkillIdByKey.set(normalizeSkillKey(skill.name), skill.id);
    nextSkillIdByKey.set(normalizeSkillKey(skill.slug), skill.id);
  }

  const nextSkillIds = normalizedSkillNames
    .map((skillName) => nextSkillIdByKey.get(normalizeSkillKey(skillName)))
    .filter((skillId): skillId is number => skillId !== undefined);

  const { error: deleteProfileSkillsError } = await supabase
    .from("profile_skills")
    .delete()
    .eq("profile_id", userId);

  if (deleteProfileSkillsError) {
    throw deleteProfileSkillsError;
  }

  if (nextSkillIds.length > 0) {
    const { error: insertProfileSkillsError } = await supabase.from("profile_skills").insert(
      nextSkillIds.map((skillId) => ({
        profile_id: userId,
        skill_id: skillId,
      })),
    );

    if (insertProfileSkillsError) {
      throw insertProfileSkillsError;
    }
  }

  return normalizedSkillNames;
}

export async function updateProfile(
  userId: string,
  payload: ProfileFormData,
): Promise<ProfileFormData> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .update(buildProfileUpdate(payload))
    .eq("id", userId)
    .select("full_name, preferred_role, timezone, portfolio_url, bio")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "We could not update your profile right now.");
  }

  const skills = await replaceProfileSkills(userId, payload.skills);

  return getProfileFormDefaults({
    fullName: data.full_name,
    preferredRole: data.preferred_role ?? "",
    timezone: data.timezone,
    portfolioUrl: data.portfolio_url ?? "",
    bio: data.bio,
    skills,
  });
}
