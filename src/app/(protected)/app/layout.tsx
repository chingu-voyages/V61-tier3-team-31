import { redirect } from "next/navigation";
import { AuthProvider } from "@/lib/auth/auth-context";
import { requireUser } from "@/lib/auth/queries";
import { isStaffRole } from "@/lib/auth/navigation";
import { ProtectedShell } from "@/components/protected-shell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  if (isStaffRole(user.role)) {
    redirect("/admin");
  }

  return (
    <AuthProvider initialUser={user}>
      <ProtectedShell role={user.role}>{children}</ProtectedShell>
    </AuthProvider>
  );
}
