"use client";

import {
  Home,
  FileText,
  Users,
  Network,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Target,
  LogOut,
  UsersRound,
  ClipboardList,
  User,
  Compass,
  Megaphone,
  CalendarDays,
  BarChart3,
  Layers,
} from "lucide-react";
import { NexusLogo } from "@/components/nexus-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useState } from "react";

type DashboardView =
  | "overview"
  | "voyages"
  | "applications"
  | "participants"
  | "matching"
  | "analytics"
  | "teams"
  | "announcements"
  | "calendar"
  | "ui-components"
  | "apply"
  | "onboarding"
  | "profile"
  | "settings";

interface SidebarProps {
  role: string;
  status?: string;
  currentView: DashboardView;
}

function NavItem({
  icon,
  label,
  active = false,
  badge = "",
  onClick,
  isExpanded = true,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: string;
  onClick?: () => void;
  isExpanded?: boolean;
}) {
  return (
    <button
      title={!isExpanded ? label : undefined}
      onClick={onClick}
      className={`w-full flex items-center ${isExpanded ? "justify-between px-3" : "justify-center px-0"} py-2.5 rounded-xl transition-colors cursor-pointer relative ${
        active
          ? "bg-white/10 text-white font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
      }`}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
      )}
      <div className={`flex items-center ${isExpanded ? "gap-3" : ""}`}>
        {icon}
        {isExpanded && <span className="text-sm">{label}</span>}
      </div>
      {isExpanded && badge && (
        <span
          className={`text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full ${
            active ? "bg-primary/20 text-primary" : "bg-white/10 text-muted-foreground"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

export function Sidebar({ role, status, currentView }: SidebarProps) {
  const { profile, signOut } = useAuth();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isVoyageExpanded, setIsVoyageExpanded] = useState(true);
  const isStaff = role === "admin" || role === "moderator";
  const userName = profile?.full_name ?? (isStaff ? "Jane Cooper" : "Mark Logic");

  const navigate = (view: DashboardView) => {
    const nextPath =
      view === "overview"
        ? isStaff
          ? "/admin"
          : "/app/overview"
        : `${isStaff ? "/admin" : "/app"}/${view}`;

    router.push(nextPath);
  };

  const handleLogout = async () => {
    await signOut();
    router.replace("/login");
  };

  return (
    <div
      className={`bg-nexus-dark text-muted-foreground flex flex-col shrink-0 min-h-screen border-r border-border transition-all duration-300 relative ${
        isExpanded ? "w-[260px]" : "w-[80px]"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3.5 top-[28px] w-7 h-7 bg-card border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground shadow-sm z-10 cursor-pointer transition-colors"
      >
        {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {/* Header */}
      <div className="h-[76px] flex items-center px-6 gap-3 pt-2 overflow-hidden">
        <NexusLogo className="w-8 h-8 shrink-0" />
        {isExpanded && (
          <span className="font-outfit text-xl font-medium tracking-wide text-white truncate">
            Nexus
          </span>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-2 space-y-1 overflow-hidden">
        {isStaff && (
          <>
            <NavItem
              isExpanded={isExpanded}
              icon={<Home className="w-4 h-4" />}
              label="Overview"
              active={currentView === "overview"}
              onClick={() => navigate("overview")}
            />
            <NavItem
              isExpanded={isExpanded}
              icon={<Compass className="w-4 h-4" />}
              label="Voyages"
              active={currentView === "voyages"}
              onClick={() => navigate("voyages")}
            />
            <NavItem
              isExpanded={isExpanded}
              icon={<FileText className="w-4 h-4" />}
              label="Applications"
              badge="312"
              active={currentView === "applications"}
              onClick={() => navigate("applications")}
            />
            <NavItem
              isExpanded={isExpanded}
              icon={<Users className="w-4 h-4" />}
              label="Participants"
              badge="128"
              active={currentView === "participants"}
              onClick={() => navigate("participants")}
            />
            <NavItem
              isExpanded={isExpanded}
              icon={<Network className="w-4 h-4" />}
              label="Matching"
              active={currentView === "matching"}
              onClick={() => navigate("matching")}
            />
            <NavItem
              isExpanded={isExpanded}
              icon={<BarChart3 className="w-4 h-4" />}
              label="Analytics"
              active={currentView === "analytics"}
              onClick={() => navigate("analytics")}
            />
            <NavItem
              isExpanded={isExpanded}
              icon={<UsersRound className="w-4 h-4" />}
              label="Teams"
              badge="18"
              active={currentView === "teams"}
              onClick={() => navigate("teams")}
            />
            <NavItem
              isExpanded={isExpanded}
              icon={<Megaphone className="w-4 h-4" />}
              label="Announcements"
              active={currentView === "announcements"}
              onClick={() => navigate("announcements")}
            />
            <NavItem
              isExpanded={isExpanded}
              icon={<CalendarDays className="w-4 h-4" />}
              label="Calendar"
              active={currentView === "calendar"}
              onClick={() => navigate("calendar")}
            />
            <NavItem
              isExpanded={isExpanded}
              icon={<Layers className="w-4 h-4" />}
              label="UI Kit"
              active={currentView === "ui-components"}
              onClick={() => navigate("ui-components")}
            />
          </>
        )}

        {!isStaff && status === "applicant" && (
          <>
            <NavItem
              isExpanded={isExpanded}
              icon={<FileText className="w-4 h-4" />}
              label="Application Form"
              active={currentView === "apply"}
              onClick={() => navigate("apply")}
            />
            <NavItem
              isExpanded={isExpanded}
              icon={<Home className="w-4 h-4" />}
              label="Application Status"
              active={currentView === "overview"}
              onClick={() => navigate("overview")}
            />
          </>
        )}

        {!isStaff && status === "participant" && (
          <>
            <NavItem
              isExpanded={isExpanded}
              icon={<Home className="w-4 h-4" />}
              label="Dashboard"
              active={currentView === "overview"}
              onClick={() => navigate("overview")}
            />
            <NavItem
              isExpanded={isExpanded}
              icon={<UsersRound className="w-4 h-4" />}
              label="Team Space"
              active={currentView === "teams"}
              onClick={() => navigate("teams")}
            />
            <NavItem
              isExpanded={isExpanded}
              icon={<ClipboardList className="w-4 h-4" />}
              label="Onboarding"
              active={currentView === "onboarding"}
              onClick={() => navigate("onboarding")}
            />
            <NavItem
              isExpanded={isExpanded}
              icon={<CalendarDays className="w-4 h-4" />}
              label="Calendar"
              active={currentView === "calendar"}
              onClick={() => navigate("calendar")}
            />
          </>
        )}

        {!isStaff && !status && (
          <>
            <NavItem
              isExpanded={isExpanded}
              icon={<Home className="w-4 h-4" />}
              label="Overview"
              active={currentView === "overview"}
              onClick={() => navigate("overview")}
            />
            <NavItem
              isExpanded={isExpanded}
              icon={<FileText className="w-4 h-4" />}
              label="Apply"
              active={currentView === "apply"}
              onClick={() => navigate("apply")}
            />
            <NavItem
              isExpanded={isExpanded}
              icon={<ClipboardList className="w-4 h-4" />}
              label="Onboarding"
              active={currentView === "onboarding"}
              onClick={() => navigate("onboarding")}
            />
            <NavItem
              isExpanded={isExpanded}
              icon={<CalendarDays className="w-4 h-4" />}
              label="Calendar"
              active={currentView === "calendar"}
              onClick={() => navigate("calendar")}
            />
            <NavItem
              isExpanded={isExpanded}
              icon={<User className="w-4 h-4" />}
              label="Profile"
              active={currentView === "profile"}
              onClick={() => navigate("profile")}
            />
          </>
        )}
      </div>

      {/* Bottom section */}
      <div className="p-4 mt-auto space-y-3">
        {/* Voyage card */}
        {isExpanded && (
          <div className="bg-nexus-sidebar rounded-xl border border-border shadow-xl whitespace-nowrap overflow-hidden transition-all duration-300">
            <button
              onClick={() => setIsVoyageExpanded(!isVoyageExpanded)}
              className="w-full flex items-center justify-between p-4 cursor-pointer transition-colors"
            >
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white text-sm">Voyage 51</span>
                  <span className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div className="text-xs text-muted-foreground">Application Review</div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
                  isVoyageExpanded ? "rotate-180" : ""
                }`}
              />
            </button>

            {isVoyageExpanded && (
              <div className="px-4 pb-4 animate-in slide-in-from-top-2 fade-in duration-200">
                <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground mb-4 bg-white/5 p-2 rounded-lg border border-border">
                  <span className="w-3.5 h-3.5 text-muted-foreground">📅</span>
                  Apr 20 – Jun 1, 2026
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Past Voyages
                  </span>
                  <div className="w-full flex items-center justify-between py-2 px-3 bg-white/5 hover:bg-white/10 transition-colors border border-border rounded-lg text-xs font-medium text-foreground cursor-pointer">
                    <span>Voyage 50</span>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {!isExpanded && (
          <div className="flex justify-center" title="Voyage 51">
            <div className="w-8 h-8 rounded-full border border-border bg-nexus-sidebar flex items-center justify-center">
              <Target className="w-4 h-4 text-primary" />
            </div>
          </div>
        )}

        {/* User profile + actions */}
        <div
          className={`flex ${
            isExpanded ? "flex-row justify-between" : "flex-col items-center"
          } gap-1`}
        >
          <div className={!isExpanded ? "order-2" : undefined}>
            <DropdownMenu>
              <DropdownMenuTrigger
                className={`flex items-center ${
                  isExpanded ? "gap-3 px-2 py-1" : "p-0.5"
                } cursor-pointer rounded-xl transition-colors min-w-0 flex-1 outline-none hover:bg-white/5`}
              >
                <img
                  src={
                    isStaff ? "https://i.pravatar.cc/100?img=5" : "https://i.pravatar.cc/100?img=11"
                  }
                  className="w-8 h-8 rounded-full bg-muted border border-border shrink-0"
                  alt="profile"
                  title={userName}
                />
                {isExpanded && (
                  <div className="flex-1 overflow-hidden text-left">
                    <div className="text-sm font-medium text-white truncate">{userName}</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {role}
                      {!isStaff && status ? ` · ${status}` : ""}
                    </div>
                  </div>
                )}
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side={isExpanded ? "top" : "right"}
                align="start"
                sideOffset={8}
                className="min-w-[180px] bg-[#1a1b24] border border-white/10 text-slate-200 p-1 shadow-xl"
              >
                <DropdownMenuItem
                  onClick={() => navigate("profile")}
                  className="text-slate-200 focus:text-white focus:bg-white/5 cursor-pointer rounded-lg px-2 py-2 text-sm"
                >
                  <User className="w-4 h-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-rose-400 focus:text-rose-300 focus:bg-white/5 cursor-pointer rounded-lg px-2 py-2 text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
