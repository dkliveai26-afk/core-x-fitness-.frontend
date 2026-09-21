import React from 'react';
import { Hero } from '@/components/sections/Hero';
import { PhilosophyTeaser } from '@/components/sections/PhilosophyTeaser';
import { ProgramsSection } from '@/components/sections/ProgramsSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { TrainersSection } from '@/components/sections/TrainersSection';
import { MembershipSection } from '@/components/sections/MembershipSection';
import { FinalCTASection } from '@/components/sections/FinalCTASection';

export default function HomePage() {
  return (
    <div className="w-full flex flex-col bg-core-void min-h-screen">
      {/* 1. Cinematic 3D Hero Experience */}
      <Hero />

      {/* 2. Brand Ethos & Human Potential Manifesto */}
      <PhilosophyTeaser />

      {/* 3. Calibrated Athletic Programs & Disciplines */}
      <ProgramsSection />

      {/* 4. 18,500 SQ FT Architectural Gym Experience */}
      <ExperienceSection />

      {/* 5. World-Class Master Coaching Directors */}
      <TrainersSection />

      {/* 6. Membership Tiers & VIP Access Protocol */}
      <MembershipSection />

      {/* 7. Cinematic Threshold Final CTA */}
      <FinalCTASection />
    </div>
  );
}
