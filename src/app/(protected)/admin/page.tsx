import { requireStaff } from "@/lib/auth/queries";
import AdminOverview from "./_components/admin-overview";

export default async function AdminPage() {
  await requireStaff();

  return <AdminOverview />;
}
