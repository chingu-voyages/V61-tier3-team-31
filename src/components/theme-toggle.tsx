'use client';

import {useTheme} from 'next-themes';
import {useSyncExternalStore} from 'react';
import {Sun, Moon, Monitor} from 'lucide-react';

/**
 * Erkennt, ob die Komponente gemountet wurde (client-seitig).
 * Verwendet `useSyncExternalStore` statt useState+useEffect fuer
 * effizientere Render-Zyklen (kein extra Re-Render beim Mount).
 */
function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/**
 * ThemeToggle-Button mit drei Zustaenden:
 * - Light (Sun-Icon)
 * - Dark (Moon-Icon)
 * - System (Monitor-Icon)
 *
 * Zyklus: system → light → dark → system
 */
export function ThemeToggle() {
  const {theme, setTheme} = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return <div className="w-8 h-8" />;
  }

  const cycle = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  return (
    <button
      onClick={cycle}
      title={`Theme: ${theme}`}
      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
    >
      {theme === 'light' && <Sun className="w-4 h-4" />}
      {theme === 'dark' && <Moon className="w-4 h-4" />}
      {theme === 'system' && <Monitor className="w-4 h-4" />}
    </button>
  );
}
