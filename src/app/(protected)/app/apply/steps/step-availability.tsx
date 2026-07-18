import { useFormContext } from "react-hook-form";
import { Clock, Sparkles } from "lucide-react";
import type { ApplyFormData } from "@/lib/schemas/apply-schema";
import { TimezonePicker } from "@/components/ui/timezone-picker";
import type { OpenVoyage } from "@/lib/applications/voyages";

export default function StepAvailability({ voyages }: { voyages: OpenVoyage[] }) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ApplyFormData>();

  const currentTimezone = watch("timezone");

  const inputClasses =
    "w-full bg-muted border border-border rounded-xl py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-nexus-green focus:ring-1 focus:ring-nexus-green transition-all";

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1 font-outfit">Availability</h2>
        <p className="text-xs text-muted-foreground">When can you contribute?</p>
      </div>

      {/* Side-by-side layout: Hours + Timezone on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        <div className="space-y-1.5 text-left">
          <label className="text-sm font-medium text-muted-foreground">Hours per Week *</label>
          <div className="relative">
            <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
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
            <p className="text-xs text-destructive flex items-center gap-1">
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
      </div>

      <div className="space-y-1.5 text-left">
        <label className="text-sm font-medium text-muted-foreground">Preferred Course</label>
        <div className="relative">
          <Sparkles className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <select
            {...register("voyage")}
            className={`${inputClasses} cursor-pointer appearance-none`}
          >
            {voyages.length === 0 ? (
              <option>No open courses</option>
            ) : (
              <>
                <option value="">Select a course...</option>
                {voyages.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>
      </div>
    </div>
  );
}
