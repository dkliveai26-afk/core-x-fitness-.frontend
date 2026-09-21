'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BarbellCanvas } from '@/components/3d/BarbellCanvas';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { HeroStats } from './HeroStats';
import { ArrowRight, Play, Sparkles, ChevronDown, Flame } from 'lucide-react';

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const [scrollProgressVal, setScrollProgressVal] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setScrollProgressVal(latest);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const opacityTransform = useTransform(scrollYProgress, [0, 0.7], [1, 0.2]);
  const textTranslateY = useTransform(scrollYProgress, [0, 0.8], [0, -80]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col justify-between pt-28 sm:pt-36 pb-12 overflow-hidden bg-core-void"
      id="hero"
    >
      {/* 1. Atmospheric Ambient Gradients & Texture */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none z-10" />
      
      {/* Top Crimson Core Glow */}
      <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[400px] bg-gradient-radial from-core-red/20 via-core-crimson/5 to-transparent rounded-full blur-3xl pointer-events-none z-0" />

      {/* Subtle Carbon Grid Blueprint Lines */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* 2. Interactive 3D Barbell Canvas Layer */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <BarbellCanvas scrollProgress={scrollProgressVal} />
      </div>

      {/* 3. Hero Content Foreground Layer */}
      <motion.div
        style={{ opacity: opacityTransform, y: textTranslateY }}
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center"
      >
        <div className="max-w-4xl">
          {/* Top Pill / Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-wrap items-center gap-3 mb-6"
          >
            <Badge variant="red" size="md" dot>
              ELITE HUMAN PERFORMANCE // METROPOLIS
            </Badge>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-mono text-core-muted/80 uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-core-red" />
              NOW ACCEPTING SELECT MEMBERS
            </span>
          </motion.div>

          {/* Primary Massive Editorial Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-1 sm:space-y-2"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black uppercase tracking-tight text-white leading-[0.92]">
              <span className="block drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">FORGED IN</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
                DISCIPLINE.
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-core-red via-core-accent to-white drop-shadow-[0_0_35px_rgba(255,42,42,0.35)]">
                DEFINED BY STRENGTH.
              </span>
            </h1>
          </motion.div>

          {/* Supporting Copy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
            className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl font-sans leading-relaxed"
          >
            Where architectural luxury meets high-performance science. Eleiko Olympic platforms,
            biometric recovery suites, and world-class athletic mentorship designed for those who refuse mediocrity.
          </motion.p>

          {/* Interactive Action Trigger Cluster */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4 sm:gap-5"
          >
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-5 h-5" />}
              onClick={() => {
                const target = document.querySelector('#memberships');
                target?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Memberships
            </Button>

            <Button
              variant="secondary"
              size="lg"
              leftIcon={
                <span className="w-6 h-6 rounded-full bg-core-red/20 text-core-red flex items-center justify-center border border-core-red/40 group-hover:bg-core-red group-hover:text-white transition-colors">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </span>
              }
              onClick={() => setIsVideoModalOpen(true)}
            >
              Watch Club Film
            </Button>

            {/* Social Proof Member Counter */}
            <div className="flex items-center gap-3 pl-2 sm:pl-4 py-2 border-l border-white/15">
              <div className="flex -space-x-2">
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Member avatar"
                    className="w-8 h-8 rounded-full border-2 border-core-dark object-cover"
                  />
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-amber-400 text-xs">★★★★★</span>
                  <span className="text-xs font-mono font-bold text-white">4.98</span>
                </div>
                <span className="text-[11px] font-mono text-core-muted">850+ Elite Members</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Hero Stats Ribbon */}
        <HeroStats />
      </motion.div>

      {/* 4. Scroll Cue at Bottom */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between mt-8 pt-4 border-t border-white/5 text-core-muted text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-core-red" />
          <span className="tracking-widest uppercase">PRECISION ENGINEERED // 2026 ARCHITECTURE</span>
        </div>

        <a
          href="#philosophy"
          className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer group"
          aria-label="Scroll to philosophy section"
        >
          <span className="tracking-widest uppercase text-[11px]">SCROLL TO EXPLORE</span>
          <ChevronDown className="w-4 h-4 animate-bounce group-hover:text-core-red" />
        </a>
      </div>

      {/* Film Trailer Modal */}
      {isVideoModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-core-void/90 backdrop-blur-2xl"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl bg-core-dark rounded-2xl border border-white/20 p-4 shadow-[0_25px_70px_rgba(0,0,0,0.9)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-core-red" />
                <span className="font-heading uppercase font-bold text-white tracking-widest text-sm">
                  CORE X FITNESS // FACILITY TOUR & ETHOS
                </span>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="text-core-muted hover:text-white text-xs font-mono uppercase px-3 py-1 bg-white/5 rounded-md hover:bg-white/10 transition-colors"
              >
                Close (ESC)
              </button>
            </div>
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black flex flex-col items-center justify-center relative">
              <img
                src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200&auto=format&fit=crop&q=80"
                alt="Core X Fitness Training Floor Preview"
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
              <div className="relative z-10 text-center p-6 bg-core-dark/80 backdrop-blur-md rounded-2xl border border-white/10 max-w-md">
                <div className="w-16 h-16 mx-auto rounded-full bg-red-gradient flex items-center justify-center shadow-glow-red mb-4">
                  <Play className="w-7 h-7 text-white fill-white ml-1" />
                </div>
                <h3 className="text-xl font-display font-extrabold text-white uppercase">
                  Cinematic Facility Film
                </h3>
                <p className="text-xs text-core-muted font-sans mt-2">
                  Experience the architectural design, Eleiko competition stations, and biometric recovery labs in 4K.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
