'use client';

import {useDashboard} from '@/lib/auth-context';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';
import {Sidebar} from '@/components/sidebar';

/**
 * Layout fuer den Dashboard-Bereich.
 * Schuetzt alle Routes unter /(dashboard) hinter der Authentifizierung.
 * Wartet auf die Initialisierung aus localStorage, bevor umgeleitet wird.
 */
export default function DashboardLayout({children}: {children: React.ReactNode}) {
  const {isAuthenticated, isInitialized} = useDashboard();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) return;
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isInitialized, isAuthenticated, router]);

  if (!isInitialized || !isAuthenticated) {
    return null;
  }

  return (
    <div className="flex bg-[#f8f9fc] dark:bg-[#0f0f0f] dark:text-slate-200 min-h-screen text-slate-800 font-sans transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col items-stretch overflow-hidden h-screen overflow-y-auto">
        <main className="p-8 max-w-[1400px] w-full mx-auto space-y-8 pb-12">
          {children}
        </main>
      </div>
    </div>
  );
}
