import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { getCurrentUser } from "@/lib/auth/queries";
import { isStaffRole } from "@/lib/auth/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export async function AuthActionButtons() {
  const user = await getCurrentUser();

  const workspaceHref = user ? (isStaffRole(user.role) ? "/admin" : "/app") : "/register";

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <Link href={workspaceHref} className={buttonVariants({ size: "lg" })}>
        {user ? "Continue to workspace" : "Create account"}

        <ArrowRight className="h-4 w-4" />
      </Link>

      {!user && (
        <Link
          href="/login"
          className={cn(
            buttonVariants({
              variant: "outline",
              size: "lg",
            }),
            "text-muted-foreground",
          )}
        >
          I have an account
        </Link>
      )}
    </div>
  );
}
