import Image from "next/image";
import { Sparkles } from "lucide-react";

import { AuthActionButtons } from "./AuthActionButtons";
import { Section } from "./Section";
const AVATARS = [
  "/avatars/avatar1.jpg",
  "/avatars/avatar2.jpg",
  "/avatars/avatar3.jpg",
  "/avatars/avatar4.jpg",
];

export function HeroSection() {
  return (
    <div className="bg-gradient pt-20">
      <Section className="grid min-h-screen items-center gap-10 py-0 text-center sm:text-left md:grid-cols-2">
        <div>
          <span className="inline-flex rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold tracking-[0.2em] text-muted-foreground gap-4">
            <Sparkles className="size-4 text-primary" /> <span>Course 48 now open</span>
          </span>

          <h1 className="mt-8 font-outfit text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Every cohort.
            <br />
            <span className="text-primary">
              Complete control.
              <br /> One platform.
            </span>
          </h1>

          <p className="max-w-2xl mb-8 mt-4 leading-8">
            A unified platform where teams manage applications, organize participants, and track
            progress — while learners manage their journey, onboarding, and growth in one place.
          </p>
          <AuthActionButtons />

          <div className="flex items-center justify-center sm:justify-start mt-8 md:mt-16">
            {AVATARS.map((avatar, index) => (
              <Image
                key={avatar}
                src={avatar}
                width={32}
                height={32}
                alt={`Participant ${index + 1}`}
                className={`size-8 rounded-full border-2 border-background object-cover ${
                  index !== 0 ? "-ml-3" : ""
                }`}
              />
            ))}

            <span className="ml-4 text-sm text-muted-foreground">
              Already <span className="text-foreground">1,200+</span> participants
            </span>
          </div>
        </div>
        <Image
          src="/hero.png"
          alt="Cohorix application dashboard"
          priority
          width={650}
          height={520}
          className="hidden md:block rounded-xl border border-border shadow-light-green"
        />
      </Section>
    </div>
  );
}
