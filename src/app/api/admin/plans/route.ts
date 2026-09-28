import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getDatabase } from '@/lib/mongodb';
import { getAllAdminPlans, revalidatePlansCache, calculateDiscount } from '@/lib/plans';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    const plans = await getAllAdminPlans();
    return NextResponse.json({ success: true, plans });
  } catch (error) {
    console.error('API /api/admin/plans GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin plans.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      badge,
      shortDescription,
      duration,
      originalPrice,
      price,
      discount,
      features,
      ctaText,
      highlighted,
      displayOrder,
      isActive,
    } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Plan name is required.' }, { status: 400 });
    }

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0) {
      return NextResponse.json({ error: 'Current price must be a valid non-negative number.' }, { status: 400 });
    }

    const numOriginalPrice = Number(originalPrice);
    if (isNaN(numOriginalPrice) || numOriginalPrice < 0) {
      return NextResponse.json({ error: 'Original price must be a valid non-negative number.' }, { status: 400 });
    }

    const cleanFeatures = Array.isArray(features)
      ? features.map((f: string) => String(f).trim()).filter(Boolean)
      : [];

    const computedDiscount = discount || calculateDiscount(numOriginalPrice, numPrice);

    const db = await getDatabase();
    const plansCol = db.collection('plans');

    const newPlan = {
      name: name.trim().toUpperCase(),
      badge: (badge || 'STANDARD').trim().toUpperCase(),
      shortDescription: (shortDescription || '').trim(),
      duration: (duration || '/ MONTH').trim(),
      originalPrice: numOriginalPrice,
      price: numPrice,
      currency: 'INR',
      discount: computedDiscount,
      features: cleanFeatures,
      ctaText: (ctaText || 'Select Plan').trim(),
      highlighted: Boolean(highlighted),
      displayOrder: Number(displayOrder) || 1,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await plansCol.insertOne(newPlan);

    revalidatePlansCache();

    return NextResponse.json({
      success: true,
      message: `Plan "${newPlan.name}" created successfully.`,
      plan: {
        ...newPlan,
        _id: result.insertedId.toString(),
      },
    });
  } catch (error) {
    console.error('API /api/admin/plans POST error:', error);
    return NextResponse.json({ error: 'Failed to create new membership plan.' }, { status: 500 });
  }
}
