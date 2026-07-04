import { useFormContext } from "react-hook-form";
import { CheckCircle } from "lucide-react";
import type { ApplyFormData } from "@/lib/schemas/apply-schema";
import { motion } from "motion/react";
import { useState } from "react";

const POPULAR_SKILLS = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "PostgreSQL",
  "Docker",
  "AWS",
  "Figma",
  "Next.js",
  "Go",
  "GraphQL",
  "Tailwind CSS",
  "Redis",
  "Kubernetes",
  "Swift",
];

export default function StepSkills() {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ApplyFormData>();

  const currentSkills = watch("skills") || [];
  const [skillInput, setSkillInput] = useState("");

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !currentSkills.includes(trimmed) && currentSkills.length < 15) {
      setValue("skills", [...currentSkills, trimmed], { shouldValidate: true });
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setValue(
      "skills",
      currentSkills.filter((s) => s !== skillToRemove),
      { shouldValidate: true },
    );
  };

  const handleAddSkill = () => {
    addSkill(skillInput);
    setSkillInput("");
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1 font-outfit">Skills & Tech Stack</h2>
        <p className="text-xs text-slate-400">Add the technologies and skills you work with.</p>
      </div>

      {currentSkills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {currentSkills.map((skill) => (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-nexus-green/10 text-nexus-green border border-nexus-green/20 rounded-lg text-xs font-medium"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="hover:text-red-400 transition-colors cursor-pointer ml-0.5"
              >
                &times;
              </button>
            </motion.span>
          ))}
        </div>
      )}

      <div className="space-y-1.5 text-left">
        <label className="text-sm font-medium text-slate-300">
          Add a skill <span className="text-white/30">(Press Enter to add)</span>
        </label>
        <input
          type="text"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddSkill();
            }
          }}
          placeholder="e.g. React, Python, Figma..."
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-nexus-green focus:ring-1 focus:ring-nexus-green transition-all"
        />
      </div>

      <div className="space-y-1.5 text-left">
        <span className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">
          Popular Skills
        </span>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_SKILLS.map((skill) => {
            const isAdded = currentSkills.includes(skill);
            return (
              <button
                type="button"
                key={skill}
                onClick={() => addSkill(skill)}
                disabled={isAdded}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${
                  isAdded
                    ? "bg-nexus-green/10 text-nexus-green border-nexus-green/20 cursor-default"
                    : "border-white/10 text-slate-400 hover:bg-white/5"
                }`}
              >
                {isAdded ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {skill}
                  </span>
                ) : (
                  `+ ${skill}`
                )}
              </button>
            );
          })}
        </div>
      </div>

      {errors.skills && (
        <p className="text-xs text-red-400 flex items-center gap-1">{errors.skills.message}</p>
      )}
    </div>
  );
}
