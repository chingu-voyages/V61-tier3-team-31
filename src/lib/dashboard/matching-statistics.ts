import { createClient } from "@/lib/supabase/server";

export async function getMatchingStatistics() {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_matching_statistics");

  if (error) {
    console.error("get_matching_statistics error:", error);
    throw error;
  }

  return data;
}
