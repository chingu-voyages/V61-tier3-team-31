"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, Shield } from "lucide-react";

export default function AdminPage() {
  const { user, profile, role, isLoading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || (role !== "admin" && role !== "moderator"))) {
      router.push("/login");
    }
  }, [isLoading, user, role, router]);

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
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            <h1 className="text-xl font-semibold">Nexus Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-600 dark:text-zinc-400 capitalize">{role}</span>
            <button
              onClick={() => signOut()}
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 underline underline-offset-4"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-semibold tracking-tight mb-6">Admin Dashboard</h2>

        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <p className="text-zinc-600 dark:text-zinc-400">
            Welcome, {profile?.full_name ?? "Admin"}! The admin panel is ready. Management features
            coming soon.
          </p>
        </div>
      </main>
    </div>
  );
}
