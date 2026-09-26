'use client';

import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignIn, SignUp } from '@clerk/nextjs';
import { useAuthModal } from '@/context/AuthModalContext';
import { X, ShieldCheck } from 'lucide-react';

export function AuthModal() {
  const { isOpen, mode, closeModal, setMode } = useAuthModal();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeModal]);

  // Synchronize internal Clerk hash routing with modal mode state
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.includes('sign-up') && mode !== 'signUp') {
        setMode('signUp');
      } else if (hash.includes('sign-in') && mode !== 'signIn') {
        setMode('signIn');
      }
    };

    if (isOpen) {
      handleHashChange();
      window.addEventListener('hashchange', handleHashChange);
    }
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isOpen, mode, setMode]);

  // Shared Clerk luxury dark glass appearance tokens
  const clerkAppearance = useMemo(
    () => ({
      elements: {
        rootBox: 'w-full',
        cardBox: 'w-full shadow-none border-0 bg-transparent p-0',
        card: 'bg-transparent border-0 shadow-none p-0 w-full',
        header: 'hidden',
        socialButtonsBlockButton:
          'bg-white/[0.04] border border-white/10 hover:border-core-red/60 hover:bg-white/[0.08] active:bg-white/[0.12] transition-all text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl h-10 shadow-sm flex items-center justify-center gap-2',
        socialButtonsBlockButtonText:
          'font-heading text-xs text-white uppercase tracking-wider font-bold',
        socialButtonsProviderIcon: 'w-4 h-4',
        dividerRow: 'my-2.5 flex items-center gap-2',
        dividerLine: 'bg-white/10 h-[1px]',
        dividerText: 'text-[9px] font-mono uppercase tracking-[0.2em] text-slate-400',
        form: 'space-y-2.5',
        formField: 'space-y-1',
        formFieldLabel:
          'text-[10px] font-mono tracking-widest uppercase text-slate-300 font-semibold',
        formFieldInput:
          'bg-black/40 border border-white/10 hover:border-white/20 text-white font-sans text-xs rounded-xl h-10 px-3.5 focus:border-core-red focus:ring-1 focus:ring-core-red focus:bg-black/60 transition-all placeholder:text-white/25',
        formFieldAction:
          'text-[10px] font-mono text-core-red hover:text-white transition-colors uppercase tracking-wider',
        formButtonPrimary:
          'bg-red-gradient hover:brightness-110 text-white font-heading font-bold uppercase tracking-widest text-xs rounded-xl h-10 transition-all shadow-glow-red active:scale-[0.98] mt-1.5',
        footer: 'pt-2',
        footerAction: 'text-center',
        footerActionText: 'text-[11px] font-mono text-slate-400',
        footerActionLink:
          'text-core-red hover:text-white font-mono text-[11px] uppercase tracking-wider font-bold transition-colors ml-1',
        identityPreview:
          'bg-white/[0.03] border border-white/10 rounded-xl p-2.5 flex items-center justify-between',
        identityPreviewText: 'text-white font-mono text-xs',
        identityPreviewEditButton:
          'text-core-red hover:text-white text-xs font-mono font-semibold',
        formResendCodeLink: 'text-core-red hover:text-white font-mono text-xs',
        otpCodeFieldInput:
          'bg-black/40 border border-white/10 text-white font-mono text-base rounded-lg focus:border-core-red focus:ring-1 focus:ring-core-red',
        alert:
          'bg-core-red/10 border border-core-red/30 rounded-xl p-2.5 text-xs text-red-200 mb-2',
        alertText: 'text-xs text-red-200',
        formFieldErrorText: 'text-[10px] font-mono text-core-red mt-1',
      },
    }),
    []
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto select-none">
          {/* Subtle Translucent Backdrop - Kept light enough to keep background visible */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeModal}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm -z-10"
          />

          {/* Compact Luxury Glass Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[370px] sm:max-w-[385px] my-4 rounded-2xl sm:rounded-3xl bg-[#080B10]/68 backdrop-blur-2xl border border-white/[0.12] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85),0_0_30px_rgba(255,42,42,0.12),inset_0_1px_0_rgba(255,255,255,0.14)] p-4 sm:p-5 overflow-hidden"
          >
            {/* Subtle Ambient Red Light Leaks behind glass */}
            <div className="absolute -top-10 -right-10 w-44 h-44 bg-core-red/15 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-core-crimson/10 rounded-full blur-3xl pointer-events-none -z-10" />

            {/* Top Bar with Brand Badge, Quick Mode Toggle, and Close Button */}
            <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-white/10">
              {/* Brand Indicator */}
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-core-red shadow-glow-red animate-pulse" />
                <span className="text-[11px] font-heading font-extrabold tracking-[0.2em] text-white uppercase">
                  CORE X
                </span>
              </div>

              {/* Mode Toggle Switch */}
              <div className="flex items-center p-0.5 rounded-full bg-white/[0.04] border border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signIn');
                    if (window.location.hash !== '#sign-in') {
                      window.location.hash = '#sign-in';
                    }
                  }}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider transition-all duration-200 ${
                    mode === 'signIn'
                      ? 'bg-core-red text-white shadow-glow-red'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signUp');
                    if (window.location.hash !== '#sign-up') {
                      window.location.hash = '#sign-up';
                    }
                  }}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider transition-all duration-200 ${
                    mode === 'signUp'
                      ? 'bg-core-red text-white shadow-glow-red'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Minimal Glass Close Button */}
              <button
                type="button"
                onClick={closeModal}
                className="w-7 h-7 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-core-red/60 hover:bg-core-red/10 transition-all flex items-center justify-center group"
                aria-label="Close Authentication Modal"
              >
                <X className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
              </button>
            </div>

            {/* Real Clerk Component Rendered with Glass Styling */}
            <div className="flex justify-center w-full clerk-custom-wrapper">
              {mode === 'signIn' ? (
                <SignIn
                  routing="hash"
                  signUpUrl="#sign-up"
                  appearance={clerkAppearance}
                />
              ) : (
                <SignUp
                  routing="hash"
                  signInUrl="#sign-in"
                  appearance={clerkAppearance}
                />
              )}
            </div>

            {/* Subtle Security Badge */}
            <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-slate-400 uppercase tracking-widest">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-core-red" />
                <span>256-Bit Encrypted Portal</span>
              </div>
              <span className="text-slate-500">Core X Kolkata</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
