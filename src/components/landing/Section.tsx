import { cn } from "@/lib/utils";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
};

export function Section({ children, className }: SectionProps) {
  return (
    <section
      className={cn(
        "mx-auto max-w-6xl px-6 sm:px-12 py-12 sm:py-18 text-center sm:text-left",
        className,
      )}
    >
      {children}
    </section>
  );
}
