import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const heightMap = {
    sm: 'h-8',
    md: 'h-10 sm:h-11',
    lg: 'h-14',
  };

  return (
    <div className={`flex items-center select-none ${className}`}>
      <Image
        src="/gymlogo1.png"
        alt="CORE X FITNESS"
        width={220}
        height={60}
        className={`${heightMap[size]} w-auto object-contain transition-transform duration-300 hover:scale-105`}
        priority
      />
    </div>
  );
}

