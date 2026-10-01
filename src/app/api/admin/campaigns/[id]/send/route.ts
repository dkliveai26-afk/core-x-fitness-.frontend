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

    if (campaign.status === 'SENDING') {
      return NextResponse.json(
        { error: 'This campaign is already actively being dispatched in the background.' },
        { status: 400 }
      );
    }

    // Trigger asynchronous background dispatch without making the HTTP response block
    dispatchCampaignInBackground(params.id).catch((err) => {
      console.error('Campaign background worker error:', err);
    });

    return NextResponse.json({
      success: true,
      message: 'Campaign dispatch started in background. Real-time progress is logged.',
      status: 'SENDING',
    });
  } catch (error: any) {
    console.error('API /api/admin/campaigns/[id]/send error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to dispatch campaign.' }, { status: 500 });
  }
}
