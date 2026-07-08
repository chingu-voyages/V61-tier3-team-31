import type { RegisterFormData } from "@/schemas/register.schema";

type RegisterField = {
  name: keyof RegisterFormData;
  label: string;
  placeholder: string;
  type?: React.ComponentProps<"input">["type"];
  autoComplete?: string;
  eyeBtn?: boolean;
};

export const registerFields: RegisterField[] = [
  {
    name: "fullName",
    label: "Full Name",
    placeholder: "Enter your name",
    type: "text",
    autoComplete: "name",
  },
  {
    name: "email",
    label: "Email address",
    placeholder: "name@company.com",
    type: "email",
    autoComplete: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "8+ characters",
    type: "password",
    autoComplete: "new-password",
    eyeBtn: true,
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    placeholder: "Repeat password",
    type: "password",
    autoComplete: "new-password",
    eyeBtn: true,
  },
];
