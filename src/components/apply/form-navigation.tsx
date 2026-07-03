"use client";

import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={isFirstStep ? () => window.history.back() : onBack}
        className="gap-2 text-muted-foreground hover:text-foreground px-4 py-2.5 h-auto rounded-xl"
        disabled={isLoading}
      >
        <ArrowLeft className="h-4 w-4" />
        {isFirstStep ? "Cancel" : "Back"}
      </Button>

      {isLastStep ? (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all duration-200 px-6 py-2.5 h-auto rounded-xl font-semibold"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Submit Application
            </>
          )}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onContinue}
          disabled={isLoading}
          className="gap-2 bg-foreground text-background hover:bg-foreground/90 hover:shadow-lg active:scale-[0.98] transition-all duration-200 px-6 py-2.5 h-auto rounded-xl font-semibold"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
