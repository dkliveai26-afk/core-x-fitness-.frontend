'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

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

  const bgY = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  return (
    <section
      id="trainers"
      ref={containerRef}
      className="relative min-h-screen w-full bg-core-void py-32 px-6 sm:px-12 border-t border-white/5 overflow-hidden flex flex-col justify-center"
    >
      {/* Editorial Background Image with Depth Parallax */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <Image
          src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1600&auto=format&fit=crop"
          alt="Gym Atmosphere"
          fill
          className="object-cover filter grayscale contrast-150"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-core-void via-transparent to-core-void" />
      </motion.div>

      <div className="max-w-7xl mx-auto w-full z-10 space-y-24">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-mono tracking-[0.4em] text-core-red uppercase font-bold">
            03 / PERFORMANCE ARCHITECTURE
          </span>
          <h2 className="font-display font-black text-4xl sm:text-6xl md:text-7xl uppercase tracking-wider text-white">
            THE ATHLETIC <span className="text-core-red">ATMOSPHERE</span>
          </h2>
          <p className="text-xs font-mono text-core-muted tracking-widest uppercase">
            CRAFTED FOR UNFORGIVING DISCIPLINE AND ABSOLUTE FOCUS
          </p>
        </div>

        {/* Metrics Grid (Minimal Editorial Typography) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {performanceMetrics.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-core-dark/60 backdrop-blur-xl border border-white/10 hover:border-core-red/40 transition-all duration-500 flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-mono tracking-[0.3em] text-core-muted uppercase block mb-4">
                  METRIC 0{index + 1}
                </span>
                <div className="font-display font-black text-5xl sm:text-6xl text-white tracking-wider group-hover:text-core-red transition-colors duration-300">
                  {stat.value}
                </div>
                <div className="text-xs font-mono text-core-red tracking-widest uppercase font-bold mt-1">
                  {stat.unit}
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 mt-8">
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
