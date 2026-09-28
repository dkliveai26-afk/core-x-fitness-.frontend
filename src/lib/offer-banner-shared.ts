import { OfferBannerItem } from '@/types/database';

export const DEFAULT_OFFER_BANNER: Omit<OfferBannerItem, '_id'> = {
  imageUrl: '/plans-offer-banner.png',
  title: 'Core X Fitness Exclusive Membership Offer - Get Up To 20% Off',
  optionalSubtitle: 'Exclusive performance admissions window available this season.',
  badgeText: 'LIMITED TIME ATHLETIC ADMISSIONS DISCOUNT',
  linkUrl: '#pricing-matrix',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
