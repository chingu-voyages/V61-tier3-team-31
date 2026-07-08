"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";
import type { AuthUser } from "@/lib/auth/queries";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type PlatformRole = Database["public"]["Enums"]["platform_role"];

type AuthState = {
  user: Pick<AuthUser, "id" | "email"> | null;
  profile: Profile | null;
  role: PlatformRole | "user";
};

type AuthContextValue = AuthState & {
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const EMPTY_STATE: AuthState = {
  user: null,
  profile: null,
  role: "user",
};

function toClientUser(user: AuthUser | null): AuthState {
  if (!user) {
    return EMPTY_STATE;
  }

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    profile: user.profile,
    role: user.role,
  };
}

export function AuthProvider({
  children,
  initialUser = null,
  clearStaleClientSession = false,
}: {
  children: ReactNode;
  initialUser?: AuthUser | null;
  clearStaleClientSession?: boolean;
}) {
  const [state, setState] = useState<AuthState>(() => toClientUser(initialUser));

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
      setState(EMPTY_STATE);
      return;
    }

    const { profile, role } = await fetchProfileAndRole(user.id);
    setState({
      user: {
        id: user.id,
        email: user.email ?? "",
      },
      profile,
      role,
    });
  }, [fetchProfileAndRole]);

  useEffect(() => {
    const supabase = createClient();

    if (clearStaleClientSession && !initialUser) {
      void supabase.auth.signOut().finally(() => {
        setState(EMPTY_STATE);
      });

      return;
    }

    supabase.auth
      .getUser()
      .then(async ({ data: { user }, error }) => {
        if (error || !user) {
          setState(EMPTY_STATE);
          return;
        }

        const { profile, role } = await fetchProfileAndRole(user.id);
        setState({
          user: {
            id: user.id,
            email: user.email ?? "",
          },
          profile,
          role,
        });
      })
      .catch(() => {
        setState(EMPTY_STATE);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setState(EMPTY_STATE);
        return;
      }

      if (session?.user) {
        const { profile, role } = await fetchProfileAndRole(session.user.id);
        setState({
          user: {
            id: session.user.id,
            email: session.user.email ?? "",
          },
          profile,
          role,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [clearStaleClientSession, fetchProfileAndRole, initialUser]);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setState(EMPTY_STATE);
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
