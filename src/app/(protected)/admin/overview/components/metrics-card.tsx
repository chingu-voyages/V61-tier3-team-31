"use client";

import { FileText, User, Users, XCircle } from "lucide-react";
import { MetricBlock } from "./metric-block";
import type { ApplicationStats } from "@/types/dashboard";
import type { LucideIcon } from "lucide-react";

type Props = {
  stats: ApplicationStats;
};

type MetricConfig = {
  icon: LucideIcon;
  value: keyof ApplicationStats;
  label: string;
  rate?: keyof ApplicationStats;
  color: {
    bg: string;
    text: string;
  };
};

const metrics: MetricConfig[] = [
  {
    icon: FileText,
    value: "total",
    label: "Applications",
    color: {
      bg: "bg-primary/10",
      text: "text-primary",
    },
  },
  {
    icon: User,
    value: "accepted",
    rate: "accepted_rate",
    label: "Accepted",
    color: {
      bg: "bg-blue-500/10",
      text: "text-blue-500",
    },
  },
  {
    icon: Users,
    value: "under_review",
    rate: "under_review_rate",
    label: "Pending Review",
    color: {
      bg: "bg-amber-500/10",
      text: "text-amber-500",
    },
  },
  {
    icon: XCircle,
    value: "rejected",
    rate: "rejected_rate",
    label: "Rejected",
    color: {
      bg: "bg-destructive/10",
      text: "text-destructive",
    },
  },
];

export function MetricsCard({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <MetricBlock
            key={metric.value}
            icon={<Icon />}
            color={metric.color}
            value={String(stats[metric.value])}
            label={metric.label}
            subtext={
              metric.value === "total"
                ? `+${stats.accepted_last_24h} joined recently`
                : `${stats[metric.rate!]}% of total`
            }
          />
        );
      })}
    </div>
  );
}
