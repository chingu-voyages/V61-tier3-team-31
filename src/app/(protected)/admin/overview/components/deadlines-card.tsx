"use client";

import { Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Deadline } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function getDaysLeft(date: string) {
  const deadline = new Date(date).getTime();
  const today = new Date().getTime();

  const diff = deadline - today;

  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return "Expired";
  if (days === 0) return "Today";

  return `${days} days`;
}

type Props = {
  deadlines: Deadline[];
};

export function DeadlinesCard({ deadlines }: Props) {
  const router = useRouter();

  return (
    <Card className="lg:col-span-4 shadow-black p-6 flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-foreground">Upcoming Deadlines</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/calendar")}
          className="text-muted-foreground"
        >
          View all
        </Button>
      </div>
      <div className="space-y-4 flex-1">
        {deadlines.map((d, i) => (
          <div key={i} className="flex items-center gap-4 py-1">
            <div className="p-2.5 rounded-lg bg-secondary text-muted-foreground border border-border">
              <Calendar className="size-4" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-foreground">{d.title}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {new Date(d.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
            <div className={`text-xs px-2.5 py-1 rounded-full font-medium ${d.badgeColor}`}>
              {getDaysLeft(d.date)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
