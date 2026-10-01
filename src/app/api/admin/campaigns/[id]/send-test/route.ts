import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { sendTestCampaign } from '@/lib/email/campaign-service';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAdminSession();
    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const testEmail = body.testEmail || session.user.email || 'dilkhushdeveloper@gmail.com';

    if (!testEmail || !testEmail.includes('@')) {
      return NextResponse.json({ error: 'Valid test email address is required.' }, { status: 400 });
    }

    const result = await sendTestCampaign(params.id, testEmail);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to dispatch test preview email.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Test email dispatched successfully to ${testEmail}.`,
      provider: result.provider,
      messageId: result.messageId,
    });
  } catch (error: any) {
    console.error('API /api/admin/campaigns/[id]/send-test error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to send test email.' }, { status: 500 });
  }
}
