import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/queries";
import { getDashboardRedirect } from "@/lib/auth/navigation";

export default async function DashboardPage() {
  const user = await requireUser();

  redirect(getDashboardRedirect(user.role));
}
