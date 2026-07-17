"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  Loader2,
  UserRound,
  UsersRound,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { OnboardingStep } from "@/lib/onboarding/get-participant-onboarding-state";
import { getRequiredProgress } from "@/lib/onboarding/progress";
import { toggleOnboardingProgress } from "./actions";

type OnboardingClientProps = {
  enrollmentId: string;
  initialSteps: OnboardingStep[];
  discordInviteUrl: string | null;
};

export function OnboardingClient({
  enrollmentId,
  initialSteps,
  discordInviteUrl,
}: OnboardingClientProps) {
  const [steps, setSteps] = useState(initialSteps);
  const [pendingStepIds, setPendingStepIds] = useState<Set<string>>(() => new Set());
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const { requiredSteps, completedRequiredSteps, percentComplete, isComplete } =
    getRequiredProgress(steps);

  function toggleStep(step: OnboardingStep, completed: boolean) {
    if (pendingStepIds.has(step.id)) {
      return;
    }

    setError(null);
    setPendingStepIds((current) => new Set(current).add(step.id));
    setSteps((current) => current.map((s) => (s.id === step.id ? { ...s, completed } : s)));

    startTransition(async () => {
      const result = await toggleOnboardingProgress({
        enrollmentId,
        stepId: step.id,
        completed,
      });

      if ("error" in result) {
        setSteps((current) =>
          current.map((s) => (s.id === step.id ? { ...s, completed: step.completed } : s)),
        );
        setError(result.error);
      }

      setPendingStepIds((current) => {
        const next = new Set(current);
        next.delete(step.id);
        return next;
      });
    });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Your onboarding progress</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              Get ready for your course
            </h1>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            {percentComplete}% complete
          </span>
        </div>

        <Progress value={percentComplete} aria-label="Onboarding progress" />
        <p className="mt-3 text-sm text-muted-foreground">
          {completedRequiredSteps} of {requiredSteps} required steps complete
        </p>
      </section>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {isComplete && (
        <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/10 p-4 text-sm text-primary">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
          <div>
            <p className="font-semibold">You&apos;re ready for the course.</p>
            <p className="mt-1 text-muted-foreground">
              All required onboarding steps are complete.
            </p>
          </div>
        </div>
      )}

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <fieldset>
          <legend className="text-lg font-semibold">Your checklist</legend>
          <div className="mt-4 divide-y divide-border">
            {steps.map((step) => {
              const isSaving = pendingStepIds.has(step.id);

              return (
                <label
                  key={step.id}
                  className="flex cursor-pointer items-start gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <Checkbox
                    checked={step.completed}
                    disabled={isSaving}
                    onCheckedChange={(checked) => toggleStep(step, checked === true)}
                    aria-label={`Mark ${step.title} as ${step.completed ? "incomplete" : "complete"}`}
                    className="mt-1"
                  />
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-sm font-semibold ${
                        step.completed ? "text-muted-foreground line-through" : "text-foreground"
                      }`}
                    >
                      {step.title}
                    </span>
                    {step.description ? (
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {step.description}
                      </span>
                    ) : null}
                  </span>
                  {isSaving ? (
                    <Loader2 className="mt-1 size-4 animate-spin text-muted-foreground" />
                  ) : null}
                  {step.completed && !isSaving ? (
                    <CheckCircle2 className="mt-1 size-4 text-primary" />
                  ) : null}
                </label>
              );
            })}
          </div>
        </fieldset>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Resources</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/app/profile" className={cn(buttonVariants({ variant: "outline" }))}>
            <UserRound className="size-4" />
            Open profile
          </Link>
          <Link href="/app/voyage-guide" className={cn(buttonVariants({ variant: "outline" }))}>
            <ExternalLink className="size-4" />
            Open Course Guide
          </Link>
          {discordInviteUrl ? (
            <a
              href={discordInviteUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              <UsersRound className="size-4" />
              Join Discord
            </a>
          ) : (
            <Button variant="outline" disabled>
              <UsersRound className="size-4" />
              Discord invite coming soon
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
