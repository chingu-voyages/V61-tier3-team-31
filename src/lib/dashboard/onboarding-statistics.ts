import { createClient } from "@/lib/supabase/server";

export async function getOnboardingStatistics() {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_onboarding_statistics");

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}
