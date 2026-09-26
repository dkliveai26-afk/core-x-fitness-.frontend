'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Badge } from '@/components/common/Badge';
import { ChevronDown } from 'lucide-react';

export function AboutHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Subtle scroll-driven parallax for the bodybuilder and ambient depth
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const athleteParallaxY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const athleteParallaxScale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);
  const athleteParallaxOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.3]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[95vh] w-full flex flex-col justify-between pt-28 sm:pt-36 pb-10 overflow-hidden bg-core-void select-none"
    >
      {/* 1. Atmospheric Ambient Lighting & Radial Vignette */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none z-10" />

      {/* Primary Red Atmospheric Core Glow behind the composition */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] h-[450px] bg-gradient-radial from-core-red/20 via-core-crimson/5 to-transparent rounded-full blur-[130px] pointer-events-none z-0" />

      {/* Subtle Carbon Blueprint Lines */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* 2. Main Hero Two-Column Composition */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Animated 3D Bodybuilder Cutout */}
          <div className="lg:col-span-5 relative flex items-end justify-center lg:justify-start order-2 lg:order-1 pt-4 lg:pt-0">
            {/* Ambient Crimson Rim Glow behind the athlete's muscular contour */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-radial from-core-red/25 via-core-crimson/10 to-transparent rounded-full blur-2xl pointer-events-none -z-10" />

            {/* Floating & Parallax Animated Wrapper */}
            <motion.div
              style={{
                y: athleteParallaxY,
                scale: athleteParallaxScale,
                opacity: athleteParallaxOpacity,
              }}
              className="relative w-full max-w-[380px] sm:max-w-[440px] lg:max-w-[520px] flex items-end justify-center"
            >
              {/* Slide-in Entrance + Subtle Continuous Breathing Float */}
              <motion.div
                initial={{ x: -140, opacity: 0, scale: 0.94 }}
                animate={{
                  x: 0,
                  opacity: 1,
                  scale: 1,
                  y: [0, -7, 0],
                }}
                transition={{
                  x: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 1.0, ease: 'easeOut' },
                  scale: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
                  y: {
                    duration: 5.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1.2,
                  },
                }}
                className="relative w-full flex items-end"
              >
                {/* The High-Detail Bodybuilder PNG Cutout */}
                <img
                  src="/bodybulder.png"
                  alt="Core X Fitness Discipline & Muscular Excellence"
                  className="relative z-10 w-full h-auto max-h-[46vh] sm:max-h-[56vh] lg:max-h-[70vh] object-contain object-bottom filter drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)] drop-shadow-[0_0_40px_rgba(255,42,42,0.2)]"
                  draggable={false}
                />

                {/* Bottom Shadow & Vignette Blend: seamlessly fades lower torso into the dark floor */}
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-core-void via-core-void/70 to-transparent pointer-events-none z-20" />
                <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-core-void/40 to-transparent pointer-events-none z-20" />
              </motion.div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Minimal, Powerful Editorial Statement */}
          <div className="lg:col-span-7 relative z-20 order-1 lg:order-2 flex flex-col justify-center">
            {/* Top Pill / Badge with slow top reveal */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-3 mb-5"
            >
              <Badge variant="red" size="md" dot>
                ABOUT CORE X
              </Badge>
              <span className="text-xs font-mono text-core-muted/90 uppercase tracking-widest">
                KOLKATA FLAGSHIP // EST. 2026
              </span>
            </motion.div>

            {/* Primary Compact Iconic Headline with slow luxury reveal */}
            <motion.div
              initial={{ opacity: 0, y: 35, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5.25rem] font-display font-black uppercase tracking-tight text-white leading-[0.98] drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)]">
                BEYOND{' '}
                <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-core-red via-[#FF4D4D] to-white drop-shadow-[0_0_35px_rgba(255,42,42,0.4)]">
                  ORDINARY.
                </span>
              </h1>
            </motion.div>

            {/* Short, Punchy Supporting Sentence with slow glide */}
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-xl font-sans font-light leading-relaxed"
            >
              Kolkata’s architectural athletic sanctuary — engineered for disciplined strength, competition iron, and biometric human performance.
            </motion.p>

            {/* Subtle Key Tenets Line with staggered reveal */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-core-muted uppercase tracking-widest"
            >
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-core-red" />
                Olympic Steel
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-core-red" />
                Sports Science
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-core-red" />
                Biometric Recovery
              </span>
            </motion.div>
          </div>

        </div>
      </div>

      {/* 3. Bottom Minimalist Scroll Cue */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between pt-6 border-t border-white/5 text-core-muted text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-core-red animate-pulse" />
          <span className="tracking-widest uppercase">THE ARCHITECTURAL IDENTITY</span>
        </div>

        <a
          href="#orbit-cards"
          className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer group"
          aria-label="Scroll to 3D Orbit Experience"
        >
          <span className="tracking-widest uppercase text-[11px]">SCROLL TO 3D ORBIT</span>
          <ChevronDown className="w-4 h-4 animate-bounce group-hover:text-core-red" />
        </a>
      </div>
    </section>
  );
}
