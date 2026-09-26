'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, ArrowUpRight } from 'lucide-react';

export function ContactLocationMap() {
  return (
    <section className="relative w-full py-12 sm:py-16 bg-core-void select-none border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Clean Map Showcase Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-[320px] sm:h-[400px] rounded-3xl overflow-hidden bg-core-dark border border-white/10 group shadow-2xl"
        >
          {/* Dark Mode Map Graphic Background Texture */}
          <div className="absolute inset-0 bg-[#0B0E14] opacity-90">
            {/* Subtle Cartographic Grid Pattern */}
            <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:40px_40px]" />

            {/* Simulated Road Lines / Architectural Geometry */}
            <svg
              className="absolute inset-0 w-full h-full stroke-white/[0.06] fill-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="0" y1="25%" x2="100%" y2="45%" strokeWidth="2" />
              <line x1="0" y1="65%" x2="100%" y2="55%" strokeWidth="3" stroke="#FF2A2A" strokeOpacity="0.15" />
              <line x1="30%" y1="0" x2="45%" y2="100%" strokeWidth="2" />
              <line x1="68%" y1="0" x2="60%" y2="100%" strokeWidth="2.5" />
              <circle cx="50%" cy="50%" r="140" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="50%" cy="50%" r="220" strokeWidth="1" strokeDasharray="6 6" />
            </svg>
          </div>

          {/* Vignette Gradients for Smooth Inset */}
          <div className="absolute inset-0 bg-gradient-to-t from-core-void via-transparent to-core-void/60 pointer-events-none" />

          {/* Central Active Location Beacon */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-10">
            {/* Radar Pulse Rings */}
            <div className="relative flex items-center justify-center">
              <span className="absolute w-20 h-20 rounded-full bg-core-red/20 animate-ping" />
              <span className="absolute w-12 h-12 rounded-full bg-core-red/30 animate-pulse" />
              <div className="relative w-10 h-10 rounded-full bg-core-red shadow-glow-red flex items-center justify-center text-white border-2 border-white/80">
                <MapPin className="w-5 h-5" />
              </div>
            </div>

            {/* Floating Location Tag */}
            <div className="mt-3 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-core-red/50 shadow-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-core-red animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                CORE X // KOLKATA FLAGSHIP
              </span>
            </div>
          </div>

          {/* Top-Left Coordinate Badge */}
          <div className="absolute top-6 left-6 z-10 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-[10px] font-mono tracking-widest text-core-muted uppercase">
            <Navigation className="w-3.5 h-3.5 text-core-red" />
            <span>22.5804° N, 88.4378° E</span>
          </div>

          {/* Bottom Card: Location details & Action Button */}
          <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/10">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-core-red font-bold block">
                METROPOLIS CORRIDOR
              </span>
              <p className="text-sm font-sans font-bold text-white mt-0.5">
                740 Grand Avenue, Sector V, Salt Lake, Kolkata — 700091
              </p>
            </div>

            <a
              href="https://maps.google.com/?q=Salt+Lake+Sector+V+Kolkata"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-core-red hover:bg-[#E61E1E] text-white text-xs font-mono tracking-widest uppercase font-bold transition-all shadow-glow-red shrink-0"
            >
              <span>Get Directions</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
