import { createClient } from "@/lib/supabase/server";

export async function getTeamsStatistics() {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_team_statistics");

  if (error) {
    console.error("get_team_statistics error:", error);
    throw error;
  }

  return data;
}
