import { ObjectId } from 'mongodb';
import { getDatabase } from '@/lib/mongodb';
import { EmailCampaign, SendEmailResult } from '@/types/email';
import { getEligibleCampaignRecipients } from './contacts-service';
import { sendEmail } from './email-service';
import { generateMarketingCampaignHtml } from './email-templates';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL || 'corexfitness.com'}`
  : 'http://localhost:3000';

/**
 * Creates a new email campaign draft
 */
export async function createEmailCampaign(
  data: Omit<EmailCampaign, '_id' | 'status' | 'sentCount' | 'failedCount' | 'totalEligibleRecipients' | 'createdAt' | 'updatedAt'>
): Promise<EmailCampaign> {
  const db = await getDatabase();
  const campaignsCol = db.collection('email_campaigns');

  const now = new Date().toISOString();
  const newCampaign: Omit<EmailCampaign, '_id'> = {
    ...data,
    status: 'DRAFT',
    totalEligibleRecipients: 0,
    sentCount: 0,
    failedCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const result = await campaignsCol.insertOne(newCampaign as any);
  return {
    _id: result.insertedId.toString(),
    ...newCampaign,
  };
}

/**
 * Updates an existing email campaign
 */
export async function updateEmailCampaign(
  id: string,
  data: Partial<EmailCampaign>
): Promise<boolean> {
  try {
    const db = await getDatabase();
    const campaignsCol = db.collection('email_campaigns');

    const updateDoc: any = { ...data, updatedAt: new Date().toISOString() };
    delete updateDoc._id;

    const result = await campaignsCol.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateDoc }
    );

    return result.matchedCount > 0;
  } catch (error) {
    console.error('Error updating campaign:', error);
    return false;
  }
}

/**
 * Retrieves a single campaign by ID
 */
export async function getEmailCampaignById(id: string): Promise<EmailCampaign | null> {
  try {
    const db = await getDatabase();
    const campaignsCol = db.collection('email_campaigns');
    const doc = await campaignsCol.findOne({ _id: new ObjectId(id) });
    if (!doc) return null;
    return {
      ...doc,
      _id: doc._id.toString(),
    } as EmailCampaign;
  } catch (error) {
    console.error('Error fetching campaign by ID:', error);
    return null;
  }
}

/**
 * Sends a single real test email of a campaign to the admin's email
 */
export async function sendTestCampaign(
  campaignId: string,
  testRecipientEmail: string
): Promise<SendEmailResult> {
  const campaign = await getEmailCampaignById(campaignId);
  if (!campaign) {
    return {
      success: false,
      provider: 'DEVELOPMENT_SIMULATED',
      error: 'Campaign not found.',
    };
  }

  const sampleUnsubscribeUrl = `${BASE_URL}/unsubscribe?token=sample_preview_token`;
  const { html, text } = generateMarketingCampaignHtml({
    heading: campaign.heading,
    bodyMessage: campaign.bodyMessage,
    offerBadge: campaign.offerBadge,
    imageUrl: campaign.imageUrl,
    ctaText: campaign.ctaText,
    ctaUrl: campaign.ctaUrl,
    footerNote: campaign.footerNote,
    recipientName: 'Test Athlete (Admin Preview)',
    unsubscribeUrl: sampleUnsubscribeUrl,
    includePricingCard: campaign.includePricingCard,
    pricingPlanDetails: campaign.pricingPlanDetails,
  });

  return sendEmail({
    to: testRecipientEmail.trim().toLowerCase(),
    subject: `[TEST PREVIEW] ${campaign.subject}`,
    html,
    text,
    emailType: 'TEST_EMAIL',
    campaignId: campaign._id,
    recipientName: 'Admin Tester',
  });
}

/**
 * Background Asynchronous Worker to dispatch campaign batches to eligible recipients
 */
export async function dispatchCampaignInBackground(campaignId: string): Promise<void> {
  try {
    const db = await getDatabase();
    const campaignsCol = db.collection('email_campaigns');

    const campaign = await getEmailCampaignById(campaignId);
    if (!campaign || campaign.status === 'SENDING') {
      return;
    }

    // Mark as SENDING to prevent duplicate sends / concurrency races
    await campaignsCol.updateOne(
      { _id: new ObjectId(campaignId) },
      {
        $set: {
          status: 'SENDING',
          sentAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }
    );

    const recipients = await getEligibleCampaignRecipients(campaign.targetAudience);

    // Update total recipients count
    await campaignsCol.updateOne(
      { _id: new ObjectId(campaignId) },
      { $set: { totalEligibleRecipients: recipients.length } }
    );

    if (recipients.length === 0) {
      await campaignsCol.updateOne(
        { _id: new ObjectId(campaignId) },
        { $set: { status: 'SENT', updatedAt: new Date().toISOString() } }
      );
      return;
    }

    let sentCount = 0;
    let failedCount = 0;

    // Process in batches of 5 concurrent dispatches with slight throttling
    const BATCH_SIZE = 5;
    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const batch = recipients.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map(async (recipient) => {
          const unsubscribeUrl = `${BASE_URL}/unsubscribe?token=${recipient.unsubscribeToken}`;
          const { html, text } = generateMarketingCampaignHtml({
            heading: campaign.heading,
            bodyMessage: campaign.bodyMessage,
            offerBadge: campaign.offerBadge,
            imageUrl: campaign.imageUrl,
            ctaText: campaign.ctaText,
            ctaUrl: campaign.ctaUrl,
            footerNote: campaign.footerNote,
            recipientName: recipient.name,
            unsubscribeUrl,
            includePricingCard: campaign.includePricingCard,
            pricingPlanDetails: campaign.pricingPlanDetails,
          });

          const result = await sendEmail({
            to: recipient.email,
            subject: campaign.subject,
            html,
            text,
            emailType: 'MARKETING_CAMPAIGN',
            campaignId: campaign._id,
            recipientName: recipient.name,
          });

          if (result.success) {
            sentCount++;
          } else {
            failedCount++;
          }
        })
      );

      // Throttling delay between batches
      if (i + BATCH_SIZE < recipients.length) {
        await new Promise((resolve) => setTimeout(resolve, 350));
      }

      // Update live progress in DB
      await campaignsCol.updateOne(
        { _id: new ObjectId(campaignId) },
        {
          $set: {
            sentCount,
            failedCount,
            updatedAt: new Date().toISOString(),
          },
        }
      );
    }

    // Mark as completed
    const finalStatus = sentCount > 0 ? 'SENT' : failedCount > 0 ? 'FAILED' : 'SENT';
    await campaignsCol.updateOne(
      { _id: new ObjectId(campaignId) },
      {
        $set: {
          status: finalStatus,
          sentCount,
          failedCount,
          updatedAt: new Date().toISOString(),
        },
      }
    );
  } catch (error) {
    console.error('Error dispatching campaign in background:', error);
    try {
      const db = await getDatabase();
      await db.collection('email_campaigns').updateOne(
        { _id: new ObjectId(campaignId) },
        {
          $set: {
            status: 'FAILED',
            updatedAt: new Date().toISOString(),
          },
        }
      );
    } catch {}
  }
}
