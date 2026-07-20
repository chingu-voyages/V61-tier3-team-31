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

// type PipelineStep = {
//   step: string;
//   color: string;
//   btnBg: string;
//   barColor: string;
//   title: string;
//   subtitle: string;
//   route: string;
//   total: string;
//   progressWidth: string;
//   stats: PipelineStats[];
// };

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
) => [
  {
    step: "01",
    color: "text-primary",
    btnBg: "bg-primary/10",
    barColor: "bg-primary",
    title: "Applications",
    subtitle: "Collect & review applications",
    route: "/applications",
    total: `${applicationStats.total} TOTAL`,
    progressWidth: "100%",
    stats: [
      {
        label: "Pending Review",
        value: String(applicationStats.under_review),
        color: "text-foreground",
      },
      { label: "Accepted", value: String(applicationStats.accepted), color: "text-primary" },
      { label: "Rejected", value: String(applicationStats.rejected), color: "text-destructive" },
      { label: "Incomplete", value: String(applicationStats.draft), color: "text-primary" },
    ],
  },
  {
    step: "02",
    color: "text-blue-500",
    btnBg: "bg-blue-500/10",
    barColor: "bg-blue-500",
    title: "Matching",
    subtitle: "Match & assign participants",
    route: "/matching",
    total: `${matchingStats.remaining} REMAINING`,
    progressWidth: "40%",
    stats: [
      { label: "Unassigned", value: String(matchingStats.unassigned), color: "text-foreground" },
      {
        label: "Partial Matches",
        value: String(matchingStats.partial_matches),
        color: "text-blue-500",
      },
      { label: "Matched", value: String(matchingStats.matched), color: "text-primary" },
    ],
  },
  {
    step: "03",
    color: "text-amber-500",
    btnBg: "bg-amber-500/10",
    barColor: "bg-amber-500",
    title: "Teams",
    subtitle: "Form & confirm teams",
    route: "/teams",
    total: `${teamStats.total} TEAMS`,
    progressWidth: "70%",
    stats: [
      { label: "Draft Teams", value: String(teamStats.draft_teams), color: "text-amber-600" },
      { label: "Confirmed", value: String(teamStats.confirmed), color: "text-primary" },
      {
        label: "Needs Attention",
        value: String(teamStats.needs_attention),
        color: "text-destructive",
      },
    ],
  },
  {
    step: "04",
    color: "text-destructive",
    btnBg: "bg-destructive/10",
    barColor: "bg-destructive",
    title: "Onboarding",
    subtitle: "Complete required steps",
    route: "/onboarding",
    total: `${onboardingStats.completion_rate}% COMPLETED`,
    progressWidth: `${onboardingStats.completion_rate}%`,
    stats: [
      { label: "Completed", value: String(onboardingStats.completed), color: "text-primary" },
      { label: "In Progress", value: String(onboardingStats.in_progress), color: "text-blue-500" },
      { label: "Missing", value: String(onboardingStats.not_started), color: "text-destructive" },
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
                  <span className={`font-semibold ${s.color || "text-foreground"}`}>{s.value}</span>
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
