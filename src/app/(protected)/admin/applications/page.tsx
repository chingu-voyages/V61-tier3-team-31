import { listAdminApplications } from "@/lib/admin/list-applications";
import { AdminApplicationsClient } from "./applications-client";

export default async function AdminApplicationsPage() {
  let applications: Awaited<ReturnType<typeof listAdminApplications>> = [];
  let loadError: string | null = null;

  try {
    applications = await listAdminApplications();
  } catch {
    loadError = "We could not load applications right now.";
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Admin workspace</p>
        <h1 className="mt-2 font-outfit text-[28px] font-medium tracking-tight text-foreground">
          Applications
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review submitted applications and grant participant access by accepting them.
        </p>
      </div>

      {loadError ? (
        <section className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive">
          {loadError}
        </section>
      ) : (
        <AdminApplicationsClient initialApplications={applications} />
      )}
    </div>
  );
}
