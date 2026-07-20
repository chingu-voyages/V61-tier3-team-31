"use client";

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type {
  ApplicationStats,
  MatchingStats,
  OnboardingStats,
  TeamStats,
} from "@/types/dashboard";
import { calculatePercentage } from "@/utils/percentage";
import { pipelineStyles } from "@/constants/pipeline-theme";
import { PipelineStatColor } from "@/types/pipeline-colors";
import { statColors } from "@/constants/stat-colors";

export type PipelineStat = {
  label: string;
  value: string;
  color?: PipelineStatColor;
};

type PipelineStep = {
  step: string;
  title: string;
  subtitle: string;
  route: string;
  color: string;
  btnBg: string;
  barColor: string;
  total: string;
  progressWidth: string;
  stats: PipelineStat[];
};

type Props = {
  applicationStats: ApplicationStats;
  teamStats: TeamStats;
  matchingStats: MatchingStats;
  onboardingStats: OnboardingStats;
};

const getPipelineSteps = (
  applicationStats: ApplicationStats,
  teamStats: TeamStats,
  matchingStats: MatchingStats,
  onboardingStats: OnboardingStats,
): PipelineStep[] => [
  {
    step: "01",
    ...pipelineStyles.applications,
    title: "Applications",
    subtitle: "Collect & review applications",
    route: "/admin/applications",
    total: `${applicationStats.total} TOTAL`,
    progressWidth: calculatePercentage(
      applicationStats.accepted + applicationStats.rejected,
      applicationStats.total,
    ),
    stats: [
      { label: "Accepted", value: String(applicationStats.accepted), color: "success" },
      { label: "Incomplete", value: String(applicationStats.draft), color: "warning" },
      { label: "Rejected", value: String(applicationStats.rejected), color: "danger" },
      {
        label: "Pending Review",
        value: String(applicationStats.under_review),
        color: "default",
      },
    ],
  },
  {
    step: "02",
    ...pipelineStyles.matching,
    title: "Matching",
    subtitle: "Match & assign participants",
    route: "/admin/matching",
    total: `${matchingStats.remaining} REMAINING`,
    progressWidth: calculatePercentage(matchingStats.matched, matchingStats.total),
    stats: [
      { label: "Matched", value: String(matchingStats.matched), color: "success" },
      { label: "Partial Matches", value: String(matchingStats.partial_matches), color: "warning" },
      { label: "Unassigned", value: String(matchingStats.unassigned), color: "danger" },
    ],
  },
  {
    step: "03",
    ...pipelineStyles.teams,
    title: "Teams",
    subtitle: "Form & confirm teams",
    route: "/admin/teams",
    total: `${teamStats.total} TEAMS`,
    progressWidth: calculatePercentage(teamStats.confirmed, applicationStats.accepted),
    stats: [
      { label: "Confirmed", value: String(teamStats.confirmed), color: "success" },
      { label: "Draft Teams", value: String(teamStats.draft_teams), color: "warning" },
      { label: "Needs Attention", value: String(teamStats.needs_attention), color: "danger" },
    ],
  },
  {
    step: "04",
    ...pipelineStyles.onboarding,
    title: "Onboarding",
    subtitle: "Complete required steps",
    route: "/admin/onboarding",
    total: `${onboardingStats.completion_rate}% COMPLETED`,
    progressWidth: `${onboardingStats.completion_rate}%`,
    stats: [
      { label: "Completed", value: String(onboardingStats.completed), color: "success" },
      { label: "In Progress", value: String(onboardingStats.in_progress), color: "warning" },
      { label: "Missing", value: String(onboardingStats.not_started), color: "danger" },
    ],
  },
];

export function PipelineCard({
  applicationStats,
  teamStats,
  matchingStats,
  onboardingStats,
}: Props) {
  const router = useRouter();

  const pipelineSteps = getPipelineSteps(
    applicationStats,
    teamStats,
    matchingStats,
    onboardingStats,
  );

  return (
    <>
      <div className="flex justify-between items-end mb-4 px-1">
        <h2 className="text-foreground text-lg">Course Pipeline</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/matching")}
          className="text-muted-foreground"
        >
          View full pipeline
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {pipelineSteps.map((p, i) => (
          <Card
            key={i}
            onClick={() => router.push(p.route)}
            className="shadow-black p-6 relative flex flex-col h-full hover:shadow-green transition-shadow cursor-pointer group/card"
          >
            <div className="flex gap-3.5 items-start mb-6">
              <div
                className={`font-outfit text-[40px] leading-none tracking-tighter font-light ${p.color}`}
              >
                {p.step}
              </div>
              <div className="pt-1">
                <div className="font-semibold text-foreground/90 leading-tight mb-1">{p.title}</div>
                <div className="text-[11px] text-muted-foreground leading-tight">{p.subtitle}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-1.5 bg-muted-foreground/20 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${p.barColor}`}
                  style={{ width: p.progressWidth }}
                ></div>
              </div>
              <div className="text-[10px] font-medium text-muted-foreground whitespace-nowrap uppercase tracking-wider">
                {p.total}
              </div>
            </div>
            <div className="space-y-3 mb-8 flex-1">
              {p.stats.map((s, j) => (
                <div key={j} className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">{s.label}</span>
                  <span className={`font-semibold ${statColors[s.color ?? "default"]}`}>
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
            <div
              className={`absolute bottom-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${p.btnBg} ${p.color} group-hover/card:scale-110`}
            >
              <ChevronRight className="w-4 h-4" />
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
