export function normalizeSkillKey(skill: string): string {
  return skill
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}
