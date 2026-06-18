'use client';

import {useDashboard} from '@/lib/auth-context';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';
import {Sidebar} from '@/components/sidebar';

/**
 * Layout fuer den Dashboard-Bereich.
 * Schuetzt alle Routes unter /(dashboard) hinter der Authentifizierung.
 */
export default function DashboardLayout({children}: {children: React.ReactNode}) {
  const {isAuthenticated} = useDashboard();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex bg-[#f8f9fc] min-h-screen text-slate-800 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col items-stretch overflow-hidden h-screen overflow-y-auto">
        <main className="p-8 max-w-[1400px] w-full mx-auto space-y-8 pb-12">
          {children}
        </main>
      </div>
    </div>
  );
}
