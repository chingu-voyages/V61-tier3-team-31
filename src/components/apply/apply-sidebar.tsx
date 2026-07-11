import { CheckCircle2 } from "lucide-react";
import type { FormStep } from "@/hooks/use-apply-form";

interface ApplySidebarProps {
  currentStep: FormStep;
}

const steps = [
  { id: 1, title: "Role & Experience", description: "Your profile basics" },
  { id: 2, title: "Skills", description: "Your expertise" },
  { id: 3, title: "Availability", description: "Your schedule" },
  { id: 4, title: "Motivation", description: "Why you want to join" },
  { id: 5, title: "Review", description: "Confirm your application" },
];

export function ApplySidebar({ currentStep }: ApplySidebarProps) {
  return (
    <div className="relative hidden lg:flex flex-col w-[340px] shrink-0 bg-[#0b0c10] border-r border-white/5 text-white overflow-hidden p-10">
      <div className="relative z-10 flex flex-col h-full pl-2">
        {/* Header */}
        <div className="mb-16 mt-4">
          <h2 className="text-[28px] leading-tight font-outfit font-bold mb-4 tracking-tight text-white">
            Dev Community
          </h2>
          <p className="text-sm text-slate-400/90 leading-relaxed max-w-[240px]">
            Join thousands of developers and build something amazing together.
          </p>
        </div>

        {/* Vertical Stepper - The Timeline */}
        <div className="flex-1 flex flex-col">
          <nav aria-label="Progress">
            <ol role="list" className="space-y-8">
              {steps.map((step, stepIdx) => {
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;

                return (
                  <li key={step.title} className="relative">
                    {/* Connecting Line */}
                    {stepIdx !== steps.length - 1 && (
                      <div
                        className={`absolute left-[15px] top-[36px] -ml-px h-[calc(100%+8px)] w-[2px] rounded-full transition-colors duration-500 ${
                          isCompleted ? "bg-nexus-green" : "bg-white/5"
                        }`}
                        aria-hidden="true"
                      />
                    )}

                    <div className="group flex items-start">
                      {/* Step Indicator */}
                      <span className="flex items-center h-8">
                        <span
                          className={`relative z-10 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-500 border-2 ${
                            isActive
                              ? "bg-[#0b0c10] border-nexus-green shadow-[0_0_15px_rgba(119,207,151,0.3)]"
                              : isCompleted
                                ? "bg-nexus-green border-nexus-green"
                                : "bg-[#0b0c10] border-white/10"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-[#0b0c10]" strokeWidth={3} />
                          ) : isActive ? (
                            <span className="w-2.5 h-2.5 rounded-full bg-nexus-green animate-pulse" />
                          ) : (
                            <span className="text-[10px] font-bold text-white/30">{step.id}</span>
                          )}
                        </span>
                      </span>

                      {/* Step Text */}
                      <span className="ml-5 flex min-w-0 flex-col pt-1.5">
                        <span
                          className={`text-[15px] font-semibold tracking-wide font-outfit transition-colors duration-300 ${
                            isActive
                              ? "text-white"
                              : isCompleted
                                ? "text-white/80"
                                : "text-white/30"
                          }`}
                        >
                          {step.title}
                        </span>
                        <span
                          className={`text-[13px] mt-1 transition-colors duration-300 ${isActive ? "text-nexus-green/80" : "text-white/30"}`}
                        >
                          {step.description}
                        </span>
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        {/* Footer info (Aligned with form buttons) */}
        <div className="mt-auto flex items-center h-12 w-full">
          <div className="flex items-center w-full h-full px-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs font-medium text-slate-400 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-nexus-green animate-pulse shadow-[0_0_8px_rgba(119,207,151,0.6)]" />
              Takes ~3 minutes to complete
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
