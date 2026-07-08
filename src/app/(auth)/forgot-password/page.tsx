"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordForm } from "@/schemas/forgot-password.schema";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Send, CheckCircle, Loader2 } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { MessageForm } from "@/components/form/MessageForm";
import { InputForm } from "@/components/form/InputForm";
import { EmailSentScreen } from "@/components/auth/EmailSentScreen";

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ForgotPasswordForm) {
    clearErrors("root");
    try {
      const supabase = createClient();

      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });

      if (error) {
        setError("root", {
          type: "server",
          message: "Unable to send reset email. Please try again.",
        });

        return;
      }

      setSubmittedEmail(data.email);
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
      <EmailSentScreen
        title="Check your email"
        descr={`We sent a reset link to ${submittedEmail}`}
        textBtn="Back to Sign In"
        icon={<ArrowLeft className="w-4 h-4" />}
      >
        <div className="bg-muted rounded-xl border border-border p-4 mb-4">
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
      </EmailSentScreen>
    );
  }

  return (
    <AuthCard title="Forgot password?" descr="Enter your email and we'll send you a reset link.">
      {errors.root && <MessageForm type="error" message={errors.root.message} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputForm
          name="email"
          control={control}
          label="Email address"
          placeholder="name@company.com"
          type="email"
          autoComplete="email"
          disabled={isSubmitting}
          leftIcon={<Mail className="h-4 w-4" />}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full h-11 font-semibold">
          {isSubmitting ? (
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
    </AuthCard>
  );
}
