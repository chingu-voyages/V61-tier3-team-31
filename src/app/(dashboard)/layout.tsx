"use client";

import { Sidebar } from "@/components/sidebar";
import { DashboardProvider } from "@/lib/auth-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <div className="dark flex h-screen bg-[#0b0c10] overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </DashboardProvider>
  );
}
