import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
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
      phone: phone.trim(),
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
  } catch (error) {
    console.error('API /api/contact error:', error);
    return NextResponse.json(
      { error: 'Failed to process inquiry dispatch. Please try again or contact directly.' },
      { status: 500 }
    );
  }
}
