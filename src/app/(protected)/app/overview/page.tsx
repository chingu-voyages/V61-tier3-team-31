"use client";

import { CheckCircle, Clock } from "lucide-react";

function ApplicantOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] font-outfit font-medium text-foreground mb-1 tracking-tight">
          Application Status
        </h1>
        <p className="text-muted-foreground text-sm">Track your application for Voyage 51.</p>
      </div>

      <div className="bg-card rounded-[24px] border border-border shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Your Application</h2>
            <p className="text-sm text-muted-foreground">
              Submitted for Voyage 51 — Application Review
            </p>
          </div>
        </div>

        {/* Status progress */}
        <div className="flex items-center gap-2 mb-8">
          {["Submitted", "Under Review", "Decision", "Onboarding"].map((step, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {i === 0 ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={`text-xs font-medium ${i === 0 ? "text-primary" : "text-muted-foreground"}`}
              >
                {step}
              </span>
              {i < 3 && (
                <div className={`flex-1 h-[2px] ${i === 0 ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Applied Role
              </div>
              <div className="text-sm font-medium text-foreground">Frontend Developer</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Experience Level
              </div>
              <div className="text-sm font-medium text-foreground">Advanced — 4 years</div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Submitted
              </div>
              <div className="text-sm font-medium text-foreground">May 1, 2026</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Status
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-semibold border border-amber-500/20">
                <Clock className="w-3 h-3" /> Under Review
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OverviewPage() {
  return <ApplicantOverview />;
}
