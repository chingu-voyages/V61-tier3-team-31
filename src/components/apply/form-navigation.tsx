"use client";

import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface FormNavigationProps {
  currentStep: number;
  isLoading: boolean;
  onBack: () => void;
  onContinue: () => void | Promise<void>;
  onSubmit: () => void | Promise<void>;
  isLastStep: boolean;
}

export function FormNavigation({
  currentStep,
  isLoading,
  onBack,
  onContinue,
  onSubmit,
  isLastStep,
}: FormNavigationProps) {
  const isFirstStep = currentStep === 1;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-6">
      {/* Back / Cancel Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={isFirstStep ? () => window.history.back() : onBack}
        disabled={isLoading}
        className="w-full sm:w-auto group relative flex items-center justify-center gap-2 px-5 py-3 h-12 rounded-xl text-sm font-medium text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-colors overflow-hidden cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        {isFirstStep ? "Cancel" : "Back"}
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      </motion.button>

      {/* Continue / Submit Button */}
      {isLastStep ? (
        <motion.button
          type="button"
          whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(74,222,128,0.3)" }}
          whileTap={{ scale: 0.98 }}
          onClick={onSubmit}
          disabled={isLoading}
          className="w-full sm:w-auto group relative flex items-center justify-center gap-2 px-8 py-3 h-12 rounded-xl text-sm font-bold text-black bg-nexus-green hover:bg-[#3bcf6d] transition-all overflow-hidden cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span>Submit Application</span>
            </>
          )}
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
        </motion.button>
      ) : (
        <motion.button
          type="button"
          whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(74,222,128,0.2)" }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinue}
          disabled={isLoading}
          className="w-full sm:w-auto group relative flex items-center justify-center gap-2 px-8 py-3 h-12 rounded-xl text-sm font-bold text-black bg-nexus-green hover:bg-[#3bcf6d] transition-all overflow-hidden cursor-pointer"
        >
          <span>Continue</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
        </motion.button>
      )}
    </div>
  );
}
