"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ApplyFormData } from "@/lib/schemas/apply-schema";
import { applyFormSchema } from "@/lib/schemas/apply-schema";

export type FormStep = 1 | 2 | 3 | 4 | 5 | 6;

interface UseApplyFormReturn {
  form: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  currentStep: FormStep;
  isLoading: boolean;
  nextStep: () => Promise<void>;
  prevStep: () => void;
  setStep: (step: FormStep) => void;
  submit: () => Promise<ApplyFormData | null>;
}

export type ApplyForm = ApplyFormData;

export function useApplyForm(): UseApplyFormReturn {
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ApplyFormData>({
    resolver: zodResolver(applyFormSchema) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "developer",
      experienceLevel: "beginner",
      yearsExperience: undefined,
      skills: [],
      hoursPerWeek: "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      voyage: "",
      motivation: "",
      bio: "",
      github: "",
      portfolio: "",
      profilePhoto: "",
    },
  });

  const getStepFields = useCallback((step: FormStep): (keyof ApplyFormData)[] => {
    switch (step) {
      case 1:
        return ["fullName", "email", "password", "confirmPassword"];
      case 2:
        return ["role", "experienceLevel", "yearsExperience"];
      case 3:
        return ["skills"];
      case 4:
        return ["hoursPerWeek", "timezone", "voyage"];
      case 5:
        return ["motivation", "bio", "github", "portfolio", "profilePhoto"];
      case 6:
        return []; // Review step doesn't have specific fields to validate on blur
    }
  }, []);

  const nextStep = useCallback(async () => {
    const stepFields = getStepFields(currentStep);
    let isValid = true;
    if (stepFields.length > 0) {
      isValid = await form.trigger(stepFields as (keyof ApplyFormData)[]);
    }
    if (!isValid) return;
    if (currentStep < 6) {
      setCurrentStep((prev) => (prev + 1) as FormStep);
    }
  }, [currentStep, form, getStepFields]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as FormStep);
    }
  }, [currentStep]);

  const setStep = useCallback((step: FormStep) => {
    setCurrentStep(step);
  }, []);

  const submit = useCallback(async () => {
    setIsLoading(true);
    try {
      const isValid = await form.trigger();
      if (!isValid) {
        return null;
      }
      return form.getValues();
    } finally {
      setIsLoading(false);
    }
  }, [form]);

  return {
    form,
    currentStep,
    isLoading,
    nextStep,
    prevStep,
    setStep,
    submit,
  };
}
