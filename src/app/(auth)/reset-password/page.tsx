"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { NexusLogo } from "@/components/nexus-logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle, Shield, Loader2 } from "lucide-react";
import { resetPasswordSchema, type ResetPasswordForm } from "@/schemas/reset-password.schema";

type FieldErrors = Partial<Record<keyof ResetPasswordForm, string>>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user }, error: userError }) => {
      if (userError || !user) {
        router.push("/login");
      }
    });
  }, [router]);

  const isValid = password.length >= 8 && password === confirmPassword;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});

    const data: ResetPasswordForm = { password, confirmPassword };
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
      const { error: updateError } = await supabase.auth.updateUser({ password: data.password });

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
      <>
        <div className="p-8 pb-6 border-b border-border flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-nexus-dark flex items-center justify-center mb-6 shadow-sm">
            <NexusLogo className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-outfit font-bold text-card-foreground mb-2">
            Password reset!
          </h1>
          <p className="text-sm text-muted-foreground">
            Your password has been updated successfully.
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
              You can now sign in with your new password.
            </p>
          </div>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full py-3 bg-nexus-dark text-white dark:bg-primary dark:text-primary-foreground rounded-xl text-sm font-semibold hover:bg-slate-800 dark:hover:bg-primary/80 transition-colors shadow-sm cursor-pointer"
          >
            Sign In
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
          Set new password
        </h1>
        <p className="text-sm text-muted-foreground">
          Create a new strong password for your account.
        </p>
      </div>

      <div className="p-8">
        {error && (
          <div className="mb-4 rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div className="space-y-1.5 text-left">
            <Label>New password</Label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                  setFieldErrors({});
                }}
                className="h-auto rounded-xl py-3 pl-10 pr-10"
                required
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Password strength indicator */}
            {password.length > 0 && (
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      password.length >= 12
                        ? "bg-primary"
                        : password.length >= 8
                          ? "bg-amber-500"
                          : "bg-destructive"
                    }`}
                    style={{ width: `${Math.min(100, (password.length / 12) * 100)}%` }}
                  />
                </div>
                <span
                  className={`text-[10px] font-semibold ${
                    password.length >= 12
                      ? "text-primary"
                      : password.length >= 8
                        ? "text-amber-500"
                        : "text-destructive"
                  }`}
                >
                  {password.length >= 12 ? "Strong" : password.length >= 8 ? "Good" : "Weak"}
                </span>
              </div>
            )}
            {fieldErrors.password && (
              <p className="text-xs text-destructive">{fieldErrors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5 text-left">
            <Label>Confirm password</Label>
            <div className="relative">
              <Shield className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type={showConfirm ? "text" : "password"}
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                  setFieldErrors({});
                }}
                className={`h-auto rounded-xl py-3 pl-10 pr-10 ${
                  confirmPassword && password !== confirmPassword
                    ? "!border-destructive focus-visible:!ring-destructive/20"
                    : confirmPassword && password === confirmPassword
                      ? "!border-primary/50 focus-visible:!ring-primary/20"
                      : ""
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-[11px] text-destructive mt-1">Passwords do not match.</p>
            )}
            {confirmPassword && password === confirmPassword && (
              <p className="text-[11px] text-primary mt-1">Passwords match.</p>
            )}
            {fieldErrors.confirmPassword && (
              <p className="text-xs text-destructive">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading || !isValid}
            className="w-full h-11 rounded-xl text-sm font-semibold bg-nexus-dark text-white hover:bg-slate-800 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/80"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
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
