'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useAuthModal } from '@/context/AuthModalContext';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/common/Button';
import { navigationItems } from '@/data/site';
import { Menu, X, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const pathname = usePathname();
  const { openModal } = useAuthModal();
  const { user } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isContact = pathname === '/contact';
  const isDiet = pathname === '/diet' || pathname === '/dite';
  const isGallery = pathname === '/gallery';
  const isAbout = pathname === '/about';
  const isPlans = pathname === '/plans';
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex items-center h-16 sm:h-20 ${
          isScrolled
            ? 'bg-core-void/90 backdrop-blur-md border-b border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
            : 'bg-transparent'
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Top-Left Official Brand Logo */}
          <div className="flex-1 flex items-center justify-start">
            <Link
              href="/"
              className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-core-red rounded-lg"
              aria-label="Core X Fitness Home"
            >
              <Logo />
            </Link>
          </div>

          {/* Center Navigation Capsule */}
          <nav
            className="hidden lg:flex flex-none items-center p-1.5 rounded-full bg-core-dark/80 backdrop-blur-md border border-white/10 shadow-inner-bevel"
            aria-label="Main Navigation"
          >
            <ul className="flex items-center gap-1">
              {navigationItems.map((item) => {
                const isActive =
                  (isContact && item.label === 'Contact') ||
                  (isDiet && item.label === 'Diet') ||
                  (isGallery && item.label === 'Gallery') ||
                  (isAbout && item.label === 'About') ||
                  (isPlans && item.label === 'Plans') ||
                  (isHome && item.label === 'Home');

                return (
                  <li key={item.label} className="relative">
                    <Link
                      href={item.href}
                      className={`relative px-5 py-2 text-xs uppercase font-heading font-bold tracking-widest transition-all duration-300 rounded-full block select-none ${
                        isActive
                          ? 'text-white'
                          : 'text-core-muted hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="navPill"
                          className="absolute inset-0 bg-red-gradient rounded-full shadow-glow-red -z-10"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right Action Cluster */}
          <div className="flex-1 flex items-center justify-end">
            <div className="hidden md:flex items-center">
              <SignedOut>
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowUpRight className="w-4 h-4" />}
                  onClick={() => openModal('signIn')}
                >
                  Get Access
                </Button>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center gap-3">
                  {user && (
                    <div className="hidden sm:flex flex-col items-end text-right leading-tight select-none">
                      <span className="text-xs font-heading font-bold text-white uppercase tracking-wider truncate max-w-[150px]">
                        {user.fullName || user.firstName || 'Athlete'}
                      </span>
                      <span className="text-[10px] font-mono text-core-red uppercase tracking-widest font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-core-red animate-pulse" />
                        Member Portal
                      </span>
                    </div>
                  )}
                  <UserButton
                    userProfileMode="modal"
                    appearance={{
                      elements: {
                        rootBox: 'flex items-center justify-center',
                        userButtonTrigger:
                          'focus:outline-none focus-visible:ring-2 focus-visible:ring-core-red rounded-full transition-transform hover:scale-105 active:scale-95',
                        userButtonAvatarBox:
                          'w-10 h-10 rounded-full ring-2 ring-core-red/80 hover:ring-core-red shadow-glow-red overflow-hidden flex items-center justify-center transition-all',
                        userButtonAvatarImage: 'w-full h-full object-cover rounded-full',
                        userButtonPopoverCard:
                          'bg-[#0B0D11]/95 backdrop-blur-2xl border border-white/12 text-white shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_30px_rgba(255,42,42,0.15)] rounded-2xl p-2',
                        userPreviewMainIdentifier:
                          'text-white font-heading font-bold text-sm tracking-wide uppercase',
                        userPreviewSecondaryIdentifier: 'text-slate-400 font-mono text-xs',
                        userButtonPopoverActionButton:
                          'text-slate-200 hover:text-white hover:bg-white/5 font-mono text-xs transition-colors rounded-xl px-3 py-2',
                        userButtonPopoverActionButtonIcon: 'text-core-red',
                        userButtonPopoverActionButtonText:
                          'font-mono text-xs text-slate-200 font-medium',
                        userButtonPopoverFooter: 'hidden',
                      },
                    }}
                  />
                </div>
              </SignedIn>
            </div>

            {/* Mobile / Tablet Menu Trigger Button (Visible on screens < 1024px) */}
            <div className="flex lg:hidden items-center gap-2 sm:gap-2.5">
              <SignedOut>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => openModal('signIn')}
                >
                  Access
                </Button>
              </SignedOut>
              <SignedIn>
                <UserButton
                  userProfileMode="modal"
                  appearance={{
                    elements: {
                      rootBox: 'flex items-center justify-center',
                      userButtonTrigger:
                        'focus:outline-none focus:ring-2 focus:ring-core-red rounded-full transition-transform active:scale-95',
                      userButtonAvatarBox:
                        'w-8 h-8 rounded-full ring-2 ring-core-red/80 shadow-glow-red overflow-hidden',
                      userButtonAvatarImage: 'w-full h-full object-cover rounded-full',
                      userButtonPopoverCard:
                        'bg-[#0B0D11]/95 backdrop-blur-2xl border border-white/12 text-white shadow-[0_25px_60px_rgba(0,0,0,0.95)] rounded-2xl p-2',
                    },
                  }}
                />
              </SignedIn>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-core-dark border border-white/10 text-white hover:text-core-red transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-core-red"
                aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile / Tablet Menu Fullscreen Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-core-void/98 backdrop-blur-2xl pt-24 sm:pt-28 pb-10 sm:pb-12 px-5 sm:px-8 flex flex-col justify-between overflow-y-auto max-h-[100dvh] lg:hidden"
          >
            {/* Background Ambient Glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-core-red/15 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-white/10">
                <ShieldCheck className="w-4 h-4 text-core-red" />
                <span className="text-xs uppercase font-mono tracking-widest text-core-muted">
                  Official Athletic Club Portal
                </span>
              </div>

              <ul className="space-y-3">
                {navigationItems.map((item, index) => {
                  const isActive =
                    (isContact && item.label === 'Contact') ||
                    (isDiet && item.label === 'Diet') ||
                    (isGallery && item.label === 'Gallery') ||
                    (isAbout && item.label === 'About') ||
                    (isPlans && item.label === 'Plans') ||
                    (isHome && item.label === 'Home');

                  return (
                    <motion.li
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => {
                          setMobileMenuOpen(false);
                        }}
                        className={`flex items-center justify-between py-3 text-xl font-display font-bold uppercase tracking-wider transition-colors border-b border-white/5 ${
                          isActive ? 'text-core-red' : 'text-white hover:text-core-red'
                        }`}
                      >
                        <span>{item.label}</span>
                        <ArrowUpRight className={`w-5 h-5 ${isActive ? 'text-core-red' : 'text-core-muted'}`} />
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/10">
              <SignedOut>
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  rightIcon={<ArrowUpRight className="w-5 h-5" />}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openModal('signIn');
                  }}
                >
                  Get Access
                </Button>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono tracking-widest text-core-red uppercase block font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-core-red animate-pulse" />
                      ACTIVE ATHLETE PASS
                    </span>
                    <span className="text-sm font-heading font-bold text-white uppercase truncate block max-w-[200px]">
                      {user?.fullName || user?.firstName || 'Member'}
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-full ring-2 ring-core-red/80 overflow-hidden shadow-glow-red flex items-center justify-center">
                    {user?.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt={user.fullName || 'Member Profile'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-core-dark flex items-center justify-center text-xs font-mono text-white">
                        CX
                      </div>
                    )}
                  </div>
                </div>
              </SignedIn>
              <div className="text-center text-xs font-mono text-core-muted uppercase tracking-widest">
                24/7 Biometric Access • 740 Grand Avenue
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
