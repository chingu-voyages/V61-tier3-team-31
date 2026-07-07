"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { AlertCircle, Loader2 } from "lucide-react";

const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(120, "Full name must be at most 120 characters"),
    email: z.string().email("Invalid email address"),
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

type RegisterFormData = z.infer<typeof registerSchema>;
type FieldErrors = Partial<Record<keyof RegisterFormData, string>>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);
    setFieldErrors({});

    const form = new FormData(event.currentTarget);
    const data: RegisterFormData = {
      fullName: form.get("fullName") as string,
      email: form.get("email") as string,
      password: form.get("password") as string,
      confirmPassword: form.get("confirmPassword") as string,
    };

    const result = registerSchema.safeParse(data);

    if (!result.success) {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0] as keyof RegisterFormData;
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

      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/login?verified=email`,
          data: {
            full_name: data.fullName,
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          setFieldErrors({ email: "This email is already registered" });
        } else {
          setServerError(error.message);
        }
        return;
      }

      setIsSuccess(true);
    } catch {
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-4">
        <div className="rounded-full bg-zinc-100 dark:bg-zinc-800 w-16 h-16 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-zinc-600 dark:text-zinc-400" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          We sent a verification link to{" "}
          <span className="font-medium text-zinc-900 dark:text-zinc-100">your email</span>. Click
          the link to activate your account.
        </p>
        <Link
          href="/login"
          className="inline-block text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 underline underline-offset-4"
        >
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Enter your details to get started
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {serverError && (
          <div className="rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-400">
            {serverError}
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="fullName"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="John Doe"
            required
            disabled={isLoading}
            className={cn(
              "flex h-10 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm ring-offset-white dark:ring-offset-zinc-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              fieldErrors.fullName &&
                "border-red-500 dark:border-red-500 focus-visible:ring-red-500",
            )}
          />
          {fieldErrors.fullName && (
            <p className="text-sm text-red-600 dark:text-red-400">{fieldErrors.fullName}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="john@example.com"
            required
            disabled={isLoading}
            className={cn(
              "flex h-10 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm ring-offset-white dark:ring-offset-zinc-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              fieldErrors.email && "border-red-500 dark:border-red-500 focus-visible:ring-red-500",
            )}
          />
          {fieldErrors.email && (
            <p className="text-sm text-red-600 dark:text-red-400">{fieldErrors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Password
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
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat your password"
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
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
