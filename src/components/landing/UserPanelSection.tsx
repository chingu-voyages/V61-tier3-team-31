import { FEATURES } from "@/constants/features";
import { Card } from "../ui/card";
import { Section } from "./Section";

export function UserPanelSection() {
  return (
    <Section className="min-h-screen">
      <div className="mb-12 max-w-2xl space-y-3">
        <h3>Features</h3>

        <h2>Everything you need to complete the course</h2>

        <p className="mt-4 leading-7">
          From registration to certificate — a smooth flow without extra tools.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ label, text, icon: Icon }) => (
          <Card
            key={label}
            className="
              flex flex-col items-center gap-4 p-6
              transition
              hover:bg-muted/50
              hover:border-primary
              hover:shadow-green
              md:items-start
            "
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="size-5 text-primary" />
            </div>

            <h4 className="text-lg font-semibold text-foreground">{label}</h4>

            <p className="text-sm leading-6">{text}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
