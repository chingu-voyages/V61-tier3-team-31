"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user, profile, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Nexus</h1>
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {profile?.full_name ?? user.email}
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-semibold tracking-tight mb-6">Dashboard</h2>

        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <p className="text-zinc-600 dark:text-zinc-400">
            Welcome, {profile?.full_name ?? "Participant"}! Your dashboard is ready. More features
            coming soon.
          </p>
        </div>
      </main>
    </div>
  );
}
