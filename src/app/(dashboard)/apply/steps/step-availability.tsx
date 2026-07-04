import { useFormContext } from "react-hook-form";
import { Clock, Sparkles } from "lucide-react";
import type { ApplyFormData } from "@/lib/schemas/apply-schema";
import { TimezonePicker } from "@/components/ui/timezone-picker";

const VOYAGES = [
  { id: "voyage-51", name: "Voyage 51", deadline: "Jul 15, 2026" },
  { id: "voyage-52", name: "Voyage 52", deadline: "Sep 1, 2026" },
];

export default function StepAvailability() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ApplyFormData>();

  const currentTimezone = watch("timezone");

  const inputClasses =
    "w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-nexus-green focus:ring-1 focus:ring-nexus-green transition-all";

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1 font-outfit">Availability</h2>
        <p className="text-xs text-slate-400">When can you contribute?</p>
      </div>

      <div className="space-y-1.5 text-left">
        <label className="text-sm font-medium text-slate-300">Hours per Week *</label>
        <div className="relative">
          <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            {...register("hoursPerWeek", { valueAsNumber: true })}
            type="number"
            min="1"
            max="80"
            placeholder="e.g. 20"
            className={inputClasses}
          />
        </div>
        {errors.hoursPerWeek && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            {errors.hoursPerWeek.message}
          </p>
        )}
      </div>

      <div className="text-left">
        <TimezonePicker
          value={currentTimezone || ""}
          onChange={(tz) => setValue("timezone", tz, { shouldValidate: true })}
          error={errors.timezone?.message}
        />
      </div>

      <div className="space-y-1.5 text-left">
        <label className="text-sm font-medium text-slate-300">Preferred Voyage</label>
        <div className="relative">
          <Sparkles className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <select
            {...register("voyage")}
            className={`${inputClasses} cursor-pointer appearance-none`}
          >
            <option value="">Select a voyage...</option>
            {VOYAGES.map((v) => (
              <option key={v.id} value={v.name}>
                {v.name} — Deadline: {v.deadline}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
