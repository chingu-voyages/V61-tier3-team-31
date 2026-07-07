"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type PlatformRole = Database["public"]["Enums"]["platform_role"];

type AuthState = {
  user: User | null;
  profile: Profile | null;
  role: PlatformRole | "user";
  isLoading: boolean;
};

type AuthContextValue = AuthState & {
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    role: "user",
    isLoading: true,
  });

  const fetchProfileAndRole = useCallback(async (userId: string) => {
    try {
      const supabase = createClient();

      const [profileResult, roleResult] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", userId).maybeSingle(),
      ]);

      return {
        profile: profileResult.data ?? null,
        role: (roleResult.data?.role ?? "user") as PlatformRole | "user",
      };
    } catch {
      return { profile: null, role: "user" as PlatformRole | "user" };
    }
  }, []);

  const refresh = useCallback(async () => {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setState({ user: null, profile: null, role: "user", isLoading: false });
      return;
    }

    const { profile, role } = await fetchProfileAndRole(user.id);
    setState({ user, profile, role, isLoading: false });
  }, [fetchProfileAndRole]);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth
      .getUser()
      .then(async ({ data: { user }, error }) => {
        if (error || !user) {
          setState({ user: null, profile: null, role: "user", isLoading: false });
          return;
        }

        const { profile, role } = await fetchProfileAndRole(user.id);
        setState({ user, profile, role, isLoading: false });
      })
      .catch(() => {
        setState({ user: null, profile: null, role: "user", isLoading: false });
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setState({ user: null, profile: null, role: "user", isLoading: false });
        return;
      }

      if (session?.user) {
        const { profile, role } = await fetchProfileAndRole(session.user.id);
        setState({ user: session.user, profile, role, isLoading: false });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfileAndRole]);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setState({ user: null, profile: null, role: "user", isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, signOut, refresh }}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
