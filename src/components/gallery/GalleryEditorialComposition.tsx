'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { galleryEditorialItems } from '@/data/gallery';

export function GalleryEditorialComposition() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Smooth parallax depth transforms for asymmetric floating layers
  const parallaxSlow = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const parallaxMedium = useTransform(scrollYProgress, [0, 1], [-110, 110]);
  const parallaxReverse = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const scaleHero = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1.02, 0.98]);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-core-void py-24 sm:py-36 px-4 sm:px-6 lg:px-12 select-none overflow-hidden"
    >
      {/* Background Architectural Atmosphere */}
      <div className="absolute top-1/4 right-0 w-[550px] h-[550px] bg-gradient-radial from-core-red/10 via-core-crimson/5 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 left-0 w-[600px] h-[600px] bg-gradient-radial from-core-red/10 via-transparent to-transparent rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto w-full space-y-24 sm:space-y-36">

        {/* Section Header with Minimal Left-to-Right Masked Reveal */}
        <div className="max-w-3xl space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-core-red/10 border border-core-red/30 text-[11px] font-mono tracking-[0.35em] text-core-red uppercase font-bold"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-core-red animate-pulse" />
            02 // EDITORIAL COMPOSITION
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white leading-none"
          >
            ARCHITECTURE <span className="text-core-red">IN TENSION.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.0, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs font-mono text-core-muted tracking-[0.3em] uppercase max-w-xl font-light"
          >
            AN ART-DIRECTED STUDY OF SCALE, FORCE, AND MATERIAL HONESTY.
          </motion.p>
        </div>

        {/* 1. Large Feature Heroic Frame (The Monolithic Sanctuary) */}
        <motion.div
          style={{ scale: scaleHero }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-[60vh] sm:h-[75vh] rounded-2xl sm:rounded-3xl overflow-hidden bg-core-dark border border-white/10 group shadow-[0_30px_90px_rgba(0,0,0,0.9)] will-change-transform"
        >
          <Image
            src={galleryEditorialItems[0].image}
            alt={galleryEditorialItems[0].title}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-center filter brightness-90 contrast-110 transition-transform duration-1000 group-hover:scale-105"
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-core-void via-core-void/35 to-transparent pointer-events-none" />

          {/* Minimal Art Direction Corner Badges */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase px-3 py-1.5 rounded-full bg-black/60 border border-white/10 text-white/90 backdrop-blur-md">
              {galleryEditorialItems[0].tag} • {galleryEditorialItems[0].category}
            </span>
            <span className="text-[11px] font-mono tracking-widest text-white/50">
              EXP. ARCHIVE // 01
            </span>
          </div>

          <div className="absolute bottom-8 left-6 sm:left-10 right-6 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h3 className="text-2xl sm:text-4xl lg:text-5xl font-display font-black uppercase tracking-tight text-white drop-shadow-lg">
                {galleryEditorialItems[0].title}
              </h3>
              <p className="mt-2 text-xs font-mono text-core-muted uppercase tracking-wider max-w-xl">
                {galleryEditorialItems[0].subtitle}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-core-red tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-core-red shadow-glow-red animate-pulse" />
              18,500 SQ FT MONOLITH
            </div>
          </div>
        </motion.div>

        {/* 2. Asymmetric Layered Duo (Chalk & Calibrated Steel + Kinetic Acceleration) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">

          {/* Left: Tall Portrait Card with Upward Parallax Drift */}
          <motion.div
            style={{ y: parallaxSlow }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative h-[520px] sm:h-[620px] rounded-2xl sm:rounded-3xl overflow-hidden bg-core-dark border border-white/10 group shadow-[0_25px_60px_rgba(0,0,0,0.85)] will-change-transform"
          >
            <Image
              src={galleryEditorialItems[1].image}
              alt={galleryEditorialItems[1].title}
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover object-center filter brightness-90 contrast-110 transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-core-void via-core-void/40 to-transparent pointer-events-none" />

            <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase px-2.5 py-1 rounded-full bg-core-red/20 border border-core-red/40 text-core-red font-bold backdrop-blur-md">
                {galleryEditorialItems[1].tag}
              </span>
              <span className="text-[10px] font-mono text-white/50 tracking-wider">
                SWEDISH STEEL
              </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 z-10">
              <h3 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight text-white">
                {galleryEditorialItems[1].title}
              </h3>
              <p className="mt-1.5 text-xs font-mono text-core-muted uppercase tracking-wider line-clamp-2">
                {galleryEditorialItems[1].subtitle}
              </p>
            </div>
          </motion.div>

          {/* Right: Wide Horizontal Landscape Card with Parallax Counter-Drift */}
          <motion.div
            style={{ y: parallaxReverse }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative h-[440px] sm:h-[540px] rounded-2xl sm:rounded-3xl overflow-hidden bg-core-dark border border-white/10 group shadow-[0_25px_60px_rgba(0,0,0,0.85)] will-change-transform"
          >
            <Image
              src={galleryEditorialItems[2].image}
              alt={galleryEditorialItems[2].title}
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover object-center filter brightness-90 contrast-110 transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-core-void via-core-void/40 to-transparent pointer-events-none" />

            <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white font-bold backdrop-blur-md">
                {galleryEditorialItems[2].tag}
              </span>
              <span className="text-[10px] font-mono text-white/50 tracking-wider">
                VELOCITY PROFILE
              </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 z-10">
              <h3 className="text-xl sm:text-3xl font-display font-black uppercase tracking-tight text-white">
                {galleryEditorialItems[2].title}
              </h3>
              <p className="mt-1.5 text-xs font-mono text-core-muted uppercase tracking-wider max-w-lg">
                {galleryEditorialItems[2].subtitle}
              </p>
            </div>
          </motion.div>
        </div>

        {/* 3. Inverted Asymmetric Duo (Metabolic Threshold + Cryo Restoration) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">

          {/* Left: Wide Card with Downward Parallax Drift */}
          <motion.div
            style={{ y: parallaxMedium }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative h-[440px] sm:h-[540px] rounded-2xl sm:rounded-3xl overflow-hidden bg-core-dark border border-white/10 group shadow-[0_25px_60px_rgba(0,0,0,0.85)] will-change-transform"
          >
            <Image
              src={galleryEditorialItems[3].image}
              alt={galleryEditorialItems[3].title}
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover object-center filter brightness-90 contrast-110 transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-core-void via-core-void/40 to-transparent pointer-events-none" />

            <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white font-bold backdrop-blur-md">
                {galleryEditorialItems[3].tag}
              </span>
              <span className="text-[10px] font-mono text-white/50 tracking-wider">
                MAXIMAL CADENCE
              </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 z-10">
              <h3 className="text-xl sm:text-3xl font-display font-black uppercase tracking-tight text-white">
                {galleryEditorialItems[3].title}
              </h3>
              <p className="mt-1.5 text-xs font-mono text-core-muted uppercase tracking-wider max-w-lg">
                {galleryEditorialItems[3].subtitle}
              </p>
            </div>
          </motion.div>

          {/* Right: Tall Portrait Card with Subtle Shift */}
          <motion.div
            style={{ y: parallaxSlow }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative h-[520px] sm:h-[620px] rounded-2xl sm:rounded-3xl overflow-hidden bg-core-dark border border-white/10 group shadow-[0_25px_60px_rgba(0,0,0,0.85)] will-change-transform"
          >
            <Image
              src={galleryEditorialItems[4].image}
              alt={galleryEditorialItems[4].title}
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover object-center filter brightness-90 contrast-110 transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-core-void via-core-void/40 to-transparent pointer-events-none" />

            <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase px-2.5 py-1 rounded-full bg-core-red/20 border border-core-red/40 text-core-red font-bold backdrop-blur-md">
                {galleryEditorialItems[4].tag}
              </span>
              <span className="text-[10px] font-mono text-white/50 tracking-wider">
                CELLULAR RECOVERY
              </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 z-10">
              <h3 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight text-white">
                {galleryEditorialItems[4].title}
              </h3>
              <p className="mt-1.5 text-xs font-mono text-core-muted uppercase tracking-wider line-clamp-2">
                {galleryEditorialItems[4].subtitle}
              </p>
            </div>
          </motion.div>
        </div>

        {/* 4. Closing Grand Frame (Titanium Dumbbell Vault) */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-[55vh] sm:h-[65vh] rounded-2xl sm:rounded-3xl overflow-hidden bg-core-dark border border-white/10 group shadow-[0_30px_90px_rgba(0,0,0,0.9)] will-change-transform"
        >
          <Image
            src={galleryEditorialItems[5].image}
            alt={galleryEditorialItems[5].title}
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-center filter brightness-90 contrast-110 transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-core-void via-core-void/35 to-transparent pointer-events-none" />

          <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase px-3 py-1.5 rounded-full bg-black/60 border border-white/10 text-white/90 backdrop-blur-md">
              {galleryEditorialItems[5].tag} • {galleryEditorialItems[5].category}
            </span>
            <span className="text-[11px] font-mono tracking-widest text-white/50">
              EXP. ARCHIVE // 06
            </span>
          </div>

          <div className="absolute bottom-8 left-6 sm:left-10 right-6 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h3 className="text-2xl sm:text-4xl font-display font-black uppercase tracking-tight text-white drop-shadow-lg">
                {galleryEditorialItems[5].title}
              </h3>
              <p className="mt-2 text-xs font-mono text-core-muted uppercase tracking-wider max-w-xl">
                {galleryEditorialItems[5].subtitle}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-core-red tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-core-red shadow-glow-red animate-pulse" />
              SOLID URETHANE & FORGED STEEL
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
