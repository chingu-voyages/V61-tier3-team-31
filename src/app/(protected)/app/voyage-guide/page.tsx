import Link from "next/link";
import {
  BookOpenText,
  CheckCircle2,
  Compass,
  HeartHandshake,
  MessageCircle,
  Rocket,
  UsersRound,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { requireUser } from "@/lib/auth/queries";
import { requireMemberVoyage } from "@/lib/voyages/require-member-voyage";

const prepChecklist = [
  "Finish your profile so teammates know who you are and what you bring.",
  "Read this Course Guide and follow the Code of Conduct.",
  "Confirm that your weekly availability still matches what you promised in your application.",
  "Join the course communication channel so you do not miss kickoff updates.",
  "Track everything in your Onboarding checklist until it reaches 100%.",
];

const workingHabits = [
  {
    title: "Communicate early",
    body: "Share progress and blockers in the team channel. Silence creates more stress than asking for help.",
  },
  {
    title: "Honor your commitments",
    body: "If you said you can give several hours this week, show up for that. If something changes, tell the team as soon as you know.",
  },
  {
    title: "Stay curious, not perfect",
    body: "Courses exist so you can practice real collaboration. You do not need every answer on day one — you need steady contribution.",
  },
  {
    title: "Respect shared deadlines",
    body: "Team milestones only work when everyone protects the plan. Raise risks early instead of disappearing near a deadline.",
  },
];

const conductRules = [
  "Treat every participant with respect, including when you disagree.",
  "Welcome different skill levels, timezones, and perspectives.",
  "No harassment, discrimination, personal attacks, or gatekeeping.",
  "Give feedback on work and ideas — never on a person’s worth.",
  "Keep project discussion in the official team channel so nobody is left out.",
];

export default async function VoyageGuidePage() {
  const user = await requireUser();
  await requireMemberVoyage(user.id);

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-8">
      <header>
        <p className="text-sm font-medium text-primary">Participant resource</p>
        <h1 className="mt-2 font-outfit text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Course Guide
        </h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
          This is your prep handbook for Cohorix courses: how the program works, how we treat each
          other, and what to finish before team work begins.
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Compass className="size-5" />
        </div>
        <h2 className="mt-4 font-outfit text-xl font-semibold text-foreground">
          Welcome to the Course
        </h2>
        <div className="mt-3 space-y-4 text-sm leading-7 text-muted-foreground">
          <p>
            A course is a multi-week collaborative build. You join a small remote team, practice
            real product work, and leave with portfolio evidence plus teamwork experience — not only
            solo tutorials.
          </p>
          <p>
            In Cohorix, your path looks like this: apply → wait for review → get accepted → complete
            onboarding → get matched into a team → build together. This guide covers the preparation
            phase between acceptance and active team work.
          </p>
          <p>
            Expect to invest focused weekly time, communicate often, and finish what you start. The
            course is free to join, but it is not free of commitment.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Rocket className="size-5" />
        </div>
        <h2 className="mt-4 font-outfit text-xl font-semibold text-foreground">How We Work</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Successful course teams treat communication as part of the product work. Use these habits
          from day one.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {workingHabits.map((habit) => (
            <div key={habit.title} className="rounded-2xl border border-border bg-muted/30 p-4">
              <h3 className="text-sm font-semibold text-foreground">{habit.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{habit.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm leading-6 text-muted-foreground">
          <p className="font-medium text-foreground">Team channel rule</p>
          <p className="mt-1">
            When your team space opens, keep course discussion in the official channel. Side chats
            leave people out and make collaboration harder to recover.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <HeartHandshake className="size-5" />
        </div>
        <h2 className="mt-4 font-outfit text-xl font-semibold text-foreground">Code of Conduct</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          We want a team environment that is ambitious and still psychologically safe. These rules
          are non-negotiable.
        </p>
        <ul className="mt-5 space-y-3">
          {conductRules.map((rule) => (
            <li
              key={rule}
              className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"
            >
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{rule}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm leading-7 text-muted-foreground">
          If something feels off, speak with your team lead or contact a platform organizer. Looking
          after the culture is part of being a good teammate.
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <BookOpenText className="size-5" />
        </div>
        <h2 className="mt-4 font-outfit text-xl font-semibold text-foreground">Getting Started</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Before team matching, finish your onboarding prep. Mark each item in the Onboarding
          checklist as you complete it.
        </p>
        <ol className="mt-5 space-y-3">
          {prepChecklist.map((item, index) => (
            <li
              key={item}
              className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {index + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/app/onboarding" className={cn(buttonVariants())}>
            <CheckCircle2 className="size-4" />
            Open onboarding checklist
          </Link>
          <Link href="/app/profile" className={cn(buttonVariants({ variant: "outline" }))}>
            <UsersRound className="size-4" />
            Update profile
          </Link>
          <Link href="/app/overview" className={cn(buttonVariants({ variant: "outline" }))}>
            <MessageCircle className="size-4" />
            Back to application status
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-sm leading-7 text-muted-foreground">
        <p className="font-medium text-foreground">What comes after onboarding?</p>
        <p className="mt-2">
          Completing the checklist marks you as prepared for this course. Team assignment, sprint
          rituals, and Demo Day come next as those parts of Cohorix come online. Until then, stay
          reachable in the communication channel and keep your profile accurate.
        </p>
      </section>
    </div>
  );
}
