"use client";

interface FormWrapperProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function FormWrapper({ children, title, description }: FormWrapperProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h2 className="text-xl font-semibold text-foreground font-outfit tracking-tight">
          {title}
        </h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="relative rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-5 shadow-sm transition-shadow hover:shadow-md">
        {children}
      </div>
    </div>
  );
}
