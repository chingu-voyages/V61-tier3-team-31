import Link from "next/link";
import { CheckCircle2, Clock3, FileText, ListChecks, Lock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth/queries";
import { getParticipantOnboardingState } from "@/lib/onboarding/get-participant-onboarding-state";
import { requireMemberVoyage } from "@/lib/voyages/require-member-voyage";
import { cn } from "@/lib/utils";

const stages = ["Applied", "Under review", "Onboarding"] as const;

const statusLabels: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under review",
  accepted: "Accepted",
  rejected: "Not accepted",
  withdrawn: "Withdrawn",
};

type StepState = "done" | "active" | "upcoming";

function getStepStates(
  status: string,
  canStartOnboarding: boolean,
  isComplete: boolean,
): StepState[] {
  const appliedDone = status !== "draft";
  const reviewDone = status === "accepted" || status === "rejected" || status === "withdrawn";
  const reviewActive = status === "submitted" || status === "under_review";

  return [
    appliedDone ? "done" : "active",
    reviewDone ? "done" : reviewActive ? "active" : "upcoming",
    isComplete ? "done" : canStartOnboarding ? "active" : "upcoming",
  ];
}

function formatLabel(value: string | null) {
  if (!value) return "Not specified";

  return value.replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function getStatusTone(status: string) {
  if (status === "accepted") {
    return {
      iconWrap: "bg-primary/10 text-primary border-primary/20",
      badge: "bg-primary/10 text-primary border-primary/20",
      Icon: CheckCircle2,
    };
  }

  if (status === "rejected" || status === "withdrawn") {
    return {
      iconWrap: "bg-destructive/10 text-destructive border-destructive/20",
      badge: "bg-destructive/10 text-destructive border-destructive/20",
      Icon: Clock3,
    };
  }

  return {
    iconWrap: "bg-muted text-muted-foreground border-border",
    badge: "bg-muted text-muted-foreground border-border",
    Icon: Clock3,
  };
}

export default async function OverviewPage() {
  const user = await requireUser();
  const active = await requireMemberVoyage(user.id);
  const state = await getParticipantOnboardingState(user.id, active.id);
  const application = state.application;
  const applicationStatus = application?.status ?? "draft";
  const canStartOnboarding =
    state.kind === "preparing" || state.kind === "checklist" || state.kind === "complete";
  const isComplete = state.kind === "complete";
  const stepStates = getStepStates(applicationStatus, canStartOnboarding, isComplete);
  const statusLabel = statusLabels[applicationStatus] ?? "Draft";
  const tone = getStatusTone(applicationStatus);
  const StatusIcon = tone.Icon;

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-outfit text-[28px] font-medium tracking-tight text-foreground">
          Application Status
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {application
            ? `Track your application for ${application.voyageName}.`
            : "Your application progress will appear here."}
        </p>
      </div>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-4">
          <div
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-2xl border",
              tone.iconWrap,
            )}
          >
            <StatusIcon className="size-6" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-foreground">
              {application ? "Your Application" : "No application yet"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {application
                ? `Submitted for ${application.voyageName} — ${statusLabel}`
                : "Submit an application to start tracking your progress."}
            </p>
          </div>
        </div>

        <div className="mb-8 flex items-center gap-2">
          {stages.map((stage, index) => {
            const stepState = stepStates[index];
            const isDone = stepState === "done";
            const isActive = stepState === "active";

            return (
              <div key={stage} className="flex min-w-0 flex-1 items-center gap-2">
                <div
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    isDone && "bg-primary text-primary-foreground",
                    isActive && "border-2 border-primary bg-primary/10 text-primary",
                    !isDone && !isActive && "bg-muted text-muted-foreground",
                  )}
                >
                  {isDone ? <CheckCircle2 className="size-4" /> : index + 1}
                </div>
                <span
                  className={cn(
                    "truncate text-xs font-medium",
                    isDone && "text-primary",
                    isActive && "text-primary",
                    !isDone && !isActive && "text-muted-foreground",
                  )}
                >
                  {stage}
                </span>
                {index < stages.length - 1 && (
                  <div
                    className={cn(
                      "h-[2px] min-w-3 flex-1 rounded-full",
                      isDone ? "bg-primary" : "bg-border",
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {application ? (
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <div>
                <div className="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Applied Role
                </div>
                <div className="text-sm font-medium text-foreground">
                  {formatLabel(application.preferredRole)}
                </div>
              </div>
              <div>
                <div className="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Experience Level
                </div>
                <div className="text-sm font-medium text-foreground">
                  {formatLabel(application.experience)}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Submitted
                </div>
                <div className="text-sm font-medium text-foreground">
                  {application.submittedAt
                    ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
                        new Date(application.submittedAt),
                      )
                    : "Not submitted"}
                </div>
              </div>
              <div>
                <div className="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Status
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
                    tone.badge,
                  )}
                >
                  <StatusIcon className="size-3" />
                  {statusLabel}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/40 p-4">
            <FileText className="mt-0.5 size-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">No submitted application yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Complete the apply form to start your course journey.
              </p>
              <Link href="/app/apply" className={cn(buttonVariants(), "mt-4")}>
                Go to Apply
              </Link>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-xl border",
                canStartOnboarding
                  ? "border-primary/20 bg-primary/10 text-primary"
                  : "border-border bg-muted text-muted-foreground",
              )}
            >
              <ListChecks className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Onboarding</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {canStartOnboarding
                  ? state.kind === "preparing"
                    ? "Your checklist is being prepared."
                    : `${state.completedRequiredSteps} of ${state.requiredSteps} required steps complete.`
                  : "Available after your application is accepted and your participant enrollment is ready."}
              </p>
            </div>
          </div>

          {canStartOnboarding ? (
            <Link href="/app/onboarding" className={cn(buttonVariants())}>
              {isComplete ? "View onboarding" : "Continue onboarding"}
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
              <Lock className="size-3" />
              Locked
            </span>
          )}
        </div>
      </section>
    </div>
  );
}
