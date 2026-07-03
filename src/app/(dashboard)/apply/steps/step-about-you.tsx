import { useFormContext } from "react-hook-form";
import { Code2, Link } from "lucide-react";
import type { ApplyFormData } from "@/lib/schemas/apply-schema";
import { motion } from "motion/react";

export default function StepAboutYou() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ApplyFormData>();

  const inputClasses =
    "w-full h-14 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 transition-all duration-300 focus:outline-none focus:border-nexus-green focus:bg-white/10 focus:shadow-[0_0_20px_rgba(119,207,151,0.15)]";

  const textareaClasses =
    "w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 transition-all duration-300 focus:outline-none focus:border-nexus-green focus:bg-white/10 focus:shadow-[0_0_20px_rgba(119,207,151,0.15)] min-h-[120px] resize-none";

  const iconClasses =
    "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 transition-colors duration-300 peer-focus:text-nexus-green";

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-8">
      <div className="text-center space-y-2">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-outfit font-bold tracking-tight text-white"
        >
          Tell us about yourself
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-400 text-sm"
        >
          Share your background, links, and online presence
        </motion.p>
      </div>

      <div className="space-y-8">
        {/* Bio */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300">
            Short Bio <span className="text-white/30">(min 50 chars)</span>
          </label>
          <div className="relative group">
            <textarea
              {...register("bio")}
              className={`${textareaClasses} peer`}
              placeholder="I am a passionate software developer with 3 years of experience..."
            />
          </div>
          {errors.bio && (
            <p className="text-red-400 text-xs pl-2 font-medium">{errors.bio.message}</p>
          )}
        </div>

        {/* GitHub */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300">
            GitHub Profile <span className="text-white/30">(Optional)</span>
          </label>
          <div className="relative group">
            <input
              {...register("github")}
              type="url"
              className={`${inputClasses} peer`}
              placeholder="https://github.com/username"
            />
            <Code2 className={iconClasses} />
          </div>
          {errors.github && (
            <p className="text-red-400 text-xs pl-2 pt-1 font-medium">{errors.github.message}</p>
          )}
        </div>

        {/* Portfolio */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300">
            Portfolio Website <span className="text-white/30">(Optional)</span>
          </label>
          <div className="relative group">
            <input
              {...register("portfolio")}
              type="url"
              className={`${inputClasses} peer`}
              placeholder="https://yourwebsite.com"
            />
            <Link className={iconClasses} />
          </div>
          {errors.portfolio && (
            <p className="text-red-400 text-xs pl-2 pt-1 font-medium">{errors.portfolio.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
