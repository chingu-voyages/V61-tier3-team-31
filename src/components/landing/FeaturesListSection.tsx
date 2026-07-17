import { Card } from "../ui/card";
import { CircleCheckBig } from "lucide-react";
import { adminList, userList } from "@/constants/list";
import { Section } from "./Section";
const FEATURE_LISTS = [
  { title: "For participants", items: userList },
  { title: "For admins", items: adminList },
];

export function FeaturesListSection() {
  return (
    <div className="border-t border-b border-border bg-secondary">
      <Section className="grid gap-6 py-8 md:grid-cols-2">
        {FEATURE_LISTS.map(({ title, items }) => (
          <Card key={title} className="p-8 shadow-black">
            <h3>{title}</h3>

            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item} className="flex items-center gap-3 text-muted-foreground">
                  <CircleCheckBig className="size-5 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </Section>
    </div>
  );
}
