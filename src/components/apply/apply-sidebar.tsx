import { CheckCircle2 } from "lucide-react";
import type { FormStep } from "@/hooks/use-apply-form";

interface ApplySidebarProps {
  currentStep: FormStep;
}

const steps = [
  { id: 1, title: "Create Account", description: "Your basic details" },
  { id: 2, title: "Role & Experience", description: "What you do best" },
  { id: 3, title: "Skills", description: "Your tech stack" },
  { id: 4, title: "Availability", description: "When you can work" },
  { id: 5, title: "Motivation", description: "Why you want to join" },
  { id: 6, title: "Review", description: "Confirm & submit" },
];

export function ApplySidebar({ currentStep }: ApplySidebarProps) {
  return (
    <div className="relative hidden lg:flex flex-col w-[340px] shrink-0 bg-[#0b0c10] text-white overflow-hidden p-10">
      {/* Decorative background graphics */}
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
        {/* Geometric patterns using CSS gradients */}
        <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-br from-nexus-green/20 to-transparent" />
        <div className="absolute top-10 left-[-20%] w-64 h-64 bg-nexus-green/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-nexus-green/10 rounded-full blur-3xl" />

        {/* Abstract shapes */}
        <svg
          className="absolute top-20 right-0 w-48 h-48 text-nexus-green/20"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <circle cx="50" cy="50" r="40" />
          <line x1="50" y1="10" x2="50" y2="90" />
          <line x1="10" y1="50" x2="90" y2="50" />
        </svg>
        <svg
          className="absolute bottom-10 left-0 w-64 h-64 text-nexus-green/10"
          viewBox="0 0 100 100"
          fill="currentColor"
        >
          <polygon points="0,100 100,100 0,0" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-2xl font-outfit font-bold mb-3 tracking-tight">
            Welcome to the Dev Community.
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Join thousands of developers and build something amazing together.
          </p>
        </div>

        {/* Vertical Stepper */}
        <div className="flex-1 flex flex-col justify-center">
          <nav aria-label="Progress">
            <ol role="list" className="space-y-6">
              {steps.map((step, stepIdx) => {
                const isActive = step.id === currentStep;
                const isCompleted = step.id < currentStep;

                return (
                  <li key={step.title} className="relative">
                    {stepIdx !== steps.length - 1 && (
                      <div
                        className={`absolute left-3.5 top-10 -ml-px h-full w-0.5 ${
                          isCompleted ? "bg-nexus-green" : "bg-white/10"
                        }`}
                        aria-hidden="true"
                      />
                    )}

                    <div className="group flex items-start">
                      <span className="flex items-center h-9">
                        <span
                          className={`relative z-10 w-7 h-7 flex items-center justify-center rounded-full transition-all duration-300 ${
                            isActive
                              ? "bg-[#0b0c10] ring-2 ring-nexus-green shadow-[0_0_12px_rgba(119,207,151,0.6)]"
                              : isCompleted
                                ? "bg-nexus-green"
                                : "bg-[#1a1b24] ring-1 ring-white/10"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-[#0b0c10]" />
                          ) : (
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${
                                isActive ? "bg-nexus-green" : "bg-transparent"
                              }`}
                            />
                          )}
                        </span>
                      </span>
                      <span className="ml-4 flex min-w-0 flex-col">
                        <span
                          className={`text-sm font-semibold tracking-wide font-outfit transition-colors duration-300 ${
                            isActive
                              ? "text-nexus-green"
                              : isCompleted
                                ? "text-white"
                                : "text-slate-500"
                          }`}
                        >
                          {step.id}. {step.title}
                        </span>
                        <span className="text-xs text-slate-500 mt-0.5">{step.description}</span>
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>

        {/* Footer info */}
        <div className="mt-auto pt-8">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-nexus-green animate-pulse" />
              Takes ~3 minutes to complete
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
