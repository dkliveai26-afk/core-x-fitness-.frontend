import React from 'react';
import type { Metadata } from 'next';
import { PlansHero } from '@/components/plans/PlansHero';
import { PlansPricingCards } from '@/components/plans/PlansPricingCards';
import { PlansFacilitiesExperience } from '@/components/plans/PlansFacilitiesExperience';
import { PlansClosingCTA } from '@/components/plans/PlansClosingCTA';

export const metadata: Metadata = {
  title: 'Plans & Memberships | CORE X FITNESS',
  description:
    'Choose your CORE X FITNESS membership standard: Core Access, Performance Lab, or Elite Black Tier. Ultra-premium athletic facility with Eleiko platforms and biometric recovery.',
};

export default function PlansPage() {
  return (
    <div className="w-full flex flex-col bg-core-void min-h-screen">
      {/* 1. Plans Intro Hero */}
      <PlansHero />

      {/* 2. Premium Animated Membership Cards (Reference-Inspired) */}
      <PlansPricingCards />

      {/* 3. Facilities & Membership Experience (Visual Bento Cards) */}
      <PlansFacilitiesExperience />

      {/* 4. Clean Final Membership Action */}
      <PlansClosingCTA />
    </div>
  );
}
