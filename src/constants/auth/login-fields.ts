import type { LoginFormData } from "@/schemas/login.schema";

type LoginField = {
  name: keyof LoginFormData;
  label: string;
  placeholder: string;
  type?: React.ComponentProps<"input">["type"];
  autoComplete?: string;
  eyeBtn?: boolean;
  link?: {
    text: string;
    href: string;
  };
};

export const loginFields: LoginField[] = [
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
    link: {
      text: "Forgot password?",
      href: "/forgot-password",
    },
  },
];
