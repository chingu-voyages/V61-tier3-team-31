import { createClient } from "@/lib/supabase/server";

export async function getAttentionStatistics() {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_attention_statistics");

  if (error) {
    console.error("get_attention_statistics error:", error);
    return {
      participants_without_team: 0,
      teams_without_roles: 0,
    };
  }

  return data;
}
