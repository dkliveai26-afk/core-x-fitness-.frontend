import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getEmailCampaignById, dispatchCampaignInBackground } from '@/lib/email/campaign-service';

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

    const campaign = await getEmailCampaignById(params.id);
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found.' }, { status: 404 });
    }

    // Await campaign dispatch to ensure all Resend network requests complete before response
    const dispatchResult = await dispatchCampaignInBackground(params.id);
    const updatedCampaign = await getEmailCampaignById(params.id);

    return NextResponse.json({
      success: true,
      message: `Campaign broadcast completed. Sent: ${dispatchResult.sentCount}, Failed: ${dispatchResult.failedCount} out of ${dispatchResult.totalRecipients} recipients.`,
      campaign: updatedCampaign,
      sentCount: dispatchResult.sentCount,
      failedCount: dispatchResult.failedCount,
      totalRecipients: dispatchResult.totalRecipients,
      status: updatedCampaign?.status || 'SENT',
    });
  } catch (error: any) {
    console.error('API /api/admin/campaigns/[id]/send error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to dispatch campaign.' }, { status: 500 });
  }
}
