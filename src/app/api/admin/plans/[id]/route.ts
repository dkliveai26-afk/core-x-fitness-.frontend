import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { revalidatePlansCache, calculateDiscount } from '@/lib/plans';

export const dynamic = 'force-dynamic';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAdminSession();
    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    const { id } = params;
    if (!id || (!ObjectId.isValid(id) && !id.startsWith('default-') && !id.startsWith('fallback-'))) {
      return NextResponse.json({ error: 'Invalid plan identifier.' }, { status: 400 });
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

    const updateDoc = {
      name: name.trim().toUpperCase(),
      badge: (badge || 'STANDARD').trim().toUpperCase(),
      shortDescription: (shortDescription || '').trim(),
      duration: (duration || '/ MONTH').trim(),
      originalPrice: numOriginalPrice,
      price: numPrice,
      currency: 'INR' as const,
      discount: computedDiscount,
      features: cleanFeatures,
      ctaText: (ctaText || 'Select Plan').trim(),
      highlighted: Boolean(highlighted),
      displayOrder: Number(displayOrder) || 1,
      isActive: Boolean(isActive),
      updatedAt: new Date().toISOString(),
    };

    let query: any = {};
    if (ObjectId.isValid(id)) {
      query._id = new ObjectId(id);
    } else {
      query.name = updateDoc.name;
    }

    const result = await plansCol.updateOne(query, { $set: updateDoc });

    if (result.matchedCount === 0) {
      // If not matched by ID (e.g. from fallback ID), insert it as a new document
      await plansCol.insertOne({
        ...updateDoc,
        createdAt: new Date().toISOString(),
      });
    }

    revalidatePlansCache();

    return NextResponse.json({
      success: true,
      message: `Plan "${updateDoc.name}" updated successfully.`,
    });
  } catch (error) {
    console.error('API /api/admin/plans/[id] PUT error:', error);
    return NextResponse.json({ error: 'Failed to update membership plan.' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAdminSession();
    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    const { id } = params;
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid plan identifier.' }, { status: 400 });
    }

    const db = await getDatabase();
    const plansCol = db.collection('plans');

    const result = await plansCol.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Plan not found.' }, { status: 404 });
    }

    revalidatePlansCache();

    return NextResponse.json({
      success: true,
      message: 'Plan removed successfully.',
    });
  } catch (error) {
    console.error('API /api/admin/plans/[id] DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete membership plan.' }, { status: 500 });
  }
}
