import { normalizeSkillKey } from "../applications/skill-normalization.ts";

export function normalizeProfileSkillNames(skillNames: string[]): string[] {
  const skillNameByKey = new Map<string, string>();

  for (const skillName of skillNames) {
    const trimmedSkillName = skillName.trim();
    const skillKey = normalizeSkillKey(trimmedSkillName);

    if (skillKey.length > 0 && !skillNameByKey.has(skillKey)) {
      skillNameByKey.set(skillKey, trimmedSkillName);
    }
  }

  return Array.from(skillNameByKey.values()).sort((a, b) => a.localeCompare(b));
}

export function createSkillSlug(skillName: string): string {
  return skillName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
