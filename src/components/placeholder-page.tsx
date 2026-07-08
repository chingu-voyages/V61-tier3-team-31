import type { ReactNode } from "react";

type PlaceholderPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function PlaceholderPage({ eyebrow, title, description, children }: PlaceholderPageProps) {
  return (
    <section className="rounded-[28px] border border-border bg-card p-8 shadow-sm">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {eyebrow}
      </span>
      <h1 className="mt-4 font-outfit text-3xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{description}</p>
      {children}
    </section>
  );
}
