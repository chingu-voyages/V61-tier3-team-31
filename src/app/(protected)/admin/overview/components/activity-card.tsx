"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Activity } from "@/types/dashboard";
import { Check, FileSignature, UsersRound, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/avatar";
import { formatRelativeTime } from "@/utils/date";

function getActivityStyle(type: string) {
  switch (type) {
    case "application_accepted":
      return {
        icon: Check,
        iconColor: {
          bg: "bg-primary/20",
          text: "text-primary",
        },
      };

    case "application_rejected":
      return {
        icon: XCircle,
        iconColor: {
          bg: "bg-destructive/10 dark:bg-destructive/20",
          text: "text-destructive",
        },
      };

    case "application_submitted":
      return {
        icon: FileSignature,
        iconColor: {
          bg: "bg-blue-100 dark:bg-blue-500/20",
          text: "text-blue-500",
        },
      };

    case "onboarding_completed":
      return {
        icon: FileSignature,
        iconColor: {
          bg: "bg-blue-100 dark:bg-blue-500/20",
          text: "text-blue-500",
        },
      };

    case "match_proposal_created":
      return {
        icon: UsersRound,
        iconColor: {
          bg: "bg-purple-100 dark:bg-purple-500/20",
          text: "text-purple-600",
        },
      };

    default:
      return {
        icon: Check,
        iconColor: {
          bg: "bg-secondary",
          text: "text-muted-foreground",
        },
      };
  }
}

type Props = {
  activities: Activity[];
};

export function ActivityCard({ activities }: Props) {
  const router = useRouter();

  return (
    <Card className="lg:col-span-6 shadow-black p-6">
      <div className="flex items-center justify-between mb-6 px-1">
        <h3 className="font-semibold text-foreground">Recent Activity</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/analytics")}
          className="text-muted-foreground"
        >
          View all
        </Button>
      </div>
      <div className="space-y-1">
        {activities.slice(0, 4).map((item, i) => {
          const style = getActivityStyle(item.type);
          const Icon = style.icon;
          return (
            <div
              key={i}
              className="flex gap-4 items-start py-3 border-b border-foreground/5 last:border-0 last:pb-0 cursor-pointer group"
            >
              <div className="relative shrink-0 mt-0.5">
                <Avatar
                  userId={item.user_id ?? undefined}
                  avatarName={item.avatar}
                  alt="avatar"
                  className="size-10 bg-foregrount/10 border border-foreground/20"
                />
                <div
                  className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-secondary flex items-center justify-center ${style.iconColor.bg}`}
                >
                  <Icon className={`w-3 h-3 ${style.iconColor.text}`} />
                </div>
              </div>
              <div className="pt-0.5">
                <div className="text-sm text-muted-foreground leading-snug">
                  <span className="font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.user_name}
                  </span>{" "}
                  {item.text}
                </div>
                <div className="text-[11px] text-muted-foreground mt-1 font-medium">
                  {formatRelativeTime(item.created_at)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
