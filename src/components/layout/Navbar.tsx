'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/common/Button';
import { navigationItems } from '@/data/site';
import { Menu, X, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState('Philosophy');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'py-3.5 bg-core-void/85 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
            : 'py-6 bg-gradient-to-b from-core-void/90 via-core-void/40 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Top-Left Official Brand Logo */}
          <Link
            href="/"
            className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-core-red rounded-lg"
            aria-label="Core X Fitness Home"
          >
            <Logo />
          </Link>

          {/* Center Navigation Capsule */}
          <nav
            className="hidden lg:flex items-center p-1.5 rounded-full bg-core-dark/80 backdrop-blur-md border border-white/10 shadow-inner-bevel"
            aria-label="Main Navigation"
          >
            <ul className="flex items-center gap-1">
              {navigationItems.map((item) => {
                const isActive = activeItem === item.label;
                return (
                  <li key={item.label} className="relative">
                    <a
                      href={item.href}
                      onClick={() => setActiveItem(item.label)}
                      className={`relative px-4 py-2 text-xs uppercase font-heading font-bold tracking-widest transition-all duration-300 rounded-full block select-none ${
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
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right Action Cluster */}
          <div className="hidden md:flex items-center">
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowUpRight className="w-4 h-4" />}
              onClick={() => {
                const target = document.querySelector('#contact');
                target?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Get Access
            </Button>
          </div>

          {/* Mobile Menu Trigger Button */}
          <div className="flex md:hidden items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                const target = document.querySelector('#contact');
                target?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Access
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg bg-core-dark border border-white/10 text-white hover:text-core-red transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-core-red"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Fullscreen Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-core-void/98 backdrop-blur-2xl pt-28 pb-12 px-6 flex flex-col justify-between md:hidden"
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
                {navigationItems.map((item, index) => (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <a
                      href={item.href}
                      onClick={() => {
                        setActiveItem(item.label);
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-between py-3 text-xl font-display font-bold uppercase tracking-wider text-white hover:text-core-red transition-colors border-b border-white/5"
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight className="w-5 h-5 text-core-muted" />
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/10">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                rightIcon={<ArrowUpRight className="w-5 h-5" />}
                onClick={() => {
                  setMobileMenuOpen(false);
                  const target = document.querySelector('#contact');
                  target?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Get Access
              </Button>
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
