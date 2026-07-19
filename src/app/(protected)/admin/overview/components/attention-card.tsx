"use client";

import { Card } from "@/components/ui/card";
import { AttentionStats } from "@/types/dashboard";
import {
  AlertTriangle,
  ChevronRight,
  FileSearch,
  FileSignature,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  attention: AttentionStats;
};

type AttentionItem = {
  key: keyof AttentionStats;
  icon: LucideIcon;
  color: {
    bg: string;
    text: string;
  };
  title: string;
  desc: string;
  route: string;
};

const attentionItems: AttentionItem[] = [
  {
    key: "old_applications",
    icon: FileSearch,
    color: {
      bg: "bg-destructive/10 dark:bg-destructive/10",
      text: "text-destructive",
    },
    title: "Applications older than 7 days",
    desc: "Need review",
    route: "/applications",
  },
  {
    key: "accepted_without_team",
    icon: AlertTriangle,
    color: {
      bg: "bg-orange-50 dark:bg-orange-500/10",
      text: "text-amber-500",
    },
    title: "Accepted participants without team",
    desc: "Require assignment",
    route: "/participants",
  },
  {
    key: "teams_missing_role",
    icon: UsersRound,
    color: {
      bg: "bg-purple-50 dark:bg-purple-500/10",
      text: "text-purple-500",
    },
    title: "Teams missing required role",
    desc: "Missing Product Owner or Developer",
    route: "/teams",
  },
  {
    key: "onboarding_incomplete",
    icon: FileSignature,
    color: {
      bg: "bg-blue-50 dark:bg-blue-500/10",
      text: "text-blue-500",
    },
    title: "Onboarding forms incomplete",
    desc: "Participants need to complete",
    route: "/onboarding",
  },
];

export function AttentionCard({ attention }: Props) {
  const router = useRouter();

  return (
    <Card className="lg:col-span-6 shadow-black p-6">
      <div className="flex items-center justify-between mb-6 px-1">
        <h3 className="font-semibold text-foreground">Needs Attention</h3>
      </div>

      <div className="space-y-1">
        {attentionItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.key}
              onClick={() => router.push(item.route)}
              className="flex items-center gap-4 py-3 border-b border-foreground/5 last:border-0 last:pb-0 cursor-pointer group"
            >
              <div
                className={`p-2.5 rounded-xl border border-destructive/30 dark:border-border shrink-0 shadow-sm ${item.color.bg} ${item.color.text}`}
              >
                <Icon className="size-4" />
              </div>

              <div className="flex-1 pt-0.5">
                <div className="text-sm font-medium text-foreground group-hover:text-destructive transition-colors mb-0.5">
                  {item.title}
                </div>
                <div className="text-[11px] text-muted-foreground">{item.desc}</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-xs font-semibold text-destructive bg-destructive/5 px-2 py-0.5 rounded-md">
                  {attention[item.key]}
                </div>

                <ChevronRight className="size-4 text-foreground/30 group-hover:text-muted-foreground dark:group-hover:text-foreground transition-colors" />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
