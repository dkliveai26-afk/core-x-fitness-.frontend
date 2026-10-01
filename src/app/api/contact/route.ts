import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { upsertContact } from '@/lib/email/contacts-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, email, phone, topic, service, message, marketingOptIn } = body;

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
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPhone = String(phone).trim();
    const cleanTopic = (service || topic || 'Membership Admissions').trim();
    const cleanMessage = message.trim();

    const newSubmission = {
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      topic: cleanTopic,
      message: cleanMessage,
      marketingOptIn: Boolean(marketingOptIn),
      status: 'NEW',
      notes: [],
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(newSubmission);

    // Synchronize to marketing contacts registry safely
    try {
      await upsertContact({
        email: cleanEmail,
        name: cleanName,
        phone: cleanPhone,
        source: 'CONTACT',
        marketingOptIn: Boolean(marketingOptIn),
        latestPlan: cleanTopic,
      });
    } catch (contactErr) {
      console.error('Non-critical: Contact registry upsert notice:', contactErr);
    }

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
