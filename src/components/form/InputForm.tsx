import { useState } from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { PasswordEyeBtn } from "./PasswordEyeBtn";

type FormInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  type?: React.ComponentProps<"input">["type"];
  disabled?: boolean;
  autoComplete?: string;
  eyeBtn?: boolean;
};

export function InputForm<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = "text",
  disabled = false,
  autoComplete,
  eyeBtn = false,
}: FormInputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="relative">
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <div className="relative">
            <Input
              {...field}
              id={field.name}
              type={eyeBtn && showPassword ? "text" : type}
              placeholder={placeholder}
              disabled={disabled}
              autoComplete={autoComplete}
              aria-invalid={fieldState.invalid}
              className={eyeBtn ? "pr-10" : ""}
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
