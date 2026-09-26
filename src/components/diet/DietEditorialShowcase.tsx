'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { nutritionPillars } from '@/data/diet';
import { Sparkles } from 'lucide-react';

export function DietEditorialShowcase() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Smooth cinematic scroll-driven rotation & 3D tilt
  const smoothRotateZ = useSpring(
    useTransform(scrollYProgress, [0, 1], [-40, 90]),
    { stiffness: 75, damping: 24, mass: 0.2, restDelta: 0.001 }
  );
  const smoothRotateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [18, -10]),
    { stiffness: 75, damping: 24 }
  );
  const smoothRotateY = useSpring(
    useTransform(scrollYProgress, [0, 1], [-14, 14]),
    { stiffness: 75, damping: 24 }
  );
  const smoothScale = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.05, 0.97]),
    { stiffness: 75, damping: 24 }
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-12 sm:py-20 bg-core-void select-none overflow-hidden border-b border-white/5"
    >
      {/* Background Volumetric Glows */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-core-red/15 via-transparent to-transparent rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Seared Chicken & Roasted Bread with Scroll-Driven Rotation (col-span-5) */}
          <div className="lg:col-span-5 relative flex items-center justify-center order-2 lg:order-1 [perspective:1200px]">
            {/* Ambient Halo behind Floating Meal */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-80 h-72 sm:h-80 bg-gradient-radial from-core-red/30 via-core-crimson/12 to-transparent rounded-full blur-[80px] pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, x: -70, scale: 0.88 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-[280px] sm:w-[360px] lg:w-[400px] aspect-square flex items-center justify-center group"
            >
              {/* Scroll-Driven Smooth Rotating Meal Element */}
              <motion.div
                style={{
                  rotateZ: smoothRotateZ,
                  rotateX: smoothRotateX,
                  rotateY: smoothRotateY,
                  scale: smoothScale,
                }}
                whileHover={{ scale: 1.06 }}
                className="w-full h-full flex items-center justify-center cursor-pointer [transform-style:preserve-3d]"
              >
                <Image
                  src="/dietpage/rostedbreadforditepage.png"
                  alt="Seared Chicken Tenderloins with Floating Basil and Heirloom Tomatoes"
                  width={499}
                  height={499}
                  priority
                  className="object-contain w-full h-full drop-shadow-[0_25px_50px_rgba(0,0,0,0.98)] filter contrast-120 brightness-105 select-none pointer-events-none"
                />
              </motion.div>

              {/* Floating Whole-Food Badge */}
              <div className="absolute bottom-2 right-2 px-3.5 py-1.5 rounded-xl bg-core-dark/90 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center gap-1.5 text-[10px] font-mono pointer-events-none">
                <Sparkles className="w-3 h-3 text-core-red" />
                <span className="text-white font-bold tracking-wider">100% WHOLE SOURCE</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Editorial Philosophy & Nutrition Pillars (col-span-7) */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-2.5"
            >
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-core-red font-bold block">
                EDITORIAL // PERFORMANCE DOCTRINE
              </span>
              <h2 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white leading-tight">
                DISCIPLINE IN THE GYM. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-core-muted">
                  CALIBRATION IN THE KITCHEN.
                </span>
              </h2>
              <p className="text-xs sm:text-sm font-sans text-core-muted leading-relaxed font-light max-w-lg">
                True athletic transformation occurs at the cellular level. Every gram of protein, every complex carb, and every essential lipid is calculated to maximize intra-workout force production and rapid myofibrillar repair.
              </p>
            </motion.div>

            {/* 3 Numbered Nutrition Pillars with Staggered Entrance */}
            <div className="space-y-3 pt-1">
              {nutritionPillars.map((pillar, idx) => (
                <motion.div
                  key={pillar.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.85, delay: idx * 0.14, ease: [0.16, 1, 0.3, 1] }}
                  className="p-4 sm:p-5 rounded-2xl bg-core-dark/70 backdrop-blur-xl border border-white/10 hover:border-core-red/40 transition-colors flex items-start gap-4 group"
                >
                  <span className="text-lg sm:text-xl font-display font-black text-core-red shrink-0 group-hover:scale-105 transition-transform">
                    {pillar.number}
                  </span>
                  <div className="space-y-0.5">
                    <h3 className="font-display font-bold text-xs sm:text-sm uppercase tracking-wider text-white">
                      {pillar.label}
                    </h3>
                    <p className="text-xs font-sans text-core-muted leading-relaxed font-light">
                      {pillar.detail}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
