import {
  ArrowRight,
  CalendarDays,
  Shield,
  Sparkle,
  Sparkles,
  StarCheck,
  Users,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth/queries";
import { isStaffRole } from "@/lib/auth/navigation";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

export async function HeroSection() {
  const user = await getCurrentUser();
  const workspaceHref = user ? (isStaffRole(user.role) ? "/admin" : "/app") : "/register";
  const avatars = [
    "/avatars/avatar1.jpg",
    "/avatars/avatar2.jpg",
    "/avatars/avatar3.jpg",
    "/avatars/avatar4.jpg",
  ];
  return (
    <>
      <div className="bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(74,222,128,0.16),transparent_32%)]">
        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 sm:px-10 lg:px-12">
          <section className="flex flex-1 flex-col justify-center text-center pt-20 sm:text-left">
            <div className="max-w-3xl mb-8">
              <span className="inline-flex rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold tracking-[0.2em] text-muted-foreground space-x-4">
                <Sparkles className="w-4 h-4 text-primary" /> <p>Course 48 now open</p>
              </span>
              <h1 className="mt-8 max-w-4xl font-outfit text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
                {/* Run each voyage from application intake to team kickoff without juggling tools. */}
                Every cohort.
                <br />{" "}
                <span className="text-primary">
                  Complete control.
                  <br /> One platform.
                </span>
                {/* One course. Everything in control. */}
              </h1>
              <p className="mt-4 max-w-2xl text-base text-muted-foreground leading-8">
                A unified platform where teams manage applications, organize participants, and track
                progress — while learners manage their journey, onboarding, and growth in one place.
                {/* A single platform to manage applications, organize teams, track progress, and help
              learners succeed. Cohorix keeps marketing and onboarding at participant workflows
              under */}
                {/* <code> /app</code>, and staff operations under <code>/admin</code>. */}
              </p>
            </div>

            {/* <div className="mt-12 grid gap-4 md:grid-cols-3">
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
          </div> */}

            <div className=" flex flex-col gap-4 sm:flex-row mb-16">
              <Link href={workspaceHref} className={buttonVariants({ size: "lg" })}>
                {user ? "Continue to workspace" : "Create account"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              {!user && (
                <Link
                  href="/login"
                  className={cn(
                    "text-muted-foreground",
                    buttonVariants({ variant: "outline", size: "lg" }),
                  )}
                >
                  I have an account
                </Link>
              )}
            </div>
            <div className="flex items-center justify-center sm:justify-start">
              {avatars.map((avatar, index) => (
                <Image
                  key={avatar}
                  src={avatar}
                  width={32}
                  height={32}
                  alt={`Participant ${index + 1}`}
                  className={`h-8 w-8 rounded-full border-2 border-background object-cover ${
                    index !== 0 ? "-ml-3" : ""
                  }`}
                />
              ))}

              <span className="ml-4 text-sm text-muted-foreground">
                Already <span className="text-foreground">1,200+</span> participants
              </span>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
