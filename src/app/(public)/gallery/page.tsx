import React from 'react';
import type { Metadata } from 'next';
import { GalleryHero } from '@/components/gallery/GalleryHero';
import { GalleryEditorialComposition } from '@/components/gallery/GalleryEditorialComposition';
import { GalleryOrbit3D } from '@/components/gallery/GalleryOrbit3D';
import { GalleryStreamStrip } from '@/components/gallery/GalleryStreamStrip';
import { GalleryClosingThreshold } from '@/components/gallery/GalleryClosingThreshold';

export const metadata: Metadata = {
  title: 'Gallery | Visual Archive & 3D Spatial Sanctuary',
  description:
    'Experience the cinematic visual exhibition of CORE X FITNESS: an art-directed architectural archive of Swedish Eleiko steel, kinetic tension, and monolithic athletic performance.',
  openGraph: {
    title: 'CORE X FITNESS // Visual Archive & Spatial Gallery',
    description:
      'Immersive scroll-driven visual journey through high-performance training architecture and Swedish iron.',
  },
};

export default function GalleryPage() {
  return (
    <main className="w-full flex flex-col bg-core-void min-h-screen">
      {/* 1. Scroll-Driven Cinematic Hero Exhibition */}
      <GalleryHero />

      {/* 2. Editorial 3D Asymmetric Composition with Layered Depth */}
      <GalleryEditorialComposition />

      {/* 3. Continuous 3D Rotating Image Orbit System */}
      <GalleryOrbit3D />

      {/* 4. Footer-Above Continuous Right-to-Left Stream Strip */}
      <GalleryStreamStrip />

      {/* 5. Minimalist Closing Threshold */}
      <GalleryClosingThreshold />
    </main>
  );
}
