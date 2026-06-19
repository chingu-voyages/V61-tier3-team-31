'use client';

import {useMemo} from 'react';
import {cn} from '@/lib/utils';

interface GradientTextProps {
  children: string;
  colors?: string[];
  duration?: number;
  className?: string;
}

/**
 * Text mit periodisch ueberfahrendem Gradient-Effekt.
 * Gradient-Band faehrt von links nach rechts ueber den Text.
 */
export function GradientText({
  children,
  colors = ['#77CF97', '#a855f7'],
  duration = 3,
  className,
}: GradientTextProps) {
  const gradient = useMemo(() => {
    const c = colors.join(', ');
    return `linear-gradient(90deg, #ffffff 0%, #ffffff 35%, ${c} 50%, #ffffff 65%, #ffffff 100%)`;
  }, [colors]);

  return (
    <span
      className={cn('inline-block text-transparent bg-clip-text', className)}
      style={{
        backgroundImage: gradient,
        backgroundSize: '250% 100%',
        animation: `gradient-sweep ${duration}s linear infinite`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {children}
    </span>
  );
}
