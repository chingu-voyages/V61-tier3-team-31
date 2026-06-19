'use client';

import {createContext, useContext, useState, useEffect, type ReactNode} from 'react';
import type {UserRole, DashboardView, DashboardCtx} from '@/types';

const STORAGE_KEY = 'nexus-auth';

/** Gepufferter Dashboard-Zustand für localStorage */
interface PersistedState {
  role: UserRole;
  isAuthenticated: boolean;
  currentView: DashboardView;
  isSidebarExpanded: boolean;
}

const DEFAULT_STATE: PersistedState = {
  role: 'applicant',
  isAuthenticated: false,
  currentView: 'overview',
  isSidebarExpanded: true,
};

/**
 * Liest den persistierten Zustand aus localStorage.
 * Gibt bei Fehler oder SSR die Defaults zurück.
 */
function readStoredState(): PersistedState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return {...DEFAULT_STATE, ...JSON.parse(raw)};
  } catch {
    return DEFAULT_STATE;
  }
}

const DashboardContext = createContext<DashboardCtx | null>(null);

/**
 * Liefert den Dashboard-Kontext (Rolle, Ansicht, Sidebar-Zustand).
 * Darf nur innerhalb von DashboardProvider verwendet werden.
 */
export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard muss innerhalb von DashboardProvider verwendet werden');
  return ctx;
}

/** Zentraler Anbieter für den gesamten Dashboard-Zustand (persistiert in localStorage) */
export function DashboardProvider({children}: {children: ReactNode}) {
  const [role, setRole] = useState<UserRole>(DEFAULT_STATE.role);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<DashboardView>(DEFAULT_STATE.currentView);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Beim Mounten aus localStorage wiederherstellen
  useEffect(() => {
    const stored = readStoredState();
    setRole(stored.role);
    setIsAuthenticated(stored.isAuthenticated);
    setCurrentView(stored.currentView);
    setIsSidebarExpanded(stored.isSidebarExpanded);
    setIsInitialized(true);
  }, []);

  // Änderungen in localStorage spiegeln
  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({role, isAuthenticated, currentView, isSidebarExpanded}));
  }, [role, isAuthenticated, currentView, isSidebarExpanded, isInitialized]);

  return (
    <DashboardContext.Provider
      value={{
        role,
        setRole,
        isAuthenticated,
        setIsAuthenticated,
        currentView,
        setCurrentView,
        isSidebarExpanded,
        setIsSidebarExpanded,
        isInitialized,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
