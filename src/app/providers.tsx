"use client";

import { AuthProvider } from "@/lib/auth/auth-context";
import type { AuthUser } from "@/lib/auth/queries";
import { ThemeProvider } from "next-themes";

export function Providers({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: AuthUser | null;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider initialUser={initialUser} clearStaleClientSession>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}
