export interface GalleryEditorialItem {
  id: string;
  title: string;
  tag: string;
  subtitle: string;
  category: 'ARCHITECTURAL' | 'STRENGTH' | 'VELOCITY' | 'RECOVERY';
  image: string;
  aspect: 'portrait' | 'landscape' | 'square' | 'heroic';
  colSpan?: string;
  offsetY?: number;
}

export interface OrbitCardItem {
  id: string;
  index: string;
  theme: string;
  subtitle: string;
  badge: string;
  image: string;
}

export interface StreamStripItem {
  id: string;
  label: string;
  tag: string;
  image: string;
  aspectClass: string;
}

// 1. Editorial 3D Composition Items (Asymmetric, Layered Depth)
export const galleryEditorialItems: GalleryEditorialItem[] = [
  {
    id: 'editorial-1',
    title: 'THE MONOLITHIC SANCTUARY',
    tag: 'ZONE 01',
    subtitle: '18,500 SQ FT of architectural training geometry with acoustic isolation and low-lux amber illumination.',
    category: 'ARCHITECTURAL',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600&auto=format&fit=crop',
    aspect: 'heroic',
    colSpan: 'lg:col-span-12',
  },
  {
    id: 'editorial-2',
    title: 'CHALK & CALIBRATED STEEL',
    tag: 'ZONE 02',
    subtitle: 'Swedish Eleiko competition plates calibrated to within 10 grams of absolute precision.',
    category: 'STRENGTH',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
    aspect: 'portrait',
    colSpan: 'lg:col-span-5',
    offsetY: 20,
  },
  {
    id: 'editorial-3',
    title: 'KINETIC ACCELERATION',
    tag: 'ZONE 03',
    subtitle: 'Explosive triple extension captured at the apex of clean pull velocity.',
    category: 'VELOCITY',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop',
    aspect: 'landscape',
    colSpan: 'lg:col-span-7',
    offsetY: -30,
  },
  {
    id: 'editorial-4',
    title: 'METABOLIC THRESHOLD',
    tag: 'ZONE 04',
    subtitle: 'Sub-maximal aerobic sprint pacing on curved magnetic air runners.',
    category: 'VELOCITY',
    image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=1200&auto=format&fit=crop',
    aspect: 'landscape',
    colSpan: 'lg:col-span-7',
    offsetY: 40,
  },
  {
    id: 'editorial-5',
    title: 'HYPERBARIC & CRYO LABS',
    tag: 'ZONE 05',
    subtitle: 'Sub-zero cryo cabins and infrared contrast suites designed for cellular restoration.',
    category: 'RECOVERY',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop',
    aspect: 'portrait',
    colSpan: 'lg:col-span-5',
    offsetY: -20,
  },
  {
    id: 'editorial-6',
    title: 'TITANIUM DUMBBELL VAULT',
    tag: 'ZONE 06',
    subtitle: 'Solid urethane and forged steel pairs ranging from 2.5kg up to 70kg competition beasts.',
    category: 'STRENGTH',
    image: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=1400&auto=format&fit=crop',
    aspect: 'heroic',
    colSpan: 'lg:col-span-12',
  },
];

// 2. Continuous 3D Rotating Orbit System Items
export const galleryOrbitItems: OrbitCardItem[] = [
  {
    id: 'orbit-1',
    index: '01',
    theme: 'ELEIKO SANCTUARY',
    subtitle: 'Swedish Competition Platforms',
    badge: 'IPF CALIBRATED',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 'orbit-2',
    index: '02',
    theme: 'KINETIC TENSION',
    subtitle: 'Precision Velocity Telemetry',
    badge: 'VBT TELEMETRY',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 'orbit-3',
    index: '03',
    theme: 'SUB-ZERO CRYO',
    subtitle: 'Cellular Restoration Suites',
    badge: 'RESTORATION',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 'orbit-4',
    index: '04',
    theme: 'ARSENAL STRENGTH',
    subtitle: 'Monolithic Heavy Racks',
    badge: 'STRUCTURAL',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 'orbit-5',
    index: '05',
    theme: 'METABOLIC DRIVE',
    subtitle: 'Curved Resistance Runners',
    badge: 'ANAEROBIC',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 'orbit-6',
    index: '06',
    theme: 'ARCHITECTURAL LUX',
    subtitle: 'Acoustic Dampening Matrix',
    badge: 'ATMOSPHERE',
    image: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=900&auto=format&fit=crop&q=80',
  },
];

// 3. Continuous Horizontal Stream Strip Items (Right -> Left, diverse dimensions)
export const galleryStreamItems: StreamStripItem[] = [
  {
    id: 'stream-1',
    label: 'ELEIKO IPF PLATFORM',
    tag: 'COMPETITION',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    aspectClass: 'w-[280px] sm:w-[360px] aspect-[4/5]',
  },
  {
    id: 'stream-2',
    label: 'CHALK EXPLOSION',
    tag: 'BARBELL PULL',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
    aspectClass: 'w-[320px] sm:w-[440px] aspect-[16/10]',
  },
  {
    id: 'stream-3',
    label: 'SUB-ZERO IMMERSION',
    tag: 'RECOVERY LAB',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    aspectClass: 'w-[260px] sm:w-[320px] aspect-[3/4]',
  },
  {
    id: 'stream-4',
    label: 'FORGED DUMBBELL VAULT',
    tag: 'HEAVY IRON',
    image: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&auto=format&fit=crop&q=80',
    aspectClass: 'w-[300px] sm:w-[400px] aspect-[16/11]',
  },
  {
    id: 'stream-5',
    label: 'ANAEROBIC SPRINT FIELD',
    tag: 'SPRINT TURF',
    image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&auto=format&fit=crop&q=80',
    aspectClass: 'w-[280px] sm:w-[350px] aspect-[4/5]',
  },
  {
    id: 'stream-6',
    label: 'TITANIUM CAGE ARCHITECTURE',
    tag: 'STRUCTURE',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    aspectClass: 'w-[340px] sm:w-[460px] aspect-[16/10]',
  },
  {
    id: 'stream-7',
    label: 'POSTERIOR CHAIN FORCE',
    tag: 'BIOMECHANICS',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    aspectClass: 'w-[260px] sm:w-[320px] aspect-[3/4]',
  },
  {
    id: 'stream-8',
    label: 'HIGH-LUX AMBIENCE',
    tag: 'SANCTUARY',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80',
    aspectClass: 'w-[300px] sm:w-[380px] aspect-[4/5]',
  },
];
