import { renderHook, act } from "@testing-library/react";
import { useApplyForm } from "./use-apply-form";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("useApplyForm", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });
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
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ application: { id: "app-123" } }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }),
    );

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
    expect(result.current.submitError).toBe("");
  });

  it("sets submitError on duplicate email (409)", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "An application with this email already exists." }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      }),
    );

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

    await act(async () => {
      await result.current.submit();
    });

    expect(result.current.submitError).toBe("An application with this email already exists.");
  });

  it("persists form data and current step to storage and restores on mount", async () => {
    // 1. First render
    const { result, unmount } = renderHook(() => useApplyForm());

    // 2. Change state
    await act(async () => {
      result.current.form.setValue("fullName", "Jane Restored");
      result.current.setStep(3);
    });

    // 3. Unmount to simulate page refresh
    unmount();

    // 4. Second render
    const { result: newResult } = renderHook(() => useApplyForm());

    // 5. Expect state to be restored
    expect(newResult.current.currentStep).toBe(3);
    expect(newResult.current.form.getValues("fullName")).toBe("Jane Restored");
  });
});
