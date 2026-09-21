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
        width={320}
        height={90}
        className="w-[200px] sm:w-[250px] lg:w-[290px] h-auto object-contain transition-transform duration-300 hover:scale-[1.02] filter drop-shadow-lg"
        priority
      />
    </div>
  );
}
