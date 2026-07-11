import { useFormContext } from "react-hook-form";
import { CheckCircle } from "lucide-react";
import type { ApplyFormData } from "@/lib/schemas/apply-schema";

const ROLES = [
  {
    value: "Frontend" as const,
    label: "Frontend",
    desc: "React, Vue, Angular, CSS, UI/UX",
    emoji: "🎨",
  },
  {
    value: "Backend" as const,
    label: "Backend",
    desc: "Node.js, Python, Go, APIs, Databases",
    emoji: "⚙️",
  },
  { value: "Fullstack" as const, label: "Fullstack", desc: "End-to-end development", emoji: "🔧" },
  { value: "Design" as const, label: "Design", desc: "UI/UX, Figma, Branding", emoji: "✨" },
  {
    value: "Product" as const,
    label: "Product",
    desc: "Strategy, Roadmaps, User Research",
    emoji: "📋",
  },
];

const EXPERIENCES = [
  { value: "Beginner" as const, label: "Beginner", desc: "0-2 years" },
  { value: "Intermediate" as const, label: "Intermediate", desc: "2-5 years" },
  { value: "Advanced" as const, label: "Advanced", desc: "5+ years" },
];

export default function StepRoleExperience() {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ApplyFormData>();

  const currentRole = watch("role");
  const currentExperience = watch("experience");

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1 font-outfit">Role & Experience</h2>
        <p className="text-xs text-slate-400">Pick the role you want to contribute in.</p>
      </div>

      <div className="space-y-1.5 text-left">
        <label className="text-sm font-medium text-slate-300">Role *</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ROLES.map((role) => {
            const isSelected = currentRole === role.value;
            return (
              <button
                type="button"
                key={role.value}
                onClick={() => setValue("role", role.value, { shouldValidate: true })}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-nexus-green bg-nexus-green/10"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <span className="text-lg">{role.emoji}</span>
                <div>
                  <div className="text-sm font-medium text-white">{role.label}</div>
                  <div className="text-[11px] text-slate-400">{role.desc}</div>
                </div>
                {isSelected && (
                  <CheckCircle className="w-4 h-4 text-nexus-green ml-auto shrink-0" />
                )}
              </button>
            );
          })}
        </div>
        {errors.role && (
          <p className="text-xs text-red-400 flex items-center gap-1">{errors.role.message}</p>
        )}
      </div>

      <div className="space-y-1.5 text-left">
        <label className="text-sm font-medium text-slate-300">Experience Level *</label>
        <div className="grid grid-cols-3 gap-2">
          {EXPERIENCES.map((exp) => {
            const isSelected = currentExperience === exp.value;
            return (
              <button
                type="button"
                key={exp.value}
                onClick={() => setValue("experience", exp.value, { shouldValidate: true })}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? "border-nexus-green bg-nexus-green/10"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="text-sm font-medium text-white">{exp.label}</div>
                <div className="text-[11px] text-slate-400">{exp.desc}</div>
              </button>
            );
          })}
        </div>
        {errors.experience && (
          <p className="text-xs text-red-400 flex items-center gap-1">
            {errors.experience.message}
          </p>
        )}
      </div>
    </div>
  );
}
