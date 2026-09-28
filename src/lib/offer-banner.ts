import { ObjectId } from 'mongodb';
import { getDatabase } from './mongodb';
import { OfferBannerItem } from '@/types/database';
import { revalidatePath } from 'next/cache';
import { DEFAULT_OFFER_BANNER } from './offer-banner-shared';

export { DEFAULT_OFFER_BANNER };

/**
 * Ensure initial offer banner exists in MongoDB
 */
export async function ensureDefaultOfferBanner(): Promise<void> {
  try {
    const db = await getDatabase();
    const bannerCol = db.collection('offer_banners');
    const count = await bannerCol.countDocuments();

    if (count === 0) {
      await bannerCol.insertOne(DEFAULT_OFFER_BANNER);
      console.log('✅ Initialized default Core X offer banner in MongoDB.');
    }
  } catch (error) {
    console.error('Error ensuring default offer banner:', error);
  }
}

/**
 * Get the single active offer banner for public website
 */
export async function getActiveOfferBanner(): Promise<OfferBannerItem | null> {
  try {
    await ensureDefaultOfferBanner();
    const db = await getDatabase();
    const bannerCol = db.collection('offer_banners');

    const doc = await bannerCol.findOne({ isActive: true }, { sort: { updatedAt: -1 } });

    if (!doc) {
      return null;
    }

    return {
      _id: doc._id.toString(),
      imageUrl: doc.imageUrl || '/plans-offer-banner.png',
      title: doc.title || '',
      optionalSubtitle: doc.optionalSubtitle || '',
      badgeText: doc.badgeText || 'LIMITED TIME ATHLETIC ADMISSIONS DISCOUNT',
      linkUrl: doc.linkUrl || '#pricing-matrix',
      isActive: Boolean(doc.isActive),
      createdAt: doc.createdAt || new Date().toISOString(),
      updatedAt: doc.updatedAt || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error in getActiveOfferBanner:', error);
    return {
      ...DEFAULT_OFFER_BANNER,
      _id: 'fallback-banner',
    };
  }
}

/**
 * Get current banner configuration for Admin
 */
export async function getAdminOfferBanner(): Promise<OfferBannerItem | null> {
  await ensureDefaultOfferBanner();
  const db = await getDatabase();
  const bannerCol = db.collection('offer_banners');

  const doc = await bannerCol.findOne({}, { sort: { updatedAt: -1 } });

  if (!doc) return null;

  return {
    _id: doc._id.toString(),
    imageUrl: doc.imageUrl || '/plans-offer-banner.png',
    title: doc.title || '',
    optionalSubtitle: doc.optionalSubtitle || '',
    badgeText: doc.badgeText || 'LIMITED TIME ATHLETIC ADMISSIONS DISCOUNT',
    linkUrl: doc.linkUrl || '#pricing-matrix',
    isActive: Boolean(doc.isActive),
    createdAt: doc.createdAt || new Date().toISOString(),
    updatedAt: doc.updatedAt || new Date().toISOString(),
  };
}

/**
 * Invalidate Next.js cache for banner
 */
export function revalidateOfferBannerCache() {
  try {
    revalidatePath('/plans');
    revalidatePath('/');
  } catch (e) {
    // Ignore outside request cycle
  }
}
