import { createClient as createServerClient } from "@/lib/supabase/server";

function normalizeSkillNames(skillNames: string[]): string[] {
  return Array.from(new Set(skillNames.map((skill) => skill.trim()).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
  );
}

export async function listProfileSkillNames(profileId: string): Promise<string[]> {
  const supabase = await createServerClient();

  const { data: profileSkills, error: profileSkillsError } = await supabase
    .from("profile_skills")
    .select("skill_id")
    .eq("profile_id", profileId);

  if (profileSkillsError || !profileSkills || profileSkills.length === 0) {
    return [];
  }

  const skillIds = profileSkills.map((row) => row.skill_id);
  const { data: skills, error: skillsError } = await supabase
    .from("skills")
    .select("name")
    .in("id", skillIds)
    .order("name");

  if (skillsError || !skills) {
    return [];
  }

  return normalizeSkillNames(skills.map((skill) => skill.name));
}
