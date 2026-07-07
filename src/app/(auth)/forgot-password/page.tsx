"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { NexusLogo } from "@/components/nexus-logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Send, CheckCircle, Loader2 } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
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

      setSubmittedEmail(data.email);
      setIsSuccess(true);
    } catch {
      setError("An unexpected error occurred. Please try again.");
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
            We sent a reset link to{" "}
            <span className="font-medium text-card-foreground">{submittedEmail}</span>
          </p>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div className="bg-muted rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setSubmittedEmail("");
                }}
                className="font-semibold text-primary hover:underline cursor-pointer"
              >
                try another email address
              </button>
              .
            </p>
          </div>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full py-3 bg-card border border-border rounded-xl text-sm font-medium text-card-foreground hover:bg-muted transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="p-8 pb-6 border-b border-border flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-nexus-dark flex items-center justify-center mb-6 shadow-sm">
          <NexusLogo className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-outfit font-bold text-card-foreground mb-2">
          Forgot password?
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <div className="p-8">
        {error && (
          <div className="mb-4 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <Label>Email address</Label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="email"
                type="email"
                placeholder="name@company.com"
                autoComplete="email"
                required
                autoFocus
                disabled={isLoading}
                className="h-auto rounded-xl py-3 pl-10 pr-4"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-xl text-sm font-semibold bg-nexus-dark text-white hover:bg-slate-800 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/80"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Reset Link
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </>
  );
}
