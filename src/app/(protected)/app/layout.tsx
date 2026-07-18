import { redirect } from "next/navigation";
import { AuthProvider } from "@/lib/auth/auth-context";
import { requireUser } from "@/lib/auth/queries";
import { hasSubmittedApplication } from "@/lib/auth/applications";
import { isStaffRole } from "@/lib/auth/navigation";
import { ApplyGate } from "@/components/apply-gate";
import { ProtectedShell } from "@/components/protected-shell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  if (isStaffRole(user.role)) {
    redirect("/admin");
  }

  const hasApplication = await hasSubmittedApplication(user.id);

  return (
    <AuthProvider initialUser={user}>
      {/* <ApplyGate hasSubmittedApplication={hasApplication}> */}
      <ProtectedShell role={user.role}>{children}</ProtectedShell>
      {/* </ApplyGate> */}
    </AuthProvider>
  );
}
