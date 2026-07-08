"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getSafeInternalRedirect } from "@/lib/auth/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/schemas/login.schema";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { MessageForm } from "@/components/form/MessageForm";
import { loginFields } from "@/constants/auth/login-fields";
import { InputForm } from "@/components/form/InputForm";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const justVerified = searchParams.get("verified") === "email";
  const redirect = searchParams.get("redirect");

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    clearErrors("root");

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        setError("root", {
          type: "server",
          message: error.message.includes("already registered")
            ? "Please verify your email before signing in. Check your inbox for the verification link."
            : "Invalid email or password. Please try again.",
        });

        return;
      }

      const destination = getSafeInternalRedirect(redirect) ?? "/app/overview";
      router.replace(destination);
    } catch {
      setError("root", {
        type: "server",
        message: "An unexpected error occurred. Please try again.",
      });
    }
  }

  return (
    <AuthCard title="Welcome back" descr="Sign in to your Cohorix workspace.">
      {justVerified && (
        <MessageForm type="success" message="Email verified successfully. You can now sign in." />
      )}
      {errors.root && <MessageForm type="error" message={errors.root.message} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {loginFields.map((field) => (
          <InputForm
            key={field.name}
            name={field.name}
            control={control}
            label={field.label}
            placeholder={field.placeholder}
            autoComplete={field.autoComplete}
            type={field.type}
            disabled={isSubmitting}
            eyeBtn={field.eyeBtn}
            link={field.link}
          />
        ))}

        <Button type="submit" disabled={isSubmitting} className="w-full h-11 font-semibold">
          {isSubmitting ? (
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
        Don&apos;t have an account?
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline underline-offset-4 ml-1"
        >
          Sign up
        </Link>
      </p>
    </AuthCard>
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
