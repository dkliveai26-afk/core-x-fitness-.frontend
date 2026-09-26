import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, email, phone, topic, service, message } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }
    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      return NextResponse.json({ error: 'Contact phone number is required' }, { status: 400 });
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection('contacts');

    const now = new Date().toISOString();
    const newSubmission = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: String(phone).trim(),
      topic: (service || topic || 'Membership Admissions').trim(),
      message: message.trim(),
      status: 'NEW',
      notes: [],
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(newSubmission);

    return NextResponse.json(
      {
        success: true,
        message: 'Dispatch received. VIP Concierge will respond shortly.',
        id: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('API /api/contact error:', error);
    const isConnError =
      error?.name === 'MongoServerSelectionError' ||
      error?.message?.includes('ECONNREFUSED') ||
      error?.message?.includes('timed out') ||
      !process.env.MONGODB_URI;

    return NextResponse.json(
      {
        error: isConnError
          ? 'Database connection unavailable. Please verify MONGODB_URI is set in Vercel Environment Variables.'
          : (error?.message || 'Failed to process inquiry dispatch. Please try again or contact directly.'),
      },
      { status: 500 }
    );
  }
}
