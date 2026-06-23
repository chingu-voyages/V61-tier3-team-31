'use client';

import {createContext, useContext, useState, useEffect, type ReactNode} from 'react';
import type {UserRole, UserStatus, DashboardView, DashboardCtx} from '@/types';

const STORAGE_KEY = 'nexus-auth';

/** Gepufferter Dashboard-Zustand fuer localStorage */
interface PersistedState {
  role: UserRole;
  status: UserStatus;
  isAuthenticated: boolean;
  currentView: DashboardView;
  isSidebarExpanded: boolean;
}

const DEFAULT_STATE: PersistedState = {
  role: 'user',
  status: 'applicant',
  isAuthenticated: false,
  currentView: 'overview',
  isSidebarExpanded: true,
};

/**
 * Liest den persistierten Zustand aus localStorage.
 * Migriert alte Rollen ('applicant'/'participant') auf das neue Schema.
 * Gibt bei Fehler oder SSR die Defaults zurueck.
 */
function readStoredState(): PersistedState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    // Migration: alte Rollen auf neues Schema umwandeln
    if (parsed.role === 'applicant') {
      parsed.role = 'user';
      parsed.status = 'applicant';
    } else if (parsed.role === 'participant') {
      parsed.role = 'user';
      parsed.status = 'participant';
    }
    return {...DEFAULT_STATE, ...parsed};
  } catch {
    return DEFAULT_STATE;
  }
}

const DashboardContext = createContext<DashboardCtx | null>(null);

/**
 * Liefert den Dashboard-Kontext (Rolle, Status, Ansicht, Sidebar-Zustand).
 * Darf nur innerhalb von DashboardProvider verwendet werden.
 */
export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard muss innerhalb von DashboardProvider verwendet werden');
  return ctx;
}

/** Zentraler Anbieter fuer den gesamten Dashboard-Zustand (persistiert in localStorage) */
export function DashboardProvider({children}: {children: ReactNode}) {
  const [role, setRole] = useState<UserRole>(DEFAULT_STATE.role);
  const [status, setStatus] = useState<UserStatus>(DEFAULT_STATE.status);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<DashboardView>(DEFAULT_STATE.currentView);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Beim Mounten aus localStorage wiederherstellen
  useEffect(() => {
    const stored = readStoredState();
    setRole(stored.role);
    setStatus(stored.status);
    setIsAuthenticated(stored.isAuthenticated);
    setCurrentView(stored.currentView);
    setIsSidebarExpanded(stored.isSidebarExpanded);
    setIsInitialized(true);
  }, []);

  // Aenderungen in localStorage spiegeln
  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({role, status, isAuthenticated, currentView, isSidebarExpanded}));
  }, [role, status, isAuthenticated, currentView, isSidebarExpanded, isInitialized]);

  return (
    <DashboardContext.Provider
      value={{
        role,
        setRole,
        status,
        setStatus,
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
