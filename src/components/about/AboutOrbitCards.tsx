'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import { Sparkles, ChevronLeft, ChevronRight, Layers } from 'lucide-react';

interface OrbitCardData {
  id: string;
  theme: string;
  subtitle: string;
  description: string;
  image: string;
  badge: string;
}

const ORBIT_CARDS: OrbitCardData[] = [
  {
    id: 'strength',
    theme: 'STRENGTH',
    subtitle: 'IPF-Calibrated Iron & Competition Barbells',
    description: 'Eleiko calibrated steel, monolithic power racks, and precision Olympic platforms.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    badge: 'OLYMPIC GRADE',
  },
  {
    id: 'performance',
    theme: 'PERFORMANCE',
    subtitle: 'Kinematic Tracking & Velocity Profiling',
    description: 'Biomechanical motion capture and linear position transducers for peak athletic output.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    badge: 'SPORTS SCIENCE',
  },
  {
    id: 'training',
    theme: 'TRAINING',
    subtitle: 'Progressive Overload Protocols',
    description: 'Bespoke periodization engineered around neurological recovery and functional hypertrophy.',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80',
    badge: 'BIO-MECHANICS',
  },
  {
    id: 'recovery',
    theme: 'RECOVERY',
    subtitle: 'Sub-Zero Cryo & Infrared Contrast',
    description: 'Accelerated soft-tissue repair suites, infrared sauna pods, and cold immersion pools.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    badge: 'RESTORATION',
  },
  {
    id: 'facility',
    theme: 'FACILITY',
    subtitle: 'Monolithic Architectural Sanctuary',
    description: 'Engineered acoustic dampening, custom-filtered airflow, and moody low-lux ambient lighting.',
    image: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&auto=format&fit=crop&q=80',
    badge: 'KOLKATA FLAGSHIP',
  },
  {
    id: 'discipline',
    theme: 'DISCIPLINE',
    subtitle: 'Uncompromising Athletic Mentorship',
    description: 'CSCS-certified strength coaches maintaining elite culture and zero tolerance for mediocrity.',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
    badge: 'ELITE STANDARD',
  },
];

