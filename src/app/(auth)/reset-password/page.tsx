"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Lock, Shield, Loader2 } from "lucide-react";
import { resetPasswordSchema, type ResetPasswordForm } from "@/schemas/reset-password.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { EmailSentScreen } from "@/components/auth/EmailSentScreen";
import { AuthCard } from "@/components/auth/AuthCard";
import { MessageForm } from "@/components/form/MessageForm";
import { InputForm } from "@/components/form/InputForm";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user }, error: userError }) => {
      if (userError || !user) {
        router.push("/login");
      }
    });
  }, [router]);

  async function onSubmit(data: ResetPasswordForm) {
    clearErrors();
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: data.password });

      if (error) {
        setError("root", {
          type: "server",
          message: error.message,
        });
        return;
      }

      setIsSuccess(true);
    } catch {
      setError("root", {
        type: "server",
        message: "Something went wrong. Please try again.",
      });
    }
  }

  if (isSuccess) {
    return (
      <>
        <EmailSentScreen
          title="Password reset!"
          descr="Your password has been updated successfully."
          textBtn="Sign In"
        >
          <div className="bg-muted rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              You can now sign in with your new password.
            </p>
          </div>
        </EmailSentScreen>
      </>
    );
  }

  return (
    <>
      <AuthCard title="Set new password" descr="Create a new strong password for your account.">
        {errors.root && <MessageForm type="error" message={errors.root.message} />}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputForm
            name="password"
            control={control}
            label="Password"
            placeholder="8+ characters"
            type="password"
            autoComplete="new-password"
            disabled={isSubmitting}
            eyeBtn={true}
            leftIcon={<Lock className="w-4 h-4" />}
          />

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

          {/* Confirm Password */}
          <InputForm
            name="confirmPassword"
            control={control}
            label="Confirm Password"
            placeholder="Repeat password"
            type="password"
            autoComplete="new-password"
            disabled={isSubmitting}
            eyeBtn={true}
            leftIcon={<Shield className="w-4 h-4" />}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full h-11 font-semibold">
            {isSubmitting ? (
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
      </AuthCard>
    </>
  );
}
