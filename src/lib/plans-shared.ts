import { PlanItem } from '@/types/database';

export const DEFAULT_PLANS: Omit<PlanItem, '_id'>[] = [
  {
    name: 'CORE',
    badge: 'FOUNDATION TIER',
    shortDescription: 'Essential Olympic strength & conditioning platform access.',
    duration: '/ MONTH',
    originalPrice: 2999,
    price: 1999,
    currency: 'INR',
    discount: 'SAVE 33%',
    ctaText: 'Select Core Access',
    highlighted: false,
    displayOrder: 1,
    isActive: true,
    features: [
      'Full 18,500 sq ft main strength floor access',
      'Eleiko Olympic platforms & Prime machined racks',
      'Executive locker suites with Malin+Goetz',
      'Dedicated towel service & ionized hydration',
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'PERFORMANCE',
    badge: 'ATHLETIC STANDARD',
    shortDescription: 'Full athletic performance, biometric recovery & coaching telemetry.',
    duration: '/ MONTH',
    originalPrice: 4999,
    price: 3499,
    currency: 'INR',
    discount: 'SAVE 30%',
    ctaText: 'Claim Performance Pass',
    highlighted: true,
    displayOrder: 2,
    isActive: true,
    features: [
      'All Core Access privileges included',
      'Unlimited Cryotherapy (-140°C) & Infrared Sauna',
      'Hyperbaric Oxygen Chamber sessions (4x/mo)',
      'Monthly InBody 770 Biometric Analysis',
      'Bi-weekly 1-on-1 Master Coach Check-ins',
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: 'ELITE',
    badge: 'PRIVATE CONCIERGE',
    shortDescription: 'Strictly limited to 75 members with dedicated coach & valet.',
    duration: '/ MONTH',
    originalPrice: 8999,
    price: 5999,
    currency: 'INR',
    discount: 'SAVE 33%',
    ctaText: 'Apply For Elite Tier',
    highlighted: false,
    displayOrder: 3,
    isActive: true,
    features: [
      '24/7 Biometric Keycard Access (365 days)',
      'Private training pod reserved upon arrival',
      'Dedicated Master Coach with weekly programming',
      'Unlimited Recovery Suite & Magnesium Cold Plunge',
      'Complimentary valet parking & laundry service',
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Format a number into standard Indian Rupee notation (e.g. ₹1,999, ₹24,000)
 */
export function formatInrPrice(amount: number | string): string {
  const numeric = typeof amount === 'string' ? parseFloat(amount.replace(/[^\d.]/g, '')) || 0 : amount;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(numeric);
}

/**
 * Calculate save percentage string
 */
export function calculateDiscount(originalPrice: number, price: number): string {
  if (!originalPrice || originalPrice <= price) return '';
  const percent = Math.round(((originalPrice - price) / originalPrice) * 100);
  return `SAVE ${percent}%`;
}
