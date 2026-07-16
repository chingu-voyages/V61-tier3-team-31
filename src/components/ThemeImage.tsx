"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ThemeImageProps {
  lightSrc: string;
  darkSrc: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export function ThemeImage({ lightSrc, darkSrc, alt, width, height, className }: ThemeImageProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Image
      src={resolvedTheme === "light" ? lightSrc : darkSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}
