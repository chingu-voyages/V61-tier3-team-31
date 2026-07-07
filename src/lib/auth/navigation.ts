import type { UserRole } from "@/lib/auth/guards";

const INTERNAL_ORIGIN = "http://localhost";
const STAFF_ROLES: UserRole[] = ["admin", "moderator"];
const AUTH_REDIRECT_PATHS = new Set(["/login", "/register", "/forgot-password"]);

export function isStaffRole(role: UserRole): boolean {
  return STAFF_ROLES.includes(role);
}

export function getSafeInternalRedirect(target: string | null | undefined): string | null {
  if (!target) {
    return null;
  }

  try {
    const url = new URL(target, INTERNAL_ORIGIN);

    if (url.origin !== INTERNAL_ORIGIN) {
      return null;
    }

    if (!url.pathname.startsWith("/") || url.pathname.startsWith("//")) {
      return null;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

export function shouldRedirectAuthenticatedUsersAwayFrom(pathname: string): boolean {
  return AUTH_REDIRECT_PATHS.has(pathname) && pathname !== "/reset-password";
}

export function getPostLoginRedirect(role: UserRole, redirect: string | null | undefined): string {
  const safeRedirect = getSafeInternalRedirect(redirect);

  if (safeRedirect) {
    if (safeRedirect === "/admin" || safeRedirect.startsWith("/admin/")) {
      return isStaffRole(role) ? safeRedirect : "/app";
    }

    return safeRedirect;
  }

  return isStaffRole(role) ? "/admin" : "/app";
}

export function getDashboardRedirect(role: UserRole): string {
  return isStaffRole(role) ? "/admin" : "/app/overview";
}
