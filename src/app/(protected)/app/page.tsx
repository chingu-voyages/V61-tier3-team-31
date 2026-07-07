import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/queries";
import { getDashboardRedirect } from "@/lib/auth/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  redirect(getDashboardRedirect(user.role));
}
