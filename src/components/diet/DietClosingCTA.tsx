'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';

export function DietClosingCTA() {
  return (
    <section className="relative w-full py-16 sm:py-24 bg-core-void select-none overflow-hidden border-t border-white/5">
      {/* Background Volumetric Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-gradient-radial from-core-red/18 via-transparent to-transparent rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Top Mini Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-core-red/10 border border-core-red/30 mb-5"
        >
          <Sparkles className="w-3 h-3 text-core-red" />
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-white font-bold">
            CONCIERGE SPORTS NUTRITION
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.05, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black text-2xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-white leading-tight mb-4"
        >
          Tailor Your Metabolic Protocol.
        </motion.h2>

        {/* Short Supporting Line */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.0, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs sm:text-sm font-sans text-core-muted font-light leading-relaxed max-w-lg mx-auto mb-9"
        >
          Consult directly with CORE X sports nutrition specialists to calibrate your individualized intake based on training volume and biometric targets.
        </motion.p>

        {/* Action Button & Security Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5"
        >
          <Link
            href="/contact"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-core-red hover:bg-[#E61E1E] text-white font-display font-black text-xs tracking-widest uppercase transition-all duration-300 shadow-[0_10px_30px_rgba(255,42,42,0.4)] hover:shadow-[0_15px_40px_rgba(255,42,42,0.6)] active:scale-[0.98] inline-flex items-center justify-center gap-2"
          >
            <span>BOOK NUTRITION ASSESSMENT</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          <Link
            href="/plans"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white font-display font-bold text-xs tracking-widest uppercase transition-colors"
          >
            VIEW MEMBERSHIP TIERS
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, delay: 0.48 }}
          className="pt-6 flex items-center justify-center gap-2 text-[10px] font-mono text-core-muted tracking-widest uppercase"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-core-red" />
          <span>INCLUDED FOR ALL BLACK CARD MEMBERS • PRIVATE CONSULT</span>
        </motion.div>

      </div>
    </section>
  );
}
