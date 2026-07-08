"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "@/schemas/register.schema";
import { InputForm } from "@/components/form/InputForm";
import { AuthCard } from "@/components/auth/AuthCard";
import { MessageForm } from "@/components/form/MessageForm";
import { registerFields } from "@/constants/auth/register-fields";
import { CheckEmailScreen } from "@/components/auth/CheckEmailScreen";

export default function RegisterPage() {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: RegisterFormData) {
    clearErrors("root");

    try {
      const supabase = createClient();

      const { data: authData, error } = await supabase.auth.signUp({
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
        const isEmailExists = error.message.includes("already registered");

        setError(isEmailExists ? "email" : "root", {
          type: "server",
          message: isEmailExists
            ? "This email is already registered."
            : "Unable to create your account. Please try again.",
        });

        return;
      }

      setIsSuccess(true);
    } catch {
      setError("root", {
        type: "server",
        message: "Unable to create your account. Please try again.",
      });
    }
  }

  if (isSuccess) {
    return <CheckEmailScreen />;
  }

  return (
    <AuthCard title="Create account" descr="Join Cohorix and start your journey.">
      {errors.root && <MessageForm type="error" message={errors.root.message} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {registerFields.map((field) => (
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
          />
        ))}

        {/* Submit */}
        <Button type="submit" disabled={isSubmitting} className="w-full h-11 font-semibold">
          {isSubmitting ? (
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
        Already have an account?
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline underline-offset-4 ml-1"
        >
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
