import { useFormContext } from "react-hook-form";
import type { ApplyFormData } from "@/lib/schemas/apply-schema";
export default function StepMotivation() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<ApplyFormData>();

  const motivationLength = watch("motivation")?.length || 0;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1 font-outfit">Motivation</h2>
        <p className="text-xs text-muted-foreground">Why do you want to join Cohorix?</p>
      </div>

      <div className="space-y-1.5 text-left">
        <label className="text-sm font-medium text-muted-foreground">
          Why do you want to participate? *
        </label>
        <textarea
          {...register("motivation")}
          placeholder="Tell us what motivates you to join this Course cohort..."
          rows={4}
          className="w-full bg-muted border border-border rounded-xl py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
        />
        <div className="flex justify-between">
          {errors.motivation && (
            <p className="text-xs text-destructive flex items-center gap-1">
              {errors.motivation.message}
            </p>
          )}
          <span className="text-[10px] text-muted-foreground ml-auto">{motivationLength}/500</span>
        </div>
      </div>

      <div className="space-y-1.5 text-left">
        <label className="text-sm font-medium text-muted-foreground">About you *</label>
        <textarea
          {...register("bio")}
          placeholder="A short bio about yourself, your background, and what you're looking for..."
          rows={3}
          className="w-full bg-muted border border-border rounded-xl py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
        />
        {errors.bio && (
          <p className="text-xs text-destructive flex items-center gap-1">{errors.bio.message}</p>
        )}
      </div>

      <div className="space-y-1.5 text-left">
        <label className="text-sm font-medium text-muted-foreground">Portfolio / GitHub</label>
        <input
          {...register("portfolio")}
          type="url"
          placeholder="https://github.com/yourusername"
          className="w-full bg-muted border border-border rounded-xl py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
        />
        {errors.portfolio && (
          <p className="text-xs text-destructive flex items-center gap-1">
            {errors.portfolio.message}
          </p>
        )}
      </div>
    </div>
  );
}
