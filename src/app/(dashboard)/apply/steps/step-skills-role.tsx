import { useFormContext } from "react-hook-form";
import { Briefcase, Code, Layers } from "lucide-react";
import type { ApplyFormData } from "@/lib/schemas/apply-schema";
import { motion } from "motion/react";
import { useState } from "react";

const ROLES = [
  { id: "developer", label: "Developer", icon: Code },
  { id: "designer", label: "Designer", icon: Layers },
  { id: "product-manager", label: "Product Manager", icon: Briefcase },
] as const;

const EXPERIENCE_LEVELS = [
  { id: "beginner", label: "Beginner (0-1 yrs)" },
  { id: "intermediate", label: "Intermediate (1-3 yrs)" },
  { id: "advanced", label: "Advanced (3-5 yrs)" },
  { id: "expert", label: "Expert (5+ yrs)" },
] as const;

export default function StepSkillsRole() {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ApplyFormData>();

  const currentRole = watch("role");
  const currentExperience = watch("experienceLevel");
  const currentSkills = watch("skills") || [];

  const [skillInput, setSkillInput] = useState("");

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newSkill = skillInput.trim();
      if (newSkill && !currentSkills.includes(newSkill) && currentSkills.length < 10) {
        setValue("skills", [...currentSkills, newSkill], { shouldValidate: true });
        setSkillInput("");
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setValue(
      "skills",
      currentSkills.filter((s) => s !== skillToRemove),
      { shouldValidate: true },
    );
  };

  const inputClasses =
    "w-full h-14 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 transition-all duration-300 focus:outline-none focus:border-nexus-green focus:bg-white/10 focus:shadow-[0_0_20px_rgba(119,207,151,0.15)]";

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-8 pb-4">
      <div className="text-center space-y-2">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-outfit font-bold tracking-tight text-white"
        >
          Skills & Role
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-400 text-sm"
        >
          Tell us about your expertise and desired role
        </motion.p>
      </div>

      <div className="space-y-8">
        {/* Primary Role Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300">Primary Role</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ROLES.map((role) => {
              const Icon = role.icon;
              const isSelected = currentRole === role.id;
              return (
                <button
                  type="button"
                  key={role.id}
                  onClick={() => setValue("role", role.id, { shouldValidate: true })}
                  className={`relative cursor-pointer flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-300 group ${
                    isSelected
                      ? "border-nexus-green bg-nexus-green/10 shadow-[0_0_15px_rgba(119,207,151,0.15)]"
                      : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 transition-colors ${isSelected ? "text-nexus-green" : "text-white/50 group-hover:text-white/80"}`}
                  />
                  <span
                    className={`text-sm font-medium ${isSelected ? "text-nexus-green" : "text-slate-300"}`}
                  >
                    {role.label}
                  </span>
                </button>
              );
            })}
          </div>
          {errors.role && (
            <p className="text-red-400 text-xs pl-2 font-medium">{errors.role.message}</p>
          )}
        </div>

        {/* Experience Level */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300">Experience Level</label>
          <div className="grid grid-cols-2 gap-3">
            {EXPERIENCE_LEVELS.map((level) => {
              const isSelected = currentExperience === level.id;
              return (
                <button
                  type="button"
                  key={level.id}
                  onClick={() => setValue("experienceLevel", level.id, { shouldValidate: true })}
                  className={`relative cursor-pointer flex items-center justify-center p-3.5 rounded-xl border transition-all duration-300 ${
                    isSelected
                      ? "border-nexus-green bg-nexus-green/10 text-nexus-green shadow-[0_0_15px_rgba(119,207,151,0.15)]"
                      : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <span className="text-sm font-medium">{level.label}</span>
                </button>
              );
            })}
          </div>
          {errors.experienceLevel && (
            <p className="text-red-400 text-xs pl-2 font-medium">
              {errors.experienceLevel.message}
            </p>
          )}
        </div>

        {/* Skills Tags Input */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300">
            Top Skills <span className="text-white/30">(Press Enter to add)</span>
          </label>
          <div className="relative group">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
              className={inputClasses}
              placeholder="e.g. React, Node.js, Figma..."
              disabled={currentSkills.length >= 10}
            />
          </div>
          {/* Tags Display */}
          <div className="flex flex-wrap gap-2 pt-1">
            {currentSkills.map((skill) => (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white/10 text-white border border-white/10"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="text-white/50 hover:text-red-400 transition-colors cursor-pointer"
                >
                  &times;
                </button>
              </motion.span>
            ))}
          </div>
          {errors.skills && (
            <p className="text-red-400 text-xs pl-2 font-medium">{errors.skills.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
