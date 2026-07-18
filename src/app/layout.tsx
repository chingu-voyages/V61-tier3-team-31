import type { Metadata } from "next";
import { Inter, Outfit, Geist } from "next/font/google";
import Script from "next/script";
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
        <Script id="perf-patch" strategy="beforeInteractive">
          {`if(window.performance){const _m=window.performance.measure.bind(window.performance);window.performance.measure=(n,s,e)=>{try{return _m(n,s,e)}catch(c){if(c instanceof TypeError&&c.message.includes("negative"))return;throw c}}}`}
        </Script>
      </body>
    </html>
  );
}
