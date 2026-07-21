"use client";

import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "../ui/button";

interface FormNavigationProps {
  currentStep: number;
  isLoading: boolean;
  onBack: () => void;
  onContinue: () => void | Promise<void>;
  onSubmit: () => void | Promise<void>;
  isLastStep: boolean;
}

export function FormNavigation({
  currentStep,
  isLoading,
  onBack,
  onContinue,
  onSubmit,
  isLastStep,
}: FormNavigationProps) {
  const isFirstStep = currentStep === 1;

  const handleBack = () => {
    if (isFirstStep) {
      window.history.back();
      return;
    }
    onBack();
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 w-full">
      <Button
        variant="outline"
        size="lg"
        onClick={handleBack}
        disabled={isLoading}
        className="w-full sm:w-auto group"
      >
        <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
        {isFirstStep ? "Cancel" : "Back"}
      </Button>

      <Button
        size="lg"
        onClick={isLastStep ? onSubmit : onContinue}
        disabled={isLoading}
        className="w-full sm:w-auto group"
      >
        {isLoading ? (
          <>
            <span className="size-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            Submitting...
          </>
        ) : isLastStep ? (
          <>
            <Sparkles className="size-4" />
            Submit Application
          </>
        ) : (
          <>
            Continue
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </>
        )}
      </Button>
    </div>
  );
}
