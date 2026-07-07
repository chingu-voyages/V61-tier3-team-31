import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FormStep } from "./use-apply-form";
import type { ApplyFormData } from "@/lib/schemas/apply-schema";

interface ApplyFormState {
  step: FormStep;
  formData: Partial<ApplyFormData>;
  setStep: (step: FormStep) => void;
  setFormData: (data: Partial<ApplyFormData>) => void;
  clearState: () => void;
}

const initialState = {
  step: 1 as FormStep,
  formData: {},
};

export const useApplyFormStore = create<ApplyFormState>()(
  persist(
    (set) => ({
      ...initialState,
      setStep: (step) => set({ step }),
      setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
      clearState: () => set(initialState),
    }),
    {
      name: "apply-form-draft",
    },
  ),
);
