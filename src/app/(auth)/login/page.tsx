"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { getSafeInternalRedirect } from "@/lib/auth/navigation";
import { NexusLogo } from "@/components/nexus-logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Loader2 } from "lucide-react";

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

      const destination = getSafeInternalRedirect(redirect) ?? "/app/overview";
      router.replace(destination);
    } catch {
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* Header */}
      <div className="p-8 pb-6 border-b border-border flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-nexus-dark flex items-center justify-center mb-6 shadow-sm">
          <NexusLogo className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-outfit font-bold text-card-foreground mb-2">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to your Nexus workspace.</p>
      </div>

      {/* Form */}
      <div className="p-8">
        {justVerified && (
          <div className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-400 flex items-center gap-2">
            <Mail className="h-4 w-4 shrink-0" />
            Email verified successfully. You can now sign in.
          </div>
        )}

        {serverError && (
          <div className="mb-4 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <Label>Email address</Label>
            <Input
              name="email"
              type="email"
              placeholder="name@company.com"
              autoComplete="email"
              required
              disabled={isLoading}
              className="h-auto rounded-xl py-3 px-4"
              aria-invalid={!!fieldErrors.email}
            />
            {fieldErrors.email && <p className="text-xs text-destructive">{fieldErrors.email}</p>}
          </div>

          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <Label>Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-primary hover:underline underline-offset-4"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              disabled={isLoading}
              className="h-auto rounded-xl py-3 px-4"
              aria-invalid={!!fieldErrors.password}
            />
            {fieldErrors.password && (
              <p className="text-xs text-destructive">{fieldErrors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-xl text-sm font-semibold bg-nexus-dark text-white hover:bg-slate-800 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/80"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
