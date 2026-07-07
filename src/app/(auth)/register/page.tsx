"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { NexusLogo } from "@/components/nexus-logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
      <>
        <div className="p-8 pb-6 border-b border-border flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-nexus-dark flex items-center justify-center mb-6 shadow-sm">
            <NexusLogo className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-outfit font-bold text-card-foreground mb-2">
            Check your email
          </h1>
          <p className="text-sm text-muted-foreground">
            We sent a verification link to your email. Click the link to activate your account.
          </p>
        </div>
        <div className="p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
          </div>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full py-3 bg-card border border-border rounded-xl text-sm font-medium text-card-foreground hover:bg-muted transition-colors shadow-sm cursor-pointer"
          >
            Go to Sign In
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="p-8 pb-6 border-b border-border flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-nexus-dark flex items-center justify-center mb-6 shadow-sm">
          <NexusLogo className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-outfit font-bold text-card-foreground mb-2">Create account</h1>
        <p className="text-sm text-muted-foreground">Join Nexus and start your journey.</p>
      </div>

      {/* Form */}
      <div className="p-8">
        {serverError && (
          <div className="mb-4 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5 text-left">
            <Label>Full Name</Label>
            <Input
              name="fullName"
              placeholder="Jane Cooper"
              autoComplete="name"
              required
              disabled={isLoading}
              className="h-auto rounded-xl py-3 px-4"
              aria-invalid={!!fieldErrors.fullName}
            />
            {fieldErrors.fullName && (
              <p className="text-xs text-destructive">{fieldErrors.fullName}</p>
            )}
          </div>

          {/* Email */}
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

          {/* Password */}
          <div className="space-y-1.5 text-left">
            <Label>Password</Label>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="8+ characters"
                autoComplete="new-password"
                required
                disabled={isLoading}
                className="h-auto rounded-xl py-3 px-4 pr-10"
                aria-invalid={!!fieldErrors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="text-xs text-destructive">{fieldErrors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5 text-left">
            <Label>Confirm Password</Label>
            <div className="relative">
              <Input
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Repeat password"
                autoComplete="new-password"
                required
                disabled={isLoading}
                className="h-auto rounded-xl py-3 px-4 pr-10"
                aria-invalid={!!fieldErrors.confirmPassword}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p className="text-xs text-destructive">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-xl text-sm font-semibold bg-nexus-dark text-white hover:bg-slate-800 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/80"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
}
