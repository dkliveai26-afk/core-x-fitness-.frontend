'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ChevronRight, ArrowDown, Sparkles, Activity } from 'lucide-react';

export function DietHero() {
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Silky, spring-interpolated scroll rotation around center & 3D axes
  const smoothRotateZ = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 115]),
    { stiffness: 75, damping: 24, mass: 0.2, restDelta: 0.001 }
  );
  const smoothRotateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [12, 24]),
    { stiffness: 75, damping: 24, mass: 0.2, restDelta: 0.001 }
  );
  const smoothRotateY = useSpring(
    useTransform(scrollYProgress, [0, 1], [-8, 14]),
    { stiffness: 75, damping: 24, mass: 0.2, restDelta: 0.001 }
  );
  const smoothScale = useSpring(
    useTransform(scrollYProgress, [0, 1], [1, 1.07]),
    { stiffness: 75, damping: 24, mass: 0.2, restDelta: 0.001 }
  );

  // Parallax floating greens drift on scroll
  const saladScrollY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 90]),
    { stiffness: 65, damping: 22, mass: 0.2 }
  );
  const saladScrollRotate = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 30]),
    { stiffness: 65, damping: 22, mass: 0.2 }
  );

  const scrollToNext = () => {
    const target = document.getElementById('diet-3d-experience');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full bg-core-void pt-24 sm:pt-28 pb-4 sm:pb-6 flex items-center overflow-hidden select-none border-b border-white/5"
    >
      {/* Background Volumetric Atmospheric Glows */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-core-red/20 via-core-crimson/8 to-transparent rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute -top-24 left-10 w-72 h-72 bg-white/[0.02] rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Background Floating Greens / Salad Layer with Subtle Organic Levitation & Scroll Parallax */}
      <motion.div
        style={{
          y: saladScrollY,
          rotate: saladScrollRotate,
        }}
        className="absolute top-10 right-4 sm:right-14 w-64 sm:w-80 h-auto pointer-events-none -z-10 mix-blend-screen"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 0.28,
            scale: 1,
            y: [0, -10, 0],
          }}
          transition={{
            opacity: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
            scale: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
            y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <Image
            src="/dietpage/fliyingseletpanerforanmetionimageindite.png"
            alt="Floating Fresh Organic Salad"
            width={541}
            height={461}
            priority
            className="object-contain w-full h-auto filter contrast-125 brightness-85 select-none"
          />
        </motion.div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        
        {/* 2-Column Balanced Split Hero: TEXT | BOWL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

          {/* Left Column: Compact Headline, Philosophy & Macro Badges (col-span-6) */}
          <div className="lg:col-span-6 space-y-4 text-left">
            
            {/* Subtle Breadcrumb: HOME > NUTRITION & DIET */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.25em] text-core-muted"
            >
              <Link href="/" className="hover:text-white transition-colors">
                HOME
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-core-red" />
              <span className="text-core-red font-bold">NUTRITION & DIET</span>
            </motion.div>

            {/* Controlled, Powerful Headline */}
            <div className="overflow-hidden">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-black text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.95)]"
              >
                FUEL THE WORK.
              </motion.h1>
            </div>

            {/* Short Supporting Statement */}
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs sm:text-sm font-mono text-core-muted tracking-[0.2em] uppercase font-light max-w-lg leading-relaxed"
            >
              METABOLIC ARCHITECTURE FOR RELENTLESS ATHLETES.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs sm:text-sm font-sans text-white/70 leading-relaxed font-light max-w-md"
            >
              Every nutrient calibrated down to the gram. Whole-food sports nutrition architected in lockstep with your barbell output metrics.
            </motion.p>

            {/* Macro Matrix Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono"
            >
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-white/90">
                <Sparkles className="w-3.5 h-3.5 text-core-red" />
                <span>48G+ BIOAVAILABLE PROTEIN</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-white/90">
                <Activity className="w-3.5 h-3.5 text-core-red" />
                <span>ZERO REFINED SUGARS</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-core-red/15 border border-core-red/30 text-white font-bold">
                CHEF & PHYSIOLOGIST CALIBRATED
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.52, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3.5 pt-2"
            >
              <button
                onClick={scrollToNext}
                className="px-5 py-3 rounded-xl bg-core-red hover:bg-[#E61E1E] text-white font-display font-black text-xs tracking-widest uppercase transition-all duration-300 shadow-[0_10px_30px_rgba(255,42,42,0.4)] hover:shadow-[0_15px_35px_rgba(255,42,42,0.6)] active:scale-[0.98] inline-flex items-center gap-2 cursor-pointer"
              >
                <span>EXPLORE 3D NUTRITION</span>
                <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              </button>

              <Link
                href="/contact"
                className="px-5 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white font-display font-bold text-xs tracking-widest uppercase transition-colors"
              >
                CONSULT DIETITIAN
              </Link>
            </motion.div>

          </div>

          {/* Right Column: Hero Steak Power Bowl Centerpiece with 3D Perspective & Scroll-Driven Rotation */}
          <div className="lg:col-span-6 relative flex items-center justify-center [perspective:1200px]">
            {/* Atmospheric Red Spotlight Halo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-80 lg:w-[420px] h-72 sm:h-80 lg:h-[420px] bg-gradient-radial from-core-red/35 via-core-crimson/15 to-transparent rounded-full blur-[90px] pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 35 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-[280px] sm:w-[350px] lg:w-[400px] aspect-square flex items-center justify-center cursor-pointer group"
            >
              {/* Grounding Shadow */}
              <div className="absolute inset-x-8 -bottom-3 h-8 bg-black/90 rounded-full blur-xl pointer-events-none" />

              {/* Scroll-Driven Smooth Rotating Bowl Container */}
              <motion.div
                style={{
                  rotateZ: smoothRotateZ,
                  rotateX: smoothRotateX,
                  rotateY: smoothRotateY,
                  scale: smoothScale,
                }}
                whileHover={{ scale: 1.05 }}
                className="w-full h-full flex items-center justify-center [transform-style:preserve-3d] transition-shadow duration-500"
              >
                <Image
                  src="/dietpage/steak_power_bowl.png"
                  alt="Core X Fitness Signature Steak Power Bowl"
                  width={454}
                  height={549}
                  priority
                  className="object-contain w-full h-full drop-shadow-[0_25px_50px_rgba(0,0,0,0.98)] filter contrast-120 brightness-105 select-none"
                />
              </motion.div>

              {/* Floating Signature Tag */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-1 right-1 px-3 py-1.5 rounded-full bg-core-dark/90 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center gap-2 text-[10px] font-mono tracking-wider uppercase text-white/90 pointer-events-none"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-core-red animate-pulse" />
                <span>SIGNATURE STEAK POWER BOWL</span>
              </motion.div>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
