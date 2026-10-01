import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getDatabase } from '@/lib/mongodb';
import { getAudienceStats } from '@/lib/email/contacts-service';
import { createEmailCampaign } from '@/lib/email/campaign-service';
import { getActiveEmailProvider } from '@/lib/email/email-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    const db = await getDatabase();
    const campaignsCol = db.collection('email_campaigns');

    const campaigns = await campaignsCol
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    const formattedCampaigns = campaigns.map((c) => ({
      ...c,
      _id: c._id.toString(),
    }));

    const stats = await getAudienceStats();
    const providerInfo = getActiveEmailProvider();

    return NextResponse.json({
      success: true,
      campaigns: formattedCampaigns,
      stats,
      providerInfo,
    });
  } catch (error: any) {
    console.error('API /api/admin/campaigns GET error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to retrieve email campaigns.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const {
      title,
      subject,
      preheader,
      heading,
      bodyMessage,
      offerBadge,
      imageUrl,
      ctaText,
      ctaUrl,
      footerNote,
      targetAudience,
      includePricingCard,
      pricingPlanId,
      pricingPlanDetails,
    } = body;

    // Validation
    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ error: 'Campaign title is required.' }, { status: 400 });
    }
    if (!subject || typeof subject !== 'string' || !subject.trim()) {
      return NextResponse.json({ error: 'Email subject is required.' }, { status: 400 });
    }
    if (!heading || typeof heading !== 'string' || !heading.trim()) {
      return NextResponse.json({ error: 'Email heading is required.' }, { status: 400 });
    }
    if (!bodyMessage || typeof bodyMessage !== 'string' || !bodyMessage.trim()) {
      return NextResponse.json({ error: 'Email body message is required.' }, { status: 400 });
    }

    const newCampaign = await createEmailCampaign({
      title: title.trim(),
      subject: subject.trim(),
      preheader: preheader ? preheader.trim() : undefined,
      heading: heading.trim(),
      bodyMessage: bodyMessage.trim(),
      offerBadge: offerBadge ? offerBadge.trim() : 'EXCLUSIVE VIP ATHLETE ACCESS',
      imageUrl: imageUrl ? imageUrl.trim() : undefined,
      ctaText: ctaText ? ctaText.trim() : 'Claim Exclusive Offer',
      ctaUrl: ctaUrl ? ctaUrl.trim() : 'https://corexfitness.com/plans#pricing-matrix',
      footerNote: footerNote ? footerNote.trim() : undefined,
      targetAudience: targetAudience || 'ALL_OPTED_IN',
      includePricingCard: Boolean(includePricingCard),
      pricingPlanId: pricingPlanId || undefined,
      pricingPlanDetails: includePricingCard && pricingPlanDetails ? pricingPlanDetails : undefined,
      createdBy: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Email campaign created successfully.',
        campaign: newCampaign,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('API /api/admin/campaigns POST error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create campaign.' },
      { status: 500 }
    );
  }
}
