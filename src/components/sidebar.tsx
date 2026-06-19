'use client';

import {
  Home, FileText, Users, Network, CheckCircle, FileSearch,
  BarChart2, Settings, ChevronLeft, ChevronRight, ChevronDown,
  Target, LogOut, UsersRound, FileCheck, ClipboardList,
} from 'lucide-react';
import {NexusLogo} from '@/components/nexus-logo';
import {ThemeToggle} from '@/components/theme-toggle';
import {useDashboard} from '@/lib/auth-context';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import type {DashboardView} from '@/types';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

/** Navigations-Item in der Sidebar */
function NavItem({
  icon, label, active = false, badge = '', onClick, isExpanded = true,
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
      className={`w-full flex items-center ${isExpanded ? 'justify-between px-3' : 'justify-center px-0'} py-2.5 rounded-xl transition-colors cursor-pointer ${active ? 'bg-[#1CB368]/15 text-[#1CB368] font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
    >
      <div className={`flex items-center ${isExpanded ? 'gap-3' : ''}`}>
        {icon}
        {isExpanded && <span className="text-sm">{label}</span>}
      </div>
      {isExpanded && badge && (
        <span className={`text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full ${active ? 'bg-[#1CB368]/20 text-[#1CB368]' : 'bg-white/10 text-slate-300'}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

/** Haupt-Sidebar mit Navigation, Voyage-Karte und Profil */
export function Sidebar() {
  const {role, currentView, setCurrentView, isSidebarExpanded, setIsSidebarExpanded, setIsAuthenticated} = useDashboard();
  const router = useRouter();
  const [isVoyageExpanded, setIsVoyageExpanded] = useState(true);

  const handleLogout = () => {
    setIsAuthenticated(false);
    router.push('/login');
  };

  const navigate = (view: DashboardView) => {
    setCurrentView(view);
    router.push(`/${view}`);
  };

  return (
    <div className={`bg-[#0b0c10] text-slate-300 flex flex-col shrink-0 min-h-screen border-r border-[#1a1b24] transition-all duration-300 relative ${isSidebarExpanded ? 'w-[260px]' : 'w-[80px]'}`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
        className="absolute -right-3.5 top-[28px] w-7 h-7 bg-white dark:bg-[#1a1b24] border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 shadow-sm z-10 cursor-pointer transition-colors"
      >
        {isSidebarExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {/* Kopfbereich */}
      <div className="h-[76px] flex items-center px-6 gap-3 pt-2 overflow-hidden">
        <NexusLogo className="w-8 h-8 shrink-0" />
        {isSidebarExpanded && (
          <span className="font-outfit text-xl font-medium tracking-wide text-white truncate">Nexus Ops</span>
        )}
      </div>

      {/* Navigationseintraege */}
      <div className="flex-1 px-4 py-2 space-y-1 overflow-hidden">
        {/* --- Admin: sieht alles --- */}
        {role === 'admin' && (
          <>
            <NavItem isExpanded={isSidebarExpanded} icon={<Home className="w-4 h-4" />} label="Overview" active={currentView === 'overview'} onClick={() => navigate('overview')} />
            <NavItem isExpanded={isSidebarExpanded} icon={<FileText className="w-4 h-4" />} label="Applications" badge="312" active={currentView === 'applications'} onClick={() => navigate('applications')} />
            <NavItem isExpanded={isSidebarExpanded} icon={<Users className="w-4 h-4" />} label="Participants" badge="128" />
            <NavItem isExpanded={isSidebarExpanded} icon={<Network className="w-4 h-4" />} label="Matching" active={currentView === 'matching'} onClick={() => navigate('matching')} />
            <NavItem isExpanded={isSidebarExpanded} icon={<UsersRound className="w-4 h-4" />} label="Teams" badge="18" active={currentView === 'teams'} onClick={() => navigate('teams')} />
            <NavItem isExpanded={isSidebarExpanded} icon={<CheckCircle className="w-4 h-4" />} label="Onboarding" />
            <NavItem isExpanded={isSidebarExpanded} icon={<FileSearch className="w-4 h-4" />} label="Forms" active={currentView === 'forms'} onClick={() => navigate('forms')} />
            <NavItem isExpanded={isSidebarExpanded} icon={<BarChart2 className="w-4 h-4" />} label="Analytics" />
            <NavItem isExpanded={isSidebarExpanded} icon={<Settings className="w-4 h-4" />} label="Settings" active={currentView === 'settings'} onClick={() => navigate('settings')} />
          </>
        )}

        {/* --- Applicant: nur Status-Uebersicht und Einstellungen --- */}
        {role === 'applicant' && (
          <>
            <NavItem isExpanded={isSidebarExpanded} icon={<Home className="w-4 h-4" />} label="Application Status" active={currentView === 'overview'} onClick={() => navigate('overview')} />
            <NavItem isExpanded={isSidebarExpanded} icon={<Settings className="w-4 h-4" />} label="Settings" active={currentView === 'settings'} onClick={() => navigate('settings')} />
          </>
        )}

        {/* --- Participant: Team, Onboarding, Einstellungen --- */}
        {role === 'participant' && (
          <>
            <NavItem isExpanded={isSidebarExpanded} icon={<Home className="w-4 h-4" />} label="Dashboard" active={currentView === 'overview'} onClick={() => navigate('overview')} />
            <NavItem isExpanded={isSidebarExpanded} icon={<UsersRound className="w-4 h-4" />} label="Team Space" active={currentView === 'teams'} onClick={() => navigate('teams')} />
            <NavItem isExpanded={isSidebarExpanded} icon={<ClipboardList className="w-4 h-4" />} label="Onboarding" active={currentView === 'onboarding'} onClick={() => navigate('onboarding')} />
            <NavItem isExpanded={isSidebarExpanded} icon={<Settings className="w-4 h-4" />} label="Settings" active={currentView === 'settings'} onClick={() => navigate('settings')} />
          </>
        )}
      </div>

      <div className="p-4 mt-auto space-y-3">
        {/* Voyage-Karte */}
        {isSidebarExpanded && (
          <div className="bg-[#13151a] rounded-xl border border-white/5 shadow-xl whitespace-nowrap overflow-hidden transition-all duration-300">
            <button
              onClick={() => setIsVoyageExpanded(!isVoyageExpanded)}
              className="w-full flex items-center justify-between p-4 cursor-pointer transition-colors"
            >
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white text-sm">Voyage 51</span>
                  <span className="w-2 h-2 rounded-full bg-[#1CB368]" />
                </div>
                <div className="text-xs text-slate-400">Application Review</div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isVoyageExpanded ? 'rotate-180' : ''}`} />
            </button>

            {isVoyageExpanded && (
              <div className="px-4 pb-4 animate-in slide-in-from-top-2 fade-in duration-200">
                <div className="flex items-center gap-2 text-[11px] font-medium text-slate-300 mb-4 bg-white/5 p-2 rounded-lg border border-white/5">
                  <span className="w-3.5 h-3.5 text-slate-400">📅</span>
                  Apr 20 – Jun 1, 2026
                </div>
                <button className="w-full flex items-center justify-between py-2 px-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-lg text-xs font-medium text-slate-200 cursor-pointer">
                  <span>View Voyage</span>
                  <span className="w-3.5 h-3.5 text-slate-400">↗</span>
                </button>
              </div>
            )}
          </div>
        )}

        {!isSidebarExpanded && (
          <div className="flex justify-center" title="Voyage 51">
            <div className="w-8 h-8 rounded-full border border-white/10 bg-[#13151a] flex items-center justify-center">
              <Target className="w-4 h-4 text-[#1CB368]" />
            </div>
          </div>
        )}

        {/* Benutzerprofil + Aktionen — auf gleicher Ebene */}
        <div className={`flex items-center ${isSidebarExpanded ? 'justify-between' : 'justify-center'} gap-2`}>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`flex items-center ${isSidebarExpanded ? 'gap-3 px-2 py-1' : 'p-1'} cursor-pointer rounded-xl transition-colors min-w-0 flex-1 outline-none`}
            >
              <img
                src={role === 'admin' ? 'https://i.pravatar.cc/100?img=5' : role === 'applicant' ? 'https://i.pravatar.cc/100?img=32' : 'https://i.pravatar.cc/100?img=11'}
                className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 shrink-0"
                alt="profile"
                title={role === 'admin' ? 'Jane Cooper' : role === 'applicant' ? 'David Rust' : 'Mark Logic'}
              />
              {isSidebarExpanded && (
                <div className="flex-1 overflow-hidden text-left">
                  <div className="text-sm font-medium text-white truncate">{role === 'admin' ? 'Jane Cooper' : role === 'applicant' ? 'David Rust' : 'Mark Logic'}</div>
                  <div className="text-xs text-slate-500 capitalize">{role}</div>
                </div>
              )}
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side={isSidebarExpanded ? "top" : "right"}
              align="start"
              sideOffset={8}
              className="min-w-[180px] bg-[#1a1b24] border border-white/10 text-slate-200 p-1 shadow-xl"
            >
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-rose-400 focus:text-rose-300 focus:bg-white/5 cursor-pointer rounded-lg px-2 py-2 text-sm"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Knopfleiste — auf gleicher Ebene neben Profil */}
          {isSidebarExpanded && (
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); navigate('settings'); }}
                title="Settings"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
              <ThemeToggle />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
