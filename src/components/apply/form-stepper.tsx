"use client";

import { motion } from "motion/react";
import {
  CheckCircle2,
  User,
  Briefcase,
  Code,
  Clock,
  MessageSquare,
  CheckCircle,
} from "lucide-react";

interface FormStepperProps {
  currentStep: number;
  steps: { label: string; description?: string }[];
}

const STEP_ICONS = [User, Briefcase, Code, Clock, MessageSquare, CheckCircle];

export function FormStepper({ currentStep, steps }: FormStepperProps) {
  return (
    <div className="w-full flex flex-col" aria-label="Form progress">
      {steps.map((step, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;
        const Icon = STEP_ICONS[i];
        const isLast = i === steps.length - 1;

        return (
          <div key={step.label} className="flex items-stretch">
            {/* Step circle + vertical line */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shrink-0 ${
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
              {!isLast && (
                <div className="w-0.5 flex-1 my-2 rounded-full bg-white/10 min-h-[24px]">
                  <motion.div
                    className="w-full rounded-full bg-nexus-green"
                    initial={{ height: 0 }}
                    animate={{ height: isCompleted ? "100%" : "0%" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              )}
            </div>

            {/* Step label + description */}
            <div className={`pl-4 pb-8 ${isLast ? "pb-0" : ""}`}>
              <span
                className={`text-sm font-medium transition-colors duration-300 block ${
                  isActive ? "text-white" : isCompleted ? "text-nexus-green" : "text-white/30"
                }`}
              >
                {step.label}
              </span>
              {step.description && (
                <span className="text-xs text-white/40 block mt-0.5">{step.description}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
