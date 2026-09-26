import React from 'react';
import { HeroVideo } from '@/components/sections/HeroVideo';
import { BrandIntroSection } from '@/components/sections/BrandIntroSection';
import { TrainingDisciplinesSection } from '@/components/sections/TrainingDisciplinesSection';
import { PerformanceExperienceSection } from '@/components/sections/PerformanceExperienceSection';
import { ClosingCTASection } from '@/components/sections/ClosingCTASection';

export default function HomePage() {
  return (
    <div className="w-full flex flex-col bg-core-void min-h-screen">
      {/* 1. Scroll-Controlled MP4 Animation Hero */}
      <HeroVideo />

      {/* 2. Brand Architecture & Kinetic Intro */}
      <BrandIntroSection />

      {/* 3. High-Performance Training Disciplines */}
      <TrainingDisciplinesSection />

      {/* 4. Architectural Gym Experience & Metrics */}
      <PerformanceExperienceSection />

      {/* 5. Uncompromising Closing Threshold & Pass Request */}
      <ClosingCTASection />
    </div>
  );
}
