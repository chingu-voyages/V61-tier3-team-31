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

function getParticipantHome(hasSubmittedApplication: boolean): string {
  return hasSubmittedApplication ? "/app/overview" : "/app/apply";
}

export function getPostAuthRedirect(
  role: UserRole,
  redirect: string | null | undefined,
  hasSubmittedApplication = false,
): string {
  const safeRedirect = getSafeInternalRedirect(redirect);

  if (safeRedirect) {
    if (safeRedirect === "/admin" || safeRedirect.startsWith("/admin/")) {
      return isStaffRole(role) ? safeRedirect : getParticipantHome(hasSubmittedApplication);
    }

    return safeRedirect;
  }

  if (isStaffRole(role)) {
    return "/admin";
  }

  return getParticipantHome(hasSubmittedApplication);
}

/** @deprecated Use getPostAuthRedirect instead */
export function getPostLoginRedirect(
  role: UserRole,
  redirect: string | null | undefined,
  hasSubmittedApplication = false,
): string {
  return getPostAuthRedirect(role, redirect, hasSubmittedApplication);
}

export function getDashboardRedirect(role: UserRole, hasSubmittedApplication = false): string {
  if (isStaffRole(role)) {
    return "/admin";
  }

  return getParticipantHome(hasSubmittedApplication);
}
