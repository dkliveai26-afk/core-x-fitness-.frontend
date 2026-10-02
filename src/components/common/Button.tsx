import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glow';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs font-semibold tracking-wider rounded-md gap-1.5',
      md: 'px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold tracking-wider rounded-lg gap-2',
      lg: 'px-5 sm:px-7 py-2.5 sm:py-3.5 text-sm sm:text-base font-bold tracking-wider sm:tracking-widest rounded-lg gap-2 sm:gap-2.5',
      xl: 'px-5 sm:px-9 py-3 sm:py-4 text-sm sm:text-lg font-extrabold tracking-wider sm:tracking-widest rounded-xl gap-2 sm:gap-3',
    };

    const variantClasses = {
      primary:
        'bg-red-gradient text-white shadow-glow-red hover:shadow-glow-red-lg border border-white/20 hover:brightness-110 active:scale-[0.98]',
      secondary:
        'bg-core-surface/80 hover:bg-core-card text-white border border-white/10 hover:border-white/25 shadow-glass-card active:scale-[0.98]',
      outline:
        'bg-transparent border border-white/20 hover:border-core-red text-white hover:text-core-red active:scale-[0.98]',
      ghost:
        'bg-transparent text-core-muted hover:text-white hover:bg-white/5 active:scale-[0.98]',
      glow:
        'relative bg-white text-core-void font-bold shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.7)] hover:bg-slate-100 active:scale-[0.98]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-heading uppercase transition-all duration-300 select-none cursor-pointer max-w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-core-red/70 focus-visible:ring-offset-2 focus-visible:ring-offset-core-void',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0 transition-transform duration-300 group-hover:translate-x-1">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
