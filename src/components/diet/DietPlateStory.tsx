'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { signaturePlates } from '@/data/diet';

export function DietPlateStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activePlateId, setActivePlateId] = useState<string>(signaturePlates[1].id);

  // Scroll tracking across section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Distinct buttery-smooth scroll-driven rotation for each plate
  // Plate 0 (Left - Sea Bass): forward rotation with subtle outward tilt
  const plate0Rotate = useSpring(
    useTransform(scrollYProgress, [0, 1], [-45, 80]),
    { stiffness: 75, damping: 24, mass: 0.2, restDelta: 0.001 }
  );
  const plate0TiltX = useSpring(
    useTransform(scrollYProgress, [0, 1], [15, -6]),
    { stiffness: 75, damping: 24 }
  );
  const plate0TiltY = useSpring(
    useTransform(scrollYProgress, [0, 1], [-12, 10]),
    { stiffness: 75, damping: 24 }
  );

  // Plate 1 (Center - Salmon Bowl): full forward rotation with direct depth
  const plate1Rotate = useSpring(
    useTransform(scrollYProgress, [0, 1], [-60, 100]),
    { stiffness: 75, damping: 24, mass: 0.2, restDelta: 0.001 }
  );
  const plate1TiltX = useSpring(
    useTransform(scrollYProgress, [0, 1], [18, -8]),
    { stiffness: 75, damping: 24 }
  );

  // Plate 2 (Right - Glazed Turkey & Yams): counter-rotation for dynamic balance
  const plate2Rotate = useSpring(
    useTransform(scrollYProgress, [0, 1], [45, -80]),
    { stiffness: 75, damping: 24, mass: 0.2, restDelta: 0.001 }
  );
  const plate2TiltX = useSpring(
    useTransform(scrollYProgress, [0, 1], [15, -6]),
    { stiffness: 75, damping: 24 }
  );
  const plate2TiltY = useSpring(
    useTransform(scrollYProgress, [0, 1], [12, -10]),
    { stiffness: 75, damping: 24 }
  );

  const plateRotations = [
    { rotateZ: plate0Rotate, rotateX: plate0TiltX, rotateY: plate0TiltY },
    { rotateZ: plate1Rotate, rotateX: plate1TiltX, rotateY: 0 },
    { rotateZ: plate2Rotate, rotateX: plate2TiltX, rotateY: plate2TiltY },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-12 sm:py-16 bg-core-void select-none overflow-hidden border-b border-white/5"
    >
      {/* Background Volumetric Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-core-red/12 via-transparent to-transparent rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
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
              THE CHEF & PHYSIOLOGIST TABLE
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight text-white leading-tight"
          >
            What&apos;s On Our Plate.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs font-sans text-core-muted font-light leading-relaxed max-w-md mx-auto"
          >
            Every plate is architected for a distinct metabolic outcome. No arbitrary cooking; strictly whole-food nutritional science.
          </motion.p>
        </div>

        {/* 3 Rotating Signature Plates Display with Unique Distinct Animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {signaturePlates.map((plate, index) => {
            const isSelected = activePlateId === plate.id;
            const rot = plateRotations[index] || plateRotations[0];

            // Tailored entrance animation profiles: Left slide, Bottom reveal, Right slide
            const entranceVariants = [
              {
                // Left Plate: Smooth Left → Right slide with subtle angle
                initial: { opacity: 0, x: -70, y: 20 },
                delay: 0,
              },
              {
                // Center Plate: Bottom → Top reveal with subtle scale
                initial: { opacity: 0, y: 70, scale: 0.92 },
                delay: 0.15,
              },
              {
                // Right Plate: Smooth Right → Left slide
                initial: { opacity: 0, x: 70, y: 20 },
                delay: 0.3,
              },
            ];

            const anim = entranceVariants[index] || entranceVariants[0];
            const isThirdOnTablet = index === 2;

            return (
              <motion.div
                key={plate.id}
                initial={anim.initial}
                whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 1.05, delay: anim.delay, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setActivePlateId(plate.id)}
                className={`relative rounded-3xl bg-core-dark/85 backdrop-blur-xl border p-5 sm:p-6 flex flex-col items-center text-center transition-all duration-400 cursor-pointer group shadow-[0_15px_40px_rgba(0,0,0,0.85)] ${
                  isThirdOnTablet ? 'sm:col-span-2 lg:col-span-1 sm:max-w-md sm:mx-auto sm:w-full lg:max-w-none' : ''
                } ${
                  isSelected
                    ? 'border-core-red/60 shadow-[0_20px_50px_rgba(255,42,42,0.2)]'
                    : 'border-white/10 hover:border-white/25'
                }`}
              >
                {/* Background Plate Accent Radial Flare */}
                <div
                  className={`absolute inset-0 rounded-3xl transition-opacity duration-400 pointer-events-none -z-10 ${
                    isSelected ? 'opacity-100 bg-core-red/5' : 'opacity-0'
                  }`}
                />

                {/* Rotating Food Plate Artwork with Silky Scroll-Driven Rotation */}
                <div className="relative w-40 sm:w-48 lg:w-52 aspect-square mb-5 flex items-center justify-center [perspective:1000px]">
                  <div className="absolute inset-0 bg-gradient-radial from-core-red/20 via-transparent to-transparent rounded-full blur-xl group-hover:scale-110 transition-transform duration-500 pointer-events-none" />

                  <motion.div
                    style={{
                      rotateZ: rot.rotateZ,
                      rotateX: rot.rotateX,
                      rotateY: rot.rotateY,
                    }}
                    whileHover={{ scale: 1.08 }}
                    className="w-full h-full flex items-center justify-center [transform-style:preserve-3d]"
                  >
                    <Image
                      src={plate.image}
                      alt={plate.title}
                      width={500}
                      height={500}
                      priority
                      className="object-contain w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)] filter contrast-115 brightness-105 select-none pointer-events-none"
                    />
                  </motion.div>
                </div>

                {/* Plate Meta & Category */}
                <div className="space-y-1.5 mb-3 w-full">
                  <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-core-red font-bold block">
                    {plate.category}
                  </span>
                  <h3 className="font-display font-black text-lg sm:text-xl uppercase tracking-tight text-white group-hover:text-core-red transition-colors">
                    {plate.title}
                  </h3>
                  <p className="text-xs font-sans text-core-muted leading-relaxed font-light line-clamp-2">
                    {plate.description}
                  </p>
                </div>

                {/* Macro Chips Cluster */}
                <div className="w-full pt-3 mt-auto border-t border-white/10 grid grid-cols-4 gap-1 text-center font-mono">
                  <div>
                    <span className="text-[8px] sm:text-[9px] text-core-muted uppercase block">PROTEIN</span>
                    <span className="font-bold text-white text-xs sm:text-sm">{plate.protein}</span>
                  </div>
                  <div>
                    <span className="text-[8px] sm:text-[9px] text-core-muted uppercase block">CARBS</span>
                    <span className="font-bold text-white text-xs sm:text-sm">{plate.carbs}</span>
                  </div>
                  <div>
                    <span className="text-[8px] sm:text-[9px] text-core-muted uppercase block">FATS</span>
                    <span className="font-bold text-white text-xs sm:text-sm">{plate.fats}</span>
                  </div>
                  <div>
                    <span className="text-[8px] sm:text-[9px] text-core-muted uppercase block">ENERGY</span>
                    <span className="font-bold text-core-red text-xs sm:text-sm">{plate.calories}</span>
                  </div>
                </div>

                {/* Active Selection Glow Pill */}
                {isSelected && (
                  <motion.div
                    layoutId="activePlateBorder"
                    className="absolute -bottom-2.5 px-3.5 py-0.5 rounded-full bg-core-red text-white text-[9px] font-mono tracking-widest uppercase font-bold shadow-glow-red flex items-center gap-1"
                  >
                    <span>ACTIVE PROTOCOL</span>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
