import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { ProfileFormData } from "@/schemas/profile.schema";
import { getProfileFormDefaults } from "@/lib/profile/profile-form-defaults";
import { replaceProfileSkills } from "@/lib/profile/replace-profile-skills";

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
