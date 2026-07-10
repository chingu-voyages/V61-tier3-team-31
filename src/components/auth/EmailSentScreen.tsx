import type { ReactNode } from "react";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { AuthCard } from "./AuthCard";

type EmailSentScreenProps = {
  title: string;
  descr: string;
  textBtn?: string;
  href?: string;
  icon?: ReactNode;
  children?: ReactNode;
};

export function EmailSentScreen({
  title,
  descr,
  textBtn = "Go to Sign In",
  href = "/login",
  icon,
  children,
}: EmailSentScreenProps) {
  return (
    <AuthCard title={title} descr={descr}>
      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
      </div>

      {children}

      <Link
        href={href}
        className="flex items-center justify-center gap-2 w-full py-3 bg-card border border-border rounded-xl text-sm font-medium text-card-foreground hover:bg-muted transition-colors shadow-sm cursor-pointer"
      >
        {icon}
        {textBtn}
      </Link>
    </AuthCard>
  );
}
