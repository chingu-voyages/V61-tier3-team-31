import { createClient } from "@/lib/supabase/server";
import type { Course } from "@/types/dashboard";

export async function getCurrentCourse(): Promise<Course | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("voyages")
    .select(
      `
      id,
      number,
      name,
      status,
      application_deadline,
      starts_at,
      ends_at
      `,
    )
    .order("number", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}
