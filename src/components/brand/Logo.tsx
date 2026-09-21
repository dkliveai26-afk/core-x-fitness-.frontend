import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', showText = true, size = 'md' }: LogoProps) {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-base tracking-widest' },
    md: { icon: 'w-9 h-9', text: 'text-xl tracking-[0.25em]' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl tracking-[0.3em]' },
  };

  return (
    <div className={`flex items-center gap-3 select-none group ${className}`}>
      {/* Precision Geometric Core X Emblem */}
      <div className={`relative ${sizeMap[size].icon} flex items-center justify-center shrink-0`}>
        {/* Glow ambient layer */}
        <div className="absolute inset-0 bg-core-red/25 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* SVG Emblem */}
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 transition-transform duration-500 ease-out group-hover:scale-105"
        >
          {/* Outer Shield / Octagonal Rim */}
          <rect
            x="2"
            y="2"
            width="44"
            height="44"
            rx="10"
            className="fill-core-dark/90 stroke-white/15 group-hover:stroke-core-red/50 transition-colors duration-300"
            strokeWidth="1.5"
          />

          {/* Precision Cross / Dynamic X Bars */}
          {/* Slash 1 - Platinum White Titanium bar */}
          <path
            d="M13 13L35 35M17 13H13V17L31 35H35V31L17 13Z"
            fill="url(#titanium-grad)"
          />
          
          {/* Slash 2 - Crimson Core Laser bar with angular cut */}
          <path
            d="M35 13L13 35M31 13H35V17L17 35H13V31L31 13Z"
            fill="url(#core-red-grad)"
          />

          {/* Center Energy Core Diamond */}
          <rect
            x="20.5"
            y="20.5"
            width="7"
            height="7"
            transform="rotate(45 24 24)"
            fill="#FFFFFF"
            className="group-hover:fill-core-red transition-colors duration-300"
          />

          {/* Gradients */}
          <defs>
            <linearGradient id="titanium-grad" x1="13" y1="13" x2="35" y2="35" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="0.5" stopColor="#E2E8F0" />
              <stop offset="1" stopColor="#94A3B8" />
            </linearGradient>
            <linearGradient id="core-red-grad" x1="35" y1="13" x2="13" y2="35" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF4D4D" />
              <stop offset="0.5" stopColor="#FF2A2A" />
              <stop offset="1" stopColor="#B91C1C" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 font-display font-extrabold text-white leading-none">
            <span className={`${sizeMap[size].text}`}>CORE</span>
            <span className="text-core-red font-black">X</span>
          </div>
          <span className="text-[9px] uppercase font-mono tracking-[0.38em] text-core-muted/90 mt-1 font-semibold group-hover:text-white transition-colors duration-300">
            FITNESS CLUB
          </span>
        </div>
      )}
    </div>
  );
}
