import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getAuthenticatedClerkUser } from '@/lib/server-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const requestPath = '/api/user/bookings';

  try {
    // 1. Strict Multi-Layer Server-Side Authentication via Clerk
    const { userId, verifiedEmails } = await getAuthenticatedClerkUser(req);

    if (!userId) {
      console.warn(`[AUTH] Path: ${requestPath} | Authenticated: NO | Status: 401 Unauthorized`);
      return NextResponse.json(
        { error: 'Unauthorized: You must be logged in to view your membership allocations.' },
        { status: 401 }
      );
    }

    const db = await getDatabase();
    const dbName = db.databaseName || 'corexfitness';
    const collectionName = 'bookings';
    const collection = db.collection(collectionName);

    // 2. Safe backward compatibility: associate unlinked historical bookings matching verified email
    if (verifiedEmails.length > 0) {
      try {
        await collection.updateMany(
          {
            email: { $in: verifiedEmails },
            clerkUserId: { $in: [null, undefined, ''] },
          },
          {
            $set: {
              clerkUserId: userId,
              updatedAt: new Date().toISOString(),
            },
          }
        );
      } catch (linkErr) {
        console.warn('Non-critical historical booking association notice:', linkErr);
      }
    }

    // 3. Query bookings strictly for this authenticated user ID
    const bookingsRaw = await collection
      .find({ clerkUserId: userId })
      .sort({ createdAt: -1 })
      .toArray();

    console.log(
      `[AUTH] Path: ${requestPath} | Authenticated: YES | User ID: ${userId} | Database: ${dbName} | Collection: ${collectionName} | Results: ${bookingsRaw.length}`
    );

    // 4. Transform and normalize booking data for client display
    const bookings = bookingsRaw.map((doc) => ({
      _id: doc._id.toString(),
      customerName: doc.customerName || 'Athlete Member',
      email: doc.email || '',
      phone: doc.phone || '',
      state: doc.state || 'West Bengal',
      city: doc.city || 'Kolkata',
      planName: doc.planName || 'Apex Athletic Tier',
      planPrice: doc.planPrice || 'Custom',
      planPeriod: doc.planPeriod || '/month',
      bookingType: doc.bookingType || 'MEMBERSHIP_ALLOCATION',
      preferredDate: doc.preferredDate || doc.createdAt,
      status: (doc.status || 'PENDING').toUpperCase(),
      notes: Array.isArray(doc.notes)
        ? doc.notes.map((n: any) => ({
            id: n.id || String(n._id || ''),
            text: n.text || '',
            author: n.author || 'Concierge',
            createdAt: n.createdAt || '',
          }))
        : [],
      createdAt: doc.createdAt || new Date().toISOString(),
      updatedAt: doc.updatedAt || doc.createdAt || new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      bookings,
      count: bookings.length,
    });
  } catch (error: any) {
    console.error(`[AUTH ERROR] Path: ${requestPath} | Error:`, error?.message || error);
    const isConnError =
      error?.name === 'MongoServerSelectionError' ||
      error?.message?.includes('ECONNREFUSED') ||
      error?.message?.includes('timed out') ||
      !process.env.MONGODB_URI;

    return NextResponse.json(
      {
        error: isConnError
          ? 'Database connection unavailable. Please verify MONGODB_URI is set.'
          : (error?.message || 'Failed to fetch user bookings.'),
        bookings: [],
      },
      { status: 500 }
    );
  }
}
