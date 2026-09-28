import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getDatabase } from '@/lib/mongodb';
import { revalidateOfferBannerCache } from '@/lib/offer-banner';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const db = await getDatabase();
    const bannerCol = db.collection('offer_banners');

    const latestBanner = await bannerCol.findOne({}, { sort: { updatedAt: -1 } });
    if (!latestBanner) {
      return NextResponse.json({ error: 'No offer banner found.' }, { status: 404 });
    }

    const newActiveState = body.isActive !== undefined ? Boolean(body.isActive) : !latestBanner.isActive;

    if (newActiveState) {
      // Ensure only this banner is active
      await bannerCol.updateMany({}, { $set: { isActive: false } });
    }

    await bannerCol.updateOne(
      { _id: latestBanner._id },
      {
        $set: {
          isActive: newActiveState,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    revalidateOfferBannerCache();

    return NextResponse.json({
      success: true,
      message: `Offer banner is now ${newActiveState ? 'active on website' : 'hidden'}.`,
      isActive: newActiveState,
    });
  } catch (error) {
    console.error('API /api/admin/offer-banner/toggle PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update offer banner status.' }, { status: 500 });
  }
}
