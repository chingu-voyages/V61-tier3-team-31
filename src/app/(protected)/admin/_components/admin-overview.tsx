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
      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${color.bg}`}>
        <span className={`w-4 h-4 ${color.text}`}>{icon}</span>
      </div>
      <div className="min-w-0">
        <div className="font-outfit text-xl font-bold text-foreground leading-none">{value}</div>
        <div className="text-11 font-semibold text-muted-foreground leading-tight truncate">
          {label}
        </div>
        <div className="text-xxs text-muted-foreground/60 font-medium mt-0.5">{subtext}</div>
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
    badgeColor: "bg-amber-500/10 text-amber-500",
  },
  {
    title: "Onboarding check",
    date: "May 16, 2026",
    badge: "17 days",
    badgeColor: "bg-blue-500/10 text-blue-500",
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
    color: "text-blue-500",
    btnBg: "bg-blue-500/10",
    barColor: "bg-blue-500",
    title: "Matching",
    subtitle: "Match & assign participants",
    total: "72 REMAINING",
    progressWidth: "40%",
    stats: [
      { label: "Unassigned", value: "72", color: "text-foreground" },
      { label: "Partial Matches", value: "34", color: "text-blue-500" },
      { label: "Matched", value: "56", color: "text-purple-600" },
    ],
  },
  {
    step: "03",
    color: "text-purple-600",
    btnBg: "bg-purple-600/10",
    barColor: "bg-purple-600",
    title: "Teams",
    subtitle: "Form & confirm teams",
    total: "18 TEAMS",
    progressWidth: "70%",
    stats: [
      { label: "Draft Teams", value: "12", color: "text-purple-600" },
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
      { label: "In Progress", value: "38", color: "text-blue-500" },
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
    color: { bg: "bg-amber-500/10", text: "text-amber-500" },
    title: "Accepted participants without team",
    desc: "Require assignment",
    value: "16",
  },
  {
    icon: <UsersRound />,
    color: { bg: "bg-purple-600/10", text: "text-purple-600" },
    title: "Teams missing required role",
    desc: "Missing Product Owner or Developer",
    value: "8",
  },
  {
    icon: <FileSignature />,
    color: { bg: "bg-blue-500/10", text: "text-blue-500" },
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
    iconColor: { bg: "bg-purple-600/20", text: "text-purple-600" },
    highlight: 'New team "Pixel Pioneers"',
    text: "was created",
    time: "15 minutes ago",
  },
  {
    avatar: "https://i.pravatar.cc/100?img=5",
    icon: FileSignature,
    iconColor: { bg: "bg-blue-500/20", text: "text-blue-500" },
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
              color={{ bg: "bg-blue-500/10", text: "text-blue-500" }}
              value="128"
              label="Accepted"
              subtext="41% of total"
            />
            <MetricBlock
              icon={<Users />}
              color={{ bg: "bg-purple-600/10", text: "text-purple-600" }}
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
                <div className="p-2.5 rounded-xl bg-muted text-muted-foreground border border-border">
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {pipelineSteps.map((p, i) => (
            <div
              key={i}
              className="admin-card p-5 flex flex-col hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold font-outfit ${p.color}`}>{p.step}</span>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{p.title}</div>
                    <div className="text-xxs text-muted-foreground">{p.subtitle}</div>
                  </div>
                </div>
                <span
                  className={`text-xxs font-semibold ${p.btnBg} ${p.color} px-2 py-0.5 rounded-full`}
                >
                  {p.total}
                </span>
              </div>

              <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-4">
                <div
                  className={`h-full rounded-full ${p.barColor}`}
                  style={{ width: p.progressWidth }}
                />
              </div>

              <div className="space-y-2 mt-auto">
                {p.stats.map((s, j) => (
                  <div key={j} className="flex items-center justify-between">
                    <span className="text-11 text-muted-foreground">{s.label}</span>
                    <span className={`text-xs font-bold ${s.color}`}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attention & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Needs Attention */}
        <div className="admin-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-foreground">Needs Attention</h3>
            <span className="text-xxs font-semibold bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
              4 items
            </span>
          </div>
          <div className="space-y-3">
            {attentionItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.color.bg}`}
                >
                  <span className={`w-4 h-4 ${item.color.text}`}>{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{item.title}</div>
                  <div className="text-xxs text-muted-foreground">{item.desc}</div>
                </div>
                <span className="text-sm font-bold text-foreground">{item.value}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="admin-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-foreground">Recent Activity</h3>
            <button className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {activityItems.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <img
                  src={item.avatar}
                  className="w-8 h-8 rounded-full bg-muted border border-border shrink-0"
                  alt=""
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">{item.highlight}</span>{" "}
                    <span className="text-muted-foreground">{item.text}</span>
                  </p>
                  <p className="text-xxs text-muted-foreground mt-0.5">{item.time}</p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${item.iconColor.bg}`}
                >
                  <item.icon className={`w-3 h-3 ${item.iconColor.text}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
