import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin credentials required' },
        { status: 401 }
      );
    }

    const db = await getDatabase();
    const bookingsCol = db.collection('bookings');
    const contactsCol = db.collection('contacts');

    // Aggregate unique customer members from real MongoDB bookings and contacts
    const [allBookings, allContacts] = await Promise.all([
      bookingsCol.find().sort({ createdAt: -1 }).toArray(),
      contactsCol.find().sort({ createdAt: -1 }).toArray(),
    ]);

    const memberMap = new Map<string, any>();

    for (const b of allBookings) {
      const email = (b.email || '').toLowerCase().trim();
      if (!email) continue;

      if (!memberMap.has(email)) {
        memberMap.set(email, {
          id: b._id.toString(),
          fullName: b.customerName || 'Athlete Member',
          email: b.email,
          phone: b.phone || 'N/A',
          firstSeen: b.createdAt,
          lastActive: b.createdAt,
          totalBookings: 1,
          latestPlan: b.planName || 'Membership Allocation',
          latestBookingStatus: b.status || 'PENDING',
          inquiryCount: 0,
        });
      } else {
        const existing = memberMap.get(email);
        existing.totalBookings += 1;
        if (new Date(b.createdAt) > new Date(existing.lastActive)) {
          existing.lastActive = b.createdAt;
          existing.latestPlan = b.planName || existing.latestPlan;
          existing.latestBookingStatus = b.status || existing.latestBookingStatus;
        }
      }
    }

    for (const c of allContacts) {
      const email = (c.email || '').toLowerCase().trim();
      if (!email) continue;

      if (!memberMap.has(email)) {
        memberMap.set(email, {
          id: c._id.toString(),
          fullName: c.name || 'Inquiry Contact',
          email: c.email,
          phone: c.phone || 'N/A',
          firstSeen: c.createdAt,
          lastActive: c.createdAt,
          totalBookings: 0,
          latestPlan: c.topic || 'General Inquiry',
          latestBookingStatus: 'INQUIRY_ONLY',
          inquiryCount: 1,
        });
      } else {
        const existing = memberMap.get(email);
        existing.inquiryCount += 1;
      }
    }

    const usersData = Array.from(memberMap.values()).sort(
      (a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
    );

    return NextResponse.json({ users: usersData, total: usersData.length });
  } catch (error) {
    console.error('API /api/admin/users error:', error);
    return NextResponse.json({ error: 'Failed to retrieve members list' }, { status: 500 });
  }
}
