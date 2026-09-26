import React from 'react';
import type { Metadata } from 'next';
import { AboutHero } from '@/components/about/AboutHero';
import { AboutOrbitCards } from '@/components/about/AboutOrbitCards';
import { AboutStorySection } from '@/components/about/AboutStorySection';
import { AboutVideoSection } from '@/components/about/AboutVideoSection';
import { AboutClosingCTA } from '@/components/about/AboutClosingCTA';

export const metadata: Metadata = {
  title: 'About | Architectural Athletic Sanctuary',
  description:
    'Discover CORE X FITNESS: Kolkata’s premier high-performance athletic club featuring competition Eleiko platforms, biometric recovery labs, and elite strength architecture.',
};

export default function AboutPage() {
  return (
    <div className="w-full flex flex-col bg-core-void min-h-screen">
      {/* 1. About Editorial Hero & Ethos */}
      <AboutHero />

      {/* 2. Continuous 3D Rotating Gym Cards Orbit */}
      <AboutOrbitCards />

      {/* 3. Training Story & Architectural Pillars */}
      <AboutStorySection />

      {/* 4. Scroll-Controlled MP4 Facility Video */}
      <AboutVideoSection />

      {/* 5. Final About Threshold & Concierge Access */}
      <AboutClosingCTA />
    </div>
  );
}
