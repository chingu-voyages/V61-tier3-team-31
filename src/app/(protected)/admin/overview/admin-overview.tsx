"use client";

import { useRouter } from "next/navigation";
import { PipelineCard } from "./components/pipeline-card";
import { DeadlinesCard } from "./components/deadlines-card";
import { AttentionCard } from "./components/attention-card";
import { ActivityCard } from "./components/activity-card";
import type {
  Activity,
  ApplicationStats,
  Course,
  Deadline,
  OnboardingStats,
  AttentionStats,
  TeamStats,
  MatchingStats,
} from "@/types/dashboard";
import { Card } from "@/components/ui/card";
import { MetricsCard } from "./components/metrics-card";

type Props = {
  userName: string;
  stats: ApplicationStats;
  onboarding: OnboardingStats;
  course: Course | null;
  deadlines?: Deadline[];
  teams: TeamStats;
  matching: MatchingStats;
  attention: AttentionStats;
  activity: Activity[];
};

function getDaysLeft(date: string) {
  const diff = new Date(date).getTime() - new Date().getTime();

  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function AdminOverview({
  userName,
  stats,
  onboarding,
  course,
  deadlines,
  teams,
  matching,
  attention,
  activity,
}: Props) {
  const router = useRouter();

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main statistic */}
        <Card className="lg:col-span-8 shadow-black p-8 flex flex-col justify-between">
          <div className="mb-6">
            <h1 className="text-3xl font-outfit mb-1 tracking-tight">
              Hello, {userName}. <span className="animate-wave">👋</span>
            </h1>
            <p className="text-sm">
              Voyage <span className="text-destructive font-medium">{course?.number}</span> is in{" "}
              <span className="capitalize">{course?.status.replaceAll("_", " ")}</span>.
            </p>
          </div>

          {/* Metrics */}
          <MetricsCard stats={stats} />
        </Card>

        {/* Deadlines */}
        <DeadlinesCard deadlines={deadlines ?? []} />
      </div>

      {/* Pipeline section */}
      <PipelineCard
        applicationStats={stats}
        teamStats={teams}
        matchingStats={matching}
        onboardingStats={onboarding}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Attention */}
        <AttentionCard attention={attention} />

        {/* Activity */}
        <ActivityCard activities={activity} />
      </div>
    </>
  );
}
