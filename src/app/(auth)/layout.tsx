export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6 font-sans transition-colors">
      <div className="w-full max-w-md bg-card rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] border border-border overflow-hidden transition-colors">
        {children}
      </div>

      <div className="mt-8 text-center text-xs font-medium text-muted-foreground">
        Protected by Nexus Identity Management
      </div>
    </div>
  );
}
