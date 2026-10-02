'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface PhaseDetail {
  id: string;
  phase: string;
  title: string;
  ingredient: string;
  description: string;
  protein: string;
  carbs: string;
  fats: string;
  calories: string;
  rotation: number;
  tiltX: number;
  tiltY: number;
}

const phases: PhaseDetail[] = [
  {
    id: 'phase1',
    phase: '01 // ANABOLIC PRIMING',
    title: 'Grass-Fed Flank Steak',
    ingredient: 'Bioavailable Hemoglobin Iron & Zinc',
    description: 'Complete essential amino acid profile with naturally bound creatine phosphate. Promotes intramuscular fluid retention and accelerates nitrogen balance.',
    protein: '48.4g',
    carbs: '12.0g',
    fats: '16.0g',
    calories: '520 KCAL',
    rotation: 0,
    tiltX: 14,
    tiltY: -8,
  },
  {
    id: 'phase2',
    phase: '02 // RECOVERY SHIELD',
    title: 'Cruciferous Sulforaphane',
    ingredient: 'Charred Tenderstem & Hass Avocado',
    description: 'Supplies oleic monounsaturated lipids and phase-2 detoxification enzymes, shielding joint capsules and soft tissue from exercise-induced oxidative stress.',
    protein: '22.0g',
    carbs: '18.0g',
    fats: '24.0g',
    calories: '410 KCAL',
    rotation: 45,
    tiltX: 22,
    tiltY: 12,
  },
  {
    id: 'phase3',
    phase: '03 // SUSTAINED GLYCOGEN',
    title: 'Slow-Release Amylose Yams',
    ingredient: 'Roasted Spiced Sweet Potato Cubes',
    description: 'Replenishes hepatic and muscular glycogen depots smoothly without reactive postprandial hypoglycemia, sustaining athletic power velocity.',
    protein: '14.0g',
    carbs: '58.0g',
    fats: '6.0g',
    calories: '460 KCAL',
    rotation: 90,
    tiltX: 12,
    tiltY: -6,
  },
];

