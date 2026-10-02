import { NextRequest, NextResponse } from 'next/server';
import { upsertContact, normalizeEmail } from '@/lib/email/contacts-service';
import { sendUserSignupWelcomeEmail } from '@/lib/email/email-service';
import { getDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawEmail = body.email || '';
    const name = body.name || 'Athlete';
    const userId = body.userId;

    const email = normalizeEmail(rawEmail);
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required.' },
        { status: 400 }
      );
    }

    // 1. Ensure user is registered in marketing_contacts with marketingOptIn = true
    await upsertContact({
      email,
      name,
      source: 'REGISTRATION',
      marketingOptIn: true,
      latestPlan: 'Registered Athlete Account',
    });

    // 2. Check if welcome email was already sent
    const db = await getDatabase();
    const contactsCol = db.collection('marketing_contacts');
    const existing = await contactsCol.findOne({ email });

    let emailResult: any = { success: true, messageId: 'already_sent' };

    if (!existing || !existing.welcomeEmailSentAt) {
      emailResult = await sendUserSignupWelcomeEmail({
        email,
        name,
        userId,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Athlete account synchronized successfully.',
      emailSent: emailResult.success && emailResult.messageId !== 'already_sent',
    });
  } catch (error: any) {
    console.error('API /api/auth/sync error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to sync authentication state.' },
      { status: 500 }
    );
  }
}
