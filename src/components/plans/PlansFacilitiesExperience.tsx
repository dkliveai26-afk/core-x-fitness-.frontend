'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { Dumbbell, ThermometerSnowflake, Activity, Hotel } from 'lucide-react';

const facilityCards = [
  {
    id: 'strength',
    title: 'STRENGTH ARENA',
    tag: 'ARCHITECTURAL RIG',
    subtitle: 'Eleiko Olympic platforms, custom 200lb machined steel dumbbells, and Prime variable-resistance curves.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1400&auto=format&fit=crop',
    icon: Dumbbell,
    colSpan: 'lg:col-span-7',
    height: 'h-[440px] sm:h-[480px]',
    parallaxOffset: [-20, 20],
  },
  {
    id: 'recovery',
    title: 'SUB-ZERO CRYO & O2 LAB',
    tag: 'BIOMETRIC REPAIR',
    subtitle: '-140°C medical nitrogen immersion and hyperbaric pure oxygen chambers.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop',
    icon: ThermometerSnowflake,
    colSpan: 'lg:col-span-5',
    height: 'h-[440px] sm:h-[480px]',
    parallaxOffset: [20, -20],
  },
  {
    id: 'telemetry',
    title: 'BAR VELOCITY & TELEMETRY',
    tag: 'FORCE MECHANICS',
    subtitle: 'High-speed optical bar velocity sensors, force plates, and InBody 770 composition analytics.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
    icon: Activity,
    colSpan: 'lg:col-span-5',
    height: 'h-[420px] sm:h-[460px]',
    parallaxOffset: [-15, 15],
  },
  {
    id: 'spa',
    title: 'EXECUTIVE SPA SANCTUARY',
    tag: 'CONTRAST SUITES',
    subtitle: '42°F contrast magnesium cold plunge, Finnish cedar saunas, and Malin+Goetz private grooming suites.',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop',
    icon: Hotel,
    colSpan: 'lg:col-span-7',
    height: 'h-[420px] sm:h-[460px]',
    parallaxOffset: [15, -15],
  },
];

export function PlansFacilitiesExperience() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  return (
    <section
      ref={containerRef}
      className="relative py-24 sm:py-32 bg-core-dark border-t border-white/5 overflow-hidden px-4 sm:px-6 lg:px-8"
    >
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[400px] bg-core-red/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        {/* Minimal Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-core-red/10 border border-core-red/30 text-[10px] font-mono tracking-[0.25em] text-core-red uppercase font-bold"
            >
              02 // FACILITY EXPERIENCE
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 1.0, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white"
            >
              WHAT MEMBERS <span className="text-core-red">ACTUALLY GET.</span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs sm:text-sm font-sans text-core-muted max-w-md font-light leading-relaxed"
          >
            Every tier grants verified access to bespoke biomechanical apparatus, sub-zero cellular restoration, and elite athlete amenities.
          </motion.p>
        </div>

        {/* Asymmetrical Editorial Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {facilityCards.map((card, index) => {
            const IconComponent = card.icon;

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 1.1,
                  delay: index * 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`group relative ${card.colSpan} ${card.height} rounded-3xl overflow-hidden border border-white/10 hover:border-core-red/50 transition-all duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.85)]`}
              >
                {/* Image with slow hover zoom & mask */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-core-void via-core-void/50 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-700" />
                  <div className="absolute inset-0 bg-core-void/20" />
                </div>

                {/* Top Corner Icon & Tag */}
                <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-core-void/80 backdrop-blur-md border border-white/10 text-[10px] font-mono tracking-widest text-white/90 uppercase font-semibold">
                    <IconComponent className="w-3 h-3 text-core-red" />
                    {card.tag}
                  </span>
                  <span className="text-[11px] font-mono text-core-muted font-bold">
                    0{index + 1}
                  </span>
                </div>

                {/* Bottom Overlaid Editorial Typography */}
                <div className="absolute bottom-6 left-6 right-6 z-10 space-y-2">
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight group-hover:text-core-red transition-colors duration-300">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-sans text-slate-300 font-light max-w-lg leading-relaxed line-clamp-2">
                    {card.subtitle}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
