import type { Database } from "@/types/database";

type PlatformRole = Database["public"]["Enums"]["platform_role"];

export type UserRole = PlatformRole | "user";

export function canAccess(requiredRole: UserRole, userRole: UserRole): boolean {
  const hierarchy: Record<UserRole, number> = {
    user: 0,
    moderator: 1,
    admin: 2,
  };

  return hierarchy[userRole] >= hierarchy[requiredRole];
}

export function isStaff(role: UserRole): boolean {
  return role === "admin" || role === "moderator";
}

export function isAdmin(role: UserRole): boolean {
  return role === "admin";
}
