"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Settings, ChevronLeft, ChevronRight, ChevronDown, Target } from "lucide-react";
import {
  adminMenu,
  applicantMenu,
  participantMenu,
  type DashboardView,
} from "@/constants/sidebar-menu";
import { Logo } from "@/components/Logo";
import { NavItem } from "./sidebar/NavItem";
import { ProfileMenu } from "./ProfileMenu";
import { setActiveVoyage } from "@/app/(protected)/app/voyages/actions";
import { formatVoyageDateRange, getVoyageStatusLabel } from "@/lib/voyages/status-label";
import type { UserVoyage } from "@/lib/voyages/types";

interface SidebarProps {
  role: string;
  status?: string;
  currentView: DashboardView;
  onNavClick?: () => void;
  hideCollapse?: boolean;
  voyages?: UserVoyage[];
  activeVoyageId?: string | null;
}

export function Sidebar({
  role,
  status,
  currentView,
  onNavClick,
  hideCollapse,
  voyages = [],
  activeVoyageId = null,
}: SidebarProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isVoyageExpanded, setIsVoyageExpanded] = useState(true);
  const [isPending, startTransition] = useTransition();
  const isStaff = role === "admin" || role === "moderator";

  const activeVoyage = voyages.find((voyage) => voyage.id === activeVoyageId) ?? voyages[0] ?? null;
  const otherVoyages = voyages.filter((voyage) => voyage.id !== activeVoyage?.id);

  const menuItems = isStaff
    ? adminMenu
    : status === "participant" || status === "accepted"
      ? participantMenu
      : applicantMenu;

  const navigate = (view: DashboardView) => {
    const nextPath =
      view === "overview"
        ? isStaff
          ? "/admin"
          : "/app/overview"
        : `${isStaff ? "/admin" : "/app"}/${view}`;

    onNavClick?.();
    router.push(nextPath);
  };

  const switchVoyage = (voyageId: string) => {
    if (voyageId === activeVoyage?.id || isPending) return;

    startTransition(async () => {
      const result = await setActiveVoyage(voyageId);
      if ("error" in result) return;

      const nextPath = result.mode === "apply" ? "/app/apply" : "/app/overview";
      router.push(nextPath);
      router.refresh();
    });
  };

  return (
    <aside
      className={`dark bg-nexus-dark text-muted-foreground flex flex-col shrink-0 h-screen border-r border-border transition-all duration-300 relative ${
        isExpanded ? "w-65" : "w-20"
      }`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3.5 top-7 w-7 h-7 bg-card border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground shadow-sm z-10 cursor-pointer transition-colors"
      >
        {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="size-4" />}
      </button>

      <div className="h-19 flex items-center px-6 gap-3 pt-2 overflow-hidden">
        <Logo className="w-8 h-8 shrink-0" />
        {isExpanded && (
          <span className="font-outfit text-xl font-medium tracking-wide text-foreground truncate">
            Cohorix
          </span>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-2 space-y-1 overflow-y-auto scrollbar-premium">
        {menuItems.map((item) => (
          <NavItem
            key={item.view}
            isExpanded={isExpanded}
            icon={<item.icon />}
            label={item.label}
            badge={item.badge}
            active={currentView === item.view}
            onClick={() => navigate(item.view)}
          />
        ))}
      </div>

      <div className="p-4 mt-auto space-y-3">
        {!isStaff && isExpanded && activeVoyage && (
          <div className="bg-nexus-sidebar rounded-xl border border-border shadow-xl whitespace-nowrap overflow-hidden transition-all duration-300">
            <button
              type="button"
              onClick={() => setIsVoyageExpanded(!isVoyageExpanded)}
              className="w-full flex items-center justify-between p-4 cursor-pointer transition-colors"
            >
              <div className="flex flex-col items-start gap-1 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-medium text-foreground text-sm truncate">
                    {activeVoyage.name}
                  </span>
                  <span className="size-2 shrink-0 rounded-full bg-primary" />
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {getVoyageStatusLabel(activeVoyage)}
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-300 ${
                  isVoyageExpanded ? "" : "rotate-180"
                }`}
              />
            </button>

            {isVoyageExpanded && (
              <div className="px-4 pb-4 animate-in slide-in-from-top-2 fade-in duration-200">
                <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground mb-4 bg-foreground/5 p-2 rounded-lg border border-border">
                  <span className="w-3.5 h-3.5 text-muted-foreground">📅</span>
                  {formatVoyageDateRange(activeVoyage.startsAt, activeVoyage.endsAt)}
                </div>

                {otherVoyages.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      Other courses
                    </span>
                    <div className="relative">
                      <select
                        disabled={isPending}
                        defaultValue=""
                        onChange={(event) => {
                          const nextVoyageId = event.target.value;
                          if (!nextVoyageId) return;
                          switchVoyage(nextVoyageId);
                          event.target.value = "";
                        }}
                        className="w-full appearance-none truncate py-2 pl-3 pr-8 bg-foreground/5 hover:bg-foreground/10 transition-colors border border-border rounded-lg text-xs font-medium text-foreground cursor-pointer disabled:opacity-60 focus:outline-none focus:ring-1 focus:ring-border"
                      >
                        <option value="" disabled>
                          Select a course
                        </option>
                        {otherVoyages.map((voyage) => (
                          <option key={voyage.id} value={voyage.id}>
                            {voyage.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {!isStaff && !isExpanded && activeVoyage && (
          <div className="flex justify-center" title={activeVoyage.name}>
            <div className="size-8 rounded-full border border-border bg-nexus-sidebar flex items-center justify-center">
              <Target className="size-4 text-primary" />
            </div>
          </div>
        )}

        <div
          className={`flex ${
            isExpanded ? "flex-row justify-between" : "flex-col items-center"
          } gap-1`}
        >
          <div className={!isExpanded ? "order-2" : undefined}>
            <ProfileMenu isExpanded={isExpanded} role={role} status={status} />
          </div>

          <div
            className={`flex ${
              isExpanded ? "items-center justify-center" : "flex-col items-center order-1"
            } gap-0.5 shrink-0`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate("settings");
              }}
              title="Settings"
              className="size-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-colors cursor-pointer"
            >
              <Settings className="size-3.5" />
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </aside>
  );
}
