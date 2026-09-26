import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    let clerkUserId: string | null = null;
    try {
      const authData = await auth();
      clerkUserId = authData?.userId || null;
    } catch {
      // Clerk auth optional on booking form
    }
    const body = await req.json();
    const {
      customerName,
      email,
      phone,
      planName,
      planPrice,
      planPeriod,
      bookingType,
      preferredDate,
    } = body;

    // Validate required fields
    if (!customerName || typeof customerName !== 'string' || !customerName.trim()) {
      return NextResponse.json({ error: 'Applicant name is required' }, { status: 400 });
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection('bookings');

    const now = new Date().toISOString();
    const newBooking = {
      customerName: customerName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      planName: planName?.trim() || 'Apex Athletic Tier',
      planPrice: planPrice?.trim() || 'Custom',
      planPeriod: planPeriod?.trim() || '/month',
      bookingType: bookingType || 'MEMBERSHIP_ALLOCATION',
      preferredDate: preferredDate || now,
      status: 'PENDING',
      clerkUserId: clerkUserId || null,
      notes: [],
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(newBooking);

    return NextResponse.json(
      {
        success: true,
        message: 'Membership reservation logged with VIP concierge.',
        id: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API /api/bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to record booking. Please try again.' },
      { status: 500 }
    );
  }
}
