import type {Metadata} from 'next';
import {Inter, Outfit, Geist } from 'next/font/google';
import './globals.css';
import {DashboardProvider} from '@/lib/auth-context';
import {ThemeProvider} from '@/components/theme-provider';
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({subsets: ['latin'], variable: '--font-inter'});
const outfit = Outfit({subsets: ['latin'], variable: '--font-outfit'});

export const metadata: Metadata = {
  title: 'Amigo | Cohort Management',
  description: 'Apply to join the next cohort on Amigo.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={cn(inter.variable, outfit.variable, "font-sans", geist.variable)} suppressHydrationWarning>
      <body className="font-sans antialiased text-slate-900">
        <ThemeProvider>
          <DashboardProvider>{children}</DashboardProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
