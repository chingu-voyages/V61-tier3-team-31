"use client";

import {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";
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

/** In-memory listeners notified on every write */
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) listener();
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

/** Cached snapshot — only re-parsed when the raw string changes */
let cachedRaw: string | null = null;
let cachedSnapshot: PersistedState = DEFAULT_STATE;

function getSnapshot(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedSnapshot = raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : DEFAULT_STATE;
    }
    return cachedSnapshot;
  } catch {
    return DEFAULT_STATE;
  }
}

function getServerSnapshot(): PersistedState {
  return DEFAULT_STATE;
}

function writeState(updater: (prev: PersistedState) => PersistedState) {
  const current = getSnapshot();
  const next = updater(current);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  emitChange();
}

const DashboardContext = createContext<DashboardCtx | null>(null);

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setRole = useCallback((role: UserRole) => writeState((s) => ({ ...s, role })), []);
  const setStatus = useCallback((status: UserStatus) => writeState((s) => ({ ...s, status })), []);
  const setIsAuthenticated = useCallback(
    (isAuthenticated: boolean) => writeState((s) => ({ ...s, isAuthenticated })),
    [],
  );
  const setCurrentView = useCallback(
    (currentView: DashboardView) => writeState((s) => ({ ...s, currentView })),
    [],
  );
  const setIsSidebarExpanded = useCallback(
    (isSidebarExpanded: boolean) => writeState((s) => ({ ...s, isSidebarExpanded })),
    [],
  );

  const value: DashboardCtx = {
    role: state.role,
    setRole,
    status: state.status,
    setStatus,
    isAuthenticated: state.isAuthenticated,
    setIsAuthenticated,
    currentView: state.currentView,
    setCurrentView,
    isSidebarExpanded: state.isSidebarExpanded,
    setIsSidebarExpanded,
    isInitialized: true,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}
