import { NextRequest, NextResponse } from 'next/server';
import { upsertContact, normalizeEmail } from '@/lib/email/contacts-service';
import { sendUserSignupWelcomeEmail } from '@/lib/email/email-service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json().catch(() => ({}));
    const eventType = payload?.type;
    const data = payload?.data;

    if (!data) {
      return NextResponse.json({ message: 'No payload data provided.' }, { status: 200 });
    }

    if (eventType === 'user.created' || eventType === 'user.updated') {
      const emailObj =
        data.email_addresses?.find((e: any) => e.id === data.primary_email_address_id) ||
        data.email_addresses?.[0];
      const rawEmail = emailObj?.email_address;
      const email = normalizeEmail(rawEmail);

      if (email && email.includes('@')) {
        const fullName =
          [data.first_name, data.last_name].filter(Boolean).join(' ').trim() ||
          data.username ||
          'Registered Athlete';

        await upsertContact({
          email,
          name: fullName,
          source: 'REGISTRATION',
          marketingOptIn: true,
          latestPlan: 'Registered Athlete Account',
        });

        // If user was just created, send confirmation welcome email
        if (eventType === 'user.created') {
          await sendUserSignupWelcomeEmail({
            email,
            name: fullName,
            userId: data.id,
          });
        }
      }
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error: any) {
    console.error('Clerk webhook error:', error);
    return NextResponse.json({ error: error?.message || 'Webhook processing failed.' }, { status: 500 });
  }
}
