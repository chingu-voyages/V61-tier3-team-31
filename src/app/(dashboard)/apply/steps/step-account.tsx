import { useFormContext } from "react-hook-form";
import { Mail, User, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { ApplyFormData } from "@/lib/schemas/apply-schema";
import { motion } from "motion/react";

export default function StepAccount() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ApplyFormData>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const inputClasses =
    "w-full h-14 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 transition-all duration-300 focus:outline-none focus:border-nexus-green focus:bg-white/10 focus:shadow-[0_0_20px_rgba(119,207,151,0.15)]";

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
          Create your account
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-slate-400 text-sm"
        >
          Let&apos;s get started with your basic details
        </motion.p>
      </div>

      <div className="space-y-8">
        {/* Full Name */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300">Full Name</label>
          <div className="relative group">
            <input
              {...register("fullName")}
              type="text"
              className={`${inputClasses} peer`}
              placeholder="e.g. John Doe"
            />
            <User className={iconClasses} />
          </div>
          {errors.fullName && (
            <p className="text-red-400 text-xs pl-2 pt-1 font-medium">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-300">Email Address</label>
          <div className="relative group">
            <input
              {...register("email")}
              type="email"
              className={`${inputClasses} peer`}
              placeholder="john@example.com"
            />
            <Mail className={iconClasses} />
          </div>
          {errors.email && (
            <p className="text-red-400 text-xs pl-2 pt-1 font-medium">{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Password */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">Password</label>
            <div className="relative group">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                className={`${inputClasses} peer pr-12`}
                placeholder="••••••••"
              />
              <Lock className={iconClasses} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs pl-2 pt-1 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">Confirm Password</label>
            <div className="relative group">
              <input
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                className={`${inputClasses} peer pr-12`}
                placeholder="••••••••"
              />
              <Lock className={iconClasses} />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs pl-2 pt-1 font-medium">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
