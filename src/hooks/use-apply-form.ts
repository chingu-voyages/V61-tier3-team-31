"use client";

import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useApplyFormStore } from "./use-apply-form-store";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ApplyFormData } from "@/lib/schemas/apply-schema";
import {
  applyFormSchema,
  stepPersonalInfoSchema,
  stepRoleExperienceSchema,
  stepSkillsSchema,
  stepAvailabilitySchema,
  stepMotivationSchema,
} from "@/lib/schemas/apply-schema";

export type FormStep = 1 | 2 | 3 | 4 | 5 | 6;

export function useApplyForm() {
  const { step: currentStep, formData, setStep, setFormData, clearState } = useApplyFormStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ApplyFormData>({
    resolver: zodResolver(applyFormSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      role: undefined,
      experience: undefined,
      skills: [],
      hoursPerWeek: 0,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      voyage: "",
      motivation: "",
      bio: "",
      portfolio: "",
      ...formData,
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      setFormData(value as Partial<ApplyFormData>);
    });
    return () => subscription.unsubscribe();
  }, [form, setFormData]);

  const getStepFields = (step: FormStep): (keyof ApplyFormData)[] => {
    switch (step) {
      case 1:
        return Object.keys(stepPersonalInfoSchema.shape) as (keyof ApplyFormData)[];
      case 2:
        return Object.keys(stepRoleExperienceSchema.shape) as (keyof ApplyFormData)[];
      case 3:
        return Object.keys(stepSkillsSchema.shape) as (keyof ApplyFormData)[];
      case 4:
        return Object.keys(stepAvailabilitySchema.shape) as (keyof ApplyFormData)[];
      case 5:
        return Object.keys(stepMotivationSchema.shape) as (keyof ApplyFormData)[];
      default:
        return [];
    }
  };

  const nextStep = useCallback(async () => {
    const fields = getStepFields(currentStep);
    const isStepValid = await form.trigger(fields);

    if (isStepValid && currentStep < 6) {
      setStep((currentStep + 1) as FormStep);
    }
  }, [currentStep, form, setStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setStep((currentStep - 1) as FormStep);
    }
  }, [currentStep, setStep]);

  const submit = useCallback(async () => {
    setIsLoading(true);
    const isValid = await form.trigger();

    if (!isValid) {
      setIsLoading(false);
      return null;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      clearState();
      return form.getValues();
    } catch (error) {
      console.error("Submission failed", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [form, clearState]);

  return {
    form,
    currentStep,
    isLoading,
    nextStep,
    prevStep,
    submit,
    setStep,
  };
}
