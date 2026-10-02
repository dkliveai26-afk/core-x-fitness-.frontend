'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { membershipPlans } from '@/data/memberships';
import { Check, Sparkles, ArrowRight, ShieldCheck, Crown } from 'lucide-react';

export function MembershipSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlanModal, setSelectedPlanModal] = useState<string | null>(null);

  return (
    <section id="memberships" className="relative py-28 sm:py-36 bg-core-dark border-t border-white/5 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-core-red/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto pb-12">
          <Badge variant="red" size="md" className="mb-4" dot>
            MEMBERSHIP TIERS // 05
          </Badge>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-white uppercase tracking-tight leading-[0.95]">
            INVEST IN UNCOMPROMISING <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-core-red via-core-accent to-white">
              PHYSICAL EXCELLENCE.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-core-muted mt-4 font-sans leading-relaxed">
            No initiation fees. No hidden lock-in contracts. Capped membership capacity to guarantee
            immediate access to all competition platforms and recovery chambers.
          </p>

          {/* Billing Toggle Capsule */}
          <div className="mt-8 inline-flex items-center justify-center gap-2 sm:gap-3 p-1.5 rounded-full bg-core-surface border border-white/10 shadow-inner-bevel max-w-full flex-wrap sm:flex-nowrap">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all duration-300 ${
                !isAnnual
                  ? 'bg-red-gradient text-white shadow-glow-red'
                  : 'text-core-muted hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 ${
                isAnnual
                  ? 'bg-red-gradient text-white shadow-glow-red'
                  : 'text-core-muted hover:text-white'
              }`}
            >
              <span>Annual Protocol</span>
              <span className="text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Membership Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 items-stretch">
          {membershipPlans.map((plan, idx) => {
            const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;
            const isPopular = plan.isPopular;
            const isBlack = plan.tier === 'Elite Black';

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className={`relative rounded-3xl p-5 sm:p-8 lg:p-10 flex flex-col justify-between transition-all duration-500 ${
                  isPopular
                    ? 'bg-core-surface border-2 border-core-red shadow-[0_0_50px_rgba(255,42,42,0.25)] lg:-translate-y-4'
                    : isBlack
                    ? 'bg-gradient-to-b from-core-dark via-core-void to-core-dark border border-white/20'
                    : 'bg-core-surface/60 border border-white/10 hover:border-white/25'
                }`}
              >
                {/* Popular Pill */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1 rounded-full bg-red-gradient text-white text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider sm:tracking-widest shadow-glow-red flex items-center gap-1.5 whitespace-nowrap max-w-[95%]">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">MOST SELECTED BY ATHLETES</span>
                  </div>
                )}

                {isBlack && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider sm:tracking-widest flex items-center gap-1.5 whitespace-nowrap max-w-[95%]">
                    <Crown className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">LIMITED TO 75 SLOTS</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-[0.2em] text-core-muted font-bold">
                      {plan.tier}
                    </span>
                    <ShieldCheck className={`w-5 h-5 ${isPopular ? 'text-core-red' : 'text-slate-400'}`} />
                  </div>

                  <h3 className="text-2xl font-display font-black text-white uppercase mt-2 tracking-wide">
                    {plan.name}
                  </h3>

                  <p className="text-xs font-sans text-core-muted mt-2 leading-relaxed min-h-[40px]">
                    {plan.description}
                  </p>

                  {/* Pricing Display */}
                  <div className="mt-6 pt-6 border-t border-white/10 flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-display font-black text-white">
                      ₹{price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-mono text-core-muted">
                      {plan.period}
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="mt-8 space-y-3.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-xs sm:text-sm font-sans text-slate-200">
                        <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${isPopular ? 'bg-core-red text-white' : 'bg-white/10 text-white'}`}>
                          <Check className="w-3 h-3" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-10 pt-6 border-t border-white/10">
                  <Button
                    variant={isPopular ? 'primary' : isBlack ? 'glow' : 'secondary'}
                    size="lg"
                    className="w-full"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    onClick={() => setSelectedPlanModal(plan.name)}
                  >
                    {plan.ctaText}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal */}
      {selectedPlanModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-core-void/90 backdrop-blur-2xl"
          onClick={() => setSelectedPlanModal(null)}
        >
          <div
            className="relative w-full max-w-md bg-core-dark rounded-3xl border border-white/20 p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9)] text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-gradient flex items-center justify-center shadow-glow-red mb-5">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>

            <span className="text-xs font-mono uppercase tracking-[0.25em] text-core-red font-bold">
              MEMBERSHIP CONCIERGE
            </span>

            <h3 className="text-2xl font-display font-black text-white uppercase mt-2">
              {selectedPlanModal}
            </h3>

            <p className="text-xs text-core-muted mt-3 font-sans leading-relaxed">
              Your priority reservation request has been initialized. A Core X Concierge will contact you within 2 business hours to schedule your biometric baseline and keycard issuing.
            </p>

            <div className="mt-8 space-y-3">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => setSelectedPlanModal(null)}
              >
                Confirm Priority Reservation
              </Button>
              <button
                onClick={() => setSelectedPlanModal(null)}
                className="text-xs font-mono text-core-muted hover:text-white uppercase tracking-wider"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
