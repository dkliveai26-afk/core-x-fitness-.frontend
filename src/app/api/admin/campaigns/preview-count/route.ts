import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getEligibleCampaignRecipients } from '@/lib/email/contacts-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json({ error: 'Unauthorized: Admin credentials required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const audience = (searchParams.get('audience') || 'ALL_OPTED_IN') as
      | 'ALL_OPTED_IN'
      | 'REGISTERED_USERS'
      | 'BOOKINGS_ONLY'
      | 'CONTACTS_ONLY';

    const recipients = await getEligibleCampaignRecipients(audience);

    return NextResponse.json({
      success: true,
      audience,
      count: recipients.length,
      sampleRecipients: recipients.slice(0, 5).map((r) => ({ email: r.email, name: r.name })),
    });
  } catch (error: any) {
    console.error('API /api/admin/campaigns/preview-count error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch recipient count.' },
      { status: 500 }
    );
  }
}
