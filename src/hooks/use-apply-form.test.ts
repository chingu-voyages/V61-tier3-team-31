import { renderHook, act } from "@testing-library/react";
import { useApplyForm } from "./use-apply-form";
import { describe, it, expect } from "vitest";

describe("useApplyForm", () => {
  it("initializes with step 1", () => {
    const { result } = renderHook(() => useApplyForm());
    expect(result.current.currentStep).toBe(1);
    expect(result.current.isLoading).toBe(false);
  });

  it("can navigate to next step when fields are valid", async () => {
    const { result } = renderHook(() => useApplyForm());

    await act(async () => {
      result.current.form.setValue("fullName", "John Doe");
      result.current.form.setValue("email", "john@example.com");
      result.current.form.setValue("password", "password123");
      result.current.form.setValue("confirmPassword", "password123");
    });

    await act(async () => {
      await result.current.nextStep();
    });

    expect(result.current.currentStep).toBe(2);
  });

  it("cannot navigate to next step when fields are invalid", async () => {
    const { result } = renderHook(() => useApplyForm());

    await act(async () => {
      result.current.form.setValue("fullName", "J"); // Invalid: too short
      result.current.form.setValue("email", "not-an-email");
    });

    await act(async () => {
      await result.current.nextStep();
    });

    expect(result.current.currentStep).toBe(1);
  });

  it("can navigate to previous step", async () => {
    const { result } = renderHook(() => useApplyForm());

    // Manually set step to 2
    act(() => {
      result.current.setStep(2);
    });

    expect(result.current.currentStep).toBe(2);

    act(() => {
      result.current.prevStep();
    });

    expect(result.current.currentStep).toBe(1);
  });

  it("cannot navigate below step 1", () => {
    const { result } = renderHook(() => useApplyForm());

    act(() => {
      result.current.prevStep();
    });

    expect(result.current.currentStep).toBe(1);
  });

  it("submits form data when valid", async () => {
    const { result } = renderHook(() => useApplyForm());

    // Fill all required fields
    await act(async () => {
      result.current.form.setValue("fullName", "John Doe");
      result.current.form.setValue("email", "john@example.com");
      result.current.form.setValue("password", "password123");
      result.current.form.setValue("confirmPassword", "password123");
      result.current.form.setValue(
        "bio",
        "This is a test bio that is perfectly at least fifty characters long so that it passes validation properly without any issues whatsoever.",
      );
      result.current.form.setValue("role", "developer");
      result.current.form.setValue("experienceLevel", "intermediate");
      result.current.form.setValue("skills", ["React"]);
      result.current.form.setValue("hoursPerWeek", 20);
      result.current.form.setValue("timezone", "UTC");
      result.current.form.setValue("daysAvailable", ["Monday"]);
      result.current.form.setValue("timeSlotsPerDay", ["morning"]);
    });

    let submittedData: ReturnType<typeof useApplyForm>["submit"] extends Promise<infer T>
      ? T
      : never = null;
    await act(async () => {
      submittedData = await result.current.submit();
    });

    expect(submittedData).toBeTruthy();
    expect(submittedData?.fullName).toBe("John Doe");
  });
});
