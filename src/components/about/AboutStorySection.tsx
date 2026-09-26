'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Dumbbell, Cpu, Wind, ChevronDown, CheckCircle2 } from 'lucide-react';

export function AboutStorySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Parallax tracking for the female athlete
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ['start end', 'end start'],
  });

  const athleteParallaxY = useTransform(scrollYProgress, [0, 1], [-25, 45]);
  const athleteParallaxScale = useTransform(scrollYProgress, [0, 1], [0.98, 1.02]);

  return (
    <section
      ref={containerRef}
      className="relative w-full py-28 sm:py-36 bg-core-void overflow-hidden border-t border-white/5 select-none"
    >
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-core-red/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -right-48 w-[500px] h-[500px] bg-core-crimson/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section 03 Two-Column Header: Editorial Statement (Left) + Female Athlete Cutout (Right) */}
        <div ref={headerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-20 sm:mb-28">
          
          {/* LEFT COLUMN: Editorial Typography & Tenets */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3"
            >
              <span className="w-2 h-2 rounded-full bg-core-red" />
              <span className="text-xs font-mono tracking-[0.3em] uppercase text-white/90">
                SECTION 03 // TRAINING ETHOS & HERITAGE
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, x: -50, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-5xl md:text-6xl font-display font-black uppercase tracking-tight text-white leading-[1.02]"
            >
              ARCHITECTURE FOR THE <span className="text-core-red">RELENTLESS.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed max-w-2xl font-light"
            >
              Conceived from the athlete's standard: zero equipment bottlenecks, acoustic tranquility,
              and an uncompromising devotion to biomechanical purity.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-core-muted uppercase tracking-widest"
            >
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-core-red" />
                Zero Compromise
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-core-red" />
                Calibrated Steel
              </span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-core-red" />
                Neurological Recovery
              </span>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Female Athlete Cutout with 3D Entrance, Ambient Crimson Rim, and Parallax */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
            {/* Ambient Crimson Rim Glow behind the athlete */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-80 sm:h-80 bg-gradient-radial from-core-red/25 via-core-crimson/10 to-transparent rounded-full blur-2xl pointer-events-none -z-10" />

            <motion.div
              style={{
                y: athleteParallaxY,
                scale: athleteParallaxScale,
              }}
              className="relative w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[440px] flex items-end justify-center"
            >
              {/* Slow Cinematic 3D Slide-in from Right + Breathing Float */}
              <motion.div
                initial={{ x: 70, y: 25, opacity: 0, scale: 0.95 }}
                whileInView={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 1,
                }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 1.25,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative w-full flex items-end"
              >
                {/* Continuous floating breathing effect */}
                <motion.div
                  animate={{
                    y: [0, -6, 0],
                  }}
                  transition={{
                    duration: 5.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative w-full"
                >
                  {/* High-Resolution Clean Cutout of Female Athlete */}
                  <img
                    src="/girlbodybulder_clean.png"
                    alt="Female Athletic Standard & Conditioning at CORE X"
                    className="relative z-10 w-full h-auto max-h-[50vh] sm:max-h-[56vh] lg:max-h-[62vh] object-contain object-bottom filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.95)] drop-shadow-[0_0_35px_rgba(255,42,42,0.22)]"
                    draggable={false}
                  />

                  {/* Soft bottom vignette blend to fade lower torso seamlessly into background */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-core-void via-core-void/70 to-transparent pointer-events-none z-20" />
                  <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-core-void/40 to-transparent pointer-events-none z-20" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

        </div>

        {/* 3 Large Story Feature Panes with Staggered Slow Cinematic Entrances */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="group relative rounded-3xl bg-core-dark border border-white/10 p-6 sm:p-8 flex flex-col justify-between hover:border-core-red/40 transition-all duration-500 shadow-glass-card"
          >
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 rounded-2xl bg-core-surface border border-white/10 flex items-center justify-center text-core-red group-hover:bg-core-red group-hover:text-white transition-colors duration-500">
                  <Dumbbell className="w-6 h-6" />
                </div>
                <span className="text-2xl font-display font-black text-white/20 group-hover:text-core-red/40 transition-colors duration-500">
                  01
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-display font-bold uppercase text-white tracking-tight">
                COMPETITION STANDARDS
              </h3>
              <p className="mt-3 text-sm text-core-muted font-sans leading-relaxed font-light">
                Calibrated to IPF and Olympic tolerances. Zero loose deflection.
                Uncompromised grip knurling, precision sleeve spin, and high-tensile Swedish steel.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-core-red shrink-0" />
                <span>Eleiko Swedish Calibrated Plates</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-core-red shrink-0" />
                <span>Prime Fitness Variable Cam Racks</span>
              </div>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.0, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="group relative rounded-3xl bg-core-dark border border-white/10 p-6 sm:p-8 flex flex-col justify-between hover:border-core-red/40 transition-all duration-500 shadow-glass-card"
          >
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 rounded-2xl bg-core-surface border border-white/10 flex items-center justify-center text-core-red group-hover:bg-core-red group-hover:text-white transition-colors duration-500">
                  <Cpu className="w-6 h-6" />
                </div>
                <span className="text-2xl font-display font-black text-white/20 group-hover:text-core-red/40 transition-colors duration-500">
                  02
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-display font-bold uppercase text-white tracking-tight">
                BIOMECHANICAL SCIENCE
              </h3>
              <p className="mt-3 text-sm text-core-muted font-sans leading-relaxed font-light">
                Continuous telemetry eliminates guesswork. We profile barbell velocity, neuromuscular fatigue,
                and unilateral force distribution to optimize neural adaptation.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-core-red shrink-0" />
                <span>Linear Position Transducers</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-core-red shrink-0" />
                <span>Force Plate Symmetry Profiling</span>
              </div>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.0, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="sm:col-span-2 lg:col-span-1 group relative rounded-3xl bg-core-dark border border-white/10 p-6 sm:p-8 flex flex-col justify-between hover:border-core-red/40 transition-all duration-500 shadow-glass-card"
          >
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 rounded-2xl bg-core-surface border border-white/10 flex items-center justify-center text-core-red group-hover:bg-core-red group-hover:text-white transition-colors duration-500">
                  <Wind className="w-6 h-6" />
                </div>
                <span className="text-2xl font-display font-black text-white/20 group-hover:text-core-red/40 transition-colors duration-500">
                  03
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-display font-bold uppercase text-white tracking-tight">
                RESTORATIVE PROTOCOLS
              </h3>
              <p className="mt-3 text-sm text-core-muted font-sans leading-relaxed font-light">
                High output requires rapid regeneration. Whole-body sub-zero cryotherapy, infrared sauna pods,
                and mineral contrast plunges reboot the autonomic nervous system.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-core-red shrink-0" />
                <span>-110°C Cryotherapy Chamber</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-core-red shrink-0" />
                <span>Medical Hyperbaric Oxygen Suite</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Transition cue to Section 04 Video with subtle entrance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-core-muted"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-core-red" />
            <span className="tracking-widest uppercase">
              NEXT // SCROLL-CONTROLLED FACILITY FILM
            </span>
          </div>

          <a
            href="#about-video"
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer group"
          >
            <span className="tracking-widest uppercase text-[11px]">SCROLL TO EXPERIENCE FILM</span>
            <ChevronDown className="w-4 h-4 animate-bounce group-hover:text-core-red" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

