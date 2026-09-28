import { ObjectId } from 'mongodb';
import { getDatabase } from './mongodb';
import { PlanItem } from '@/types/database';
import { revalidatePath } from 'next/cache';
import { DEFAULT_PLANS, formatInrPrice, calculateDiscount } from './plans-shared';

export { DEFAULT_PLANS, formatInrPrice, calculateDiscount };

/**
 * Ensure default plans exist in MongoDB if collection is empty
 */
export async function ensureDefaultPlans(): Promise<void> {
  try {
    const db = await getDatabase();
    const plansCol = db.collection('plans');
    const count = await plansCol.countDocuments();

    if (count === 0) {
      await plansCol.insertMany(DEFAULT_PLANS);
      console.log('✅ Initialized default Core X membership plans in MongoDB.');
    }
  } catch (error) {
    console.error('Error ensuring default plans:', error);
  }
}

/**
 * Get active plans for the public website, ordered by displayOrder
 */
export async function getPublicPlans(): Promise<PlanItem[]> {
  try {
    await ensureDefaultPlans();
    const db = await getDatabase();
    const plansCol = db.collection('plans');

    const docs = await plansCol
      .find({ isActive: true })
      .sort({ displayOrder: 1, createdAt: 1 })
      .toArray();

    if (docs.length === 0) {
      return DEFAULT_PLANS.map((p, index) => ({
        ...p,
        _id: `default-${index}`,
      }));
    }

    return docs.map((doc: any) => ({
      _id: doc._id.toString(),
      name: doc.name,
      badge: doc.badge || 'STANDARD',
      shortDescription: doc.shortDescription || '',
      duration: doc.duration || '/ MONTH',
      originalPrice: Number(doc.originalPrice) || 0,
      price: Number(doc.price) || 0,
      currency: 'INR',
      discount: doc.discount || calculateDiscount(Number(doc.originalPrice), Number(doc.price)),
      features: Array.isArray(doc.features) ? doc.features : [],
      ctaText: doc.ctaText || 'Select Plan',
      highlighted: Boolean(doc.highlighted),
      displayOrder: Number(doc.displayOrder) || 1,
      isActive: Boolean(doc.isActive),
      createdAt: doc.createdAt || new Date().toISOString(),
      updatedAt: doc.updatedAt || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error in getPublicPlans:', error);
    // Safe graceful fallback to default plans
    return DEFAULT_PLANS.map((p, index) => ({
      ...p,
      _id: `fallback-${index}`,
    }));
  }
}

/**
 * Get all plans (both active and inactive) for Admin Management
 */
export async function getAllAdminPlans(): Promise<PlanItem[]> {
  await ensureDefaultPlans();
  const db = await getDatabase();
  const plansCol = db.collection('plans');

  const docs = await plansCol
    .find()
    .sort({ displayOrder: 1, createdAt: 1 })
    .toArray();

  return docs.map((doc: any) => ({
    _id: doc._id.toString(),
    name: doc.name,
    badge: doc.badge || 'STANDARD',
    shortDescription: doc.shortDescription || '',
    duration: doc.duration || '/ MONTH',
    originalPrice: Number(doc.originalPrice) || 0,
    price: Number(doc.price) || 0,
    currency: 'INR',
    discount: doc.discount || calculateDiscount(Number(doc.originalPrice), Number(doc.price)),
    features: Array.isArray(doc.features) ? doc.features : [],
    ctaText: doc.ctaText || 'Select Plan',
    highlighted: Boolean(doc.highlighted),
    displayOrder: Number(doc.displayOrder) || 1,
    isActive: Boolean(doc.isActive),
    createdAt: doc.createdAt || new Date().toISOString(),
    updatedAt: doc.updatedAt || new Date().toISOString(),
  }));
}

/**
 * Invalidate Next.js cache for plans pages
 */
export function revalidatePlansCache() {
  try {
    revalidatePath('/plans');
    revalidatePath('/');
  } catch (e) {
    // Non-fatal if invoked outside Next.js request lifecycle
  }
}
