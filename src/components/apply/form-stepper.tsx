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
    <nav className="w-full" aria-label="Application progress" role="navigation">
      {/* Progress bar (mobile: shown, sm+: hidden) */}
      <div className="sm:hidden mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-xs font-semibold text-white">{steps[currentStep - 1].label}</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-nexus-green/80 to-nexus-green"
            initial={{ width: 0 }}
            animate={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        {/* Mobile step icons */}
        <div className="flex items-center justify-center gap-2 mt-3">
          {steps.map((step, i) => {
            const stepNum = i + 1;
            const isCompleted = stepNum < currentStep;
            const isActive = stepNum === currentStep;
            const Icon = STEP_ICONS[i];

            return (
              <div key={step.label} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? "bg-nexus-green text-[#0b0c10]"
                      : isActive
                        ? "bg-nexus-green/15 border border-nexus-green/60 text-nexus-green"
                        : "bg-white/5 border border-white/8 text-white/20"
                  }`}
                  aria-current={isActive ? "step" : undefined}
                  aria-label={`${step.label}${isCompleted ? " (completed)" : isActive ? " (current)" : ""}`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3 h-3" strokeWidth={2.5} />
                  ) : (
                    <Icon className="w-3 h-3" />
                  )}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-3 h-px bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-nexus-green"
                      initial={{ width: 0 }}
                      animate={{ width: isCompleted ? "100%" : "0%" }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop stepper (hidden on mobile, shown sm+) */}
      <ol
        className="hidden sm:grid"
        style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}
      >
        {steps.map((step, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;
          const Icon = STEP_ICONS[i];

          return (
            <li
              key={step.label}
              className="flex flex-col items-center relative"
              aria-current={isActive ? "step" : undefined}
            >
              {/* Connector line — positioned behind the circle, connecting to next step */}
              {i < steps.length - 1 && (
                <div
                  className="absolute top-[18px] h-0.5 rounded-full bg-white/8 overflow-hidden"
                  style={{ left: "50%", right: "-50%" }}
                  aria-hidden="true"
                >
                  <motion.div
                    className="h-full rounded-full bg-nexus-green"
                    initial={{ width: 0 }}
                    animate={{ width: isCompleted ? "100%" : "0%" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              )}

              {/* Circle */}
              <div className="relative z-10">
                {/* Active glow ring */}
                {isActive && (
                  <motion.div
                    className="absolute -inset-1.5 rounded-full bg-nexus-green/15 blur-sm"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    aria-hidden="true"
                  />
                )}
                <motion.div
                  className={`relative w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300 ${
                    isCompleted
                      ? "bg-nexus-green text-[#0b0c10]"
                      : isActive
                        ? "bg-[#0b0c10] border-2 border-nexus-green text-nexus-green shadow-[0_0_20px_rgba(119,207,151,0.25)]"
                        : "bg-white/5 border border-white/10 text-white/30"
                  }`}
                  initial={false}
                  animate={isCompleted ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                </motion.div>
              </div>

              {/* Label */}
              <span
                className={`text-[11px] font-medium whitespace-nowrap mt-2 transition-colors duration-300 ${
                  isActive ? "text-white" : isCompleted ? "text-nexus-green/80" : "text-white/25"
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
