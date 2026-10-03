import { NavItem, StatItem, ProgramItem, TrainerItem, MembershipPlan } from '@/types';

export const siteConfig = {
  name: 'CORE X FITNESS',
  legalName: 'Core X Fitness Club & Performance Labs',
  tagline: 'Forged in Discipline. Defined by Strength.',
  description: 'Ultra-premium athletic club, high-performance training facility, and recovery laboratory built for relentless athletes and leaders.',
  url: 'https://corexfitness.com',
  address: {
    street: 'Debaipukur, Bhadrakali',
    city: 'Uttarpara',
    state: 'West Bengal',
    zip: '712232',
    landmark: 'Bireswar Banerjee Street, Above HDFC Bank',
  },
  contact: {
    phone: '+91 98300 12345',
    email: 'concierge@corexfitness.com',
  },
  hours: {
    weekdays: '06:00 - 23:00',
    weekends: '06:00 - 23:00',
    members247: '24/7 Biometric Keycard Access for Elite Tier',
  },
};

export const navigationItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Plans', href: '/plans' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Diet', href: '/diet' },
  { label: 'Contact', href: '/contact' },
];

export const heroStats: StatItem[] = [
  {
    value: '18,500',
    suffix: 'SQ FT',
    label: 'ARCHITECTURAL FACILITY',
    sublabel: 'Custom Eleiko & Prime Racks',
  },
  {
    value: '99.4',
    suffix: '%',
    label: 'CLIENT GOAL ATTAINMENT',
    sublabel: 'Biometric Tracking Matrix',
  },
  {
    value: '1:4',
    label: 'MAX COACH RATIO',
    sublabel: 'Uncompromised Guidance',
  },
  {
    value: '24/7',
    label: 'BIOMETRIC RECOVERY',
    sublabel: 'Cryo & Hyperbaric Suites',
  },
];
