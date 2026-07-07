"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Loader2, CheckCircle2 } from "lucide-react";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;
type FieldErrors = Partial<Record<keyof ResetPasswordForm, string>>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user has a valid session (set by auth callback)
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user }, error: userError }) => {
      if (userError || !user) {
        router.push("/login");
      }
    });
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});

    const form = new FormData(event.currentTarget);
    const data: ResetPasswordForm = {
      password: form.get("password") as string,
      confirmPassword: form.get("confirmPassword") as string,
    };

    const result = resetPasswordSchema.safeParse(data);

    if (!result.success) {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0] as keyof ResetPasswordForm;
        if (!errors[path]) {
          errors[path] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      const { error: updateError } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setIsSuccess(true);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-4">
        <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/50 w-16 h-16 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Password updated</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Your password has been successfully reset.
        </p>
        <Link
          href="/login"
          className="inline-block text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:underline underline-offset-4"
        >
          Sign in with your new password
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Set new password</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Enter your new password below</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            New password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            required
            disabled={isLoading}
            className={cn(
              "flex h-10 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm ring-offset-white dark:ring-offset-zinc-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              fieldErrors.password &&
                "border-red-500 dark:border-red-500 focus-visible:ring-red-500",
            )}
          />
          {fieldErrors.password && (
            <p className="text-sm text-red-600 dark:text-red-400">{fieldErrors.password}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Confirm new password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat your new password"
            required
            disabled={isLoading}
            className={cn(
              "flex h-10 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm ring-offset-white dark:ring-offset-zinc-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              fieldErrors.confirmPassword &&
                "border-red-500 dark:border-red-500 focus-visible:ring-red-500",
            )}
          />
          {fieldErrors.confirmPassword && (
            <p className="text-sm text-red-600 dark:text-red-400">{fieldErrors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "inline-flex h-10 w-full items-center justify-center rounded-lg bg-zinc-950 dark:bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-50 dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-colors",
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating password...
            </>
          ) : (
            "Reset password"
          )}
        </button>
      </form>
    </div>
  );
}
