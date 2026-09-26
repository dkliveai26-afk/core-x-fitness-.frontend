'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Orbit, Sparkles } from 'lucide-react';
import { galleryOrbitItems } from '@/data/gallery';

export function GalleryOrbit3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const totalCards = galleryOrbitItems.length;

  const [rotationAngle, setRotationAngle] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(1200);
  const [frontCardIndex, setFrontCardIndex] = useState(0);

  // Responsive Ellipse Radii detection
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track scroll progress across this section for subtle camera depth modulation
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Subtle 3D camera tilt responsive to scroll
  const cameraRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [10, 5, 0]);
  const groundRingRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [78, 74, 70]);

  // Continuous, butter-smooth RAF animation loop with delta time normalization
  // No mouse dependency, no hover stops, seamless infinite 3D loop
  useEffect(() => {
    let active = true;
    let lastTime = performance.now();
    let currentAngle = 0;

    // Slow, majestic speed: ~34 seconds per full revolution
    // Moves: RIGHT -> FRONT -> LEFT -> BACK -> RIGHT -> FRONT
    const baseSpeed = 0.0024;

    const tick = (now: number) => {
      if (!active) return;
      const delta = Math.min(now - lastTime, 40); // Cap frame delta to prevent frame jumps
      lastTime = now;

      // Mathematically continuous increment
      currentAngle += baseSpeed * (delta / 16.67);
      setRotationAngle(currentAngle);

      // Determine which card is currently closest to the front (cos(angle) closest to +1)
      const cardAngleStep = (Math.PI * 2) / totalCards;
      let highestZ = -999;
      let closestIdx = 0;

      for (let i = 0; i < totalCards; i++) {
        // Base angle for each card
        const cardAngle = (i * cardAngleStep) - currentAngle;
        const zValue = Math.cos(cardAngle);
        if (zValue > highestZ) {
          highestZ = zValue;
          closestIdx = i;
        }
      }
      setFrontCardIndex(closestIdx);

      requestAnimationFrame(tick);
    };

    const rafId = requestAnimationFrame(tick);

    return () => {
      active = false;
      cancelAnimationFrame(rafId);
    };
  }, [totalCards]);

  // Responsive 3D Ellipse Radii:
  // Mobile: tight compact orbit; Tablet: medium; Desktop: dramatic wide spatial orbit
  const radiusX = viewportWidth < 420 ? 135 : viewportWidth < 640 ? 180 : viewportWidth < 1024 ? 300 : 460;
  const radiusZ = viewportWidth < 420 ? 100 : viewportWidth < 640 ? 135 : viewportWidth < 1024 ? 210 : 310;

  return (
    <section
      id="gallery-3d-orbit"
      ref={containerRef}
      className="relative min-h-screen w-full bg-core-void py-16 sm:py-24 lg:py-32 overflow-hidden select-none flex flex-col justify-between"
    >
      {/* Background Volumetric Core Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[550px] bg-gradient-radial from-core-red/15 via-core-crimson/5 to-transparent rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Subtle Grid Ambient Texture */}
      <div className="absolute inset-0 bg-grid-white/[0.015] bg-[size:40px_40px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section Header with Left-to-Right Masked Entrance */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-12 sm:pb-16 border-b border-white/5">
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-core-red/10 border border-core-red/30 text-[11px] font-mono tracking-[0.35em] text-core-red uppercase font-bold"
            >
              <Orbit className="w-3.5 h-3.5 text-core-red animate-spin" style={{ animationDuration: '14s' }} />
              03 // 3D ORBITAL TRAJECTORY
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, x: -35 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display font-black text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-white leading-none"
            >
              SPATIAL <span className="text-core-red">KINETICS.</span>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs font-mono text-core-muted tracking-[0.25em] uppercase max-w-sm sm:text-right font-light"
          >
            CONTINUOUS 3D CURVED TRACK TRAVERSING DEPTH, LIGHT, AND PERSPECTIVE.
          </motion.p>
        </div>
      </div>

      {/* 3D Perspective Stage Container */}
      <motion.div
        style={{ rotateX: cameraRotateX }}
        className="relative w-full h-[420px] sm:h-[520px] lg:h-[620px] my-4 sm:my-6 flex items-center justify-center pointer-events-none will-change-transform"
      >
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{
            perspective: '1400px',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Subtle Ground Orbit Ellipse Ring */}
          <motion.div
            style={{
              width: `${radiusX * 2.1}px`,
              height: `${radiusZ * 1.6}px`,
              rotateX: groundRingRotateX,
              transform: 'translateZ(-70px)',
              boxShadow: '0 0 70px rgba(255, 42, 42, 0.08), inset 0 0 50px rgba(255, 42, 42, 0.04)',
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-core-red/15 pointer-events-none"
          />

          {/* Continuous Orbiting Cards */}
          {galleryOrbitItems.map((card, index) => {
            const cardBaseAngle = (index * (Math.PI * 2)) / totalCards;

            // Travel direction: RIGHT -> FRONT -> LEFT -> BACK -> RIGHT
            // With negative increment, angle progresses from right (+X) to front (+Z) to left (-X) to back (-Z)
            const angle = cardBaseAngle - rotationAngle;

            // Elliptical coordinate formulas
            const x = Math.sin(angle) * radiusX;
            const z = Math.cos(angle) * radiusZ;

            const cosAngle = Math.cos(angle);
            const sinAngle = Math.sin(angle);

            // Normalized depth from 0.0 (deepest back) to 1.0 (closest front)
            const depthNorm = (cosAngle + 1) / 2;

            // Dynamic 3D Scale: 1.1x at front, 0.62x at back
            const scale = 0.62 + depthNorm * 0.46;

            // Dynamic Opacity: 1.0 at front, 0.35 at back
            const opacity = 0.35 + depthNorm * 0.65;

            // Strict Z-Index layering based on depth
            const zIndex = Math.round(depthNorm * 100);

            // Dynamic Y-axis rotation tangentially aligned with the orbital curve
            const rotateY = sinAngle * 26;

            // Optical Depth of field blur for background cards
            const blurAmount = Math.max(0, (1 - depthNorm) * 2.6);

            const isFront = index === frontCardIndex && depthNorm > 0.85;

            return (
              <div
                key={card.id}
                className="absolute pointer-events-auto select-none"
                style={{
                  width: 'clamp(200px, 22vw, 320px)',
                  height: 'clamp(290px, 44vh, 440px)',
                  transform: `translate3d(${x}px, 0px, ${z}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  filter: `blur(${blurAmount}px)`,
                  willChange: 'transform, opacity',
                }}
              >
                {/* Physical 3D Card Body */}
                <div
                  className={`relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-core-dark border transition-all duration-500 ${
                    isFront
                      ? 'border-core-red/60 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_40px_rgba(255,42,42,0.35)]'
                      : 'border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.7)]'
                  }`}
                >
                  {/* High Quality Fitness Image */}
                  <img
                    src={card.image}
                    alt={card.theme}
                    className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none filter brightness-90 contrast-110"
                    loading="lazy"
                  />

                  {/* Contrast Vignette Mask */}
                  <div className="absolute inset-0 bg-gradient-to-t from-core-void via-core-void/45 to-transparent pointer-events-none" />

                  {/* Top Minimal Badge Cluster */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span
                      className={`text-[10px] font-mono tracking-[0.25em] px-2.5 py-1 rounded-full uppercase font-bold backdrop-blur-md border ${
                        isFront
                          ? 'bg-core-red/25 text-white border-core-red/50 shadow-glow-red'
                          : 'bg-black/60 text-white/70 border-white/10'
                      }`}
                    >
                      {card.badge}
                    </span>

                    <span className="text-[11px] font-mono text-white/40 tracking-wider">
                      {card.index}
                    </span>
                  </div>

                  {/* Bottom Minimalist Label */}
                  <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 z-10 flex flex-col justify-end">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isFront ? 'bg-core-red shadow-glow-red' : 'bg-white/30'}`} />
                      <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/70 font-semibold">
                        CORE ARCHIVE
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-display font-black uppercase tracking-tight text-white leading-tight drop-shadow-md">
                      {card.theme}
                    </h3>

                    <p className="mt-1 text-[11px] font-mono text-core-muted uppercase tracking-wider line-clamp-1">
                      {card.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Orbit Footer Telemetry Tracker */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-core-muted">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold tracking-widest uppercase">
            NOW PASSING FRONT:
          </span>
          <span className="text-core-red font-semibold uppercase tracking-wider">
            {galleryOrbitItems[frontCardIndex]?.theme}
          </span>
          <span className="text-white/20 hidden md:inline">•</span>
          <span className="text-core-muted tracking-wider uppercase hidden md:inline">
            {galleryOrbitItems[frontCardIndex]?.subtitle}
          </span>
        </div>

        {/* Dynamic Pagination Pill Tracker */}
        <div className="flex items-center gap-2">
          {galleryOrbitItems.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === frontCardIndex
                  ? 'w-7 bg-core-red shadow-glow-red'
                  : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
