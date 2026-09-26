'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function PlansHero() {
  return (
    <section className="relative pt-36 pb-20 sm:pt-44 sm:pb-28 overflow-hidden bg-core-void flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Atmospheric Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-core-red/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-6">
        {/* Top Minimal Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-core-dark/80 border border-white/10 backdrop-blur-md shadow-inner-bevel"
        >
          <span className="w-2 h-2 rounded-full bg-core-red shadow-glow-red animate-pulse" />
          <span className="text-[11px] font-mono tracking-[0.3em] text-white/90 uppercase font-bold">
            01 // MEMBERSHIP ALLOCATION
          </span>
        </motion.div>

        {/* Primary Punchy Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight text-white leading-[0.98]"
        >
          TRAIN WITH <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-core-red">PURPOSE</span>
          <span className="text-core-red">.</span>
        </motion.h1>

        {/* Concise Supporting Copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg font-sans text-core-muted max-w-2xl mx-auto font-light leading-relaxed"
        >
          Select your standard of architectural performance, calibrated Eleiko lifting bays, and biometric recovery suites.
        </motion.p>
      </div>
    </section>
  );
}
