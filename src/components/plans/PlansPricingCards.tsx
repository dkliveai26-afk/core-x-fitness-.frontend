'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthModal } from '@/context/AuthModalContext';
import { useUser, useAuth } from '@clerk/nextjs';
import { Check, ArrowRight, Sparkles, ShieldCheck, X, CheckCircle2 } from 'lucide-react';
import { playSuccessSound } from '@/lib/sound';
import { PlanItem, OfferBannerItem } from '@/types/database';
import { formatInrPrice, calculateDiscount, DEFAULT_PLANS } from '@/lib/plans-shared';
import { DEFAULT_OFFER_BANNER } from '@/lib/offer-banner-shared';

interface PlansPricingCardsProps {
  initialPlans?: PlanItem[];
  initialOfferBanner?: OfferBannerItem | null;
}

export function PlansPricingCards({
  initialPlans,
  initialOfferBanner,
}: PlansPricingCardsProps) {
  const { openModal } = useAuthModal();
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();

  const [plans, setPlans] = useState<PlanItem[]>(() => {
    if (initialPlans && initialPlans.length > 0) return initialPlans;
    return DEFAULT_PLANS.map((p, idx) => ({ ...p, _id: `default-${idx}` }));
  });

  const [offerBanner, setOfferBanner] = useState<OfferBannerItem | null>(() => {
    if (initialOfferBanner !== undefined) return initialOfferBanner;
    return { ...DEFAULT_OFFER_BANNER, _id: 'default-banner' };
  });

  const [selectedPlan, setSelectedPlan] = useState<PlanItem | null>(null);
  const [focusedPlanName, setFocusedPlanName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    marketingOptIn: true,
  });
  const [bookingError, setBookingError] = useState('');

  // Handle URL deep-links from email campaigns (e.g. /plans?plan=performance#pricing-matrix)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const planParam = urlParams.get('plan') || urlParams.get('targetPlan');
    const hash = window.location.hash.toLowerCase();

    let targetPlanKey = planParam ? planParam.toLowerCase().trim() : null;
    if (!targetPlanKey && hash.startsWith('#plan-')) {
      targetPlanKey = hash.replace('#plan-', '').trim();
    }

    if (targetPlanKey) {
      setFocusedPlanName(targetPlanKey);

      // Smooth scroll to the specific plan card with offset
      const timer = setTimeout(() => {
        const targetElement =
          document.getElementById(`plan-${targetPlanKey}`) ||
          document.getElementById('pricing-matrix');

        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);

      // Auto-clear highlight after 6 seconds
      const clearTimer = setTimeout(() => {
        setFocusedPlanName(null);
      }, 6000);

      return () => {
        clearTimeout(timer);
        clearTimeout(clearTimer);
      };
    }
  }, [plans]);

  // Client-side fallback synchronization only if initial props were not passed
  useEffect(() => {
    if (!initialPlans || initialPlans.length === 0) {
      fetch('/api/plans')
        .then((res) => res.json())
        .then((data) => {
          if (data.plans && data.plans.length > 0) {
            setPlans(data.plans);
          }
        })
        .catch((err) => console.warn('Plans fetch notice:', err));
    }

    if (initialOfferBanner === undefined) {
      fetch('/api/offer-banner')
        .then((res) => res.json())
        .then((data) => {
          if (data.banner !== undefined) {
            setOfferBanner(data.banner);
          }
        })
        .catch((err) => console.warn('Offer banner fetch notice:', err));
    }
  }, [initialPlans, initialOfferBanner]);

  const handleCtaClick = (plan: PlanItem) => {
    setSelectedPlan(plan);
    setIsSubmitted(false);
    setBookingError('');
    if (isSignedIn && user) {
      setBookingForm({
        name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Athlete Member',
        email: user.primaryEmailAddress?.emailAddress || '',
        phone: user.primaryPhoneNumber?.phoneNumber || '',
        preferredDate: new Date().toISOString().split('T')[0],
        marketingOptIn: true,
      });
    } else {
      setBookingForm({
        name: '',
        email: '',
        phone: '',
        preferredDate: new Date().toISOString().split('T')[0],
        marketingOptIn: true,
      });
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    if (!bookingForm.name.trim() || !bookingForm.email.trim()) {
      setBookingError('Name and email are required.');
      return;
    }

    setIsSubmitting(true);
    setBookingError('');

    try {
      let token: string | null = null;
      try {
        token = await getToken();
      } catch (tokenErr) {
        console.warn('Notice: getToken in PlansPricingCards:', tokenErr);
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers,
        credentials: 'same-origin',
        body: JSON.stringify({
          customerName: bookingForm.name.trim(),
          email: bookingForm.email.trim(),
          phone: bookingForm.phone.trim(),
          planName: selectedPlan.name,
          planPrice: formatInrPrice(selectedPlan.price),
          planPeriod: selectedPlan.duration,
          bookingType: 'MEMBERSHIP_ALLOCATION',
          preferredDate: bookingForm.preferredDate || new Date().toISOString(),
          marketingOptIn: Boolean(bookingForm.marketingOptIn),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit membership allocation.');
      }

      // Play subtle success chime only after confirmed save
      playSuccessSound();
      setIsSubmitted(true);
    } catch (err: any) {
      setBookingError(err.message || 'Submission error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const featuredPlan = plans.find((p) => p.highlighted) || plans[1] || plans[0];

  return (
    <section id="pricing-matrix" className="relative py-12 sm:py-20 bg-core-void px-4 sm:px-6 lg:px-8">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-96 bg-core-red/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Dynamic Reference-Inspired Animated Cards */}
        <div className={`grid grid-cols-1 ${plans.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6 lg:gap-8 items-stretch`}>
          {plans.map((plan, index) => {
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

            const isThirdOnTablet = index === 2 && plans.length === 3;
            const discountText = plan.discount || calculateDiscount(plan.originalPrice, plan.price);
            const planSlug = plan.name.toLowerCase().replace(/\s+/g, '-');
            const isCardFocused =
              focusedPlanName &&
              (focusedPlanName === planSlug ||
                focusedPlanName === plan.name.toLowerCase() ||
                focusedPlanName === plan._id);

            return (
              <motion.div
                key={plan._id || plan.name}
                id={`plan-${planSlug}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={entranceVariants}
                whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
                className={`relative rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 flex flex-col justify-between transition-all duration-500 backdrop-blur-xl ${
                  isThirdOnTablet ? 'md:col-span-2 lg:col-span-1 md:max-w-md md:mx-auto md:w-full lg:max-w-none' : ''
                } ${
                  isCardFocused
                    ? 'ring-4 ring-core-red bg-gradient-to-b from-[#260E12] via-core-dark to-[#0C0E12] shadow-[0_0_60px_rgba(255,42,42,0.45)] scale-[1.02] -translate-y-3 z-30'
                    : plan.highlighted
                    ? 'bg-gradient-to-b from-[#170E10] via-core-dark to-[#0C0E12] border-2 border-core-red shadow-[0_20px_50px_rgba(255,42,42,0.18)] lg:-translate-y-2'
                    : 'bg-core-dark/90 border border-white/10 hover:border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
                }`}
              >
                {/* Popular Pill Marker or Campaign Highlight Marker */}
                {isCardFocused ? (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                    <span className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1 rounded-full bg-red-gradient text-[9px] sm:text-[10px] font-mono tracking-[0.2em] text-white uppercase font-bold shadow-glow-red animate-pulse whitespace-nowrap">
                      <Sparkles className="w-3 h-3 text-white" />
                      SELECTED CAMPAIGN OFFER
                    </span>
                  </div>
                ) : plan.highlighted ? (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                    <span className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-0.5 sm:py-1 rounded-full bg-red-gradient text-[9px] sm:text-[10px] font-mono tracking-[0.2em] sm:tracking-[0.25em] text-white uppercase font-bold shadow-glow-red whitespace-nowrap">
                      <Sparkles className="w-3 h-3 text-white" />
                      MOST SOUGHT AFTER
                    </span>
                  </div>
                ) : null}

                {/* Top Section matching reference layout */}
                <div
                  className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-7 mb-4 sm:mb-6 lg:mb-8 transition-all ${
                    plan.highlighted
                      ? 'bg-gradient-to-br from-[#260E12]/90 to-[#12151B]/95 border border-core-red/30'
                      : 'bg-white/[0.04] border border-white/5'
                  }`}
                >
                  {/* Top Pill Tag */}
                  <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-5">
                    <span
                      className={`inline-block px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-mono tracking-[0.18em] sm:tracking-[0.2em] uppercase font-bold ${
                        plan.highlighted
                          ? 'bg-core-red/20 text-core-red border border-core-red/40'
                          : 'bg-white/10 text-white/80 border border-white/10'
                      }`}
                    >
                      {plan.badge}
                    </span>
                    <span className="text-[10px] font-mono text-core-muted tracking-widest uppercase">
                      {plan.name}
                    </span>
                  </div>

                  {/* Price: Old Price crossed out + Current Price highlighted */}
                  <div className="mb-2 sm:mb-3 lg:mb-4">
                    {/* Old Price with Strikethrough & Discount */}
                    <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                      {plan.originalPrice > 0 && (
                        <span className="font-mono text-xs sm:text-sm lg:text-base line-through text-slate-400/80 tracking-wider">
                          {formatInrPrice(plan.originalPrice)}
                        </span>
                      )}
                      {discountText && (
                        <span
                          className={`text-[9px] sm:text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full font-bold ${
                            plan.highlighted
                              ? 'bg-core-red/20 text-core-red border border-core-red/40'
                              : 'bg-white/10 text-white/80 border border-white/10'
                          }`}
                        >
                          {discountText}
                        </span>
                      )}
                    </div>

                    {/* Current Price Prominently Highlighted */}
                    <div className="flex items-baseline gap-1.5 sm:gap-2">
                      <span className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
                        {formatInrPrice(plan.price)}
                      </span>
                      <span className="text-[11px] sm:text-xs lg:text-sm font-mono text-core-muted font-normal uppercase tracking-wider">
                        {plan.duration}
                      </span>
                    </div>
                  </div>

                  {/* Short Description */}
                  <p className="text-xs sm:text-sm font-sans text-core-muted font-light leading-relaxed mb-4 sm:mb-5 lg:mb-6 min-h-0 sm:min-h-[38px]">
                    {plan.shortDescription}
                  </p>

                  {/* Action Button directly under description */}
                  <button
                    onClick={() => handleCtaClick(plan)}
                    className={`w-full py-2.5 sm:py-3.5 px-4 sm:px-5 rounded-xl font-heading text-xs sm:text-sm uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                      plan.highlighted
                        ? 'bg-red-gradient text-white shadow-glow-red hover:shadow-[0_0_35px_rgba(255,42,42,0.6)] hover:brightness-110'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span>{plan.ctaText || `Select ${plan.name}`}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>

                {/* Key Benefits Checklist */}
                <div className="space-y-2 sm:space-y-3 pt-1 pb-2 sm:pb-4">
                  <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] sm:tracking-[0.25em] text-core-muted block font-bold mb-2 sm:mb-3 lg:mb-4">
                    INCLUDED IN {plan.name}:
                  </span>
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 sm:gap-3">
                      <div
                        className={`flex-none w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center mt-0.5 ${
                          plan.highlighted
                            ? 'bg-core-red/20 text-core-red'
                            : 'bg-white/10 text-slate-300'
                        }`}
                      >
                        <Check className="w-2 sm:w-2.5 h-2 sm:h-2.5 stroke-[3]" />
                      </div>
                      <span className="text-[11px] sm:text-xs lg:text-[13px] font-sans text-slate-300 font-light leading-snug">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom Guarantee Marker */}
                <div className="mt-3 sm:mt-5 pt-3 sm:pt-4 border-t border-white/5 flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-core-muted uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className={`w-3.5 h-3.5 ${plan.highlighted ? 'text-core-red' : 'text-slate-400'}`} />
                    <span>Cancel Anytime</span>
                  </div>
                  <span>Kolkata Club</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Promotional Offer Card Banner (Database-Driven with Fixed Location & Styling) */}
        {offerBanner && offerBanner.isActive && (
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 sm:mt-16 lg:mt-20 flex flex-col items-center justify-center w-full px-2 sm:px-4 relative"
          >
            {/* Radial Ambient Red Glow behind banner */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl sm:max-w-4xl h-40 sm:h-52 bg-gradient-radial from-core-red/20 via-core-crimson/8 to-transparent rounded-full blur-[80px] sm:blur-[110px] pointer-events-none -z-10" />

            <div
              onClick={() => featuredPlan && handleCtaClick(featuredPlan)}
              className="group relative w-full max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl rounded-2xl sm:rounded-3xl overflow-hidden border border-white/15 hover:border-core-red/60 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(255,42,42,0.18)] hover:shadow-[0_30px_70px_rgba(255,42,42,0.3)] transition-all duration-500 cursor-pointer bg-core-dark/90 backdrop-blur-xl"
            >
              <Image
                src={offerBanner.imageUrl || '/plans-offer-banner.png'}
                alt={offerBanner.title || 'Core X Fitness Exclusive Membership Offer - Get Up To 20% Off'}
                width={996}
                height={300}
                className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.015]"
                priority
                unoptimized={Boolean(offerBanner.imageUrl?.startsWith('data:'))}
              />
            </div>

            <span className="mt-3.5 sm:mt-4 text-[10px] sm:text-[11px] font-mono tracking-[0.2em] sm:tracking-widest text-core-muted uppercase flex items-center gap-1.5 text-center">
              <span className="w-1.5 h-1.5 rounded-full bg-core-red animate-pulse shrink-0" />
              {offerBanner.badgeText || 'LIMITED TIME ATHLETIC ADMISSIONS DISCOUNT'}
            </span>
          </motion.div>
        )}
      </div>

      {/* Interactive Reservation Modal for Visitors & Members */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-core-dark border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_50px_rgba(255,42,42,0.2)] text-left space-y-5"
            >
              <button
                onClick={() => setSelectedPlan(null)}
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
                      APPLY FOR {selectedPlan.name} TIER
                    </h3>
                    <p className="text-xs font-sans text-core-muted font-light">
                      {formatInrPrice(selectedPlan.price)} {selectedPlan.duration} • {selectedPlan.shortDescription}
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

                  <label className="flex items-start gap-2.5 cursor-pointer text-left pt-1">
                    <input
                      type="checkbox"
                      checked={bookingForm.marketingOptIn}
                      onChange={(e) => setBookingForm({ ...bookingForm, marketingOptIn: e.target.checked })}
                      className="mt-0.5 w-4 h-4 rounded bg-white/[0.04] border-white/20 text-core-red focus:ring-core-red cursor-pointer accent-[#FF2A2A]"
                    />
                    <span className="text-[11px] font-sans text-slate-400 leading-tight select-none">
                      Receive exclusive CORE X athlete offers, nutritional guides, and event invitations via email.
                    </span>
                  </label>

                  <div className="pt-2 space-y-2.5">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl bg-red-gradient text-white font-heading font-bold uppercase tracking-widest text-xs shadow-glow-red hover:brightness-110 transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? 'Transmitting Allocation...' : `Confirm ${selectedPlan.name} Allocation`}
                    </button>

                    {!isSignedIn && (
                      <p className="text-center text-[11px] font-mono text-core-muted">
                        Already have a member profile?{' '}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPlan(null);
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
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.35)]">
                    <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                  </div>

                  <div className="space-y-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-400 font-bold">
                      ALLOCATION RECORDED
                    </span>
                    <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight">
                      {selectedPlan.name} TIER RESERVED
                    </h3>
                    <p className="text-xs font-sans text-core-muted font-light leading-relaxed">
                      Thank you, <span className="text-white font-semibold">{bookingForm.name}</span>. Your reservation for the {selectedPlan.name} membership standard has been logged directly in the Admissions database.
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
                      <span className="text-emerald-400 font-bold">&lt; 2 Hours (Admissions Board)</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                    <Link
                      href="/profile"
                      onClick={() => setSelectedPlan(null)}
                      className="flex-1 py-3.5 rounded-xl bg-red-gradient text-white font-heading font-bold uppercase tracking-widest text-xs shadow-glow-red hover:brightness-110 active:scale-95 transition-all text-center flex items-center justify-center gap-1.5"
                    >
                      <span>View in My Membership</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => setSelectedPlan(null)}
                      className="flex-1 py-3.5 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/10 text-white font-heading font-bold uppercase tracking-widest text-xs transition-all"
                    >
                      Return to Plans
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
