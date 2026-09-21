'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/common/Button';
import { siteConfig } from '@/data/site';
import { ArrowUp, Mail, MapPin, Phone, Clock, Instagram, Youtube, Twitter } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-core-void border-t border-white/10 pt-20 pb-12 overflow-hidden">
      {/* Background Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-core-red/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top VIP Concierge Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-core-dark border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 mb-20 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <div className="max-w-xl">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-core-red font-bold">
              CONCIERGE & PRIVATE TOURS
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mt-2 uppercase">
              Schedule Your Private Facility Assessment
            </h3>
            <p className="text-sm text-core-muted mt-2 font-sans">
              Experience the private recovery chambers, Eleiko stations, and receive a baseline biometric assessment with our Master Coaches.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Enter your email for private tour concierge"
              className="w-full sm:w-72 px-4 py-3.5 rounded-xl bg-core-surface border border-white/10 text-white placeholder-core-muted text-sm focus:outline-none focus:border-core-red font-sans"
            />
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto shrink-0"
            >
              Request Access
            </Button>
          </div>
        </div>

        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-5">
            <Logo size="lg" />
            <p className="text-sm text-core-muted max-w-sm font-sans leading-relaxed">
              {siteConfig.description}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-lg bg-core-surface border border-white/10 flex items-center justify-center text-core-muted hover:text-white hover:border-core-red transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-lg bg-core-surface border border-white/10 flex items-center justify-center text-core-muted hover:text-white hover:border-core-red transition-all"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-lg bg-core-surface border border-white/10 flex items-center justify-center text-core-muted hover:text-white hover:border-core-red transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links 1: Navigation */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-white font-bold mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm font-sans text-core-muted">
              <li><a href="#hero" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#programs" className="hover:text-white transition-colors">Programs</a></li>
              <li><a href="#trainers" className="hover:text-white transition-colors">Trainers</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Quick Links 2: Disciplines */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-white font-bold mb-4">
              Disciplines
            </h4>
            <ul className="space-y-2.5 text-sm font-sans text-core-muted">
              <li><a href="#programs" className="hover:text-white transition-colors">Hypertrophy & Power</a></li>
              <li><a href="#programs" className="hover:text-white transition-colors">Athletic Conditioning</a></li>
              <li><a href="#programs" className="hover:text-white transition-colors">Biometric Recovery</a></li>
              <li><a href="#programs" className="hover:text-white transition-colors">Olympic Barbell Protocol</a></li>
            </ul>
          </div>

          {/* Quick Links 3: Contact & Hours */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-white font-bold mb-4">
              Flagship Club
            </h4>
            <ul className="space-y-3 text-xs font-mono text-core-muted">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-core-red shrink-0 mt-0.5" />
                <span>{siteConfig.address.street}, {siteConfig.address.city}, {siteConfig.address.state}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-core-red shrink-0" />
                <span>{siteConfig.contact.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-core-red shrink-0" />
                <span>{siteConfig.contact.email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-core-muted">
          <div>
            © {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-core-dark border border-white/10 hover:border-core-red hover:text-white transition-all text-[11px] uppercase tracking-wider"
              aria-label="Back to top"
            >
              <span>TOP</span>
              <ArrowUp className="w-3.5 h-3.5 text-core-red" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
