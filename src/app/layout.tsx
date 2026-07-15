import type { Metadata } from "next";
import { Inter, Outfit, Geist } from "next/font/google";
import { Providers } from "./providers";
import { getCurrentUser } from "@/lib/auth/queries";
import { cn } from "@/lib/utils";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Cohorix — Course Management",
  description: "Manage your tech course experience",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();

  return (
    <html
      lang="en"
      className={cn(
        // "dark",
        inter.variable,
        outfit.variable,
        geist.variable,
        "font-sans",
        "h-full antialiased",
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans antialiased text-foreground">
        <Providers initialUser={currentUser}>{children}</Providers>
      </body>
    </html>
  );
}
