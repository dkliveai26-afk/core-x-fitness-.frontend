import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'red' | 'outline' | 'dark' | 'gold';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export function Badge({
  children,
  variant = 'red',
  size = 'md',
  className = '',
  dot = false,
}: BadgeProps) {
  const variantStyles = {
    red: 'bg-core-red/15 text-core-accent border-core-red/30 shadow-[0_0_15px_rgba(255,42,42,0.15)]',
    outline: 'bg-white/5 text-white/90 border-white/15',
    dark: 'bg-core-dark/90 text-core-muted border-white/10',
    gold: 'bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-[0_0_15px_rgba(212,175,55,0.15)]',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2.5 py-0.5 tracking-[0.12em] sm:tracking-[0.2em]',
    md: 'text-xs px-3 py-1 tracking-[0.14em] sm:tracking-[0.25em]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-mono font-semibold uppercase rounded-full border backdrop-blur-md max-w-full text-center break-words',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-core-red animate-pulse shrink-0" />
      )}
      {children}
    </span>
  );
}
