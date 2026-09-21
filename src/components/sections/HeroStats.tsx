'use client';

import React from 'react';
import { heroStats } from '@/data/site';
import { motion } from 'framer-motion';

export function HeroStats() {
  return (
    <div className="w-full relative z-20 mt-12 lg:mt-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-5 rounded-2xl bg-core-dark/70 backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
        {heroStats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 + idx * 0.1 }}
            className="relative p-4 sm:p-5 rounded-xl bg-core-surface/50 border border-white/5 hover:border-core-red/40 hover:bg-core-card/80 transition-all duration-300 group overflow-hidden"
          >
            {/* Ambient hover glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-core-red/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white group-hover:text-white transition-colors">
                  {stat.value}
                </span>
                {stat.suffix && (
                  <span className="text-xs sm:text-sm font-mono font-bold text-core-red tracking-wider">
                    {stat.suffix}
                  </span>
                )}
              </div>

              <div className="mt-2.5">
                <p className="text-[11px] sm:text-xs font-heading font-extrabold uppercase tracking-widest text-slate-200">
                  {stat.label}
                </p>
                {stat.sublabel && (
                  <p className="text-[10px] sm:text-[11px] font-mono text-core-muted mt-0.5 tracking-wide">
                    {stat.sublabel}
                  </p>
                )}
              </div>
            </div>

            {/* Corner accent tick */}
            <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-core-red transition-colors duration-300" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
