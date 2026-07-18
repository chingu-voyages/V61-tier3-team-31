import { redirect } from "next/navigation";
import { AuthProvider } from "@/lib/auth/auth-context";
import { requireUser } from "@/lib/auth/queries";
import { isStaffRole } from "@/lib/auth/navigation";
import { getParticipantOnboardingState } from "@/lib/onboarding/get-participant-onboarding-state";
import { resolveActiveVoyage } from "@/lib/voyages/resolve-active-voyage";
import { ApplyGate } from "@/components/apply-gate";
import { ProtectedShell } from "@/components/protected-shell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  if (isStaffRole(user.role)) {
    redirect("/admin");
  }

  const { active, voyages } = await resolveActiveVoyage(user.id);
  const needsApply = active?.relation === "open_apply";
  const participantStage =
    active?.relation === "member"
      ? (await getParticipantOnboardingState(user.id, active.id)).participantStage
      : active?.relation === "open_apply"
        ? "apply_only"
        : undefined;

  return (
    <AuthProvider initialUser={user}>
      <ApplyGate needsApply={needsApply}>
        <ProtectedShell
          role={user.role}
          status={participantStage}
          voyages={voyages}
          activeVoyageId={active?.id ?? null}
        >
          {children}
        </ProtectedShell>
      </ApplyGate>
    </AuthProvider>
  );
}
