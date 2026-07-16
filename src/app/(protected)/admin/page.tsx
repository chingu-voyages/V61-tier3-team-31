import { Shield } from "lucide-react";
import { requireStaff } from "@/lib/auth/queries";

export default async function AdminPage() {
  const user = await requireStaff();

  return (
    <div className="flex-1 flex flex-col">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            <h1 className="text-xl font-semibold">Cohorix Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-600 dark:text-zinc-400 capitalize">{user.role}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-semibold tracking-tight mb-6">Admin Dashboard</h2>

        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
          <p className="text-zinc-600 dark:text-zinc-400">
            Welcome, {user.profile?.full_name ?? "Admin"}! The admin panel is ready. Management
            features coming soon.
          </p>
        </div>
      </main>
    </div>
  );
}
