import { useFormContext } from "react-hook-form";
import { Clock, Calendar, Globe, Sun, Moon, Sunset, Sunrise } from "lucide-react";
import type { ApplyFormData } from "@/lib/schemas/apply-schema";
import { motion } from "motion/react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIMEZONES = [
  "UTC",
  "EST (UTC-5)",
  "CST (UTC-6)",
  "PST (UTC-8)",
  "GMT (UTC+0)",
  "CET (UTC+1)",
  "IST (UTC+5:30)",
  "JST (UTC+9)",
  "AEST (UTC+10)",
];
const TIME_SLOTS = [
  { id: "morning", label: "Morning", icon: Sunrise },
  { id: "afternoon", label: "Afternoon", icon: Sun },
  { id: "evening", label: "Evening", icon: Sunset },
  { id: "night", label: "Night", icon: Moon },
];

export default function StepAvailability() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ApplyFormData>();

  const currentDays = watch("daysAvailable") || [];
  const currentSlots = watch("timeSlotsPerDay") || [];

  const toggleDay = (day: string) => {
    if (currentDays.includes(day)) {
      setValue(
        "daysAvailable",
        currentDays.filter((d) => d !== day),
        { shouldValidate: true },
      );
    } else {
      setValue("daysAvailable", [...currentDays, day], { shouldValidate: true });
    }
  };

  const toggleSlot = (slot: string) => {
    if (currentSlots.includes(slot)) {
      setValue(
        "timeSlotsPerDay",
        currentSlots.filter((s) => s !== slot),
        { shouldValidate: true },
      );
    } else {
      setValue("timeSlotsPerDay", [...currentSlots, slot], { shouldValidate: true });
    }
  };

  const inputClasses =
    "w-full h-14 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 transition-all duration-300 focus:outline-none focus:border-nexus-green focus:bg-white/10 focus:shadow-[0_0_20px_rgba(119,207,151,0.15)] appearance-none";

  const iconClasses =
    "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 transition-colors duration-300 peer-focus:text-nexus-green";

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-8 pb-4">
      <div className="text-center space-y-2">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-outfit font-bold tracking-tight text-white"
        >
          Your Availability
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-400 text-sm"
        >
          Let us know when you&apos;re free to collaborate
        </motion.p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Hours Per Week */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">Hours Per Week</label>
            <div className="relative group">
              <input
                {...register("hoursPerWeek", { valueAsNumber: true })}
                type="number"
                min="5"
                max="40"
                className={`${inputClasses} peer`}
                placeholder="e.g. 20"
              />
              <Clock className={iconClasses} />
            </div>
            {errors.hoursPerWeek && (
              <p className="text-red-400 text-xs pl-2 pt-1 font-medium">
                {errors.hoursPerWeek.message}
              </p>
            )}
          </div>

          {/* Timezone */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">Timezone</label>
            <div className="relative group">
              <select
                {...register("timezone")}
                className={`${inputClasses} cursor-pointer peer [&>option]:bg-[#1a1b24] [&>option]:text-white`}
              >
                <option value="" disabled className="text-white/30">
                  Select your timezone
                </option>
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
              <Globe className={iconClasses} />
            </div>
            {errors.timezone && (
              <p className="text-red-400 text-xs pl-2 pt-1 font-medium">
                {errors.timezone.message}
              </p>
            )}
          </div>
        </div>

        {/* Days Available */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-white/40" />
            Days Available
          </label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => {
              const isSelected = currentDays.includes(day);
              return (
                <button
                  type="button"
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`cursor-pointer px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border ${
                    isSelected
                      ? "bg-nexus-green/10 border-nexus-green text-nexus-green shadow-[0_0_15px_rgba(119,207,151,0.15)]"
                      : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
          {errors.daysAvailable && (
            <p className="text-red-400 text-xs pl-2 font-medium">{errors.daysAvailable.message}</p>
          )}
        </div>

        {/* Time Slots */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Clock className="w-4 h-4 text-white/40" />
            Preferred Time Slots
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TIME_SLOTS.map((slot) => {
              const Icon = slot.icon;
              const isSelected = currentSlots.includes(slot.id);
              return (
                <button
                  type="button"
                  key={slot.id}
                  onClick={() => toggleSlot(slot.id)}
                  className={`cursor-pointer flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-300 ${
                    isSelected
                      ? "bg-nexus-green/10 border-nexus-green text-nexus-green shadow-[0_0_15px_rgba(119,207,151,0.15)]"
                      : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{slot.label}</span>
                </button>
              );
            })}
          </div>
          {errors.timeSlotsPerDay && (
            <p className="text-red-400 text-xs pl-2 font-medium">
              {errors.timeSlotsPerDay.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
