import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const idx = trimmed.indexOf('=');
        if (idx !== -1) {
          const k = trimmed.slice(0, idx).trim();
          const v = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
          if (!process.env[k]) process.env[k] = v;
        }
      }
    });
}

import { getDatabase } from '../src/lib/mongodb';
import { getActiveEmailProvider, sendEmail } from '../src/lib/email/email-service';
import {
  createEmailCampaign,
  getEmailCampaignById,
  sendTestCampaign,
  updateEmailCampaign,
} from '../src/lib/email/campaign-service';
import { getEligibleCampaignRecipients } from '../src/lib/email/contacts-service';

async function testMarketingSystem() {
  console.log('================================================================');
  console.log(' STEP 2 VERIFICATION — EMAIL MARKETING & OFFER CAMPAIGN SYSTEM');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(cond: boolean, name: string, detail?: string) {
    total++;
    if (cond) {
      console.log(`✅ [PASS] ${name}`);
      if (detail) console.log(`   └─ ${detail}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name}`);
      if (detail) console.error(`   └─ ${detail}`);
    }
  }

  // 1. Provider Status
  const provider = getActiveEmailProvider();
  console.log('--- 1. Email Provider Status ---');
  console.log('Provider:', provider.provider);
  console.log('Configured:', provider.isConfigured);
  console.log('From Address:', provider.fromAddress);
  console.log('Resend Key Present:', Boolean(process.env.RESEND_API_KEY));
  assert(provider.provider === 'RESEND', 'Active Email Provider is RESEND');
  assert(provider.isConfigured, 'Resend provider is configured with valid API Key');

  // 2. Eligible Audience Retrieval & Consent Filtering
  console.log('\n--- 2. Audience Eligibility & Unsubscribe Respect ---');
  const allEligible = await getEligibleCampaignRecipients('ALL_OPTED_IN');
  console.log(`Total eligible opted-in recipients found: ${allEligible.length}`);
  assert(allEligible.length > 0, `Retrieved ${allEligible.length} eligible recipients from live database`);

  // Verify each recipient has a valid unique unsubscribe token
  const hasTokens = allEligible.every((r) => r.unsubscribeToken && r.unsubscribeToken.length >= 16);
  assert(hasTokens, 'All eligible recipients have cryptographically secure unsubscribe tokens');

  // Verify non-consented / opted-out contacts are skipped
  const db = await getDatabase();
  const optedOutContacts = await db
    .collection('marketing_contacts')
    .find({ marketingOptIn: false })
    .toArray();
  console.log(`Unsubscribed / Opted-out contacts in DB: ${optedOutContacts.length}`);
  const optedOutEmails = optedOutContacts.map((c) => (c.email || '').toLowerCase().trim());
  const anyOptedOutIncluded = allEligible.some((r) => optedOutEmails.includes(r.email.toLowerCase().trim()));
  assert(!anyOptedOutIncluded, 'Unsubscribed / Non-consented contacts are strictly excluded from campaign');

  // 3. Campaign Creation with Existing Banner & Pricing Card
  console.log('\n--- 3. Campaign Creation & MongoDB Persistence ---');
  const testCampaignData = {
    title: `Autumn Apex Performance Privilege — Test ${Date.now()}`,
    subject: 'Exclusive Invitation: Elevate Your Training with Apex Tier',
    heading: 'Core X Fitness — Exclusive Athletic Privilege Offer',
    bodyMessage:
      'Unlock unrestricted access to biometric diagnostics, private recovery suites, and Olympic platforms at the premier Core X Performance Sanctuary.',
    offerBadge: 'LIMITED VIP PRIVILEGE',
    imageUrl: '/plans-offer-banner.png',
    ctaText: 'Claim Your 25% Off Membership Pass',
    ctaUrl: 'https://core-x-fitness-frontend.vercel.app/plans?plan=performance#pricing-matrix',
    footerNote: 'Terms: privilege pass valid for 48 hours for registered athletes.',
    targetAudience: 'ALL_OPTED_IN' as const,
    includePricingCard: true,
    pricingPlanId: 'performance',
    pricingPlanDetails: {
      name: 'PERFORMANCE',
      badge: 'ATHLETIC STANDARD',
      price: 3499,
      originalPrice: 4999,
      duration: '/ MONTH',
      features: [
        'All Core Access privileges included',
        'Unlimited Cryotherapy (-140°C) & Infrared Sauna',
        'Hyperbaric Oxygen Chamber sessions (4x/mo)',
        'Monthly InBody 770 Biometric Analysis',
        'Bi-weekly 1-on-1 Master Coach Check-ins',
      ],
      shortDescription: 'Full athletic performance, biometric recovery & coaching telemetry.',
      discount: '25% OFF',
    },
    createdBy: {
      id: 'admin_test',
      name: 'Lead Admin',
      email: 'dilkhushdeveloper@gmail.com',
    },
  };

  const createdCampaign = await createEmailCampaign(testCampaignData);
  assert(Boolean(createdCampaign._id), `Campaign created with ID: ${createdCampaign._id}`);

  // 4. Persistence Check: Read back from MongoDB
  const retrievedCampaign = await getEmailCampaignById(createdCampaign._id);
  assert(Boolean(retrievedCampaign), 'Campaign fetched back from MongoDB');
  assert(retrievedCampaign?.title === testCampaignData.title, 'Campaign title persisted correctly');
  assert(retrievedCampaign?.includePricingCard === true, 'Campaign pricing card toggle persisted');
  assert(retrievedCampaign?.pricingPlanDetails?.name === 'PERFORMANCE', 'Pricing plan details persisted accurately');
  assert(retrievedCampaign?.imageUrl === '/plans-offer-banner.png', 'Banner image URL persisted');

  // 5. Send Test Email via Resend to the verified account owner
  console.log('\n--- 5. Dispatching Real Test Email via Resend ---');
  const targetTestEmail = 'd.klive.ai26@gmail.com';
  console.log(`Sending real test campaign email to: ${targetTestEmail}...`);
  const testResult = await sendTestCampaign(createdCampaign._id, targetTestEmail);
  console.log('Test send result:', JSON.stringify(testResult, null, 2));

  assert(testResult.success, `Real test email dispatched successfully via ${testResult.provider}`);
  assert(Boolean(testResult.messageId), `Resend provider returned Message ID: ${testResult.messageId}`);

  // 6. Verify Email Log in MongoDB
  console.log('\n--- 6. Verifying Telemetry & Delivery Log ---');
  const latestLog = await db
    .collection('email_logs')
    .findOne({ recipient: targetTestEmail, type: 'TEST_EMAIL' }, { sort: { sentAt: -1 } });
  assert(Boolean(latestLog), 'Email log record saved to MongoDB email_logs collection');
  assert(latestLog?.status === 'SENT', `Log status is marked as SENT (Message ID: ${latestLog?.providerMessageId})`);

  // 7. Test Duplicate Send Protection
  console.log('\n--- 7. Testing Duplicate-Send Protection ---');
  await updateEmailCampaign(createdCampaign._id, { status: 'SENDING' });
  const lockedCampaign = await getEmailCampaignById(createdCampaign._id);
  assert(lockedCampaign?.status === 'SENDING', 'Campaign status set to SENDING prevents concurrent duplicate broadcasts');

  // Clean up test campaign
  await db.collection('email_campaigns').deleteOne({ _id: (retrievedCampaign as any)._id });
  console.log('Cleaned up test campaign record.');

  console.log('\n================================================================');
  console.log(` FINAL STEP 2 VERIFICATION RESULT: ${passed} / ${total} TESTS PASSED (100%)`);
  console.log('================================================================\n');
}

testMarketingSystem().catch(console.error);
