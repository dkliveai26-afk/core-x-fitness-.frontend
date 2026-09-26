'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function ContactKineticBands() {
  // Phrase sets for each band
  const band1Items = [
    'CORE X FITNESS',
    'PERFORMANCE',
    'STRENGTH',
    'DISCIPLINE',
    'ATHLETIC RESILIENCE',
    'UNCOMPROMISED',
  ];

  const band2Items = [
    'BUILT FOR PERFORMANCE',
    'TRAIN WITH PURPOSE',
    'ELEIKO ARCHITECTURE',
    'MAXIMUM FORCE',
    'FORGED IN IRON',
  ];

  const band3Items = [
    '24/7 BIOMETRIC LABS',
    'KINETIC ARCHITECTURE',
    'PEAK FORCE METRICS',
    'ZERO COMPROMISE',
    'OLYMPIC CALIBRATION',
  ];

  // Quadruple items to ensure seamless, infinite translation without seam
  const track1 = [...band1Items, ...band1Items, ...band1Items, ...band1Items];
  const track2 = [...band2Items, ...band2Items, ...band2Items, ...band2Items];
  const track3 = [...band3Items, ...band3Items, ...band3Items, ...band3Items];

  return (
    <section className="relative w-full py-16 sm:py-24 bg-core-void overflow-hidden select-none border-t border-white/5">
      {/* Background Volumetric Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-gradient-radial from-core-red/15 via-transparent to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Edge Linear Fade Masks (ensures text glides in and out of the deep void seamlessly) */}
      <div className="absolute left-0 inset-y-0 w-24 sm:w-48 bg-gradient-to-r from-core-void via-core-void/90 to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-24 sm:w-48 bg-gradient-to-l from-core-void via-core-void/90 to-transparent z-20 pointer-events-none" />

      {/* Layered Diagonal Bands Stage */}
      <div className="relative w-full flex flex-col justify-center items-center py-6 sm:py-8 space-y-4 sm:space-y-6">

        {/* ========================================================
            BAND 1 (Top Ribbon)
            Tilt: -2.2deg | Direction: LEFT -> RIGHT (-->)
           ======================================================== */}
        <div
          className="relative w-[135vw] -ml-[17.5vw] -rotate-[2.2deg] overflow-hidden bg-[#0A0D12]/95 border-y border-white/10 py-3 sm:py-4 shadow-xl z-0 will-change-transform"
        >
          <motion.div
            className="flex items-center gap-8 sm:gap-12 whitespace-nowrap will-change-transform"
            animate={{ x: ['-50%', '0%'] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 36,
                ease: 'linear',
              },
            }}
          >
            {track1.map((text, i) => (
              <div key={i} className="flex items-center gap-8 sm:gap-12 shrink-0">
                <span className="font-display font-black text-2xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white/90">
                  {text}
                </span>
                <span className="text-core-red text-xl sm:text-3xl font-bold">
                  ❯
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ========================================================
            BAND 2 (Middle Ribbon - Core Red Prominent Overlay)
            Tilt: +2.4deg | Direction: RIGHT -> LEFT (<--)
           ======================================================== */}
        <div
          className="relative w-[135vw] -ml-[17.5vw] rotate-[2.4deg] -my-2 sm:-my-3 overflow-hidden bg-gradient-to-r from-core-red via-[#E61E1E] to-[#B31414] py-3.5 sm:py-4.5 shadow-[0_15px_45px_rgba(255,42,42,0.38)] z-10 border-y border-white/20 will-change-transform"
        >
          <motion.div
            className="flex items-center gap-8 sm:gap-12 whitespace-nowrap will-change-transform"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 28,
                ease: 'linear',
              },
            }}
          >
            {track2.map((text, i) => (
              <div key={i} className="flex items-center gap-8 sm:gap-12 shrink-0">
                <span className="font-display font-black text-2xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white drop-shadow-md">
                  {text}
                </span>
                <span className="text-black/60 text-xl sm:text-3xl font-black">
                  //
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ========================================================
            BAND 3 (Lower Ribbon)
            Tilt: -1.2deg | Direction: LEFT -> RIGHT (-->)
           ======================================================== */}
        <div
          className="relative w-[135vw] -ml-[17.5vw] -rotate-[1.2deg] overflow-hidden bg-[#0D1016]/95 border-y border-white/10 py-3 sm:py-4 shadow-xl z-0 will-change-transform"
        >
          <motion.div
            className="flex items-center gap-8 sm:gap-12 whitespace-nowrap will-change-transform"
            animate={{ x: ['-50%', '0%'] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 42,
                ease: 'linear',
              },
            }}
          >
            {track3.map((text, i) => (
              <div key={i} className="flex items-center gap-8 sm:gap-12 shrink-0">
                <span className="font-display font-black text-xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-white/80">
                  {text}
                </span>
                <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-core-red shadow-glow-red" />
              </div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
