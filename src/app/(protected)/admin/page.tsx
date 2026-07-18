import { requireStaff } from "@/lib/auth/queries";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  await requireStaff();

  redirect("/admin/overview");
}
