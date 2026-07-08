import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { AuthCard } from "./AuthCard";

export function CheckEmailScreen() {
  return (
    <AuthCard
      title="Check your email"
      descr="We sent a verification link to your email. Click the link to activate your account."
    >
      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
      </div>
      <Link
        href="/login"
        className="flex items-center justify-center gap-2 w-full py-3 bg-card border border-border rounded-xl text-sm font-medium text-card-foreground hover:bg-muted transition-colors shadow-sm cursor-pointer"
      >
        Go to Sign In
      </Link>
    </AuthCard>
  );
}
