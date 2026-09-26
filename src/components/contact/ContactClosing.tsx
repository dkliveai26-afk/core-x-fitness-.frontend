'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { ArrowRight, Sparkles, MapPin } from 'lucide-react';

export function ContactClosing() {
  return (
    <section className="relative w-full py-28 sm:py-36 bg-core-void overflow-hidden border-t border-white/5 select-none">
      {/* Volumetric Center Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-radial from-core-red/15 via-core-crimson/5 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
        {/* Minimal Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-core-red/15 border border-core-red/30 text-xs font-mono tracking-[0.3em] text-core-red uppercase font-bold backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-core-red" />
          ATHLETIC SANCTUARY
        </motion.div>

        {/* Short, Strong Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-5xl md:text-6xl font-display font-black uppercase tracking-tight text-white leading-tight"
        >
          THE BENCHMARK IS <span className="text-core-red">WAITING.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs sm:text-sm font-mono text-core-muted tracking-[0.25em] uppercase max-w-xl mx-auto leading-relaxed"
        >
          CALIBRATED SWEDISH STEEL. 18,500 SQ FT MONOLITH. ZERO WAIT TIMES.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
        >
          <Link href="/plans">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Explore Membership Tiers
            </Button>
          </Link>

          <Link href="/gallery">
            <Button
              variant="secondary"
              size="lg"
            >
              Tour Visual Gallery
            </Button>
          </Link>
        </motion.div>

        {/* Minimal Location Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, delay: 0.45 }}
          className="pt-6 flex items-center justify-center gap-2 text-xs font-mono text-core-muted tracking-widest uppercase"
        >
          <MapPin className="w-3.5 h-3.5 text-core-red" />
          <span>740 GRAND AVENUE // SALT LAKE SECTOR V, KOLKATA</span>
        </motion.div>
      </div>
    </section>
  );
}
