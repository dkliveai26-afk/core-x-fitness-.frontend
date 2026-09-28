import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { revalidatePlansCache } from '@/lib/plans';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    const body = await req.json();
    const { orders } = body; // Array of { id: string, displayOrder: number }

    if (!Array.isArray(orders) || orders.length === 0) {
      return NextResponse.json({ error: 'Orders array is required.' }, { status: 400 });
    }

    const db = await getDatabase();
    const plansCol = db.collection('plans');

    const bulkOps = orders
      .filter((item) => item.id && ObjectId.isValid(item.id))
      .map((item) => ({
        updateOne: {
          filter: { _id: new ObjectId(item.id) },
          update: {
            $set: {
              displayOrder: Number(item.displayOrder) || 1,
              updatedAt: new Date().toISOString(),
            },
          },
        },
      }));

    if (bulkOps.length > 0) {
      await plansCol.bulkWrite(bulkOps);
    }

    revalidatePlansCache();

    return NextResponse.json({
      success: true,
      message: 'Plan display orders updated successfully.',
    });
  } catch (error) {
    console.error('API /api/admin/plans/reorder PATCH error:', error);
    return NextResponse.json({ error: 'Failed to reorder plans.' }, { status: 500 });
  }
}
