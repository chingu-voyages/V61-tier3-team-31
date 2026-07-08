import { useFormContext } from "react-hook-form";
import type { ApplyFormData } from "@/lib/schemas/apply-schema";
export default function StepPersonalInfo() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ApplyFormData>();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1 font-outfit">Personal Information</h2>
        <p className="text-xs text-slate-400">Tell us about yourself.</p>
      </div>

      <div className="space-y-1.5 text-left">
        <label className="text-sm font-medium text-slate-300">Full Name *</label>
        <input
          {...register("fullName")}
          type="text"
          placeholder="Jane Cooper"
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-nexus-green focus:ring-1 focus:ring-nexus-green transition-all"
        />
        {errors.fullName && (
          <p className="text-xs text-red-400 flex items-center gap-1">{errors.fullName.message}</p>
        )}
      </div>

      <div className="space-y-1.5 text-left">
        <label className="text-sm font-medium text-slate-300">Email Address *</label>
        <input
          {...register("email")}
          type="email"
          placeholder="name@company.com"
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-nexus-green focus:ring-1 focus:ring-nexus-green transition-all"
        />
        {errors.email && (
          <p className="text-xs text-red-400 flex items-center gap-1">{errors.email.message}</p>
        )}
      </div>
    </div>
  );
}
