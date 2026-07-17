"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

type DashboardView =
  | "overview"
  | "courses"
  | "applications"
  | "participants"
  | "matching"
  | "analytics"
  | "teams"
  | "announcements"
  | "calendar"
  | "ui-components"
  | "apply"
  | "onboarding"
  | "profile"
  | "settings";

function getCurrentView(pathname: string, role: string): DashboardView {
  if (pathname === "/app" || pathname === "/app/overview" || pathname === "/admin") {
    return "overview";
  }

  const leaf = pathname.split("/").pop() ?? "overview";

  if (role !== "admin" && role !== "moderator" && leaf === "admin") {
    return "overview";
  }

  return leaf as DashboardView;
}

export function ProtectedShell({
  children,
  role,
  status,
}: {
  children: React.ReactNode;
  role: string;
  status?: string;
}) {
  const pathname = usePathname();
  const currentView = getCurrentView(pathname, role);

  return (
    <div className="flex bg-background text-foreground min-h-screen font-sans transition-colors">
      <Sidebar role={role} status={status} currentView={currentView} />
      <div className="flex-1 flex flex-col items-stretch overflow-hidden h-screen overflow-y-auto">
        <main className="p-8 max-w-[1400px] w-full mx-auto space-y-8 pb-12">{children}</main>
      </div>
    </div>
  );
}
