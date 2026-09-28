import React from 'react';
import type { Metadata } from 'next';
import { PlansHero } from '@/components/plans/PlansHero';
import { PlansPricingCards } from '@/components/plans/PlansPricingCards';
import { PlansFacilitiesExperience } from '@/components/plans/PlansFacilitiesExperience';
import { PlansClosingCTA } from '@/components/plans/PlansClosingCTA';
import { getPublicPlans } from '@/lib/plans';
import { getActiveOfferBanner } from '@/lib/offer-banner';

export const metadata: Metadata = {
  title: 'Plans & Memberships | CORE X FITNESS',
  description:
    'Choose your CORE X FITNESS membership standard: Core Access, Performance Lab, or Elite Black Tier. Ultra-premium athletic facility with Eleiko platforms and biometric recovery.',
};

export const dynamic = 'force-dynamic';

export default async function PlansPage() {
  const [plans, offerBanner] = await Promise.all([
    getPublicPlans(),
    getActiveOfferBanner(),
  ]);

  return (
    <div className="w-full flex flex-col bg-core-void min-h-screen">
      {/* 1. Plans Intro Hero */}
      <PlansHero />

      {/* 2. Premium Animated Membership Cards (Database-Driven with CMS Management) */}
      <PlansPricingCards initialPlans={plans} initialOfferBanner={offerBanner} />

      {/* 3. Facilities & Membership Experience (Visual Bento Cards) */}
      <PlansFacilitiesExperience />

      {/* 4. Clean Final Membership Action */}
      <PlansClosingCTA />
    </div>
  );
}
