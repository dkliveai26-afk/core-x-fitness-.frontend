import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getDatabase } from '@/lib/mongodb';
import { Filter } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim() || '';
    const status = searchParams.get('status')?.trim() || 'ALL';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    const db = await getDatabase();
    const collection = db.collection('bookings');

    // Build query filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const queryFilter: Filter<any> = {};

    if (status && status !== 'ALL') {
      queryFilter.status = { $regex: `^${status}$`, $options: 'i' };
    }

    if (search) {
      queryFilter.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } },
        { planName: { $regex: search, $options: 'i' } },
        { bookingType: { $regex: search, $options: 'i' } },
      ];
    }

    const [total, bookingsRaw] = await Promise.all([
      collection.countDocuments(queryFilter),
      collection.find(queryFilter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
    ]);

    const bookings = bookingsRaw.map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
    }));

    return NextResponse.json({
      bookings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    console.error('API /api/admin/bookings error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
