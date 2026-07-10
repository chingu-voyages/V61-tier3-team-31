"use client";

import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useApplyFormStore } from "./use-apply-form-store";
import { useAuth } from "@/lib/auth/auth-context";
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
import { submitApplication } from "@/app/(protected)/app/apply/actions";
import type { ApplyProfileDraft } from "@/lib/applications/profile-sync";

export type FormStep = 1 | 2 | 3 | 4 | 5 | 6;

export function useApplyForm(initialProfileDraft?: ApplyProfileDraft) {
  const { user, profile } = useAuth();
  const { step: currentStep, formData, setStep, setFormData, clearState } = useApplyFormStore();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const form = useForm<ApplyFormData>({
    resolver: zodResolver(applyFormSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: initialProfileDraft?.fullName ?? profile?.full_name ?? "",
      email: user?.email ?? "",
      role: initialProfileDraft?.role,
      experience: undefined,
      skills: initialProfileDraft?.skills ?? [],
      hoursPerWeek: 0,
      timezone:
        initialProfileDraft?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      voyage: "",
      motivation: "",
      bio: initialProfileDraft?.bio ?? "",
      portfolio: initialProfileDraft?.portfolio ?? "",
      ...formData,
    },
  });

  useEffect(() => {
    if (!profile?.full_name && !user?.email && !initialProfileDraft) {
      return;
    }

    const current = form.getValues();
    const updates: Partial<ApplyFormData> = {};

    if (!current.fullName && profile?.full_name) {
      updates.fullName = profile.full_name;
    }
    if (!current.email && user?.email) {
      updates.email = user.email;
    }
    if (!current.role && initialProfileDraft?.role) {
      updates.role = initialProfileDraft.role;
    }
    if ((current.skills?.length ?? 0) === 0 && (initialProfileDraft?.skills.length ?? 0) > 0) {
      updates.skills = initialProfileDraft?.skills;
    }
    if (!current.timezone && initialProfileDraft?.timezone) {
      updates.timezone = initialProfileDraft.timezone;
    }
    if (!current.bio && initialProfileDraft?.bio) {
      updates.bio = initialProfileDraft.bio;
    }
    if (!current.portfolio && initialProfileDraft?.portfolio) {
      updates.portfolio = initialProfileDraft.portfolio;
    }

    if (Object.keys(updates).length > 0) {
      form.reset({ ...current, ...updates });
    }
  }, [form, initialProfileDraft, profile?.full_name, user?.email]);

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
    setSubmitError("");
    const fields = getStepFields(currentStep);
    const isStepValid = await form.trigger(fields);

    if (isStepValid && currentStep < 6) {
      setStep((currentStep + 1) as FormStep);
    }
  }, [currentStep, form, setStep]);

  const prevStep = useCallback(() => {
    setSubmitError("");
    if (currentStep > 1) {
      setStep((currentStep - 1) as FormStep);
    }
  }, [currentStep, setStep]);

  const submit = useCallback(async () => {
    setSubmitError("");
    setIsLoading(true);
    const isValid = await form.trigger();

    if (!isValid) {
      setIsLoading(false);
      return null;
    }

    try {
      const data = form.getValues();
      const result = await submitApplication(data);

      if ("error" in result) {
        setSubmitError(result.error);
        return null;
      }

      clearState();
      return data;
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [form, clearState]);

  return {
    form,
    currentStep,
    isLoading,
    submitError,
    nextStep,
    prevStep,
    submit,
    setStep,
  };
}
