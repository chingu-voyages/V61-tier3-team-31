import type {Metadata} from 'next';
import {Inter, Outfit} from 'next/font/google';
import './globals.css';
import {DashboardProvider} from '@/lib/auth-context';

const inter = Inter({subsets: ['latin'], variable: '--font-inter'});
const outfit = Outfit({subsets: ['latin'], variable: '--font-outfit'});

export const metadata: Metadata = {
  title: 'Nexus | Cohort Management',
  description: 'Apply to join the next cohort on Nexus.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased text-slate-900 bg-stone-50" suppressHydrationWarning>
        <DashboardProvider>{children}</DashboardProvider>
      </body>
    </html>
  );
}
