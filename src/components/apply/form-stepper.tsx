"use client";

import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

interface FormStepperProps {
  currentStep: number;
  steps: { label: string; description?: string }[];
}

export function FormStepper({ currentStep, steps }: FormStepperProps) {
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;
  const currentStepData = steps[currentStep - 1];

  return (
    <div className="w-full flex flex-col gap-3" aria-label="Form progress">
      <div className="flex items-center justify-between text-sm">
        <div className="flex flex-col">
          <span className="font-outfit font-semibold text-foreground flex items-center gap-2">
            Step {currentStep} of {steps.length}
            {currentStep === steps.length && <CheckCircle2 className="w-4 h-4 text-nexus-green" />}
          </span>
          <span className="text-xs text-muted-foreground mt-0.5">
            {currentStepData?.label} — {currentStepData?.description}
          </span>
        </div>
        <span className="text-xs font-medium text-nexus-green bg-nexus-green/10 px-2 py-1 rounded-md">
          {Math.round(progressPercentage)}%
        </span>
      </div>

      <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-nexus-green rounded-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-white/20 w-full animate-[gradient-sweep_2s_linear_infinite]" />
        </motion.div>
      </div>
    </div>
  );
}
