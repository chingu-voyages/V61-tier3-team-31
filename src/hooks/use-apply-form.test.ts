/// <reference types="vitest/globals" />
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useApplyForm } from "./use-apply-form";
import type { ApplyFormData } from "@/lib/schemas/apply-schema";

describe("useApplyForm", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("initializes with step 1", () => {
    const { result } = renderHook(() => useApplyForm());
    expect(result.current.currentStep).toBe(1);
  });

  it("validates step 1 before advancing", async () => {
    const { result } = renderHook(() => useApplyForm());

    await act(async () => {
      await result.current.nextStep();
    });

    expect(result.current.currentStep).toBe(1);
  });

  it("advances to step 2 when step 1 is valid", async () => {
    const { result } = renderHook(() => useApplyForm());

    await act(async () => {
      result.current.form.setValue("fullName", "John Doe");
      result.current.form.setValue("email", "john@example.com");
      result.current.form.setValue("password", "password123");
      result.current.form.setValue("confirmPassword", "password123");
      await result.current.nextStep();
    });

    expect(result.current.currentStep).toBe(2);
  });

  it("goes back to previous step", async () => {
    const { result } = renderHook(() => useApplyForm());

    await act(async () => {
      result.current.form.setValue("fullName", "John Doe");
      result.current.form.setValue("email", "john@example.com");
      result.current.form.setValue("password", "password123");
      result.current.form.setValue("confirmPassword", "password123");
      await result.current.nextStep();
    });

    act(() => {
      result.current.prevStep();
    });

    expect(result.current.currentStep).toBe(1);
  });

  it("sets specific step", () => {
    const { result } = renderHook(() => useApplyForm());

    act(() => {
      result.current.setStep(3);
    });

    expect(result.current.currentStep).toBe(3);
  });

  it("validates all steps on submit", async () => {
    const { result } = renderHook(() => useApplyForm());

    act(() => {
      result.current.form.setValue("fullName", "John Doe");
      result.current.form.setValue("email", "john@example.com");
      result.current.form.setValue("password", "password123");
      result.current.form.setValue("confirmPassword", "password123");
      result.current.form.setValue("role", "developer");
      result.current.form.setValue("experienceLevel", "intermediate");
      result.current.form.setValue("skills", ["React", "TypeScript"]);
      result.current.form.setValue("hoursPerWeek", "15-20 hours/week");
      result.current.form.setValue("timezone", "America/New_York");
      result.current.form.setValue("voyage", "Voyage 51");
      result.current.form.setValue(
        "motivation",
        "I want to join to learn and grow with other developers.",
      );
      result.current.form.setValue("bio", "I am a passionate developer with experience.");
      result.current.form.setValue("github", "https://github.com/johndoe");
      result.current.form.setValue("portfolio", "https://johndoe.dev");
    });

    let submitResult: ApplyFormData | null = null;
    await act(async () => {
      submitResult = await result.current.submit();
    });

    expect(submitResult).not.toBeNull();
    expect(submitResult!.fullName).toBe("John Doe");
  });

  it("returns null on invalid submit", async () => {
    const { result } = renderHook(() => useApplyForm());

    let submitResult: ApplyFormData | null = null;
    await act(async () => {
      submitResult = await result.current.submit();
    });

    expect(submitResult).toBeNull();
  });

  it("shows loading state during submit", async () => {
    const { result } = renderHook(() => useApplyForm());

    act(() => {
      result.current.form.setValue("fullName", "John Doe");
      result.current.form.setValue("email", "john@example.com");
      result.current.form.setValue("password", "password123");
      result.current.form.setValue("confirmPassword", "password123");
      result.current.form.setValue("role", "developer");
      result.current.form.setValue("experienceLevel", "intermediate");
      result.current.form.setValue("skills", ["React"]);
      result.current.form.setValue("hoursPerWeek", "15-20 hours/week");
      result.current.form.setValue("timezone", "America/New_York");
      result.current.form.setValue("voyage", "Voyage 51");
      result.current.form.setValue(
        "motivation",
        "I want to join to learn and grow with other developers.",
      );
      result.current.form.setValue("bio", "I am a passionate developer with experience.");
    });

    await act(async () => {
      const submitPromise = result.current.submit();
      await vi.runAllTimersAsync();
      await submitPromise;
    });

    expect(result.current.isLoading).toBe(false);
  });
});
