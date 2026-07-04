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
      result.current.form.setValue("fullName", "Jane Cooper");
      result.current.form.setValue("email", "jane@example.com");
    });

    await act(async () => {
      await result.current.nextStep();
    });

    expect(result.current.currentStep).toBe(2);
  });

  it("cannot navigate to next step when fields are invalid", async () => {
    const { result } = renderHook(() => useApplyForm());

    await act(async () => {
      result.current.form.setValue("fullName", "J");
      result.current.form.setValue("email", "not-an-email");
    });

    await act(async () => {
      await result.current.nextStep();
    });

    expect(result.current.currentStep).toBe(1);
  });

  it("can navigate to previous step", async () => {
    const { result } = renderHook(() => useApplyForm());

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

    await act(async () => {
      result.current.form.setValue("fullName", "Jane Cooper");
      result.current.form.setValue("email", "jane@example.com");
      result.current.form.setValue("role", "Frontend");
      result.current.form.setValue("experience", "Intermediate");
      result.current.form.setValue("skills", ["React", "TypeScript"]);
      result.current.form.setValue("hoursPerWeek", 20);
      result.current.form.setValue("timezone", "America/New_York");
      result.current.form.setValue(
        "motivation",
        "I want to join because I am passionate about building great software.",
      );
      result.current.form.setValue("bio", "I am a software developer with 3 years of experience.");
    });

    let submittedData: Awaited<ReturnType<typeof result.current.submit>> = null as Awaited<
      ReturnType<typeof result.current.submit>
    >;
    await act(async () => {
      submittedData = await result.current.submit();
    });

    expect(submittedData).toBeTruthy();
    expect(submittedData?.fullName).toBe("Jane Cooper");
  });
});
