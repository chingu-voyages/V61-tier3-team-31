"use client";

import { useAuth } from "@/lib/auth/auth-context";
import {
  FileText,
  User,
  Users,
  XCircle,
  UsersRound,
  Calendar,
  ChevronRight,
  AlertTriangle,
  FileSearch,
  FileSignature,
  Check,
} from "lucide-react";

function MetricBlock({
  icon,
  color,
  value,
  label,
  subtext,
}: {
  icon: React.ReactNode;
  color: { bg: string; text: string };
  value: string;
  label: string;
  subtext: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3">
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 [&>svg]:w-4 [&>svg]:h-4 ${color.bg} ${color.text}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="font-outfit text-xl font-bold text-foreground leading-none">{value}</div>
        <div className="text-[11px] font-semibold text-muted-foreground leading-tight truncate">
          {label}
        </div>
        <div className="text-[10px] text-muted-foreground/60 font-medium mt-0.5">{subtext}</div>
      </div>
    </div>
  );
}

const deadlines = [
  {
    title: "Review applications",
    date: "May 2, 2026",
    badge: "3 days",
    badgeColor: "bg-destructive/10 text-destructive",
  },
  {
    title: "Confirm teams",
    date: "May 9, 2026",
    badge: "10 days",
    badgeColor: "bg-accent text-accent-foreground",
  },
  {
    title: "Onboarding check",
    date: "May 16, 2026",
    badge: "17 days",
    badgeColor: "bg-nexus-green/10 text-nexus-green",
  },
  {
    title: "Voyage starts",
    date: "May 23, 2026",
    badge: "24 days",
    badgeColor: "bg-primary/10 text-primary",
  },
];

const pipelineSteps = [
  {
    step: "01",
    color: "text-primary",
    btnBg: "bg-primary/10",
    barColor: "bg-primary",
    title: "Applications",
    subtitle: "Collect & review applications",
    total: "312 TOTAL",
    progressWidth: "100%",
    stats: [
      { label: "Pending Review", value: "64", color: "text-foreground" },
      { label: "Accepted", value: "128", color: "text-primary" },
      { label: "Rejected", value: "28", color: "text-destructive" },
      { label: "Incomplete", value: "92", color: "text-primary" },
    ],
  },
  {
    step: "02",
    color: "text-nexus-green",
    btnBg: "bg-nexus-green/10",
    barColor: "bg-nexus-green",
    title: "Matching",
    subtitle: "Match & assign participants",
    total: "72 REMAINING",
    progressWidth: "40%",
    stats: [
      { label: "Unassigned", value: "72", color: "text-foreground" },
      { label: "Partial Matches", value: "34", color: "text-nexus-green" },
      { label: "Matched", value: "56", color: "text-primary" },
    ],
  },
  {
    step: "03",
    color: "text-accent-foreground",
    btnBg: "bg-accent",
    barColor: "bg-accent-foreground",
    title: "Teams",
    subtitle: "Form & confirm teams",
    total: "18 TEAMS",
    progressWidth: "70%",
    stats: [
      { label: "Draft Teams", value: "12", color: "text-accent-foreground" },
      { label: "Confirmed", value: "6", color: "text-primary" },
      { label: "Needs Attention", value: "3", color: "text-destructive" },
    ],
  },
  {
    step: "04",
    color: "text-destructive",
    btnBg: "bg-destructive/10",
    barColor: "bg-destructive",
    title: "Onboarding",
    subtitle: "Complete required steps",
    total: "61% COMPLETED",
    progressWidth: "61%",
    stats: [
      { label: "Completed", value: "79", color: "text-primary" },
      { label: "In Progress", value: "38", color: "text-nexus-green" },
      { label: "Missing", value: "19", color: "text-destructive" },
    ],
  },
];

const attentionItems = [
  {
    icon: <FileSearch />,
    color: { bg: "bg-destructive/10", text: "text-destructive" },
    title: "Applications older than 7 days",
    desc: "Need review",
    value: "24",
  },
  {
    icon: <AlertTriangle />,
    color: { bg: "bg-accent", text: "text-accent-foreground" },
    title: "Accepted participants without team",
    desc: "Require assignment",
    value: "16",
  },
  {
    icon: <UsersRound />,
    color: { bg: "bg-primary/10", text: "text-primary" },
    title: "Teams missing required role",
    desc: "Missing Product Owner or Developer",
    value: "8",
  },
  {
    icon: <FileSignature />,
    color: { bg: "bg-nexus-green/10", text: "text-nexus-green" },
    title: "Onboarding forms incomplete",
    desc: "Participants need to complete",
    value: "12",
  },
];

const activityItems = [
  {
    avatar: "https://i.pravatar.cc/100?img=11",
    icon: Check,
    iconColor: { bg: "bg-primary/20", text: "text-primary" },
    highlight: "Daniel Martinez",
    text: "was accepted",
    time: "2 minutes ago",
  },
  {
    avatar: "https://i.pravatar.cc/100?img=4",
    icon: UsersRound,
    iconColor: { bg: "bg-accent", text: "text-accent-foreground" },
    highlight: 'New team "Pixel Pioneers"',
    text: "was created",
    time: "15 minutes ago",
  },
  {
    avatar: "https://i.pravatar.cc/100?img=5",
    icon: FileSignature,
    iconColor: { bg: "bg-nexus-green/10", text: "text-nexus-green" },
    highlight: "Sophia Taylor",
    text: "submitted onboarding",
    time: "1 hour ago",
  },
  {
    avatar: "https://i.pravatar.cc/100?img=9",
    icon: XCircle,
    iconColor: { bg: "bg-destructive/20", text: "text-destructive" },
    highlight: "Alex Morgan",
    text: "was rejected",
    time: "2 hours ago",
  },
];

