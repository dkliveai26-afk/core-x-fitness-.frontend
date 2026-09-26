'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { contactDetails } from '@/data/contact';

export function ContactHero() {
  return (
    <section className="relative w-full pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 bg-core-void select-none overflow-hidden">
      {/* Background Volumetric Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-radial from-core-red/15 via-core-crimson/5 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Subtle Spatial Grid Texture */}
      <div className="absolute inset-0 bg-grid-white/[0.015] bg-[size:40px_40px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto w-full">
        <div className="max-w-4xl space-y-6 sm:space-y-8">

          {/* Minimalist Top Badge with Left-to-Right Reveal */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-core-red/10 border border-core-red/30 text-[11px] font-mono tracking-[0.35em] text-core-red uppercase font-bold backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-core-red" />
            DIRECT COMMUNICATIONS // ATHLETIC CONCIERGE
          </motion.div>

          {/* Masked Hero Title with Staggered Left-to-Right Reveal */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-black text-[clamp(2.4rem,7vw,6.5rem)] uppercase tracking-tight leading-[0.98] text-white"
            >
              <span className="block text-white">LET&apos;S BUILD</span>
              <span className="block mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-core-red via-[#FF4D4D] to-white drop-shadow-[0_0_35px_rgba(255,42,42,0.4)]">
                WHAT&apos;S NEXT.
              </span>
            </motion.h1>
          </div>

          {/* Very Short Supporting Line */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs sm:text-sm font-mono text-core-muted tracking-[0.25em] uppercase max-w-2xl leading-relaxed font-light"
          >
            {contactDetails.subheadline}
          </motion.p>

          {/* Quick Status Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.0, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-white/70"
          >
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10">
              <span className="w-2 h-2 rounded-full bg-core-red shadow-glow-red animate-pulse" />
              <span>CONCIERGE DESK ACTIVE</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-core-red" />
              <span>&lt; 2-HOUR RESPONSE SLA</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-core-muted">
              <span>KOLKATA FLAGSHIP // SECTOR V</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
