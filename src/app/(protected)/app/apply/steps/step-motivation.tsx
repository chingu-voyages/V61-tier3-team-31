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
        <h2 className="text-lg font-semibold text-white mb-1 font-outfit">Motivation</h2>
        <p className="text-xs text-slate-400">Why do you want to join Amigo?</p>
      </div>

      <div className="space-y-1.5 text-left">
        <label className="text-sm font-medium text-slate-300">
          Why do you want to participate? *
        </label>
        <textarea
          {...register("motivation")}
          placeholder="Tell us what motivates you to join this Voyage cohort..."
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-nexus-green focus:ring-1 focus:ring-nexus-green transition-all resize-none"
        />
        <div className="flex justify-between">
          {errors.motivation && (
            <p className="text-xs text-red-400 flex items-center gap-1">
              {errors.motivation.message}
            </p>
          )}
          <span className="text-[10px] text-white/40 ml-auto">{motivationLength}/500</span>
        </div>
      </div>

      <div className="space-y-1.5 text-left">
        <label className="text-sm font-medium text-slate-300">About you *</label>
        <textarea
          {...register("bio")}
          placeholder="A short bio about yourself, your background, and what you're looking for..."
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-nexus-green focus:ring-1 focus:ring-nexus-green transition-all resize-none"
        />
        {errors.bio && (
          <p className="text-xs text-red-400 flex items-center gap-1">{errors.bio.message}</p>
        )}
      </div>

      <div className="space-y-1.5 text-left">
        <label className="text-sm font-medium text-slate-300">Portfolio / GitHub</label>
        <input
          {...register("portfolio")}
          type="url"
          placeholder="https://github.com/yourusername"
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-nexus-green focus:ring-1 focus:ring-nexus-green transition-all"
        />
        {errors.portfolio && (
          <p className="text-xs text-red-400 flex items-center gap-1">{errors.portfolio.message}</p>
        )}
      </div>
    </div>
  );
}
