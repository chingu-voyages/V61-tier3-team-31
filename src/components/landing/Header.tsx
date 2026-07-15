import { SunMedium } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/queries";
import { isStaffRole } from "@/lib/auth/navigation";
import { Logo } from "../Logo";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import { ProfileMenu } from "../ProfileMenu";

export async function Header() {
  const user = await getCurrentUser();
  const workspaceHref = user ? (isStaffRole(user.role) ? "/admin" : "/app") : "/login";
  return (
    <header className="h-16 sm:h-20 fixed top-0 z-50 w-full border-b border-secondary bg-background/80 backdrop-blur">
      <div className="h-full mx-auto flex max-w-6xl items-center justify-between px-6 sm:px-10 lg:px-12">
        <div className="flex items-center gap-3">
          <Logo className="size-8 shrink-0" />
          <span className="font-outfit text-xl font-medium tracking-wide">Cohorix</span>
        </div>
        <div className="flex items-center gap-4">
          <SunMedium className="w-5 h-5" />
          {/* <Moon /> */}

          {user ? (
            <ProfileMenu avatarSize="size-10" side="bottom" align="end" />
          ) : (
            <Link href={workspaceHref} className={buttonVariants()}>
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
