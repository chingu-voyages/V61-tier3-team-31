import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { ApplyFormData } from "@/lib/schemas/apply-schema";
import {
  buildProfileSyncPlan,
  normalizeRole,
  normalizeSkillNames,
  normalizeNullableUrl,
  normalizeProfileText,
  type ApplyProfileDraft,
  type ProfileSyncField,
  type ProfileSyncPlan,
} from "@/lib/applications/profile-sync";

type ServerClient = SupabaseClient<Database>;
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

async function listProfileSkillIds(supabase: ServerClient, userId: string): Promise<number[]> {
  const { data, error } = await supabase
    .from("profile_skills")
    .select("skill_id")
    .eq("profile_id", userId);

  if (error || !data) {
    return [];
  }

  return data.map((row) => row.skill_id);
}

async function listSkillNamesByIds(supabase: ServerClient, skillIds: number[]): Promise<string[]> {
  if (skillIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("skills")
    .select("id, name")
    .in("id", skillIds)
    .order("name");

  if (error || !data) {
    return [];
  }

  return normalizeSkillNames(data.map((skill) => skill.name));
}

async function resolveSkillIdsForProfileSync(
  supabase: ServerClient,
  skillNames: string[],
): Promise<number[]> {
  const normalizedNames = normalizeSkillNames(skillNames);

  if (normalizedNames.length === 0) {
    return [];
  }

  const { data: existingSkills, error: existingSkillsError } = await supabase
    .from("skills")
    .select("id, name, slug");

  if (existingSkillsError) {
    throw existingSkillsError;
  }

  const existingByKey = new Map<string, number>();
  for (const skill of existingSkills ?? []) {
    const nameKey = skill.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "");
    const slugKey = skill.slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "");
    existingByKey.set(nameKey, skill.id);
    existingByKey.set(slugKey, skill.id);
  }

  const resolvedSkillIds = normalizedNames
    .map((skillName) => existingByKey.get(skillName.toLowerCase().replace(/[^a-z0-9]+/g, "")))
    .filter((skillId): skillId is number => skillId !== undefined);

  if (resolvedSkillIds.length !== normalizedNames.length) {
    throw new Error("Some submitted skills could not be resolved for profile sync.");
  }

  return resolvedSkillIds;
}

export async function getApplyProfileDraft(userId: string): Promise<ApplyProfileDraft> {
  const supabase = await createServerClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("bio, timezone, portfolio_url, preferred_role")
    .eq("id", userId)
    .maybeSingle();

  const skillIds = await listProfileSkillIds(supabase, userId);
  const skillNames = await listSkillNamesByIds(supabase, skillIds);

  return {
    role: normalizeRole(profile?.preferred_role),
    skills: skillNames,
    timezone: profile?.timezone ?? "UTC",
    bio: profile?.bio ?? "",
    portfolio: profile?.portfolio_url ?? "",
  };
}

function buildProfileUpdatePatch(
  profile: ApplyProfileDraft,
  application: ApplyFormData,
  fieldsToSync: Set<ProfileSyncField>,
): Database["public"]["Tables"]["profiles"]["Update"] {
  const patch: Database["public"]["Tables"]["profiles"]["Update"] = {};

  if (
    fieldsToSync.has("bio") &&
    normalizeProfileText(profile.bio) !== normalizeProfileText(application.bio)
  ) {
    patch.bio = normalizeProfileText(application.bio);
  }

  if (
    fieldsToSync.has("timezone") &&
    normalizeProfileText(profile.timezone) !== normalizeProfileText(application.timezone)
  ) {
    patch.timezone = normalizeProfileText(application.timezone);
  }

  if (
    fieldsToSync.has("portfolio") &&
    normalizeNullableUrl(profile.portfolio) !== normalizeNullableUrl(application.portfolio)
  ) {
    patch.portfolio_url = normalizeNullableUrl(application.portfolio) || null;
  }

  if (fieldsToSync.has("role")) {
    const normalizedRole = normalizeRole(application.role)?.toLowerCase() as
      | ProfileRow["preferred_role"]
      | undefined;
    if (normalizedRole) {
      patch.preferred_role = normalizedRole;
    }
  }

  return patch;
}

export async function prepareProfileSync(
  userId: string,
  application: ApplyFormData,
): Promise<ProfileSyncPlan> {
  const profileDraft = await getApplyProfileDraft(userId);
  return buildProfileSyncPlan(profileDraft, application);
}

export async function applyProfileSync(
  userId: string,
  application: ApplyFormData,
  fields: ProfileSyncField[],
): Promise<void> {
  const supabase = await createServerClient();
  const currentProfile = await getApplyProfileDraft(userId);
  const fieldsToSync = new Set(fields);

  const profilePatch = buildProfileUpdatePatch(currentProfile, application, fieldsToSync);
  if (Object.keys(profilePatch).length > 0) {
    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update(profilePatch)
      .eq("id", userId);

    if (profileUpdateError) {
      throw profileUpdateError;
    }
  }

  if (fieldsToSync.has("skills")) {
    const nextSkillIds = await resolveSkillIdsForProfileSync(supabase, application.skills);

    const { error: deleteError } = await supabase
      .from("profile_skills")
      .delete()
      .eq("profile_id", userId);

    if (deleteError) {
      throw deleteError;
    }

    if (nextSkillIds.length > 0) {
      const { error: insertError } = await supabase.from("profile_skills").insert(
        nextSkillIds.map((skillId) => ({
          profile_id: userId,
          skill_id: skillId,
        })),
      );

      if (insertError) {
        throw insertError;
      }
    }
  }
}
