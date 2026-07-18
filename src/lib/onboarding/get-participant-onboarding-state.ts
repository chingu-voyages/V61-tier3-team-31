import { cache } from "react";
import type { Database } from "@/types/database";
import { createClient } from "@/lib/supabase/server";
import { getRequiredProgress } from "@/lib/onboarding/progress";

type ApplicationStatus = Database["public"]["Enums"]["application_status"];
type EnrollmentStatus = Database["public"]["Enums"]["enrollment_status"];

export type ParticipantStage = "applicant" | "accepted" | "participant" | "inactive";

export type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  position: number;
  required: boolean;
  completed: boolean;
};

type ApplicationSummary = {
  id: string;
  status: ApplicationStatus;
  voyageId: string;
  voyageName: string;
  voyageNumber: number;
  preferredRole: string | null;
  experience: string | null;
  submittedAt: string | null;
};

type EnrollmentSummary = {
  id: string;
  status: EnrollmentStatus;
};

type WaitingState = {
  kind:
    | "error"
    | "no_application"
    | "under_review"
    | "rejected"
    | "withdrawn"
    | "pending_enrollment";
  application: ApplicationSummary | null;
  participantStage: ParticipantStage;
};

type ChecklistState = {
  kind: "preparing" | "checklist" | "complete";
  application: ApplicationSummary;
  enrollment: EnrollmentSummary;
  participantStage: ParticipantStage;
  steps: OnboardingStep[];
  completedRequiredSteps: number;
  requiredSteps: number;
  percentComplete: number;
};

export type ParticipantOnboardingState = WaitingState | ChecklistState;

function waiting(
  kind: WaitingState["kind"],
  application: ApplicationSummary | null = null,
  participantStage: ParticipantStage = "applicant",
): WaitingState {
  return { kind, application, participantStage };
}

function getParticipantStage(
  applicationStatus: ApplicationStatus,
  enrollmentStatus: EnrollmentStatus,
): ParticipantStage {
  if (enrollmentStatus === "active") return "participant";

  if (
    enrollmentStatus === "inactive" ||
    enrollmentStatus === "completed" ||
    enrollmentStatus === "withdrawn"
  ) {
    return "inactive";
  }

  if (applicationStatus === "accepted" && enrollmentStatus === "invited") {
    return "accepted";
  }

  return "applicant";
}

function toApplicationSummary(
  application: {
    id: string;
    status: ApplicationStatus;
    voyage_id: string;
    preferred_role: string | null;
    experience: string | null;
    submitted_at: string | null;
  },
  voyage: { name: string; number: number } | null,
): ApplicationSummary {
  return {
    id: application.id,
    status: application.status,
    voyageId: application.voyage_id,
    voyageName: voyage?.name ?? "Your course",
    voyageNumber: voyage?.number ?? 0,
    preferredRole: application.preferred_role,
    experience: application.experience,
    submittedAt: application.submitted_at,
  };
}

function mergeStepsWithProgress(
  steps: Array<{
    id: string;
    title: string;
    description: string;
    position: number;
    required: boolean;
  }>,
  progress: Array<{ step_id: string; status: string }>,
): OnboardingStep[] {
  const completedStepIds = new Set(
    progress.filter((item) => item.status === "completed").map((item) => item.step_id),
  );

  return steps.map((step) => ({
    ...step,
    completed: completedStepIds.has(step.id),
  }));
}

export const getParticipantOnboardingState = cache(async function getParticipantOnboardingState(
  userId: string,
  voyageId?: string | null,
): Promise<ParticipantOnboardingState> {
  const supabase = await createClient();

  let applicationQuery = supabase
    .from("applications")
    .select("id, status, voyage_id, preferred_role, experience, submitted_at")
    .eq("applicant_id", userId)
    .neq("status", "draft");

  if (voyageId) {
    applicationQuery = applicationQuery.eq("voyage_id", voyageId);
  } else {
    applicationQuery = applicationQuery
      .order("submitted_at", { ascending: false, nullsFirst: false })
      .limit(1);
  }

  const { data: application, error: applicationError } = await applicationQuery.maybeSingle();

  if (applicationError) return waiting("error");
  if (!application) return waiting("no_application");

  const { data: voyage, error: voyageError } = await supabase
    .from("voyages")
    .select("name, number")
    .eq("id", application.voyage_id)
    .maybeSingle();

  if (voyageError) return waiting("error");

  const applicationSummary = toApplicationSummary(application, voyage);

  if (application.status === "rejected") {
    return waiting("rejected", applicationSummary);
  }

  if (application.status === "withdrawn") {
    return waiting("withdrawn", applicationSummary);
  }

  if (application.status !== "accepted") {
    return waiting("under_review", applicationSummary);
  }

  const { data: enrollment, error: enrollmentError } = await supabase
    .from("enrollments")
    .select("id, status")
    .eq("application_id", application.id)
    .maybeSingle();

  if (enrollmentError) return waiting("error", applicationSummary);
  if (!enrollment) return waiting("pending_enrollment", applicationSummary);

  const participantStage = getParticipantStage(application.status, enrollment.status);

  if (participantStage === "inactive") {
    return waiting("withdrawn", applicationSummary, participantStage);
  }

  const [{ data: steps, error: stepsError }, { data: progress, error: progressError }] =
    await Promise.all([
      supabase
        .from("onboarding_steps")
        .select("id, title, description, position, required")
        .eq("voyage_id", application.voyage_id)
        .eq("active", true)
        .order("position"),
      supabase
        .from("onboarding_progress")
        .select("step_id, status")
        .eq("enrollment_id", enrollment.id),
    ]);

  if (stepsError || progressError) {
    return waiting("error", applicationSummary, participantStage);
  }

  const onboardingSteps = mergeStepsWithProgress(steps ?? [], progress ?? []);
  const progressSummary = getRequiredProgress(onboardingSteps);

  const checklistState = {
    application: applicationSummary,
    enrollment: { id: enrollment.id, status: enrollment.status },
    participantStage,
    steps: onboardingSteps,
    completedRequiredSteps: progressSummary.completedRequiredSteps,
    requiredSteps: progressSummary.requiredSteps,
    percentComplete: progressSummary.percentComplete,
  };

  if (onboardingSteps.length === 0) {
    return { kind: "preparing", ...checklistState };
  }

  if (progressSummary.isComplete) {
    return { kind: "complete", ...checklistState };
  }

  return { kind: "checklist", ...checklistState };
});
