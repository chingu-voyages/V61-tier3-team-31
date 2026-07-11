import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/queries";
import { hasSubmittedApplication } from "@/lib/auth/applications";
import { getPostAuthRedirect } from "@/lib/auth/navigation";

export default async function DashboardPage() {
  const user = await requireUser();
  const hasApplication = await hasSubmittedApplication(user.id);

  redirect(getPostAuthRedirect(user.role, null, hasApplication));
}
