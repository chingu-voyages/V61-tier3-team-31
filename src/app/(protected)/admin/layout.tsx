import { AuthProvider } from "@/lib/auth/auth-context";
import { requireStaff } from "@/lib/auth/queries";
import { ProtectedShell } from "@/components/protected-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireStaff();

  return (
    <AuthProvider initialUser={user}>
      <ProtectedShell role={user.role}>{children}</ProtectedShell>
    </AuthProvider>
  );
}
