'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthModal } from '@/context/AuthModalContext';
import { useUser } from '@clerk/nextjs';
import { Check, ArrowRight, Sparkles, ShieldCheck, X } from 'lucide-react';

interface PricingTier {
  id: string;
  name: string;
  badge: string;
  oldPrice: string;
  price: string;
  period: string;
  description: string;
  ctaText: string;
  highlighted: boolean;
  features: string[];
}

const tiers: PricingTier[] = [
  {
    id: 'core',
    name: 'CORE',
    badge: 'FOUNDATION TIER',
    oldPrice: '₹2,999',
    price: '₹1,999',
    period: '/ MONTH',
    description: 'Essential Olympic strength & conditioning platform access.',
    ctaText: 'Select Core Access',
    highlighted: false,
    features: [
      'Full 18,500 sq ft main strength floor access',
      'Eleiko Olympic platforms & Prime machined racks',
      'Executive locker suites with Malin+Goetz',
      'Dedicated towel service & ionized hydration',
    ],
  },
  {
    id: 'performance',
    name: 'PERFORMANCE',
    badge: 'ATHLETIC STANDARD',
    oldPrice: '₹4,999',
    price: '₹3,499',
    period: '/ MONTH',
    description: 'Full athletic performance, biometric recovery & coaching telemetry.',
    ctaText: 'Claim Performance Pass',
    highlighted: true,
    features: [
      'All Core Access privileges included',
      'Unlimited Cryotherapy (-140°C) & Infrared Sauna',
      'Hyperbaric Oxygen Chamber sessions (4x/mo)',
      'Monthly InBody 770 Biometric Analysis',
      'Bi-weekly 1-on-1 Master Coach Check-ins',
    ],
  },
  {
    id: 'elite',
    name: 'ELITE',
    badge: 'PRIVATE CONCIERGE',
    oldPrice: '₹8,999',
    price: '₹5,999',
    period: '/ MONTH',
    description: 'Strictly limited to 75 members with dedicated coach & valet.',
    ctaText: 'Apply For Elite Tier',
    highlighted: false,
    features: [
      '24/7 Biometric Keycard Access (365 days)',
      'Private training pod reserved upon arrival',
      'Dedicated Master Coach with weekly programming',
      'Unlimited Recovery Suite & Magnesium Cold Plunge',
      'Complimentary valet parking & laundry service',
    ],
  },
];

