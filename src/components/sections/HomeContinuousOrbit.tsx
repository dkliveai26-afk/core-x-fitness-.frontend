'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface OrbitCard {
  id: string;
  number: string;
  theme: string;
  subtitle: string;
  image: string;
  tag: string;
}

const HOME_ORBIT_CARDS: OrbitCard[] = [
  {
    id: 'strength',
    number: '01',
    theme: 'STRENGTH DISTRICT',
    subtitle: 'IPF Calibrated Steel & Swedish Iron',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    tag: 'CALIBRATED',
  },
  {
    id: 'biomechanics',
    number: '02',
    theme: 'BIOMECHANIC LAB',
    subtitle: 'Velocity Tracking & Force Profiling',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    tag: 'TELEMETRY',
  },
  {
    id: 'restoration',
    number: '03',
    theme: 'RESTORATION SUITE',
    subtitle: 'Sub-Zero Cryo & Infrared Saunas',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    tag: 'REGENERATION',
  },
  {
    id: 'platforms',
    number: '04',
    theme: 'COMPETITION PLATFORMS',
    subtitle: 'Monolithic Swedish Power Stations',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
    tag: 'ELEIKO RACKS',
  },
  {
    id: 'conditioning',
    number: '05',
    theme: 'METABOLIC ARENA',
    subtitle: 'High-Resistance Concept2 & Sprints',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80',
    tag: 'CONDITIONING',
  },
  {
    id: 'architecture',
    number: '06',
    theme: 'ARCHITECTURAL SANCTUARY',
    subtitle: 'Acoustic Dampening & Low-Lux Serenity',
    image: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&auto=format&fit=crop&q=80',
    tag: 'TITANIUM',
  },
];

export function HomeContinuousOrbit() {
  const totalCards = HOME_ORBIT_CARDS.length;
  const [rotationAngle, setRotationAngle] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(1200);

  // Track window resizing for responsive 3D ellipse radii
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Continuous, butter-smooth RAF animation loop with delta time normalization
  useEffect(() => {
    let active = true;
    let lastTime = performance.now();
    let currentAngle = 0;

    // Slow, cinematic velocity: ~32 seconds per full revolution
    const speed = 0.0028;

    const tick = (now: number) => {
      if (!active) return;
      const delta = Math.min(now - lastTime, 40); // Cap frame delta to prevent jumps
      lastTime = now;

      // Smooth mathematical increment — no jumps, seamless 2PI periodicity
      currentAngle += speed * (delta / 16.67);
      setRotationAngle(currentAngle);

      requestAnimationFrame(tick);
    };

    const rafId = requestAnimationFrame(tick);

    return () => {
      active = false;
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Responsive Ellipse Radii:
  const radiusX = viewportWidth < 380 ? 100 : viewportWidth < 480 ? 130 : viewportWidth < 640 ? 175 : viewportWidth < 1024 ? 290 : 440;
  const radiusZ = viewportWidth < 380 ? 75 : viewportWidth < 480 ? 95 : viewportWidth < 640 ? 130 : viewportWidth < 1024 ? 200 : 300;

  return (
    <div className="relative w-full py-8 sm:py-16 lg:py-24 overflow-hidden select-none">
      {/* Ambient Red Glow in Center of the 3D Orbit */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-radial from-core-red/15 via-core-crimson/5 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* 3D Perspective Stage */}
      <div
        className="relative w-full h-[360px] sm:h-[460px] lg:h-[540px] flex items-center justify-center pointer-events-none"
        style={{
          perspective: '1300px',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Subtle Ground Orbit Ellipse Ring */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-core-red/15 pointer-events-none"
          style={{
            width: `${radiusX * 2.1}px`,
            height: `${radiusZ * 1.6}px`,
            transform: 'rotateX(74deg) translateZ(-60px)',
            boxShadow: '0 0 60px rgba(255, 42, 42, 0.08), inset 0 0 40px rgba(255, 42, 42, 0.05)',
          }}
        />

        {/* Orbiting Cards System */}
        {HOME_ORBIT_CARDS.map((card, index) => {
          const cardBaseAngle = (index * (Math.PI * 2)) / totalCards;
          const angle = cardBaseAngle + rotationAngle;

          // 3D Elliptical coordinates
          const x = Math.sin(angle) * radiusX;
          const z = Math.cos(angle) * radiusZ;

          const cosAngle = Math.cos(angle);
          const sinAngle = Math.sin(angle);

          // Normalized depth: 1 at very front, 0 at very back
          const depthNorm = (cosAngle + 1) / 2;

          // Dynamic scale: 1.08 in front, 0.66 in back
          const scale = 0.66 + depthNorm * 0.42;

          // Dynamic opacity: 1 in front, 0.38 in back
          const opacity = 0.38 + depthNorm * 0.62;

          // Z-Index ordering (front card always stacks above back cards)
          const zIndex = Math.round(depthNorm * 100);

          // Rotate Y along the cylindrical curve
          const rotateY = -sinAngle * 26;

          // Subtle optical depth-of-field blur for background cards
          const blurAmount = Math.max(0, (1 - depthNorm) * 2.6);

          const isFront = depthNorm > 0.88;

          return (
            <div
              key={card.id}
              className="absolute pointer-events-auto"
              style={{
                width: 'clamp(170px, 22vw, 310px)',
                height: 'clamp(250px, 42vh, 420px)',
                transform: `translate3d(${x}px, 0px, ${z}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                zIndex,
                filter: `blur(${blurAmount}px)`,
                willChange: 'transform, opacity',
              }}
            >
              {/* Card Container */}
              <div
                className={`relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-core-dark border transition-all duration-500 ${
                  isFront
                    ? 'border-core-red/60 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(255,42,42,0.32)]'
                    : 'border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.7)]'
                }`}
              >
                {/* Visual Image */}
                <img
                  src={card.image}
                  alt={card.theme}
                  className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none filter brightness-90 contrast-110"
                />

                {/* Dark Vignette Overlay for Crisp Typography */}
                <div className="absolute inset-0 bg-gradient-to-t from-core-void via-core-void/45 to-transparent pointer-events-none" />

                {/* Top Minimal Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span
                    className={`text-[10px] font-mono tracking-[0.25em] px-2.5 py-1 rounded-full uppercase font-bold backdrop-blur-md border ${
                      isFront
                        ? 'bg-core-red/25 text-white border-core-red/50 shadow-glow-red'
                        : 'bg-black/60 text-white/70 border-white/10'
                    }`}
                  >
                    {card.tag}
                  </span>

                  <span className="text-[11px] font-mono text-white/40 tracking-wider">
                    {card.number}
                  </span>
                </div>

                {/* Bottom Minimal Label */}
                <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 z-10 flex flex-col justify-end">
                  <h3 className="text-base sm:text-lg md:text-xl font-display font-black uppercase tracking-tight text-white leading-tight drop-shadow-md">
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
    </div>
  );
}
