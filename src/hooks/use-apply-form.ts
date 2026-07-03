"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ApplyFormData } from "@/lib/schemas/apply-schema";
import {
  applyFormSchema,
  stepAccountSchema,
  stepAboutYouSchema,
  stepSkillsRoleSchema,
  stepAvailabilitySchema,
} from "@/lib/schemas/apply-schema";

export type FormStep = 1 | 2 | 3 | 4;

export function useApplyForm() {
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ApplyFormData>({
    resolver: zodResolver(applyFormSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      bio: "",
      github: "",
      portfolio: "",
      role: undefined,
      experienceLevel: undefined,
      yearsExperience: undefined,
      skills: [],
      hoursPerWeek: 0,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      daysAvailable: [],
      timeSlotsPerDay: [],
    },
  });

  const getStepFields = (step: FormStep): (keyof ApplyFormData)[] => {
    switch (step) {
      case 1:
        return Object.keys(stepAccountSchema.shape) as (keyof ApplyFormData)[];
      case 2:
        return Object.keys(stepAboutYouSchema.shape) as (keyof ApplyFormData)[];
      case 3:
        return Object.keys(stepSkillsRoleSchema.shape) as (keyof ApplyFormData)[];
      case 4:
        return Object.keys(stepAvailabilitySchema.shape) as (keyof ApplyFormData)[];
      default:
        return [];
    }
  };

  const nextStep = useCallback(async () => {
    const fields = getStepFields(currentStep);
    const isStepValid = await form.trigger(fields);

    if (isStepValid && currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as FormStep);
    }
  }, [currentStep, form]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as FormStep);
    }
  }, [currentStep]);

  const submit = useCallback(async () => {
    setIsLoading(true);
    const isValid = await form.trigger();

    if (!isValid) {
      setIsLoading(false);
      return null;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return form.getValues();
    } catch (error) {
      console.error("Submission failed", error);
      return null;
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
    submit,
    setStep: (step: FormStep) => setCurrentStep(step),
  };
}
