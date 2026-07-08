import Link from "next/link";
import { ArrowRight, CalendarDays, Shield, Users } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/queries";
import { isStaffRole } from "@/lib/auth/navigation";

export default async function Home() {
  const user = await getCurrentUser();
  const workspaceHref = user ? (isStaffRole(user.role) ? "/admin" : "/app") : "/register";

  return (
    <main className="relative flex-1 overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(74,222,128,0.16),transparent_32%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between gap-4">
          <div>
            <div className="font-outfit text-2xl font-semibold tracking-tight">Nexus</div>
            <p className="text-sm text-muted-foreground">Voyage management platform</p>
          </div>
          <div className="flex items-center gap-3">
            {!user && (
              <Link
                href="/login"
                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Sign in
              </Link>
            )}
            <Link
              href={workspaceHref}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:opacity-90"
            >
              {user ? "Open workspace" : "Get started"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </header>

        <section className="flex flex-1 flex-col justify-center py-20 lg:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Public landing plus dedicated role zones
            </span>
            <h1 className="mt-8 max-w-4xl font-outfit text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
              Run each voyage from application intake to team kickoff without juggling tools.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Nexus keeps marketing and onboarding at <code>/</code>, participant workflows under
              <code> /app</code>, and staff operations under <code>/admin</code>.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur">
              <Shield className="h-6 w-6 text-foreground" />
              <h2 className="mt-4 text-lg font-semibold">Staff workspace</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Review applications, manage participants, and coordinate matching in the dedicated
                <code> /admin</code> zone.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur">
              <Users className="h-6 w-6 text-foreground" />
              <h2 className="mt-4 text-lg font-semibold">Participant workspace</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Give applicants and members a focused path for onboarding, status tracking, and
                voyage tasks under <code>/app</code>.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur">
              <CalendarDays className="h-6 w-6 text-foreground" />
              <h2 className="mt-4 text-lg font-semibold">Public entry point</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Keep the root route open for product story, onboarding CTA, and a clean first
                impression before authentication.
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <Link
              href={workspaceHref}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-colors hover:opacity-90"
            >
              {user ? "Continue to workspace" : "Create account"}
              <ArrowRight className="h-4 w-4" />
            </Link>
            {!user && (
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                I already have an account
              </Link>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
