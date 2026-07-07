import { createClient as createServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type AuthUser = {
  id: string;
  email: string;
  profile: Profile | null;
  role: "admin" | "moderator" | "user";
};

export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const [profileResult, roleResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle(),
  ]);

  const profile = profileResult.data ?? null;
  const userRole = roleResult.data?.role ?? "user";

  return {
    id: user.id,
    email: user.email ?? "",
    profile,
    role: userRole,
  };
}

export async function getUserRole(userId: string): Promise<"admin" | "moderator" | "user"> {
  const supabase = await createServerClient();

  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle();

  return data?.role ?? "user";
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createServerClient();

  const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();

  return data;
}
