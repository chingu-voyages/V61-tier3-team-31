"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { getPostLoginRedirect } from "@/lib/auth/navigation";
import { cn } from "@/lib/utils";
import { Loader2, Mail } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type FieldErrors = Partial<Record<keyof LoginFormData, string>>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const justVerified = searchParams.get("verified") === "email";
  const redirect = searchParams.get("redirect");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);
    setFieldErrors({});

    const form = new FormData(event.currentTarget);
    const data: LoginFormData = {
      email: form.get("email") as string,
      password: form.get("password") as string,
    };

    const result = loginSchema.safeParse(data);

    if (!result.success) {
      const errors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0] as keyof LoginFormData;
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

      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          setServerError(
            "Please verify your email before signing in. Check your inbox for the verification link.",
          );
        } else {
          setServerError("Invalid email or password. Please try again.");
        }
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle();

        router.push(getPostLoginRedirect(roleData?.role ?? "user", redirect));
      }
    } catch {
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {justVerified && (
          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-3 text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
            <Mail className="h-4 w-4 shrink-0" />
            Email verified successfully. You can now sign in.
          </div>
        )}

        {serverError && (
          <div className="rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-400">
            {serverError}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium leading-none">
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
          <label htmlFor="password" className="text-sm font-medium leading-none">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
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

        <div className="flex items-center justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 underline underline-offset-4"
          >
            Forgot password?
          </Link>
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
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline underline-offset-4"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
