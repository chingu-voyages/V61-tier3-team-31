'use client';

import {useDashboard} from '@/lib/auth-context';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';

/**
 * Dashboard-Startseite.
 * Leitet je nach Rolle auf /overview weiter.
 */
export default function DashboardPage() {
  const {isAuthenticated} = useDashboard();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/overview');
    } else {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  return null;
}
