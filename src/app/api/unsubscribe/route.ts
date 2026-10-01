import { NextRequest, NextResponse } from 'next/server';
import { unsubscribeByToken, setMarketingConsent } from '@/lib/email/contacts-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Unsubscribe token is required.' }, { status: 400 });
    }

    const result = await unsubscribeByToken(token);
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Invalid or expired token.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'You have been successfully unsubscribed from marketing emails.',
      email: result.email,
    });
  } catch (error: any) {
    console.error('API /api/unsubscribe error:', error);
    return NextResponse.json({ error: 'Failed to process unsubscribe request.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { token, email, resubscribe } = body;

    if (token) {
      const result = await unsubscribeByToken(token);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, email: result.email });
    }

    if (email && typeof resubscribe === 'boolean') {
      const result = await setMarketingConsent(email, resubscribe);
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, email });
    }

    return NextResponse.json({ error: 'Token or email is required.' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
  }
}
