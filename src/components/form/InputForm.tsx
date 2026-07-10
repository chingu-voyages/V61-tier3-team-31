import { useState } from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { PasswordEyeBtn } from "./PasswordEyeBtn";
import Link from "next/link";
import { cn } from "@/lib/utils";

type FormInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  type?: React.ComponentProps<"input">["type"];
  disabled?: boolean;
  autoComplete?: string;
  leftIcon?: React.ReactNode;
  eyeBtn?: boolean;
  link?: {
    text: string;
    href: string;
  };
};

export function InputForm<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = "text",
  disabled = false,
  autoComplete,
  leftIcon,
  eyeBtn = false,
  link,
}: FormInputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="relative">
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

            {link && (
              <Link
                href={link.href}
                className="text-xs font-semibold text-primary hover:underline underline-offset-4"
              >
                {link.text}
              </Link>
            )}
          </div>
          <div className="relative">
            {leftIcon && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {leftIcon}
              </div>
            )}
            <Input
              {...field}
              id={field.name}
              type={eyeBtn && showPassword ? "text" : type}
              placeholder={placeholder}
              disabled={disabled}
              autoComplete={autoComplete}
              aria-invalid={fieldState.invalid}
              className={cn(leftIcon && "pl-10", eyeBtn && "pr-10")}
            />
            {eyeBtn && (
              <PasswordEyeBtn
                show={showPassword}
                onToggle={() => setShowPassword((prev) => !prev)}
              />
            )}
          </div>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
