"use client";

import { useState } from "react";
import { FormProvider } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";
import { useApplyForm } from "@/hooks/use-apply-form";
import { ApplySidebar } from "@/components/apply/apply-sidebar";
import { FormStepper } from "@/components/apply/form-stepper";
import { FormNavigation } from "@/components/apply/form-navigation";

import StepAccount from "@/app/(dashboard)/apply/steps/step-account";
import StepRoleExperience from "@/app/(dashboard)/apply/steps/step-role-experience";
import StepSkills from "@/app/(dashboard)/apply/steps/step-skills";
import StepAvailability from "@/app/(dashboard)/apply/steps/step-availability";
import StepMotivation from "@/app/(dashboard)/apply/steps/step-motivation";
import StepReview from "@/app/(dashboard)/apply/steps/step-review";
import StepSuccess from "@/app/(dashboard)/apply/steps/step-success";

const steps = [
  { label: "Account", description: "Basic details" },
  { label: "Role", description: "What you do" },
  { label: "Skills", description: "Tech stack" },
  { label: "Availability", description: "Schedule" },
  { label: "Motivation", description: "Why join" },
  { label: "Review", description: "Submit" },
];

export default function ApplyPage() {
  const { form, currentStep, isLoading, nextStep, prevStep, submit } = useApplyForm();

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    const data = await submit();
    if (data) {
      console.log("Form submitted:", data);
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return <StepSuccess />;
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] w-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-[1200px] flex flex-col lg:flex-row bg-white dark:bg-[#0b0c10]/40 rounded-2xl overflow-hidden glass-panel min-h-[700px]">
        {/* Left Sidebar - Desktop only */}
        <ApplySidebar currentStep={currentStep} />

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-white dark:bg-[#1a1b24]/40">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex-1 flex flex-col h-full"
            >
              {/* Mobile top stepper */}
              <div className="lg:hidden p-6 border-b border-border bg-card/50 backdrop-blur-md">
                <FormStepper currentStep={currentStep} steps={steps} />
              </div>

              {/* Form step content with animation */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 sm:p-10 lg:p-12 relative">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="h-full"
                  >
                    {currentStep === 1 && <StepAccount />}
                    {currentStep === 2 && <StepRoleExperience />}
                    {currentStep === 3 && <StepSkills />}
                    {currentStep === 4 && <StepAvailability />}
                    {currentStep === 5 && <StepMotivation />}
                    {currentStep === 6 && <StepReview />}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer navigation */}
              <div className="p-6 sm:px-10 lg:px-12 bg-white/50 dark:bg-black/20 backdrop-blur-md border-t border-slate-200 dark:border-white/5">
                <FormNavigation
                  currentStep={currentStep}
                  isLoading={isLoading}
                  onBack={prevStep}
                  onContinue={nextStep}
                  onSubmit={handleSubmit}
                  isLastStep={currentStep === 6}
                />
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
