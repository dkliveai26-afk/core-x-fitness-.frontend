'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const disciplines = [
  {
    id: '01',
    title: 'HYPERTROPHY & POWER',
    subtitle: 'HEAVY LOAD & MECHANICAL TENSION',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop',
    tags: ['ELEIKO RACKS', 'PRIME FITNESS', 'KEYCARD ACCESS'],
  },
  {
    id: '02',
    title: 'ATHLETIC CONDITIONING',
    subtitle: 'METABOLIC THRESHOLD & SPEED',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
    tags: ['SPRINT TURF', 'CONCEPT2 ERGS', 'HEART-RATE TELEMETRY'],
  },
  {
    id: '03',
    title: 'BIOMETRIC RECOVERY',
    subtitle: 'HYPERBARIC & CRYO REGENERATION',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop',
    tags: ['CRYO PLUNGE', 'INFRARED SAUNA', 'COMPRESSION LAB'],
  },
];

export function TrainingDisciplinesSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const headingY = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  return (
    <section
      id="programs"
      ref={containerRef}
      className="relative min-h-screen w-full bg-core-void py-32 px-6 sm:px-12 border-t border-white/5 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto space-y-20 z-10 relative">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/10">
          <motion.div
            initial={{ opacity: 0, x: -50, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3"
          >
            <span className="text-xs font-mono tracking-[0.35em] text-core-red uppercase font-bold block">
              02 / TRAINING DISCIPLINES
            </span>
            <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white max-w-full break-words">
              ENGINEERED FOR <span className="text-core-red">PERFORMANCE</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.0, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs font-mono text-core-muted tracking-widest uppercase max-w-xs font-light"
          >
            NO CAROUSELS • NO GENERIC CLASSES • ONLY CALIBRATED DISCIPLINE
          </motion.p>
        </div>

        {/* Editorial Discipline List (Interactive Full-Width Layout) */}
        <div className="space-y-16">
          {disciplines.map((item, idx) => {
            return (
              <div
                key={item.id}
                className="group relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-8 border-b border-white/10"
              >
                {/* Discipline Info — Glides smoothly from Left */}
                <motion.div
                  initial={{ opacity: 0, x: -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 1.15, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="lg:col-span-6 space-y-6"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-display font-black text-4xl sm:text-6xl text-core-red tracking-wider">
                      {item.id}
                    </span>
                    <span className="text-xs font-mono text-core-muted tracking-[0.3em] uppercase">
                      {item.subtitle}
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white group-hover:text-core-red transition-colors duration-500 max-w-full break-words">
                    {item.title}
                  </h3>

                  {/* Minimal Tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono tracking-widest text-core-muted uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* Editorial Visual Frame — Glides smoothly from Right with subtle scale */}
                <motion.div
                  initial={{ opacity: 0, x: 60, scale: 0.95 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 1.2, delay: idx * 0.15 + 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="lg:col-span-6"
                >
                  <div className="relative h-[300px] sm:h-[380px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl group-hover:border-core-red/40 transition-colors duration-500">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover filter grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-core-void/90 via-transparent to-transparent" />

                    <div className="absolute bottom-6 right-6 p-3 rounded-full bg-core-void/80 backdrop-blur-md border border-white/20 text-white group-hover:bg-core-red group-hover:border-core-red transition-colors duration-300">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
