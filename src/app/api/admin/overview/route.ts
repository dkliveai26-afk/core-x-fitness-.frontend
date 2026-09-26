import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin authentication required' },
        { status: 401 }
      );
    }

    const db = await getDatabase();
    const contactsCol = db.collection('contacts');
    const bookingsCol = db.collection('bookings');

    const [
      totalInquiries,
      newInquiries,
      totalBookings,
      activeBookings,
      pendingBookings,
      completedBookings,
      recentContactsRaw,
      recentBookingsRaw,
    ] = await Promise.all([
      contactsCol.countDocuments(),
      contactsCol.countDocuments({ status: { $in: ['NEW', 'unread', 'pending'] } }),
      bookingsCol.countDocuments(),
      bookingsCol.countDocuments({ status: { $in: ['CONFIRMED', 'ACTIVE', 'confirmed'] } }),
      bookingsCol.countDocuments({ status: { $in: ['PENDING', 'pending'] } }),
      bookingsCol.countDocuments({ status: { $in: ['COMPLETED', 'completed'] } }),
      contactsCol.find().sort({ createdAt: -1 }).limit(6).toArray(),
      bookingsCol.find().sort({ createdAt: -1 }).limit(6).toArray(),
    ]);

    // Normalize IDs to string
    const recentContacts = recentContactsRaw.map((doc: any) => ({
      ...doc,
      _id: doc._id.toString(),
    }));

    const recentBookings = recentBookingsRaw.map((doc: any) => ({
      ...doc,
      _id: doc._id.toString(),
    }));

    return NextResponse.json({
      stats: {
        totalBookings,
        pendingBookings,
        activeBookings,
        completedBookings,
        totalInquiries,
        newInquiries,
      },
      recentContacts,
      recentBookings,
      adminUser: session.user,
    });
  } catch (error) {
    console.error('API /api/admin/overview error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve admin dashboard metrics' },
      { status: 500 }
    );
  }
}
