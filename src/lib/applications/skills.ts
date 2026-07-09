import { createClient as createServerClient } from "@/lib/supabase/server";

export async function listActiveSkills(): Promise<string[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("skills")
    .select("name")
    .eq("active", true)
    .order("name");

  if (error) {
    console.error("Failed to load active skills for apply form:", error);
    return [];
  }

  return data.map((skill) => skill.name);
}
