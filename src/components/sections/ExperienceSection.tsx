'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Sparkles, ArrowRight, ShieldCheck, ThermometerSnowflake, Wind, Dumbbell, Hotel } from 'lucide-react';

const spaces = [
  {
    id: 'floor',
    label: 'STRENGTH ARENA',
    icon: Dumbbell,
    title: '18,500 SQ FT ARCHITECTURAL STRENGTH FLOOR',
    subtitle: 'Custom Eleiko IPF/IWF certified platforms, machined dumbbell racks up to 200lbs, and Prime variable-resistance stations.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80',
    specs: ['12 Olympic Racks', 'Calibrated Steel Plates', 'High-Ceiling Acoustic Dampening'],
  },
  {
    id: 'cryo',
    label: 'CRYO LAB',
    icon: ThermometerSnowflake,
    title: 'SUB-ZERO CRYOTHERAPY (-140°C)',
    subtitle: 'Medical-grade whole body cryotherapy designed to flush inflammation, stimulate norepinephrine release, and accelerate muscle restoration.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&auto=format&fit=crop&q=80',
    specs: ['-140°C Nitrogen Chamber', '3-Minute Sessions', 'Biometric Vitals Monitoring'],
  },
  {
    id: 'hbot',
    label: 'HYPERBARIC SUITE',
    icon: Wind,
    title: 'MILD HYPERBARIC OXYGEN THERAPY (HBOT)',
    subtitle: 'Pressurized pure oxygen chambers delivering increased plasma saturation for accelerated cellular healing and cognitive rejuvenation.',
    image: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=1200&auto=format&fit=crop&q=80',
    specs: ['2.0 ATA Pressure Rating', '100% Medical O2', 'Noise-Canceling Audio Integration'],
  },
  {
    id: 'lounge',
    label: 'EXECUTIVE LOUNGE',
    icon: Hotel,
    title: 'PRIVATE EXECUTIVE LOCKER SUITES & SPA',
    subtitle: 'Rain showers, cedarwood dry saunas, magnesium cold plunges (42°F), and grooming essentials by Malin+Goetz.',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200&auto=format&fit=crop&q=80',
    specs: ['Cedar Dry Sauna', '42°F Contrast Plunge', 'High-Speed Workstation Pods'],
  },
];

export function ExperienceSection() {
  const [activeSpace, setActiveSpace] = useState(spaces[0]);

  return (
    <section id="experience" className="relative py-28 sm:py-36 bg-core-dark border-t border-white/5 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-core-red/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/10">
          <div>
            <Badge variant="red" size="md" className="mb-4" dot>
              ARCHITECTURAL EXPERIENCE // 03
            </Badge>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-white uppercase tracking-tight leading-[0.95]">
              AN UNCOMPROMISED <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-core-accent">
                ATHLETIC ENVIRONMENT.
              </span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-core-muted max-w-md font-sans leading-relaxed">
            Every architectural detail—from acoustic flooring to surgical lighting and continuous HEPA air exchange—is built to maximize your output.
          </p>
        </div>

        {/* Space Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10">
          {spaces.map((space) => {
            const Icon = space.icon;
            const isActive = activeSpace.id === space.id;
            return (
              <button
                key={space.id}
                onClick={() => setActiveSpace(space)}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 flex items-center gap-3.5 ${
                  isActive
                    ? 'bg-core-surface border-core-red shadow-glow-red'
                    : 'bg-core-surface/40 border-white/5 hover:border-white/20 hover:bg-core-surface/70'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    isActive ? 'bg-red-gradient text-white' : 'bg-core-dark text-core-muted'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span
                    className={`block text-xs font-heading font-extrabold uppercase tracking-widest ${
                      isActive ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    {space.label}
                  </span>
                  <span className="text-[10px] font-mono text-core-muted uppercase">
                    EXPLORE ZONE
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Interactive Visual Showcase */}
        <div className="mt-8 rounded-3xl bg-core-surface border border-white/10 overflow-hidden relative shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSpace.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]"
            >
              {/* Media Preview Column */}
              <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto overflow-hidden">
                <img
                  src={activeSpace.image}
                  alt={activeSpace.title}
                  className="w-full h-full object-cover filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-core-surface hidden lg:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-core-surface via-transparent to-transparent lg:hidden" />

                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-core-void/80 backdrop-blur-md border border-white/15 text-xs font-mono text-white flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-core-red" />
                  <span>METROPOLIS CAMPUS</span>
                </div>
              </div>

              {/* Information Column */}
              <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between bg-core-surface relative z-10">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-core-red uppercase tracking-widest font-bold mb-3">
                    <ShieldCheck className="w-4 h-4" />
                    <span>FACILITY SPECIFICATION</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight leading-snug">
                    {activeSpace.title}
                  </h3>

                  <p className="mt-4 text-sm sm:text-base text-core-muted font-sans leading-relaxed">
                    {activeSpace.subtitle}
                  </p>

                  {/* Specs List */}
                  <div className="mt-8 space-y-3">
                    {activeSpace.specs.map((spec) => (
                      <div
                        key={spec}
                        className="flex items-center gap-3 p-3 rounded-xl bg-core-dark/80 border border-white/5 text-xs font-mono text-slate-200"
                      >
                        <span className="w-2 h-2 rounded-full bg-core-red" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-mono text-core-muted">AVAILABLE 7 DAYS</span>
                  <Button
                    variant="primary"
                    size="md"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    onClick={() => {
                      const target = document.querySelector('#memberships');
                      target?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Tour Space
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
