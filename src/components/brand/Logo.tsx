import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`flex items-center select-none ${className}`}>
      <Image
        src="/gymlogo1.png"
        alt="CORE X FITNESS"
        width={260}
        height={80}
        className="w-[140px] sm:w-[180px] lg:w-[210px] h-auto object-contain transition-transform duration-300 hover:scale-[1.02] filter drop-shadow-md"
        priority
      />
    </div>
  );
}
