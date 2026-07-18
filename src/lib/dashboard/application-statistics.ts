import { createClient } from "@/lib/supabase/server";

export async function getApplicationStatusCounts() {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_application_status_counts");

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}