export default function AdminOverview() {
  const { profile } = useAuth();
  const firstName = profile?.full_name?.split(" ")[0] ?? "Admin";

  return (
    <div className="space-y-8">
      {/* Top row: Metrics & Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Welcome + Metrics */}
        <div className="lg:col-span-8 admin-card p-8 flex flex-col justify-between">
          <div className="mb-6">
            <h1 className="admin-heading-xl mb-1">
              Good morning, {firstName}. <span className="animate-wave">👋</span>
            </h1>
            <p className="text-muted-foreground text-sm">
              Voyage <span className="text-destructive font-medium">51</span> is in application
              review.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <MetricBlock
              icon={<FileText />}
              color={{ bg: "bg-primary/10", text: "text-primary" }}
              value="312"
              label="Applications"
              subtext="+24 since yesterday"
            />
            <MetricBlock
              icon={<User />}
              color={{ bg: "bg-nexus-green/10", text: "text-nexus-green" }}
              value="128"
              label="Accepted"
              subtext="41% of total"
            />
            <MetricBlock
              icon={<Users />}
              color={{ bg: "bg-accent", text: "text-accent-foreground" }}
              value="64"
              label="Pending Review"
              subtext="20% of total"
            />
            <MetricBlock
              icon={<XCircle />}
              color={{ bg: "bg-destructive/10", text: "text-destructive" }}
              value="28"
              label="Rejected"
              subtext="9% of total"
            />
          </div>
        </div>

        {/* Right: Deadlines */}
        <div className="lg:col-span-4 admin-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-foreground">Upcoming Deadlines</h3>
            <button className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              View all
            </button>
          </div>
          <div className="space-y-4 flex-1">
            {deadlines.map((d, i) => (
              <div key={i} className="flex items-center gap-4 py-1">
                <div className="p-2.5 rounded-xl bg-muted/50 text-muted-foreground border border-border/50">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{d.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{d.date}</div>
                </div>
                <div className={`text-xs px-2.5 py-1 rounded-full font-medium ${d.badgeColor}`}>
                  {d.badge}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pipeline */}
      <div>
        <div className="flex justify-between items-end mb-4 px-1">
          <h2 className="font-semibold text-foreground text-lg">Voyage Pipeline</h2>
          <button className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            View full pipeline
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {pipelineSteps.map((p, i) => (
            <div
              key={i}
              className="admin-card p-6 relative flex flex-col h-full hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-shadow cursor-pointer group/card"
            >
              <div className="flex gap-3.5 items-start mb-6">
                <div
                  className={`font-outfit text-[40px] leading-none tracking-tighter font-light ${p.color}`}
                >
                  {p.step}
                </div>
                <div className="pt-1">
                  <div className="font-semibold text-foreground text-sm leading-tight mb-1">
                    {p.title}
                  </div>
                  <div className="text-[11px] text-muted-foreground leading-tight">
                    {p.subtitle}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
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
                    <span className={`font-semibold ${s.color || "text-foreground"}`}>
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
            </div>
          ))}
        </div>
      </div>

      {/* Attention & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Needs Attention */}
        <div className="lg:col-span-6 admin-card p-6">
          <div className="flex items-center justify-between mb-6 px-1">
            <h3 className="font-semibold text-foreground">Needs Attention</h3>
          </div>
          <div className="space-y-1">
            {attentionItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 py-3 border-b border-border/50 last:border-0 last:pb-0 cursor-pointer group"
              >
                <div
                  className={`p-2.5 rounded-xl border border-border/50 shrink-0 shadow-sm [&>svg]:w-4 [&>svg]:h-4 ${item.color.bg} ${item.color.text}`}
                >
                  {item.icon}
                </div>
                <div className="flex-1 pt-0.5">
                  <div className="text-sm font-medium text-foreground group-hover:text-destructive transition-colors mb-0.5">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{item.desc}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs font-semibold text-destructive bg-destructive/10 px-2 py-0.5 rounded-md">
                    {item.value}
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-6 admin-card p-6">
          <div className="flex items-center justify-between mb-6 px-1">
            <h3 className="font-semibold text-foreground">Recent Activity</h3>
            <button className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              View all
            </button>
          </div>
          <div className="space-y-1">
            {activityItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="flex gap-4 items-start py-3 border-b border-border/50 last:border-0 last:pb-0 cursor-pointer group"
                >
                  <div className="relative shrink-0 mt-0.5">
                    <img
                      src={item.avatar}
                      className="w-10 h-10 rounded-full bg-muted border border-border"
                      alt="avatar"
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-card flex items-center justify-center ${item.iconColor.bg} ${item.iconColor.text}`}
                    >
                      <Icon className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="pt-0.5">
                    <div className="text-sm text-muted-foreground leading-snug">
                      <span className="font-semibold text-foreground group-hover:text-nexus-green transition-colors">
                        {item.highlight}
                      </span>{" "}
                      {item.text}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1 font-medium">
                      {item.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
