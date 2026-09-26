'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { glassNutritionCards } from '@/data/diet';

export function DietGlassCards() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedCard, setSelectedCard] = useState<string>(glassNutritionCards[0].id);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Silky scroll-driven rotation & 3D tilt
  const smoothRotateZ = useSpring(
    useTransform(scrollYProgress, [0, 1], [-50, 85]),
    { stiffness: 75, damping: 24, mass: 0.2, restDelta: 0.001 }
  );
  const smoothRotateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [20, -10]),
    { stiffness: 75, damping: 24 }
  );
  const smoothRotateY = useSpring(
    useTransform(scrollYProgress, [0, 1], [-16, 16]),
    { stiffness: 75, damping: 24 }
  );
  const smoothScale = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1.05, 0.96]),
    { stiffness: 75, damping: 24 }
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-12 sm:py-16 bg-core-void select-none overflow-hidden border-b border-white/5"
    >
      {/* Background Ambient Flare */}
      <div className="absolute top-1/2 right-1/3 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-core-red/12 via-transparent to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading Cluster */}
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
              GLASS PROTOCOL INTERFACE
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-white leading-tight"
          >
            Timed Performance Protocols.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs font-sans text-core-muted font-light leading-relaxed max-w-md mx-auto"
          >
            Calibrated timing windows configured to optimize intra-muscular glycogen replenishment and peak energy velocity.
          </motion.p>
        </div>

        {/* 2-Column Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

          {/* Left Column: Tilted Fresh Salad Bowl with Scroll-Driven Rotation (col-span-5) */}
          <div className="lg:col-span-5 relative flex items-center justify-center [perspective:1200px]">
            {/* Ambient Halo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-80 h-72 sm:h-80 bg-gradient-radial from-core-red/25 via-transparent to-transparent rounded-full blur-[80px] pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, x: -70, rotateY: -16, scale: 0.88 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-[280px] sm:w-[360px] lg:w-[400px] aspect-square flex items-center justify-center group cursor-pointer"
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
                className="w-full h-full flex items-center justify-center [transform-style:preserve-3d]"
              >
                <Image
                  src="/dietpage/tometoflypannerforanmetionindite.png"
                  alt="Fresh Salad with Floating Feta and Organic Vegetables"
                  width={541}
                  height={461}
                  priority
                  className="object-contain w-full h-full drop-shadow-[0_25px_50px_rgba(0,0,0,0.98)] filter contrast-120 brightness-105 select-none pointer-events-none"
                />
              </motion.div>

              {/* Bottom Subtle Overlay Pill */}
              <div className="absolute -bottom-1 px-4 py-1.5 rounded-full bg-core-dark/85 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center gap-2 text-[10px] font-mono pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-core-red animate-pulse" />
                <span className="text-white font-bold tracking-wider uppercase">ELECTROLYTE MATRIX</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Floating Dark Glass Cards (col-span-7) with Natural Stagger */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 [perspective:1000px]">
            {glassNutritionCards.map((card, index) => {
              const isSelected = selectedCard === card.id;

              return (
                <motion.div
                  key={card.id}
                  initial={{
                    opacity: 0,
                    x: index % 2 === 0 ? -30 : 30,
                    y: 25,
                  }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{
                    duration: 0.9,
                    delay: index * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  onClick={() => setSelectedCard(card.id)}
                  className={`relative p-5 rounded-2xl backdrop-blur-2xl transition-all duration-400 cursor-pointer flex flex-col justify-between group shadow-[0_15px_40px_rgba(0,0,0,0.8)] ${
                    isSelected
                      ? 'bg-white/[0.07] border border-core-red/60 shadow-[0_15px_40px_rgba(255,42,42,0.2)]'
                      : 'bg-white/[0.025] border border-white/10 hover:border-white/25 hover:bg-white/[0.04]'
                  }`}
                >
                  {/* Subtle Red Flare on Selection */}
                  <div
                    className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none transition-opacity duration-400 ${
                      isSelected ? 'opacity-100 bg-core-red/15' : 'opacity-0'
                    }`}
                  />

                  {/* Card Header */}
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono tracking-[0.25em] text-core-red font-bold uppercase">
                        {card.phase}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono text-core-muted uppercase tracking-wider">
                        {card.timing}
                      </span>
                    </div>

                    <h3 className="font-display font-black text-base sm:text-lg uppercase tracking-tight text-white group-hover:text-core-red transition-colors">
                      {card.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs font-sans text-core-muted leading-relaxed font-light mb-4">
                    {card.description}
                  </p>

                  {/* Bottom Macro Split */}
                  <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-core-muted uppercase tracking-wider block">
                        MACRO SPLIT
                      </span>
                      <span className="text-white font-bold tracking-tight text-xs">
                        {card.macroRatio}
                      </span>
                    </div>

                    <div className="text-right space-y-0.5">
                      <span className="text-[9px] text-core-red uppercase tracking-wider block font-semibold">
                        WINDOW
                      </span>
                      <span className="text-white/80 text-[10px] truncate max-w-[110px] block">
                        {card.highlight}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
