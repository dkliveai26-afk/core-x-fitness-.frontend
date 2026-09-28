import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { revalidatePlansCache } from '@/lib/plans';

export const dynamic = 'force-dynamic';

export async function PATCH(
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

    const body = await req.json().catch(() => ({}));
    const db = await getDatabase();
    const plansCol = db.collection('plans');

    const plan = await plansCol.findOne({ _id: new ObjectId(id) });
    if (!plan) {
      return NextResponse.json({ error: 'Plan not found.' }, { status: 404 });
    }

    const newActiveState = body.isActive !== undefined ? Boolean(body.isActive) : !plan.isActive;

    await plansCol.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          isActive: newActiveState,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    revalidatePlansCache();

    return NextResponse.json({
      success: true,
      message: `Plan "${plan.name}" is now ${newActiveState ? 'active on website' : 'deactivated/hidden'}.`,
      isActive: newActiveState,
    });
  } catch (error) {
    console.error('API /api/admin/plans/[id]/toggle PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update plan status.' }, { status: 500 });
  }
}
