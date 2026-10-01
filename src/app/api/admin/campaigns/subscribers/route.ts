import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getDatabase } from '@/lib/mongodb';
import {
  setMarketingConsent,
  upsertContact,
  getAudienceStats,
} from '@/lib/email/contacts-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = (searchParams.get('search') || '').trim().toLowerCase();
    const filter = searchParams.get('filter') || 'ALL'; // ALL, OPTED_IN, UNSUBSCRIBED, NOT_OPTED_IN

    const db = await getDatabase();
    const contactsCol = db.collection('marketing_contacts');

    // Auto-sync if contacts collection has 0 items
    const count = await contactsCol.countDocuments();
    if (count === 0) {
      const bookingsCol = db.collection('bookings');
      const inquiriesCol = db.collection('contacts');
      const [allBookings, allInquiries] = await Promise.all([
        bookingsCol.find().toArray(),
        inquiriesCol.find().toArray(),
      ]);

      for (const b of allBookings) {
        if (b.email) {
          await upsertContact({
            email: b.email,
            name: b.customerName,
            phone: b.phone,
            source: 'BOOKING',
            marketingOptIn: b.marketingOptIn === true,
            latestPlan: b.planName,
          });
        }
      }

      for (const c of allInquiries) {
        if (c.email) {
          await upsertContact({
            email: c.email,
            name: c.name,
            phone: c.phone,
            source: 'CONTACT',
            marketingOptIn: c.marketingOptIn === true,
            latestPlan: c.topic,
          });
        }
      }
    }

    const query: any = {};
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    if (filter === 'OPTED_IN') {
      query.marketingOptIn = true;
    } else if (filter === 'UNSUBSCRIBED') {
      query.marketingOptOutAt = { $exists: true, $ne: null };
    } else if (filter === 'NOT_OPTED_IN') {
      query.marketingOptIn = { $ne: true };
    }

    const [subscribers, stats] = await Promise.all([
      contactsCol.find(query).sort({ lastActiveAt: -1 }).limit(100).toArray(),
      getAudienceStats(),
    ]);

    const formatted = subscribers.map((s) => ({
      ...s,
      _id: s._id.toString(),
    }));

    return NextResponse.json({
      success: true,
      subscribers: formatted,
      stats,
      total: formatted.length,
    });
  } catch (error: any) {
    console.error('API /api/admin/campaigns/subscribers GET error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to retrieve subscribers.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { email, marketingOptIn } = body;

    if (!email || typeof marketingOptIn !== 'boolean') {
      return NextResponse.json({ error: 'Email and boolean marketingOptIn are required.' }, { status: 400 });
    }

    const result = await setMarketingConsent(email, marketingOptIn);
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to update consent.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Marketing consent updated to ${marketingOptIn ? 'OPTED IN' : 'OPTED OUT'}.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error updating consent.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDatabase();
    const bookingsCol = db.collection('bookings');
    const inquiriesCol = db.collection('contacts');

    const [allBookings, allInquiries] = await Promise.all([
      bookingsCol.find().toArray(),
      inquiriesCol.find().toArray(),
    ]);

    let syncedCount = 0;

    for (const b of allBookings) {
      if (b.email) {
        await upsertContact({
          email: b.email,
          name: b.customerName,
          phone: b.phone,
          source: 'BOOKING',
          marketingOptIn: b.marketingOptIn === true,
          latestPlan: b.planName,
        });
        syncedCount++;
      }
    }

    for (const c of allInquiries) {
      if (c.email) {
        await upsertContact({
          email: c.email,
          name: c.name,
          phone: c.phone,
          source: 'CONTACT',
          marketingOptIn: c.marketingOptIn === true,
          latestPlan: c.topic,
        });
        syncedCount++;
      }
    }

    const stats = await getAudienceStats();

    return NextResponse.json({
      success: true,
      message: `Synchronized ${syncedCount} records into marketing contacts registry.`,
      stats,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Sync error.' }, { status: 500 });
  }
}
