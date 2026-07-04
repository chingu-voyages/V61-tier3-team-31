"use client";

import { motion } from "motion/react";
import { CheckCircle2, User, Briefcase, Code, Clock } from "lucide-react";

interface FormStepperProps {
  currentStep: number;
  steps: { label: string; description?: string }[];
}

const STEP_ICONS = [User, Briefcase, Code, Clock];

export function FormStepper({ currentStep, steps }: FormStepperProps) {
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full flex flex-col gap-4" aria-label="Form progress">
      {/* Step dots with labels */}
      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;
          const Icon = STEP_ICONS[i];

          return (
            <div key={step.label} className="flex items-center flex-1 last:flex-none">
              {/* Step circle + label */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    isCompleted
                      ? "bg-nexus-green text-[#0b0c10]"
                      : isActive
                        ? "bg-[#0b0c10] border-2 border-nexus-green text-nexus-green shadow-[0_0_15px_rgba(119,207,151,0.3)]"
                        : "bg-white/5 border border-white/10 text-white/30"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={`text-xs font-medium whitespace-nowrap transition-colors duration-300 ${
                    isActive ? "text-white" : isCompleted ? "text-nexus-green" : "text-white/30"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connecting line */}
              {i < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-3 mt-[-20px]">
                  <div className="w-full h-full rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-nexus-green"
                      initial={{ width: 0 }}
                      animate={{ width: isCompleted ? "100%" : "0%" }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-nexus-green rounded-full relative"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-white/20 w-full animate-[gradient-sweep_2s_linear_infinite]" />
        </motion.div>
      </div>
    </div>
  );
}
