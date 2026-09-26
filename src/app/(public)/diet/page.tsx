import React from 'react';
import type { Metadata } from 'next';
import { DietHero } from '@/components/diet/DietHero';
import { DietBowl3DScroll } from '@/components/diet/DietBowl3DScroll';
import { DietPlateStory } from '@/components/diet/DietPlateStory';
import { DietEditorialShowcase } from '@/components/diet/DietEditorialShowcase';
import { DietGlassCards } from '@/components/diet/DietGlassCards';
import { DietClosingCTA } from '@/components/diet/DietClosingCTA';

export const metadata: Metadata = {
  title: 'Nutrition & Diet | CORE X FITNESS',
  description:
    'Calibrated metabolic architecture and performance nutrition for CORE X athletes. Discover 3D nutritional science, timed nutrient windows, and chef-crafted whole food fuel.',
  openGraph: {
    title: 'Nutrition & Diet // CORE X FITNESS Metabolic Architecture',
    description:
      'Performance nutrition, 3D macro calibration, and bioavailable chef-crafted meals for elite athletes.',
  },
};

export default function DietPage() {
  return (
    <main className="w-full flex flex-col bg-core-void min-h-screen overflow-x-hidden">
      {/* 1. Diet Hero Section (Fuel The Work) */}
      <DietHero />

      {/* 2. Main 3D Bowl Scroll Experience (Pinned Virtual Space) */}
      <DietBowl3DScroll />

      {/* 3. Performance Nutrition Story (3 Rotating Signature Plates) */}
      <DietPlateStory />

      {/* 4. Editorial Philosophy & Nutrition Pillars */}
      <DietEditorialShowcase />

      {/* 5. Glass / Transparent Nutrition Cards Section */}
      <DietGlassCards />

      {/* 6. Closing Assessment CTA */}
      <DietClosingCTA />
    </main>
  );
}
