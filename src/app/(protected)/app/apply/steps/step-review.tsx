import { useFormContext } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import type { ApplyFormData } from "@/lib/schemas/apply-schema";
interface StepReviewProps {
  onEditStep: (step: 1 | 2 | 3 | 4) => void;
  error?: string;
}

export default function StepReview({ onEditStep, error }: StepReviewProps) {
  const { watch } = useFormContext<ApplyFormData>();

  const form = {
    role: watch("role"),
    experience: watch("experience"),
    skills: watch("skills") || [],
    hoursPerWeek: watch("hoursPerWeek"),
    timezone: watch("timezone"),
    voyage: watch("voyage"),
    motivation: watch("motivation"),
    bio: watch("bio"),
    portfolio: watch("portfolio"),
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1 font-outfit">
          Review Your Application
        </h2>
        <p className="text-xs text-muted-foreground">
          Please review your information before submitting.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <div className="bg-muted rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Role & Experience
            </h3>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="text-xs font-medium text-nexus-green hover:text-nexus-green/80 cursor-pointer"
            >
              Edit
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Role:</span>{" "}
              <span className="font-medium text-foreground ml-1">{form.role || "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Experience:</span>{" "}
              <span className="font-medium text-foreground ml-1">{form.experience || "—"}</span>
            </div>
          </div>
        </div>

        <div className="bg-muted rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Skills
            </h3>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="text-xs font-medium text-nexus-green hover:text-nexus-green/80 cursor-pointer"
            >
              Edit
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {form.skills.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-nexus-green/10 text-nexus-green border border-nexus-green/20 rounded-lg text-xs font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-muted rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Availability
            </h3>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="text-xs font-medium text-nexus-green hover:text-nexus-green/80 cursor-pointer"
            >
              Edit
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Hours:</span>{" "}
              <span className="font-medium text-foreground ml-1">
                {form.hoursPerWeek ? `${form.hoursPerWeek} hrs/week` : "—"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Timezone:</span>{" "}
              <span className="font-medium text-foreground ml-1">{form.timezone}</span>
            </div>
            {form.voyage && (
              <div>
                <span className="text-muted-foreground">Course:</span>{" "}
                <span className="font-medium text-foreground ml-1">{form.voyage}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-muted rounded-xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Motivation
            </h3>
            <button
              type="button"
              onClick={() => onEditStep(4)}
              className="text-xs font-medium text-nexus-green hover:text-nexus-green/80 cursor-pointer"
            >
              Edit
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Motivation:</span>
              <p className="text-foreground mt-1">{form.motivation || "—"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">About:</span>
              <p className="text-foreground mt-1">{form.bio || "—"}</p>
            </div>
            {form.portfolio && (
              <div>
                <span className="text-muted-foreground">Portfolio:</span>{" "}
                <a
                  href={form.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-nexus-green hover:text-nexus-green/80 ml-1"
                >
                  {form.portfolio}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
