'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { ArrowRight, Flame, Shield, Trophy } from 'lucide-react';

export function FinalCTASection() {
  return (
    <section className="relative py-32 sm:py-44 bg-core-void border-t border-white/5 overflow-hidden">
      {/* Cinematic Center Crimson Flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-radial from-core-red/25 via-core-crimson/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Dark Grid Lines Overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center justify-center">
            <Badge variant="red" size="md" dot>
              BEGIN YOUR REVOLUTION
            </Badge>
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black uppercase tracking-tight text-white leading-[0.92]">
            THE THRESHOLD OF YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-core-red via-core-accent to-white drop-shadow-[0_0_40px_rgba(255,42,42,0.4)]">
              STRONGEST SELF.
            </span>
          </h2>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-sans leading-relaxed">
            Join a collective of relentless athletes, executives, and leaders. Step onto the platform and experience what true physical calibration feels like.
          </p>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Button
              variant="primary"
              size="xl"
              rightIcon={<ArrowRight className="w-5 h-5" />}
              onClick={() => {
                const target = document.querySelector('#memberships');
                target?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Claim Your Guest Pass
            </Button>

            <Button
              variant="secondary"
              size="xl"
              onClick={() => {
                const target = document.querySelector('#facility');
                target?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Schedule VIP Tour
            </Button>
          </div>

          {/* Reassurance Micro-Badges */}
          <div className="pt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-mono text-core-muted uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-core-red" />
              <span>Capped 850 Capacity</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-core-red" />
              <span>Zero Initiation Fee</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-core-red" />
              <span>Eleiko Certified IPF Facility</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
