"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Image from "next/image";
import { useAuth } from "@/lib/auth/auth-context";
import { useAvatar } from "@/hooks/use-avatar";

interface ProfileMenuProps {
  isExpanded?: boolean;
  role?: string;
  status?: string;
  avatarSize?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "end";
}

export function ProfileMenu({
  isExpanded = false,
  role,
  status,
  avatarSize,
  side = "top",
  align = "start",
}: ProfileMenuProps) {
  const { profile, signOut } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isStaff = role === "admin" || role === "moderator";
  const userName = profile?.full_name ?? "User";
  const avatarUrl = useAvatar(profile?.id, profile?.avatar_path);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await signOut();
      router.replace("/login");
    } catch {
      setIsLoggingOut(false);
      router.replace("/login");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`flex items-center ${
          isExpanded ? "gap-3 px-2 py-1" : "p-0.5"
        } rounded-xl transition-colors min-w-0 flex-1 outline-none hover:bg-foreground/5`}
      >
        <Image
          src={avatarUrl}
          width={32}
          height={32}
          alt={`${userName} avatar`}
          title={userName}
          className={`${avatarSize ?? "size-8"} rounded-full object-cover bg-muted border border-border shrink-0`}
        />

        {isExpanded && (
          <div className="flex-1 overflow-hidden text-left">
            <p className="text-sm font-medium text-foreground truncate">{userName}</p>
            <p className="text-xs capitalize">
              {role}
              {!isStaff && status ? ` · ${status}` : ""}
            </p>
          </div>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side={side}
        align={align}
        sideOffset={8}
        className="min-w-44 bg-secondary border border-border p-1 shadow-xl"
      >
        <DropdownMenuItem
          onClick={() => router.push("/app/profile")}
          className="focus:text-foreground focus:bg-foreground/5 px-2 py-2 text-muted-foreground"
        >
          <User className="size-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-foreground/10" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:text-destructive/60 focus:bg-foreground/5 px-2 py-2"
        >
          <LogOut className="size-4" />
          {isLoggingOut ? "Signing out..." : "Sign Out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
