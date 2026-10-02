'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { HomeContinuousOrbit } from '@/components/sections/HomeContinuousOrbit';

const performanceMetrics = [
  { value: '18,500', unit: 'SQ FT', label: 'TITANIUM ARCHITECTURE' },
  { value: '100%', unit: 'ELEIKO', label: 'SWEDISH RACKS & BARS' },
  { value: '1:4', unit: 'RATIO', label: 'MASTER COACH GUIDANCE' },
  { value: '24/7', unit: 'BIOMETRIC', label: 'KEYCARD LAB ACCESS' },
];

export function PerformanceExperienceSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  return (
    <section
      id="trainers"
      ref={containerRef}
      className="relative min-h-0 lg:min-h-screen w-full bg-core-void py-14 sm:py-20 lg:py-32 px-4 sm:px-8 lg:px-12 border-t border-white/5 overflow-hidden flex flex-col justify-center select-none"
    >
      {/* Editorial Background Image with Depth Parallax */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0 opacity-15 pointer-events-none">
        <Image
          src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1600&auto=format&fit=crop"
          alt="Gym Atmosphere"
          fill
          className="object-cover filter grayscale contrast-150"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-core-void via-transparent to-core-void" />
      </motion.div>

      <div className="max-w-7xl mx-auto w-full z-10 space-y-12">
        {/* Section Header with Slow Luxury Reveal */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-core-red/10 border border-core-red/30 text-[11px] font-mono tracking-[0.35em] text-core-red uppercase font-bold"
          >
            03 // PERFORMANCE ARCHITECTURE
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-2xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white max-w-full break-words px-2"
          >
            THE ATHLETIC <span className="text-core-red inline-block">ATMOSPHERE</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.0, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs font-mono text-core-muted tracking-[0.12em] sm:tracking-[0.25em] uppercase font-light px-2"
          >
            CRAFTED FOR UNFORGIVING DISCIPLINE AND ABSOLUTE FOCUS
          </motion.p>
        </div>

        {/* Continuous 3D Rotating Gym Cards Orbit (Autonomous Loop) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <HomeContinuousOrbit />
        </motion.div>

        {/* Metrics Grid (Minimal Cards with Staggered Slow Entrance) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 pt-4">
          {performanceMetrics.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 1.0, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="p-5 sm:p-8 rounded-2xl bg-core-dark/70 backdrop-blur-xl border border-white/10 hover:border-core-red/40 transition-all duration-500 flex flex-col justify-between group shadow-xl"
            >
              <div>
                <span className="text-[10px] font-mono tracking-[0.2em] sm:tracking-[0.3em] text-core-muted uppercase block mb-3 sm:mb-4">
                  METRIC 0{index + 1}
                </span>
                <div className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight group-hover:text-core-red transition-colors duration-500">
                  {stat.value}
                </div>
                <div className="text-xs font-mono text-core-red tracking-widest uppercase font-bold mt-1">
                  {stat.unit}
                </div>
              </div>

              <div className="pt-5 sm:pt-8 border-t border-white/10 mt-5 sm:mt-8">
                <span className="text-xs font-heading font-bold text-white uppercase tracking-widest block">
                  {stat.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

