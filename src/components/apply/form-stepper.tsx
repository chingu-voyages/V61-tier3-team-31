"use client";

import { cn } from "@/lib/utils";

interface FormStepperProps {
  currentStep: number;
  steps: { label: string; description?: string }[];
}

export function FormStepper({ currentStep, steps }: FormStepperProps) {
  return (
    <nav className="w-full mb-10" aria-label="Form progress">
      <ol className="relative flex items-center justify-between">
        {/* Connecting line — background */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" aria-hidden="true" />

        {/* Connecting line — progress fill */}
        <div
          className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 ease-out"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            width: `${steps.length > 1 ? ((currentStep - 1) / (steps.length - 1)) * 100 : 0}%`,
          }}
          aria-hidden="true"
        />

        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <li key={step.label} className="relative z-10 flex flex-col items-center flex-1">
              {/* Step indicator */}
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300",
                  isActive &&
                    "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-110",
                  isCompleted && "bg-primary text-primary-foreground",
                  !isActive &&
                    !isCompleted &&
                    "bg-secondary text-muted-foreground border border-border",
                )}
                aria-current={isActive ? "step" : undefined}
                aria-label={`Step ${stepNumber}: ${step.label}${isCompleted ? " (completed)" : isActive ? " (current)" : ""}`}
              >
                {isCompleted ? (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <span>{stepNumber}</span>
                )}
              </div>

              {/* Step label */}
              <div className="mt-3 text-center max-w-[90px]">
                <p
                  className={cn(
                    "text-xs font-semibold transition-colors duration-300",
                    isActive && "text-primary",
                    isCompleted && "text-primary",
                    !isActive && !isCompleted && "text-muted-foreground",
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5 line-clamp-1">
                    {step.description}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
