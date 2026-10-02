'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { ArrowUpRight, Cpu, Activity, Zap, Shield } from 'lucide-react';

const pillars = [
  {
    icon: Activity,
    title: 'PRECISION BIOMECHANICS',
    description: 'Data-calibrated bar-path tracking and torque profiling for optimal neuromuscular recruitment without joint degradation.',
  },
  {
    icon: Zap,
    title: 'METABOLIC CONDITIONING',
    description: 'Zone-2 mitochondrial optimization paired with anaerobic threshold sprints in hypoxic and hyperbaric environments.',
  },
  {
    icon: Cpu,
    title: 'BIOMETRIC RECOVERY',
    description: 'Sub-zero cryotherapy (-140°C), infrared photobiomodulation, and dynamic compression for expedited central nervous system recovery.',
  },
  {
    icon: Shield,
    title: 'PRIVATE ATHLETIC HAVEN',
    description: 'Capped club membership ensuring uninterrupted access to calibrated competition racks, dumbell suites, and private training pods.',
  },
];

export function PhilosophyTeaser() {
  return (
    <section id="philosophy" className="relative py-28 sm:py-36 bg-core-dark border-t border-white/5 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-core-red/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-16 border-b border-white/10">
          <div className="max-w-2xl">
            <Badge variant="red" size="md" className="mb-4" dot>
              CORE PHILOSOPHY // 01
            </Badge>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-white uppercase tracking-tight leading-[0.96]">
              WE DO NOT BUILD BODIES. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-core-red via-core-accent to-slate-200">
                WE ENGINEER HUMAN POTENTIAL.
              </span>
            </h2>
          </div>

          <div className="max-w-md">
            <p className="text-sm sm:text-base text-core-muted leading-relaxed font-sans">
              Founded on the belief that peak physical performance requires surgical focus, elite equipment,
              and ruthless consistency. At Core X, every square inch is designed to elevate your standard.
            </p>
          </div>
        </div>

        {/* 4 Performance Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative p-5 sm:p-8 rounded-2xl bg-core-surface/60 border border-white/5 hover:border-core-red/40 hover:bg-core-surface transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Number Watermark */}
                <div className="absolute top-4 right-6 text-4xl font-display font-black text-white/5 group-hover:text-core-red/15 transition-colors select-none">
                  0{idx + 1}
                </div>

                <div>
                  <div className="w-12 h-12 rounded-xl bg-core-dark border border-white/10 flex items-center justify-center text-core-red group-hover:scale-110 group-hover:bg-red-gradient group-hover:text-white transition-all duration-300 shadow-glow-red">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-heading font-extrabold text-white uppercase tracking-wider mt-6 mb-3">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-core-muted leading-relaxed font-sans font-light">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-core-muted group-hover:text-white transition-colors">
                  <span>DISCIPLINE PROTOCOL</span>
                  <ArrowUpRight className="w-4 h-4 text-core-red group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Large Architectural Quote Banner */}
        <div className="mt-16 sm:mt-20 p-5 sm:p-8 lg:p-12 rounded-3xl bg-gradient-to-r from-core-surface via-core-dark to-core-surface border border-white/10 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
          <div className="relative z-10 max-w-2xl text-center lg:text-left">
            <span className="text-xs font-mono uppercase tracking-[0.2em] sm:tracking-[0.3em] text-core-red font-bold">
              THE CORE X MANIFESTO
            </span>
            <p className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-white mt-3 italic leading-snug">
              &ldquo;Mediocrity is a choice. Greatness is forged in the relentless pursuit of daily discipline.&rdquo;
            </p>
          </div>

          <div className="relative z-10 w-full sm:w-auto shrink-0 flex justify-center">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              rightIcon={<ArrowUpRight className="w-5 h-5" />}
              onClick={() => {
                const target = document.querySelector('#memberships');
                target?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Start Your Evolution
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
