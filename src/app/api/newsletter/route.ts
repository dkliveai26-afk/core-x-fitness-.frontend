import { NextRequest, NextResponse } from 'next/server';
import { upsertContact } from '@/lib/email/contacts-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, name } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address is required.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    await upsertContact({
      email: cleanEmail,
      name: name?.trim() || cleanEmail.split('@')[0] || 'Athlete',
      source: 'FOOTER_NEWSLETTER',
      marketingOptIn: true,
      latestPlan: 'Private Tour Concierge Request',
    });

    return NextResponse.json({
      success: true,
      message: 'VIP Tour Access requested. Concierge desk will be in touch.',
    });
  } catch (error: any) {
    console.error('API /api/newsletter error:', error);
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
  }
}
