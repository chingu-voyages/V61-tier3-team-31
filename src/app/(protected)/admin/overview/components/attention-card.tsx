"use client";

import { Card } from "@/components/ui/card";
import { AlertTriangle, ChevronRight, FileSearch, FileSignature, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";

const attentionItems: Array<{
  icon: React.ReactNode;
  color: { bg: string; text: string };
  title: string;
  desc: string;
  value: string;
  route: string;
}> = [
  {
    icon: <FileSearch />,
    color: { bg: "bg-destructive/10 dark:bg-destructive/10", text: "text-destructive" },
    title: "Applications older than 7 days",
    desc: "Need review",
    value: "24",
    route: "/applications",
  },
  {
    icon: <AlertTriangle />,
    color: { bg: "bg-orange-50 dark:bg-orange-500/10", text: "text-amber-500" },
    title: "Accepted participants without team",
    desc: "Require assignment",
    value: "16",
    route: "/participants",
  },
  {
    icon: <UsersRound />,
    color: { bg: "bg-purple-50 dark:bg-purple-500/10", text: "text-purple-500" },
    title: "Teams missing required role",
    desc: "Missing Product Owner or Developer",
    value: "8",
    route: "/teams",
  },
  {
    icon: <FileSignature />,
    color: { bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-500" },
    title: "Onboarding forms incomplete",
    desc: "Participants need to complete",
    value: "12",
    route: "/onboarding",
  },
];

export function AttentionCard() {
  const router = useRouter();

  return (
    <Card className="lg:col-span-6 shadow-black p-6">
      <div className="flex items-center justify-between mb-6 px-1">
        <h3 className="font-semibold text-foreground">Needs Attention</h3>
      </div>
      <div className="space-y-1">
        {attentionItems.map((item, i) => (
          <div
            key={i}
            onClick={() => router.push(item.route)}
            className="flex items-center gap-4 py-3 border-b border-foreground/5 last:border-0 last:pb-0 cursor-pointer group"
          >
            <div
              className={`p-2.5 rounded-xl border border-destructive/30 dark:border-border shrink-0 shadow-sm ${item.color.bg} ${item.color.text}`}
            >
              <span className="size-4">{item.icon}</span>
            </div>
            <div className="flex-1 pt-0.5">
              <div className="text-sm font-medium text-foreground group-hover:text-destructive transition-colors mb-0.5">
                {item.title}
              </div>
              <div className="text-[11px] text-muted-foreground">{item.desc}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs font-semibold text-destructive bg-destructive/5 px-2 py-0.5 rounded-md">
                {item.value}
              </div>
              <ChevronRight className="size-4 text-foreground/30 group-hover:text-muted-foreground dark:group-hover:text-foreground transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
