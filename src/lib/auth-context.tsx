'use client';

import {createContext, useContext, useState, type ReactNode} from 'react';
import type {UserRole, DashboardView, SettingsTab, DashboardContext} from '@/types';

const DashboardContext = createContext<DashboardContext | null>(null);

/**
 * Liefert den Dashboard-Kontext (Rolle, Ansicht, Sidebar-Zustand).
 * Darf nur innerhalb von DashboardProvider verwendet werden.
 */
export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard muss innerhalb von DashboardProvider verwendet werden');
  return ctx;
}

/** Zentraler Anbieter für den gesamten Dashboard-Zustand */
export function DashboardProvider({children}: {children: ReactNode}) {
  const [role, setRole] = useState<UserRole>('applicant');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

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
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
