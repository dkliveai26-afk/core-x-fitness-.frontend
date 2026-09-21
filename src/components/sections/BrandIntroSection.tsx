'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

export function BrandIntroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const textY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const clipProgress = useTransform(scrollYProgress, [0.1, 0.4], ['inset(20% 10% 20% 10% rounded 24px)', 'inset(0% 0% 0% 0% rounded 0px)']);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen w-full bg-core-void py-32 px-6 sm:px-12 overflow-hidden flex flex-col justify-center"
    >
      {/* Background Accent Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center z-10">
        {/* Left Column: Kinetic Minimal Typography */}
        <motion.div style={{ y: textY }} className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-core-red/10 border border-core-red/30 text-[11px] font-mono tracking-[0.3em] text-core-red uppercase">
            BRAND ARCHITECTURE
          </div>

          <h2 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl uppercase tracking-wider text-white leading-[0.95]">
            REDEFINING THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-core-muted">LIMITS OF</span> HUMAN POTENTIAL<span className="text-core-red">.</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-white/10">
            <div>
              <span className="text-xs font-mono tracking-[0.3em] text-core-red uppercase block mb-2 font-bold">
                01 / ARCHITECTURE
              </span>
              <p className="text-sm font-sans text-core-muted leading-relaxed font-light">
                An 18,500 sq ft sanctuary designed with industrial titanium, dark acoustic dampening, and precision illumination.
              </p>
            </div>

            <div>
              <span className="text-xs font-mono tracking-[0.3em] text-core-red uppercase block mb-2 font-bold">
                02 / METHODOLOGY
              </span>
              <p className="text-sm font-sans text-core-muted leading-relaxed font-light">
                Biometric tracking, custom Eleiko resistance apparatus, and Olympic coaching directives.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Layered Editorial Image with Parallax & Mask Reveal */}
        <div className="lg:col-span-5 relative">
          <motion.div
            style={{ clipPath: clipProgress, y: imageY }}
            className="relative h-[480px] sm:h-[560px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          >
            <Image
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1400&auto=format&fit=crop"
              alt="CORE X FITNESS Atmosphere"
              fill
              className="object-cover filter grayscale contrast-125 hover:grayscale-0 transition-all duration-700 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-core-void via-transparent to-transparent opacity-80" />

            {/* Overlaid Minimal Badge */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-core-void/90 backdrop-blur-md border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-heading font-bold text-white uppercase tracking-widest block">
                  OLYMPIC DISTRICT
                </span>
                <span className="text-[10px] font-mono text-core-muted tracking-wider uppercase">
                  ESTABLISHED 2026
                </span>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-core-red animate-ping" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
