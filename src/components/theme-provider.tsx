'use client';

import {ThemeProvider as NextThemesProvider} from 'next-themes';
import {type ReactNode} from 'react';

/**
 * ThemeProvider-Wrapper fuer next-themes.
 * Verwendet `class`-Strategie, damit Tailwind v4 `dark:`-Utilities funktionieren.
 * `disableTransitionOnChange` verhindert Farb-Animation beim Wechsel.
 */
export function ThemeProvider({children}: {children: ReactNode}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
