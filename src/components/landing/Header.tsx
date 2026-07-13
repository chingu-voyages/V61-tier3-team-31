import { ArrowRight, SunMedium } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/queries";
import { isStaffRole } from "@/lib/auth/navigation";
import { Logo } from "../Logo";
import { buttonVariants } from "../ui/button";
import { header } from "motion/react-client";
import Link from "next/link";

export async function Header() {
  const user = await getCurrentUser();
  const workspaceHref = user ? (isStaffRole(user.role) ? "/admin" : "/app") : "/register";
  return (
    <header className="fixed top-0 z-50 w-full border-b border-secondary bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-10 lg:px-12">
        <div className="flex items-center gap-3">
          <Logo className="w-8 h-8 shrink-0" />
          <span className="font-outfit text-xl font-medium tracking-wide">Cohorix</span>
        </div>
        <div className="flex items-center gap-4">
          <SunMedium className="w-5 h-5" />
          {/* <Moon /> */}
          <Link href={workspaceHref} className={buttonVariants()}>
            {user ? "Open workspace" : "Log in"}
          </Link>
        </div>
      </div>
    </header>
  );
}
