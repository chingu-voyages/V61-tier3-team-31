"use client";

import { AuthProvider } from "@/lib/auth/auth-context";
import type { AuthUser } from "@/lib/auth/queries";

export function Providers({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: AuthUser | null;
}) {
  return (
    <AuthProvider initialUser={initialUser} clearStaleClientSession>
      {children}
    </AuthProvider>
  );
}