export function DietBowl3DScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const currentPhase = phases[activePhaseIndex];

  // Strong, buttery-smooth scroll-driven rotation physics
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const smoothScrollRotation = useSpring(
    useTransform(scrollYProgress, [0, 1], [-65, 145]),
    { stiffness: 75, damping: 24, mass: 0.2, restDelta: 0.001 }
  );

  const smoothTiltX = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [22, 14, 20]),
    { stiffness: 75, damping: 24, mass: 0.2, restDelta: 0.001 }
  );

  const smoothTiltY = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [-14, 0, 14]),
    { stiffness: 75, damping: 24, mass: 0.2, restDelta: 0.001 }
  );

  return (
    <section
      ref={sectionRef}
      id="diet-3d-experience"
      className="relative w-full pt-6 sm:pt-10 pb-16 sm:pb-20 bg-core-void select-none overflow-hidden border-b border-white/5"
    >
      {/* Background Volumetric Atmospheric Flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-core-red/18 via-core-crimson/6 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Staggered Entrance */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14 space-y-2">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-core-red shadow-glow-red" />
            <span className="text-[10px] font-mono tracking-[0.25em] text-core-red uppercase font-bold">
              3D METABOLIC ARCHITECTURE
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-white leading-tight"
          >
            Architectural Macro Breakdown.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs font-sans text-core-muted font-light leading-relaxed max-w-md mx-auto"
          >
            Select each cellular timing layer to observe how nutrients shift perspective, angle, and physiological function.
          </motion.p>
        </div>

        {/* 3-Column Interactive Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left Column: Interactive Phase Selector Tabs (col-span-4) - Slide from Left */}
          <div className="lg:col-span-4 space-y-3">
            {phases.map((item, idx) => {
              const isActive = activePhaseIndex === idx;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.9, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setActivePhaseIndex(idx)}
                  className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-core-dark/95 border-core-red/60 shadow-[0_15px_35px_rgba(255,42,42,0.2)]'
                      : 'bg-white/[0.025] border-white/10 hover:border-white/25 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono tracking-[0.2em] uppercase font-bold text-core-red">
                      {item.phase}
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'text-core-red rotate-90' : 'text-white/40'}`} />
                  </div>

                  <h3 className="font-display font-black text-base sm:text-lg uppercase tracking-tight text-white mb-1">
                    {item.title}
                  </h3>

                  <p className="text-xs font-sans text-core-muted leading-relaxed font-light line-clamp-2">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Center Column: The 3D Rotating Food Bowl (col-span-5) - Strong Scroll Rotation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex items-center justify-center py-4 [perspective:1200px]"
          >
            {/* Ambient Red Radial Halo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-88 h-72 sm:h-88 bg-gradient-radial from-core-red/30 via-transparent to-transparent rounded-full blur-[80px] pointer-events-none" />

            <div className="relative w-[230px] xs:w-[270px] sm:w-[350px] lg:w-[400px] aspect-square flex items-center justify-center [transform-style:preserve-3d] cursor-pointer group">
              {/* Grounding Shadow */}
              <div className="absolute inset-x-6 -bottom-3 h-8 bg-black/90 rounded-full blur-xl pointer-events-none" />

              {/* Scroll-Driven Smooth 3D Rotating Meal Object */}
              <motion.div
                style={{
                  rotateZ: smoothScrollRotation,
                  rotateX: smoothTiltX,
                  rotateY: smoothTiltY,
                }}
                whileHover={{ scale: 1.05 }}
                className="w-full h-full flex items-center justify-center [transform-style:preserve-3d] select-none"
              >
                <Image
                  src="/dietpage/steak_power_bowl.png"
                  alt={currentPhase.title}
                  width={454}
                  height={549}
                  priority
                  className="object-contain w-full h-full drop-shadow-[0_25px_50px_rgba(0,0,0,0.98)] filter contrast-120 brightness-105 pointer-events-none select-none transition-transform duration-500"
                />
              </motion.div>

              {/* Interactive Angle Tag */}
              <div className="absolute bottom-1 px-3 py-1 rounded-full bg-core-dark/90 backdrop-blur-md border border-white/10 text-[9px] font-mono tracking-widest text-core-muted uppercase pointer-events-none">
                3D METABOLIC ROTATION // SCROLL DRIVEN
              </div>
            </div>
          </motion.div>

          {/* Right Column: Dynamic Live Macro HUD Gauges (col-span-3) - Slide from Right */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 sm:gap-4 lg:gap-3">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              key={`cal-${currentPhase.id}`}
              className="p-4 rounded-2xl bg-core-dark/80 backdrop-blur-xl border border-white/10 space-y-1"
            >
              <span className="text-[9px] font-mono tracking-widest text-core-muted uppercase block">
                ENERGY CONTENT
              </span>
              <div className="text-xl font-display font-black text-core-red">
                {currentPhase.calories}
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className="bg-core-red h-full rounded-full"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              key={`pro-${currentPhase.id}`}
              className="p-4 rounded-2xl bg-core-dark/80 backdrop-blur-xl border border-white/10 space-y-1"
            >
              <span className="text-[9px] font-mono tracking-widest text-core-muted uppercase block">
                BIOAVAILABLE PROTEIN
              </span>
              <div className="text-xl font-display font-black text-white">
                {currentPhase.protein}
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '92%' }}
                  transition={{ duration: 0.7, delay: 0.05, ease: 'easeOut' }}
                  className="bg-white/80 h-full rounded-full"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              key={`carb-${currentPhase.id}`}
              className="p-4 rounded-2xl bg-core-dark/80 backdrop-blur-xl border border-white/10 space-y-1"
            >
              <span className="text-[9px] font-mono tracking-widest text-core-muted uppercase block">
                COMPLEX GLYCOGEN
              </span>
              <div className="text-xl font-display font-black text-white">
                {currentPhase.carbs}
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
                  className="bg-white/50 h-full rounded-full"
                />
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
