"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="flex bg-background text-foreground min-h-screen font-sans transition-colors h-screen overflow-hidden">
      {/* Desktop sidebar — always visible */}
      <div className="hidden lg:block shrink-0">
        <Sidebar role={role} status={status} currentView={currentView} />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar drawer */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-[260px] lg:hidden transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          role={role}
          status={status}
          currentView={currentView}
          onNavClick={closeMobile}
          hideCollapse
        />
      </div>

      {/* Main content */}
      <div
        id="main-scroll-container"
        className="flex-1 flex flex-col items-stretch overflow-y-auto"
      >
        {/* Mobile header */}
        <div className="sticky top-0 z-30 lg:hidden flex items-center h-14 px-4 bg-background/90 backdrop-blur-md border-b border-border">
          <button
            onClick={mobileOpen ? closeMobile : () => setMobileOpen(true)}
            className="p-2 -ml-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-subtle transition-colors cursor-pointer"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <main className="p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto space-y-6 lg:space-y-8 pb-12">
          {children}
        </main>
      </div>
    </div>
  );
}
