"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: string;
  colors?: string[];
  duration?: number;
  className?: string;
}

export function GradientText({
  children,
  colors = ["hsl(145 37% 69%)", "#a855f7"],
  duration = 3,
  className,
}: GradientTextProps) {
  const gradient = useMemo(() => {
    const c = colors.join(", ");
    return `linear-gradient(90deg, hsl(var(--foreground)) 0%, hsl(var(--foreground)) 35%, ${c} 50%, hsl(var(--foreground)) 65%, hsl(var(--foreground)) 100%)`;
  }, [colors]);

  return (
    <span
      className={cn("inline-block text-transparent bg-clip-text", className)}
      style={{
        backgroundImage: gradient,
        backgroundSize: "250% 100%",
        animation: `gradient-sweep ${duration}s linear infinite`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {children}
    </span>
  );
}
