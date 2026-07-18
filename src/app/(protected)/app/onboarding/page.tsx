import { CheckCircle2, Clock3, ListChecks } from "lucide-react";
import { requireUser } from "@/lib/auth/queries";
import { getParticipantOnboardingState } from "@/lib/onboarding/get-participant-onboarding-state";
import { OnboardingClient } from "./onboarding-client";

function OnboardingStatusCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <section className="max-w-2xl rounded-2xl border border-border bg-card p-8 shadow-sm">
      <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
    </section>
  );
}

const waitingCopy = {
  error: {
    title: "We could not load onboarding",
    description:
      "Please refresh the page and try again. If this keeps happening, contact your course organizer.",
    icon: <Clock3 className="size-6" />,
  },
  no_application: {
    title: "Complete your application first",
    description:
      "Your onboarding checklist will be available after you submit an application and are accepted.",
    icon: <ListChecks className="size-6" />,
  },
  under_review: {
    title: "Your application is under review",
    description: "Your onboarding checklist will appear once you are accepted.",
    icon: <Clock3 className="size-6" />,
  },
  pending_enrollment: {
    title: "Your participant access is being prepared",
    description:
      "Your application was accepted. Your onboarding checklist will appear when your course enrollment is ready.",
    icon: <Clock3 className="size-6" />,
  },
  preparing: {
    title: "Your onboarding checklist is being prepared",
    description: "Please check back soon. Your course preparation steps will appear here.",
    icon: <ListChecks className="size-6" />,
  },
  rejected: {
    title: "Onboarding is unavailable",
    description:
      "Onboarding becomes available only to accepted participants with an active course enrollment.",
    icon: <CheckCircle2 className="size-6" />,
  },
  withdrawn: {
    title: "Onboarding is unavailable",
    description:
      "Onboarding becomes available only to accepted participants with an active course enrollment.",
    icon: <CheckCircle2 className="size-6" />,
  },
} as const;

export default async function OnboardingPage() {
  const user = await requireUser();
  const state = await getParticipantOnboardingState(user.id);

  if (state.kind === "checklist" || state.kind === "complete") {
    return (
      <OnboardingClient
        enrollmentId={state.enrollment.id}
        initialSteps={state.steps}
        discordInviteUrl={process.env.DISCORD_INVITE_URL ?? null}
      />
    );
  }

  const copy = waitingCopy[state.kind];
  return <OnboardingStatusCard {...copy} />;
}
