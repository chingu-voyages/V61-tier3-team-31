import { CircleCheckBig } from "lucide-react";
import { adminPanelList } from "@/constants/list";
import { Section } from "./Section";
import { ThemeImage } from "../ThemeImage";

export function AdminPanelSection() {
  return (
    <Section className="grid gap-6 md:grid-cols-2 items-center text-left">
      <div className="space-y-4">
        <h3>Admin panel</h3>

        <h2>Run the cohort in a couple of clicks</h2>

        <p className="text-muted-foreground mb-10">
          Browse every registered participant, assign them to groups, appoint mentors and keep an
          eye on the course dynamics
        </p>

        <ul className="space-y-4">
          {adminPanelList.map((item) => (
            <li key={item} className="flex items-center gap-3 text-foreground text-sm">
              <CircleCheckBig className="size-5 text-primary shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <ThemeImage
        lightSrc="/admin-panel-light.png"
        darkSrc="/admin-panel.png"
        alt="Cohorix application dashboard"
        width={650}
        height={520}
        className="rounded-xl border border-border shadow-light-green"
      />
    </Section>
  );
}
