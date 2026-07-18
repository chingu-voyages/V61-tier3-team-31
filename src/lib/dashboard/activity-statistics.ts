import { createClient } from "@/lib/supabase/server";
import type { Activity } from "@/types/dashboard";

export async function getRecentActivity(): Promise<Activity[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_recent_activity");

  if (error) {
    console.error("get_recent_activity error:", error);
    return [];
  }

  return data ?? [];
}
