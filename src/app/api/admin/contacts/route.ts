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
        { error: 'Unauthorized: Administrator credentials required' },
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
    const collection = db.collection('contacts');

    // Build query filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const queryFilter: Filter<any> = {};

    if (status && status !== 'ALL') {
      queryFilter.status = { $regex: `^${status}$`, $options: 'i' };
    }

    if (search) {
      queryFilter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { topic: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
      ];
    }

    const [total, contactsRaw] = await Promise.all([
      collection.countDocuments(queryFilter),
      collection.find(queryFilter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
    ]);

    const contacts = contactsRaw.map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
    }));

    return NextResponse.json({
      contacts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    console.error('API /api/admin/contacts error:', error);
    return NextResponse.json({ error: 'Failed to fetch contact inquiries' }, { status: 500 });
  }
}
