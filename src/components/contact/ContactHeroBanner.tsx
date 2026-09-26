'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export function ContactHeroBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-core-void pt-20 sm:pt-24 border-b border-white/5 select-none">
      {/* Background Banner Image with Dark Cinematic Overlays */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/contactpagebannerbagroudimage.jpg"
          alt="Contact Page Banner"
          fill
          priority
          className="object-cover object-center opacity-65 filter contrast-125 brightness-75"
        />
        {/* Dark Vignettes & Gradients for seamless integration */}
        <div className="absolute inset-0 bg-gradient-to-r from-core-void via-core-void/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-core-void via-transparent to-core-void/40" />
        {/* Subtle Red Atmospheric Glow */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-radial from-core-red/25 via-core-crimson/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] flex items-center justify-between">
        {/* Left Side: Compact, Impactful Typography */}
        <div className="max-w-xl py-8 sm:py-12 space-y-3 sm:space-y-4 z-10">
          {/* Subtle Breadcrumb: HOME > CONTACT */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.25em] text-core-muted"
          >
            <Link href="/" className="hover:text-white transition-colors">
              HOME
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-core-red" />
            <span className="text-core-red font-bold">CONTACT</span>
          </motion.div>

          {/* Compact Strong Heading: CONTACT */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-black text-3xl sm:text-5xl lg:text-7xl uppercase tracking-tight text-white leading-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.95)]"
            >
              CONTACT
            </motion.h1>
          </div>

          {/* Very Short Supporting Line */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs sm:text-sm font-mono text-core-muted tracking-[0.25em] uppercase font-light max-w-md leading-relaxed"
          >
            DIRECT CONCIERGE ACCESS & ATHLETIC ADMISSIONS
          </motion.p>
        </div>

        {/* Right Side: First Bodybuilder Image (Large Hero Visual matching marked green reference box) */}
        <div className="relative hidden md:flex items-end justify-center self-end h-[380px] sm:h-[460px] lg:h-[520px] w-[280px] sm:w-[360px] lg:w-[440px] shrink-0">
          {/* Intense Red Glow Halo behind Athlete */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-radial from-core-red/45 via-core-crimson/20 to-transparent rounded-full blur-[110px] pointer-events-none" />

          {/* The Bodybuilder Image with Smooth Slide-in and Depth Settle */}
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-full flex items-end justify-center"
          >
            <Image
              src="/manimage1forcontactpage.png"
              alt="Core X Fitness Athlete"
              width={261}
              height={386}
              priority
              className="object-contain object-bottom drop-shadow-[0_25px_60px_rgba(0,0,0,0.98)] h-full w-auto max-h-[380px] sm:max-h-[460px] lg:max-h-[520px] filter contrast-125 brightness-105 select-none"
            />

            {/* Bottom edge vignette so his torso dissolves into the banner floor */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-core-void via-core-void/70 to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
