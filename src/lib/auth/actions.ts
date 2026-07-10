"use server";

import { createClient } from "@/lib/supabase/server";

export async function signOutAction(): Promise<{ ok: true } | { error: string }> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut({ scope: "local" });

  if (error) {
    return { error: "Unable to sign out. Please try again." };
  }

  return { ok: true };
}
