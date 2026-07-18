import { redirect } from "next/navigation";
import { AuthProvider } from "@/lib/auth/auth-context";
import { requireUser } from "@/lib/auth/queries";
import { hasSubmittedApplication } from "@/lib/auth/applications";
import { isStaffRole } from "@/lib/auth/navigation";
import { getParticipantOnboardingState } from "@/lib/onboarding/get-participant-onboarding-state";
import { ApplyGate } from "@/components/apply-gate";
import { ProtectedShell } from "@/components/protected-shell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  if (isStaffRole(user.role)) {
    redirect("/admin");
  }

  const hasApplication = await hasSubmittedApplication(user.id);
  const participantStage = hasApplication
    ? (await getParticipantOnboardingState(user.id)).participantStage
    : undefined;

  return (
    <AuthProvider initialUser={user}>
      <ApplyGate hasSubmittedApplication={hasApplication}>
        <ProtectedShell role={user.role} status={participantStage}>
          {children}
        </ProtectedShell>
      </ApplyGate>
    </AuthProvider>
  );
}
