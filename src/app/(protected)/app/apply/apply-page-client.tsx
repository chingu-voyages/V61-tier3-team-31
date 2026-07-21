"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";
import { useApplyForm, type FormStep } from "@/hooks/use-apply-form";
import { FormStepper } from "@/components/apply/form-stepper";
import { FormNavigation } from "@/components/apply/form-navigation";
import { ProfileSyncDialog } from "@/components/apply/profile-sync-dialog";

import StepRoleExperience from "@/app/(protected)/app/apply/steps/step-role-experience";
import StepSkills from "@/app/(protected)/app/apply/steps/step-skills";
import StepAvailability from "@/app/(protected)/app/apply/steps/step-availability";
import StepMotivation from "@/app/(protected)/app/apply/steps/step-motivation";
import StepReview from "@/app/(protected)/app/apply/steps/step-review";
import type { OpenVoyage } from "@/lib/applications/voyages";
import type { ApplyProfileDraft, ProfileSyncDiff } from "@/lib/applications/profile-sync";
import {
  prepareProfileSyncFromApplication,
  syncProfileFromApplication,
} from "@/app/(protected)/app/apply/actions";
import type { ApplyFormData } from "@/lib/schemas/apply-schema";
import { Card } from "@/components/ui/card";

const steps = [
  { label: "Role & Experience", description: "Your profile basics" },
  { label: "Skills", description: "Your tech stack" },
  { label: "Availability", description: "When you can work" },
  { label: "Motivation", description: "Why you want to join" },
  { label: "Review", description: "Confirm & submit" },
];

export function ApplyPageClient({
  popularSkills,
  openVoyages,
  initialProfileDraft,
  preferredVoyageId = null,
}: {
  popularSkills: string[];
  openVoyages: OpenVoyage[];
  initialProfileDraft: ApplyProfileDraft;
  preferredVoyageId?: string | null;
}) {
  const router = useRouter();
  const { form, currentStep, isLoading, submitError, nextStep, prevStep, submit, setStep } =
    useApplyForm(initialProfileDraft, preferredVoyageId);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [profileSyncCandidate, setProfileSyncCandidate] = useState<ProfileSyncDiff[] | null>(null);
  const [profileSyncLoading, setProfileSyncLoading] = useState(false);
  const [profileSyncError, setProfileSyncError] = useState("");
  const [profileSyncWarning, setProfileSyncWarning] = useState("");
  const [submittedApplication, setSubmittedApplication] = useState<ApplyFormData | null>(null);

  const handleSubmit = async () => {
    setProfileSyncError("");
    setProfileSyncWarning("");

    const data = await submit();
    if (data) {
      setSubmittedApplication(data);

      const syncPreparation = await prepareProfileSyncFromApplication(data);

      if ("error" in syncPreparation) {
        setProfileSyncWarning(syncPreparation.error);
        finalizeSuccess();
        return;
      }

      if (syncPreparation.syncCandidate) {
        setProfileSyncCandidate(syncPreparation.syncCandidate);
        return;
      }

      finalizeSuccess();
    }
  };

  const finalizeSuccess = () => {
    router.refresh();
    setProfileSyncCandidate(null);
    setProfileSyncError("");
    setIsSubmitted(true);
  };

  const handleProfileSyncConfirm = async () => {
    if (!submittedApplication) {
      finalizeSuccess();
      return;
    }

    setProfileSyncLoading(true);
    setProfileSyncError("");
    try {
      const result = await syncProfileFromApplication(
        submittedApplication,
        profileSyncCandidate?.map((difference) => difference.field),
      );

      if ("error" in result) {
        setProfileSyncError(result.error);
        return;
      }

      finalizeSuccess();
    } finally {
      setProfileSyncLoading(false);
    }
  };

  const handleProfileSyncSkip = () => {
    finalizeSuccess();
  };

  if (isSubmitted) {
    return (
      <div className="w-full min-h-full flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="glass-panel rounded-3xl p-12 sm:p-16 max-w-lg w-full text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="relative mx-auto w-24 h-24 mb-8"
          >
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            <div className="absolute inset-0 rounded-full border-2 border-primary/30" />
            <div className="relative w-24 h-24 rounded-full bg-primary/15 border border-primary/40 flex items-center justify-center shadow-[0_0_40px_rgba(119,207,151,0.25)]">
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
                className="w-10 h-10 text-primary"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
                />
              </motion.svg>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <h2 className="text-3xl sm:text-4xl font-outfit font-bold text-foreground tracking-tight mb-3">
              Application Submitted!
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto mb-10">
              Thank you for applying to join our community. We&apos;ll review your application and
              get back to you within 48 hours.
            </p>
            {profileSyncWarning && (
              <div className="mb-8 rounded-2xl border border-amber-400/25 bg-amber-400/10 p-4 text-left text-sm text-amber-100">
                <p className="font-semibold text-amber-50">Profile update needs attention</p>
                <p className="mt-1 text-amber-100/80">{profileSyncWarning}</p>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="grid grid-cols-2 gap-3 mb-10"
          >
            <div className="rounded-xl bg-muted border border-border p-4">
              <p className="text-xs text-muted-foreground mb-1">Response Time</p>
              <p className="text-sm font-semibold text-foreground">~48 hours</p>
            </div>
            <div className="rounded-xl bg-muted border border-border p-4">
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <p className="text-sm font-semibold text-primary flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Pending Review
              </p>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => (window.location.href = "/app/overview")}
            className="cursor-pointer w-full py-3 rounded-xl bg-muted border border-border text-muted-foreground text-sm font-medium hover:bg-accent hover:text-foreground transition-all"
          >
            Back to Workspace
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <ProfileSyncDialog
        open={profileSyncCandidate !== null}
        differences={profileSyncCandidate ?? []}
        isLoading={profileSyncLoading}
        error={profileSyncError}
        onConfirm={handleProfileSyncConfirm}
        onSkip={handleProfileSyncSkip}
      />

      <div className="w-full min-h-full flex items-center justify-center p-4 text-foreground">
        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-outfit font-bold text-foreground tracking-tight mb-2">
              Apply for Course
            </h1>
            <p className="text-muted-foreground text-sm">
              Complete the form below to apply for the next Cohorix course cohort.
            </p>
          </motion.div>

          <div className="mb-8">
            <FormStepper currentStep={currentStep} steps={steps} />
          </div>

          <FormProvider {...form}>
            <Card>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="px-8 sm:px-10">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {currentStep === 1 && <StepRoleExperience />}
                    {currentStep === 2 && <StepSkills popularSkills={popularSkills} />}
                    {currentStep === 3 && <StepAvailability voyages={openVoyages} />}
                    {currentStep === 4 && <StepMotivation />}
                    {currentStep === 5 && (
                      <StepReview
                        onEditStep={setStep as (step: FormStep) => void}
                        error={submitError}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="mt-8">
                  <FormNavigation
                    currentStep={currentStep}
                    isLoading={isLoading}
                    onBack={prevStep}
                    onContinue={nextStep}
                    onSubmit={handleSubmit}
                    isLastStep={currentStep === 5}
                  />
                </div>
              </form>
            </Card>
          </FormProvider>
        </div>
      </div>
    </>
  );
}