export function AboutOrbitCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const totalCards = ORBIT_CARDS.length;

  // Scroll Progress across 350vh track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth rotation state (driven by scroll + manual nudge)
  const [rotationAngle, setRotationAngle] = useState(0);
  const targetRotationRef = useRef(0);
  const currentRotationRef = useRef(0);
  const manualOffsetRef = useRef(0);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(1200);

  // Track window resizing for responsive 3D ellipse radii
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync scroll with smooth RAF lerp
  useEffect(() => {
    let active = true;

    // Total orbit turns across the 350vh scroll distance (approx 2.5 complete revolutions)
    const totalRotationSpan = Math.PI * 5;

    const unsubscribe = scrollYProgress.on('change', (progress) => {
      targetRotationRef.current = progress * totalRotationSpan + manualOffsetRef.current;
    });

    const tick = () => {
      if (!active) return;

      const diff = targetRotationRef.current - currentRotationRef.current;
      if (Math.abs(diff) > 0.0005) {
        currentRotationRef.current += diff * 0.085;
        setRotationAngle(currentRotationRef.current);

        // Determine which card is currently closest to front (angle near 0 mod 2PI)
        const normalized = ((currentRotationRef.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const cardAngleStep = (Math.PI * 2) / totalCards;
        let closestIndex = 0;
        let minAngleDist = 999;

        for (let i = 0; i < totalCards; i++) {
          const cardBase = i * cardAngleStep;
          let dist = Math.abs(((cardBase + normalized + Math.PI) % (Math.PI * 2)) - Math.PI);
          if (dist < minAngleDist) {
            minAngleDist = dist;
            closestIndex = i;
          }
        }
        setActiveCardIndex(closestIndex);
      }

      requestAnimationFrame(tick);
    };

    const rafId = requestAnimationFrame(tick);

    return () => {
      active = false;
      unsubscribe();
      cancelAnimationFrame(rafId);
    };
  }, [scrollYProgress, totalCards]);

  // Manual rotation nudge buttons
  const rotateOrbit = (direction: 'prev' | 'next') => {
    const step = (Math.PI * 2) / totalCards;
    manualOffsetRef.current += direction === 'next' ? -step : step;
    targetRotationRef.current += direction === 'next' ? -step : step;
  };

  // Responsive Ellipse Radii:
  // Mobile: tight radius; Tablet: medium; Desktop: wide dramatic orbit
  const radiusX = viewportWidth < 380 ? 105 : viewportWidth < 480 ? 135 : viewportWidth < 640 ? 180 : viewportWidth < 1024 ? 300 : 450;
  const radiusZ = viewportWidth < 380 ? 80 : viewportWidth < 480 ? 100 : viewportWidth < 640 ? 140 : viewportWidth < 1024 ? 220 : 320;

  return (
    <section
      id="orbit-cards"
      ref={containerRef}
      className="relative h-[380vh] w-full bg-core-void select-none"
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-6 sm:py-10 bg-core-void">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 bg-radial-vignette pointer-events-none z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-radial from-core-red/10 via-core-crimson/5 to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* Section Header with Section Index & Live Theme Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-core-red" />
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-white/90">
              SECTION 02 // 3D GYM ORBIT
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono tracking-widest text-core-muted uppercase backdrop-blur-md">
            <Layers className="w-3.5 h-3.5 text-core-red" />
            <span>CONTINUOUS 3D DEPTH CAROUSEL</span>
          </div>

          {/* Manual controls for immediate interactive feel */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => rotateOrbit('prev')}
              className="p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-core-red hover:border-core-red transition-all duration-200"
              aria-label="Previous Card"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => rotateOrbit('next')}
              className="p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-core-red hover:border-core-red transition-all duration-200"
              aria-label="Next Card"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Central 3D Orbit Stage */}
        <div
          className="relative flex-1 w-full flex items-center justify-center pointer-events-none"
          style={{
            perspective: '1300px',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Circular Ground Glow Indicator */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-core-red/10 pointer-events-none"
            style={{
              width: `${radiusX * 2}px`,
              height: `${radiusZ * 1.5}px`,
              transform: 'rotateX(72deg) translateZ(-80px)',
              boxShadow: '0 0 60px rgba(255, 42, 42, 0.08), inset 0 0 40px rgba(255, 42, 42, 0.04)',
            }}
          />

          {/* Orbiting Cards System */}
          {ORBIT_CARDS.map((card, index) => {
            const cardBaseAngle = (index * (Math.PI * 2)) / totalCards;
            // Effective angle for this card
            const angle = cardBaseAngle + rotationAngle;

            // Coordinates on 3D ellipse
            const x = Math.sin(angle) * radiusX;
            const z = Math.cos(angle) * radiusZ;

            // Frontness factor: 1 when in front (z = +radiusZ), -1 when in back (z = -radiusZ)
            const cosAngle = Math.cos(angle);
            const sinAngle = Math.sin(angle);

            // Normalized depth from 0 (back) to 1 (front)
            const depthNorm = (cosAngle + 1) / 2;

            // Dynamic scale: 1.08 in front, 0.64 in back
            const scale = 0.64 + depthNorm * 0.44;

            // Dynamic opacity: 1 in front, 0.32 in back
            const opacity = 0.32 + depthNorm * 0.68;

            // Z-Index ordering (highest in front)
            const zIndex = Math.round(depthNorm * 100);

            // Rotate Y to face tangentially along orbit curve
            const rotateY = -sinAngle * 28;

            // Subtle depth blur for cards in the background
            const blurAmount = Math.max(0, (1 - depthNorm) * 3);

            const isFrontCard = index === activeCardIndex;

            return (
              <div
                key={card.id}
                className="absolute pointer-events-auto transition-shadow duration-300"
                style={{
                  width: 'clamp(175px, 22vw, 330px)',
                  height: 'clamp(255px, 44vh, 460px)',
                  transform: `translate3d(${x}px, 0px, ${z}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  filter: `blur(${blurAmount}px)`,
                  willChange: 'transform, opacity',
                }}
              >
                {/* The Card Element */}
                <div
                  className={`relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-core-dark border transition-all duration-300 ${
                    isFrontCard
                      ? 'border-core-red/60 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(255,42,42,0.35)]'
                      : 'border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.7)] hover:border-white/25'
                  }`}
                >
                  {/* Card Background Gym Photo */}
                  <img
                    src={card.image}
                    alt={card.theme}
                    className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none filter brightness-90 contrast-105"
                  />

                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-core-void via-core-void/50 to-transparent pointer-events-none" />

                  {/* Top Badge on Card */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span
                      className={`text-[10px] font-mono tracking-[0.25em] px-2.5 py-1 rounded-full uppercase font-bold backdrop-blur-md border ${
                        isFrontCard
                          ? 'bg-core-red/20 text-white border-core-red/40'
                          : 'bg-black/50 text-white/70 border-white/10'
                      }`}
                    >
                      {card.badge}
                    </span>

                    {isFrontCard && (
                      <span className="w-2 h-2 rounded-full bg-core-red shadow-glow-red animate-pulse" />
                    )}
                  </div>

                  {/* Bottom Minimalist Label */}
                  <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 z-10 flex flex-col justify-end">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-display font-black uppercase tracking-tight text-white leading-none drop-shadow-md">
                      {card.theme}
                    </h3>
                    <p className="mt-2 text-xs font-mono text-core-muted uppercase tracking-wider line-clamp-2">
                      {card.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Orbit Navigation Footer / Status Indicator */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/5 text-xs font-mono text-core-muted">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold tracking-widest uppercase">
              {ORBIT_CARDS[activeCardIndex].theme}
            </span>
            <span className="text-white/30">•</span>
            <span className="text-core-muted tracking-wider uppercase hidden md:inline">
              {ORBIT_CARDS[activeCardIndex].description}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {ORBIT_CARDS.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === activeCardIndex
                    ? 'w-6 bg-core-red shadow-glow-red'
                    : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
