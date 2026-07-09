import { createClient } from "@/lib/supabase/server";

export async function hasSubmittedApplication(userId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("applications")
    .select("id")
    .eq("applicant_id", userId)
    .neq("status", "draft")
    .limit(1)
    .maybeSingle();

  return data !== null;
}
