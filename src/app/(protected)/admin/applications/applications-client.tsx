"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, CircleAlert, Clock3, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminApplicationListItem } from "@/lib/admin/list-applications";
import { cn } from "@/lib/utils";
import { acceptApplication, rejectApplication } from "./actions";

const statusStyles: Record<string, string> = {
  submitted: "bg-muted text-muted-foreground border-border",
  under_review: "bg-secondary text-secondary-foreground border-border",
  accepted: "bg-primary/10 text-primary border-primary/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  withdrawn: "bg-muted text-muted-foreground border-border",
};

function formatLabel(value: string | null) {
  if (!value) return "—";
  return value.replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

export function AdminApplicationsClient({
  initialApplications,
}: {
  initialApplications: AdminApplicationListItem[];
}) {
  const [applications, setApplications] = useState(initialApplications);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function decide(applicationId: string, decision: "accept" | "reject") {
    if (pendingId) return;

    setError(null);
    setMessage(null);
    setPendingId(applicationId);

    startTransition(async () => {
      const result =
        decision === "accept"
          ? await acceptApplication({ applicationId })
          : await rejectApplication({ applicationId });

      if ("error" in result) {
        setError(result.error);
        setPendingId(null);
        return;
      }

      setApplications((current) =>
        current.map((application) => {
          if (application.id !== applicationId) return application;

          return {
            ...application,
            status: decision === "accept" ? "accepted" : "rejected",
            decidedAt: new Date().toISOString(),
            enrollmentId: decision === "accept" ? (application.enrollmentId ?? "pending") : null,
            enrollmentStatus: decision === "accept" ? "invited" : null,
          };
        }),
      );
      setMessage(
        decision === "accept"
          ? "Application accepted. Participant enrollment is ready."
          : "Application rejected.",
      );
      setPendingId(null);
    });
  }

  if (applications.length === 0) {
    return (
      <section className="rounded-2xl border border-border bg-card p-8 text-sm text-muted-foreground shadow-sm">
        No submitted applications yet.
      </section>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {message && (
        <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/10 p-4 text-sm text-primary">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          <p>{message}</p>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <ul className="divide-y divide-border">
          {applications.map((application) => {
            const canDecide =
              application.status === "submitted" || application.status === "under_review";
            const isBusy = pendingId === application.id;

            return (
              <li
                key={application.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg truncate text-foreground">
                      {application.applicantName}
                    </h2>
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize",
                        statusStyles[application.status] ?? statusStyles.withdrawn,
                      )}
                    >
                      {formatLabel(application.status)}
                    </span>
                    {application.enrollmentStatus && (
                      <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground capitalize">
                        Enrollment: {application.enrollmentStatus}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {application.voyageName} · {formatLabel(application.preferredRole)} ·{" "}
                    {formatLabel(application.experience)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Submitted {formatDate(application.submittedAt)}
                    {application.timezone ? ` · ${application.timezone}` : ""}
                    {application.weeklyHours ? ` · ${application.weeklyHours}h/week` : ""}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {canDecide ? (
                    <>
                      <Button
                        variant="outline"
                        disabled={Boolean(pendingId)}
                        onClick={() => decide(application.id, "reject")}
                      >
                        <XCircle className="size-4" />
                        {isBusy ? "Saving…" : "Reject"}
                      </Button>
                      <Button
                        disabled={Boolean(pendingId)}
                        onClick={() => decide(application.id, "accept")}
                      >
                        <CheckCircle2 className="size-4" />
                        {isBusy ? "Saving…" : "Accept"}
                      </Button>
                    </>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock3 className="size-4" />
                      Decision recorded
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
