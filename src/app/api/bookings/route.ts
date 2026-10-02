import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getAuthenticatedClerkUser } from '@/lib/server-auth';
import { createClerkClient } from '@clerk/backend';
import { upsertContact } from '@/lib/email/contacts-service';
import {
  sendCustomerBookingConfirmation,
  sendAdminBookingNotification,
} from '@/lib/email/email-service';

export async function POST(req: NextRequest) {
  try {
    // 1. Resolve Clerk User ID server-side via robust multi-layer auth
    let { userId: clerkUserId } = await getAuthenticatedClerkUser(req);

    const body = await req.json().catch(() => ({}));
    const {
      customerName,
      email,
      phone,
      planName,
      planPrice,
      planPeriod,
      bookingType,
      preferredDate,
      marketingOptIn,
    } = body;

    // Validate required fields
    if (!customerName || typeof customerName !== 'string' || !customerName.trim()) {
      return NextResponse.json({ error: 'Applicant name is required' }, { status: 400 });
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = customerName.trim();
    const cleanPhone = phone ? String(phone).trim() : '';
    const cleanPlan = planName?.trim() || 'Apex Athletic Tier';
    const cleanPrice = planPrice?.trim() || 'Custom';
    const cleanPeriod = planPeriod?.trim() || '/month';
    const cleanBookingType = bookingType || 'MEMBERSHIP_ALLOCATION';
    const now = new Date().toISOString();
    const cleanPreferredDate = preferredDate || now;

    // If clerkUserId not from session header, check Clerk backend for verified matching email
    const bookingSecretKey =
      (process.env.CLERK_SECRET_KEY || 'sk_test_fe4N9jHveG0FJ2ojRtKPNroBMtuk2TaHTQD5UZ9uL2')
        .trim()
        .replace(/^["']|["']$/g, '');

    if (!clerkUserId && bookingSecretKey) {
      try {
        const clerk = createClerkClient({
          secretKey: bookingSecretKey,
        });
        const clerkUsers = await clerk.users.getUserList({ emailAddress: [cleanEmail] });
        if (clerkUsers.data && clerkUsers.data.length > 0) {
          clerkUserId = clerkUsers.data[0].id;
        }
      } catch (clerkErr) {
        console.warn('Non-critical: Clerk user match lookup notice:', clerkErr);
      }
    }

    const db = await getDatabase();
    const collection = db.collection('bookings');

    // 2. Duplicate booking protection: Prevent accidental rapid double-submissions within 30 seconds
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000).toISOString();
    const recentDuplicate = await collection.findOne({
      email: cleanEmail,
      planName: cleanPlan,
      createdAt: { $gte: thirtySecondsAgo },
    });

    if (recentDuplicate) {
      return NextResponse.json(
        {
          success: true,
          message: 'Membership reservation already confirmed with VIP concierge.',
          id: recentDuplicate._id.toString(),
        },
        { status: 200 }
      );
    }

    const newBooking = {
      customerName: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      planName: cleanPlan,
      planPrice: cleanPrice,
      planPeriod: cleanPeriod,
      bookingType: cleanBookingType,
      preferredDate: cleanPreferredDate,
      status: 'PENDING',
      clerkUserId: clerkUserId || null,
      marketingOptIn: Boolean(marketingOptIn),
      notes: [],
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(newBooking);
    const bookingId = result.insertedId.toString();

    // 3. Asynchronously store / normalize customer in marketing contacts registry
    try {
      await upsertContact({
        email: cleanEmail,
        name: cleanName,
        phone: cleanPhone,
        source: 'BOOKING',
        marketingOptIn: Boolean(marketingOptIn),
        latestPlan: cleanPlan,
      });
    } catch (contactErr) {
      console.error('Non-critical: Failed to upsert contact from booking:', contactErr);
    }

    // 4. Asynchronously dispatch Customer Confirmation & Admin Notification
    Promise.allSettled([
      sendCustomerBookingConfirmation({
        _id: bookingId,
        customerName: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        planName: cleanPlan,
        planPrice: cleanPrice,
        planPeriod: cleanPeriod,
        bookingType: cleanBookingType,
        preferredDate: cleanPreferredDate,
      }),
      sendAdminBookingNotification({
        _id: bookingId,
        customerName: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        planName: cleanPlan,
        planPrice: cleanPrice,
        planPeriod: cleanPeriod,
        bookingType: cleanBookingType,
        preferredDate: cleanPreferredDate,
        createdAt: now,
      }),
    ]).catch((err) => {
      console.error('Non-critical: Booking email notification dispatch error:', err);
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Membership reservation logged with VIP concierge.',
        id: bookingId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('API /api/bookings error:', error);
    const isConnError =
      error?.name === 'MongoServerSelectionError' ||
      error?.message?.includes('ECONNREFUSED') ||
      error?.message?.includes('timed out') ||
      !process.env.MONGODB_URI;

    return NextResponse.json(
      {
        error: isConnError
          ? 'Database connection unavailable. Please verify MONGODB_URI is set in Vercel Environment Variables.'
          : (error?.message || 'Failed to record booking. Please try again.'),
      },
      { status: 500 }
    );
  }
}
