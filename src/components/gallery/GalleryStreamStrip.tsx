'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { galleryStreamItems } from '@/data/gallery';
import { ArrowRight, Layers } from 'lucide-react';

export function GalleryStreamStrip() {
  // Duplicate array twice to ensure seamless continuous right-to-left loop without any visible reset
  const duplicatedItems = [...galleryStreamItems, ...galleryStreamItems, ...galleryStreamItems];

  return (
    <section className="relative w-full bg-core-void py-24 sm:py-32 overflow-hidden border-t border-white/5 select-none">
      {/* Background Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-gradient-radial from-core-red/10 via-transparent to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-core-red/10 border border-core-red/30 text-[11px] font-mono tracking-[0.35em] text-core-red uppercase font-bold"
            >
              <Layers className="w-3.5 h-3.5 text-core-red" />
              04 // HORIZONTAL STREAM
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white leading-none"
            >
              CONTINUOUS <span className="text-core-red">FLUIDITY.</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 text-xs font-mono text-core-muted tracking-[0.25em] uppercase"
          >
            <span>RIGHT → LEFT INFINITE CADENCE</span>
            <ArrowRight className="w-4 h-4 text-core-red" />
          </motion.div>
        </div>
      </div>

      {/* Edge Linear Fade Masks — cards enter and disappear smoothly into black void */}
      <div className="absolute left-0 inset-y-0 w-24 sm:w-48 bg-gradient-to-r from-core-void via-core-void/90 to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-24 sm:w-48 bg-gradient-to-l from-core-void via-core-void/90 to-transparent z-20 pointer-events-none" />

      {/* Hardware Accelerated Continuous Horizontal Stream Strip */}
      <div className="relative w-full flex items-center overflow-hidden py-4">
        <motion.div
          className="flex items-center gap-6 sm:gap-8 will-change-transform shrink-0"
          animate={{
            x: ['0%', '-33.333333%'],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 48, // Slow, elegant, cinematic travel speed
              ease: 'linear',
            },
          }}
        >
          {duplicatedItems.map((item, idx) => {
            // Subtle rhythmic alternation in vertical positioning and heights for organic visual life
            const isTall = idx % 3 === 0;
            const isWide = idx % 3 === 1;

            return (
              <div
                key={`${item.id}-${idx}`}
                className={`relative shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden bg-core-dark border border-white/10 group shadow-[0_20px_50px_rgba(0,0,0,0.85)] hover:border-core-red/50 transition-all duration-500 ${
                  isTall
                    ? 'w-[260px] sm:w-[320px] h-[380px] sm:h-[460px] -translate-y-2'
                    : isWide
                    ? 'w-[340px] sm:w-[440px] h-[320px] sm:h-[400px] translate-y-3'
                    : 'w-[280px] sm:w-[360px] h-[350px] sm:h-[430px]'
                }`}
              >
                {/* Visual Imagery */}
                <img
                  src={item.image}
                  alt={item.label}
                  className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90 contrast-110 transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                  loading="lazy"
                />

                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-core-void via-core-void/40 to-transparent pointer-events-none" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="text-[10px] font-mono tracking-[0.2em] uppercase px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-white/80 backdrop-blur-md">
                    {item.tag}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-core-red/60 group-hover:bg-core-red group-hover:shadow-glow-red transition-all" />
                </div>

                {/* Bottom Minimal Label */}
                <div className="absolute bottom-0 inset-x-0 p-5 z-10">
                  <span className="text-sm sm:text-base font-display font-black uppercase tracking-tight text-white block group-hover:text-core-red transition-colors">
                    {item.label}
                  </span>
                  <span className="text-[10px] font-mono text-core-muted uppercase tracking-wider block mt-1">
                    CORE X FACILITY
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
