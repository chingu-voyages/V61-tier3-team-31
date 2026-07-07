"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Loader2, CheckCircle2 } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const data: ForgotPasswordForm = {
      email: form.get("email") as string,
    };

    const result = forgotPasswordSchema.safeParse(data);

    if (!result.success) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });

      if (resetError) {
        setError(resetError.message);
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
        <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          If an account with that email exists, we&apos;ve sent a password reset link. It expires in
          1 hour.
        </p>
        <Link
          href="/login"
          className="inline-block text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 underline underline-offset-4"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

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
            className="flex h-10 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm ring-offset-white dark:ring-offset-zinc-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
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
              Sending reset link...
            </>
          ) : (
            "Send reset link"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        Remember your password?{" "}
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
