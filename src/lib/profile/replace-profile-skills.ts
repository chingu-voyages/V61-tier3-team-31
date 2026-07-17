import { createClient } from "@/lib/supabase/server";
import { normalizeSkillKey } from "@/lib/applications/skill-normalization";
import {
  createSkillSlug,
  normalizeProfileSkillNames,
} from "@/lib/profile/profile-skill-normalization";

export async function replaceProfileSkills(
  userId: string,
  skillNames: string[],
): Promise<string[]> {
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
