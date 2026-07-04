"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { UserRole, UserStatus, DashboardView, DashboardCtx } from "@/types";

const STORAGE_KEY = "nexus-auth";

interface PersistedState {
  role: UserRole;
  status: UserStatus;
  isAuthenticated: boolean;
  currentView: DashboardView;
  isSidebarExpanded: boolean;
}

const DEFAULT_STATE: PersistedState = {
  role: "user",
  status: "applicant",
  isAuthenticated: false,
  currentView: "overview",
  isSidebarExpanded: false,
};

function readStoredState(): PersistedState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return DEFAULT_STATE;
  }
}

const DashboardContext = createContext<DashboardCtx | null>(null);

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(DEFAULT_STATE);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage hydration on mount
    setState(readStoredState());
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isInitialized]);

  const value: DashboardCtx = {
    role: state.role,
    setRole: (role) => setState((s) => ({ ...s, role })),
    status: state.status,
    setStatus: (status) => setState((s) => ({ ...s, status })),
    isAuthenticated: state.isAuthenticated,
    setIsAuthenticated: (isAuthenticated) => setState((s) => ({ ...s, isAuthenticated })),
    currentView: state.currentView,
    setCurrentView: (currentView) => setState((s) => ({ ...s, currentView })),
    isSidebarExpanded: state.isSidebarExpanded,
    setIsSidebarExpanded: (isSidebarExpanded) => setState((s) => ({ ...s, isSidebarExpanded })),
    isInitialized,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}
