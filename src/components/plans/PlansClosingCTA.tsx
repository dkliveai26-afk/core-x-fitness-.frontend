'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuthModal } from '@/context/AuthModalContext';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/common/Button';
import { ArrowUpRight, Phone, ShieldCheck, Sparkles } from 'lucide-react';

export function PlansClosingCTA() {
  const { openModal } = useAuthModal();
  const { isSignedIn } = useUser();

  const handleAction = () => {
    if (!isSignedIn) {
      openModal('signUp');
    } else {
      const pricingSection = document.getElementById('pricing-matrix');
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative py-24 sm:py-32 bg-core-void overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-core-red/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="p-8 sm:p-14 rounded-3xl bg-core-dark border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_50px_rgba(255,42,42,0.15)] flex flex-col md:flex-row items-center justify-between gap-10"
        >
          {/* Left Text Column */}
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-core-red/10 border border-core-red/30 text-[10px] font-mono tracking-[0.25em] text-core-red uppercase font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-core-red animate-pulse" />
              QUARTERLY ALLOCATION OPEN
            </div>

            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white leading-tight">
              CLAIM YOUR <span className="text-core-red">STANDARD.</span>
            </h2>

            <p className="text-xs sm:text-sm font-sans text-core-muted font-light leading-relaxed">
              Memberships are strictly capped to preserve platform access, zero wait times, and high-fidelity coach guidance.
            </p>
          </div>

          {/* Right Action Column */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3.5 w-full md:w-auto">
            <Button
              variant="primary"
              size="lg"
              onClick={handleAction}
              rightIcon={<ArrowUpRight className="w-4 h-4" />}
              className="w-full justify-center"
            >
              {isSignedIn ? 'Select Plan' : 'Get Membership Access'}
            </Button>

            <a
              href="mailto:concierge@corexfitness.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-xs font-mono uppercase tracking-widest text-slate-300 hover:text-white transition-all text-center"
            >
              <Phone className="w-3.5 h-3.5 text-core-red" />
              <span>VIP Concierge Line</span>
            </a>
          </div>
        </motion.div>

        {/* Minimal Footer Assurance */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-[10px] font-mono text-core-muted uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-core-red" />
            <span>Eleiko Official Facility</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-core-red" />
            <span>Biometric Onboarding Included</span>
          </div>
          <div>Kolkata Flagship</div>
        </div>
      </div>
    </section>
  );
}