export function PlansPricingCards() {
  const { openModal } = useAuthModal();
  const { isSignedIn, user } = useUser();
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
  });
  const [bookingError, setBookingError] = useState('');

  const handleCtaClick = (tier: PricingTier) => {
    setSelectedTier(tier);
    setIsSubmitted(false);
    setBookingError('');
    if (isSignedIn && user) {
      setBookingForm({
        name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Athlete Member',
        email: user.primaryEmailAddress?.emailAddress || '',
        phone: user.primaryPhoneNumber?.phoneNumber || '',
        preferredDate: new Date().toISOString().split('T')[0],
      });
    } else {
      setBookingForm({
        name: '',
        email: '',
        phone: '',
        preferredDate: new Date().toISOString().split('T')[0],
      });
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTier) return;
    if (!bookingForm.name.trim() || !bookingForm.email.trim()) {
      setBookingError('Name and email are required.');
      return;
    }

    setIsSubmitting(true);
    setBookingError('');

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: bookingForm.name.trim(),
          email: bookingForm.email.trim(),
          phone: bookingForm.phone.trim(),
          planName: selectedTier.name,
          planPrice: selectedTier.price,
          planPeriod: selectedTier.period,
          bookingType: 'MEMBERSHIP_ALLOCATION',
          preferredDate: bookingForm.preferredDate || new Date().toISOString(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit membership allocation.');
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setBookingError(err.message || 'Submission error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="pricing-matrix" className="relative py-12 sm:py-20 bg-core-void px-4 sm:px-6 lg:px-8">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-96 bg-core-red/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* 3 Reference-Inspired Animated Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {tiers.map((tier, index) => {
            // Animated entrance: left from left, middle from bottom/front, right from right
            const entranceVariants = {
              hidden: {
                opacity: 0,
                x: index === 0 ? -45 : index === 2 ? 45 : 0,
                y: index === 1 ? 50 : 25,
                scale: index === 1 ? 0.94 : 0.97,
              },
              visible: {
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
                transition: {
                  duration: 1.1,
                  delay: index * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                },
              },
            };

            const isThirdOnTablet = index === 2;

            return (
              <motion.div
                key={tier.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={entranceVariants}
                whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
                className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-500 backdrop-blur-xl ${
                  isThirdOnTablet ? 'md:col-span-2 lg:col-span-1 md:max-w-md md:mx-auto md:w-full lg:max-w-none' : ''
                } ${
                  tier.highlighted
                    ? 'bg-gradient-to-b from-[#170E10] via-core-dark to-[#0C0E12] border-2 border-core-red shadow-[0_20px_50px_rgba(255,42,42,0.18)] lg:-translate-y-2'
                    : 'bg-core-dark/90 border border-white/10 hover:border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
                }`}
              >
                {/* Popular Pill Marker for Middle Plan */}
                {tier.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-red-gradient text-[10px] font-mono tracking-[0.25em] text-white uppercase font-bold shadow-glow-red">
                      <Sparkles className="w-3 h-3 text-white" />
                      MOST SOUGHT AFTER
                    </span>
                  </div>
                )}

                {/* Top Section matching reference layout */}
                <div
                  className={`rounded-2xl p-6 sm:p-7 mb-8 transition-all ${
                    tier.highlighted
                      ? 'bg-gradient-to-br from-[#260E12]/90 to-[#12151B]/95 border border-core-red/30'
                      : 'bg-white/[0.04] border border-white/5'
                  }`}
                >
                  {/* Top Pill Tag */}
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className={`inline-block px-3.5 py-1 rounded-full text-[11px] font-mono tracking-[0.2em] uppercase font-bold ${
                        tier.highlighted
                          ? 'bg-core-red/20 text-core-red border border-core-red/40'
                          : 'bg-white/10 text-white/80 border border-white/10'
                      }`}
                    >
                      {tier.badge}
                    </span>
                    <span className="text-[10px] font-mono text-core-muted tracking-widest uppercase">
                      {tier.name}
                    </span>
                  </div>

                  {/* Price: Old Price crossed out + Current Price highlighted */}
                  <div className="mb-4">
                    {/* Old Price with Strikethrough */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm sm:text-base line-through text-slate-400/80 tracking-wider">
                        {tier.oldPrice}
                      </span>
                      <span
                        className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full font-bold ${
                          tier.highlighted
                            ? 'bg-core-red/20 text-core-red border border-core-red/40'
                            : 'bg-white/10 text-white/80 border border-white/10'
                        }`}
                      >
                        SAVE {Math.round((1 - parseInt(tier.price.replace(/[^\d]/g, '')) / parseInt(tier.oldPrice.replace(/[^\d]/g, ''))) * 100)}%
                      </span>
                    </div>

                    {/* Current Price Prominently Highlighted */}
                    <div className="flex items-baseline gap-2">
                      <span className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight">
                        {tier.price}
                      </span>
                      <span className="text-xs sm:text-sm font-mono text-core-muted font-normal uppercase tracking-wider">
                        {tier.period}
                      </span>
                    </div>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs sm:text-sm font-sans text-core-muted font-light leading-relaxed mb-6 min-h-[38px]">
                    {tier.description}
                  </p>

                  {/* Action Button directly under description (Reference Structure) */}
                  <button
                    onClick={() => handleCtaClick(tier)}
                    className={`w-full py-3.5 px-5 rounded-xl font-heading text-xs sm:text-sm uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                      tier.highlighted
                        ? 'bg-red-gradient text-white shadow-glow-red hover:shadow-[0_0_35px_rgba(255,42,42,0.6)] hover:brightness-110'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span>{tier.ctaText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>

                {/* Key Benefits Checklist */}
                <div className="space-y-3.5 pt-2 pb-4">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-core-muted block font-bold mb-4">
                    INCLUDED IN {tier.name}:
                  </span>
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <div
                        className={`flex-none w-4 h-4 rounded-full flex items-center justify-center mt-0.5 ${
                          tier.highlighted
                            ? 'bg-core-red/20 text-core-red'
                            : 'bg-white/10 text-slate-300'
                        }`}
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className="text-xs sm:text-[13px] font-sans text-slate-300 font-light leading-snug">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom Guarantee Marker */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-core-muted uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className={`w-3.5 h-3.5 ${tier.highlighted ? 'text-core-red' : 'text-slate-400'}`} />
                    <span>Cancel Anytime</span>
                  </div>
                  <span>Kolkata Club</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Promotional Offer Card Banner (Compact, Responsive, Preserving Aspect Ratio) */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 sm:mt-14 flex flex-col items-center justify-center"
        >
          <div
            onClick={() => handleCtaClick(tiers[1])}
            className="group relative w-full max-w-lg sm:max-w-xl lg:max-w-2xl rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 hover:border-core-red/50 shadow-[0_20px_50px_rgba(0,0,0,0.85)] hover:shadow-[0_20px_50px_rgba(255,42,42,0.2)] transition-all duration-500 cursor-pointer bg-core-dark/80 backdrop-blur-xl"
          >
            <Image
              src="/plans-offer-banner.png"
              alt="Core X Fitness Exclusive Membership Offer - Get Up To 20% Off"
              width={996}
              height={300}
              className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.02]"
              priority
            />
          </div>

          <span className="mt-3 text-[10px] font-mono tracking-widest text-core-muted uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-core-red animate-pulse" />
            LIMITED TIME ATHLETIC ADMISSIONS DISCOUNT
          </span>
        </motion.div>
      </div>

      {/* Interactive Reservation Modal for Visitors & Members */}
      <AnimatePresence>
        {selectedTier && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-core-dark border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_50px_rgba(255,42,42,0.2)] text-left space-y-5"
            >
              <button
                onClick={() => setSelectedTier(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/5 text-core-muted hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>

              {!isSubmitted ? (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-core-red/10 border border-core-red/30 text-[10px] font-mono tracking-[0.2em] text-core-red uppercase font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-core-red animate-pulse" />
                      MEMBERSHIP ALLOCATION
                    </div>
                    <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight">
                      APPLY FOR {selectedTier.name} TIER
                    </h3>
                    <p className="text-xs font-sans text-core-muted font-light">
                      {selectedTier.price} {selectedTier.period} • {selectedTier.description}
                    </p>
                  </div>

                  {bookingError && (
                    <div className="p-3 rounded-xl bg-core-red/10 border border-core-red/30 text-xs font-mono text-core-red">
                      {bookingError}
                    </div>
                  )}

                  <div className="space-y-3 text-xs font-sans">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingForm.name}
                        onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                        placeholder="e.g. Vikram Sengupta"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 text-xs focus:outline-none focus:border-core-red"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={bookingForm.email}
                          onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                          placeholder="e.g. athlete@domain.com"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 text-xs focus:outline-none focus:border-core-red"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={bookingForm.phone}
                          onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                          placeholder="e.g. +91 98300 00000"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30 text-xs focus:outline-none focus:border-core-red"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                        Preferred Walkthrough / Start Date
                      </label>
                      <input
                        type="date"
                        value={bookingForm.preferredDate}
                        onChange={(e) => setBookingForm({ ...bookingForm, preferredDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-core-red"
                      />
                    </div>
                  </div>

                  <div className="pt-2 space-y-2.5">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl bg-red-gradient text-white font-heading font-bold uppercase tracking-widest text-xs shadow-glow-red hover:brightness-110 transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? 'Transmitting Allocation...' : `Confirm ${selectedTier.name} Allocation`}
                    </button>

                    {!isSignedIn && (
                      <p className="text-center text-[11px] font-mono text-core-muted">
                        Already have a member profile?{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTier(null);
                            openModal('signIn');
                          }}
                          className="text-white underline hover:text-core-red transition-colors"
                        >
                          Sign In with Clerk
                        </button>
                      </p>
                    )}
                  </div>
                </form>
              ) : (
                <div className="text-center space-y-5 py-2">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-core-red/10 border border-core-red/30 flex items-center justify-center shadow-glow-red">
                    <Sparkles className="w-7 h-7 text-core-red" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-core-red font-bold block">
                      ALLOCATION RECORDED
                    </span>
                    <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight">
                      {selectedTier.name} TIER RESERVED
                    </h3>
                    <p className="text-xs font-sans text-core-muted font-light leading-relaxed">
                      Thank you, <span className="text-white font-semibold">{bookingForm.name}</span>. Your reservation for the {selectedTier.name} membership standard has been logged directly in the Admissions database.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-left text-xs font-mono space-y-1.5 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-core-muted">APPLICANT EMAIL:</span>
                      <span className="text-white">{bookingForm.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-core-muted">FACILITY:</span>
                      <span className="text-white">Core X Kolkata Sanctuary</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-core-muted">RESPONSE PROTOCOL:</span>
                      <span className="text-core-red">&lt; 2 Hours (Admissions Board)</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedTier(null)}
                    className="w-full py-3.5 rounded-xl bg-red-gradient text-white font-heading font-bold uppercase tracking-widest text-xs shadow-glow-red hover:brightness-110 transition-all"
                  >
                    Return to Plans
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
