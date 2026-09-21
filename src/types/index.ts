export interface NavItem {
  label: string;
  href: string;
  badge?: string;
  isExternal?: boolean;
}

export interface ProgramItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: 'Strength' | 'Conditioning' | 'Personal Training' | 'Functional' | 'Performance';
  description: string;
  image: string;
  intensity: 'Medium' | 'High' | 'Elite';
  duration: string;
  features: string[];
  metrics: {
    label: string;
    value: string;
  }[];
}

export interface TrainerItem {
  id: string;
  name: string;
  role: string;
  specialization: string;
  bio: string;
  experience: string;
  image: string;
  certifications: string[];
  socials?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface MembershipPlan {
  id: string;
  name: string;
  tier: 'Access' | 'Performance' | 'Elite Black';
  priceMonthly: number;
  priceAnnual: number;
  period: string;
  description: string;
  isPopular?: boolean;
  features: string[];
  ctaText: string;
}

export interface StatItem {
  value: string;
  label: string;
  sublabel?: string;
  prefix?: string;
  suffix?: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  title: string;
  avatar: string;
  statsHighlight: string;
}
