"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/sidebar";

type DashboardView =
  | "overview"
  | "voyages"
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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, role, isLoading } = useAuth();
  const router = useRouter();
  const [currentView, setCurrentView] = useState<DashboardView>("overview");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex bg-background text-foreground min-h-screen font-sans transition-colors">
      <Sidebar role={role ?? "user"} currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex-1 flex flex-col items-stretch overflow-hidden h-screen overflow-y-auto">
        <main className="p-8 max-w-[1400px] w-full mx-auto space-y-8 pb-12">{children}</main>
      </div>
    </div>
  );
}
