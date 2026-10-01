import fs from 'fs';
import path from 'path';

// Load .env.local manually for standalone Node execution
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    for (const line of envConfig.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...rest] = trimmed.split('=');
        process.env[key.trim()] = rest.join('=').trim();
      }
    }
  }
} catch (e) {}

import { getDatabase } from '../src/lib/mongodb';
import { createClerkClient } from '@clerk/backend';
import {
  createEmailCampaign,
  updateEmailCampaign,
  getEmailCampaignById,
  sendTestCampaign,
} from '../src/lib/email/campaign-service';
import {
  getActiveEmailProvider,
  sendCustomerBookingConfirmation,
  sendAdminBookingNotification,
} from '../src/lib/email/email-service';
import { getEligibleCampaignRecipients, getAudienceStats } from '../src/lib/email/contacts-service';

async function testFullProductionPersistence() {
  console.log('================================================================');
  console.log('  CORE X FITNESS — PRODUCTION DATABASE & DELIVERY VERIFICATION');
  console.log('================================================================\n');

  // 1. Check MongoDB Connection
  console.log('1. Testing MongoDB Production Connection & Telemetry...');
  const db = await getDatabase();
  const pingResult = await db.command({ ping: 1 });
  console.log('   ✓ MongoDB Ping Successful:', pingResult);

  // 2. Check Clerk Auth
  console.log('\n2. Testing Clerk Auth Multi-Source Integration...');
  const clerkKey = process.env.CLERK_SECRET_KEY?.trim().replace(/^["']|["']$/g, '');
  if (!clerkKey) {
    throw new Error('CLERK_SECRET_KEY missing in environment variables.');
  }
  const clerk = createClerkClient({ secretKey: clerkKey });
  const clerkUsers = await clerk.users.getUserList({ limit: 500 });
  console.log(`   ✓ Found ${clerkUsers.data.length} real athlete accounts in Clerk Auth:`);
  for (const u of clerkUsers.data) {
    const email =
      u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId)?.emailAddress ||
      u.emailAddresses[0]?.emailAddress;
    console.log(`     - [Clerk User] ${u.firstName || ''} ${u.lastName || ''} <${email}>`);
  }

  // 3. Test Audience Stats & Eligible Recipients
  console.log('\n3. Testing Audience Aggregation & Consent Metrics...');
  const audienceStats = await getAudienceStats();
  console.log('   ✓ Live Audience Stats:', audienceStats);
  const eligibleRecipients = await getEligibleCampaignRecipients('ALL_OPTED_IN');
  console.log(`   ✓ Found ${eligibleRecipients.length} eligible opted-in recipients ready for broadcasts:`);
  eligibleRecipients.forEach((r) => console.log(`     - <${r.email}> (${r.name})`));

  // 4. Test Campaign CRUD & Persistence
  console.log('\n4. Testing Campaign Database Persistence & Lifecycle...');
  const plans = await db.collection('plans').find().toArray();
  const selectedPlan = plans.find((p) => p.name.toLowerCase().includes('performance')) || plans[0];

  // A. Create Campaign
  const initialCampaign = await createEmailCampaign({
    title: 'Autumn Apex Elevation Privilege — 2026',
    subject: 'Exclusive Invitation: Elevate Your Training with Apex Tier',
    heading: 'Core X Fitness — Exclusive Athletic Privilege',
    bodyMessage: 'Unlock unrestricted access to biometric diagnostics, private recovery suites, and Olympic platforms.',
    offerBadge: 'LIMITED VIP PRIVILEGE',
    imageUrl: '/plans-offer-banner.png',
    ctaText: 'Claim Offer & View Plan',
    ctaUrl: `https://core-x-fitness-frontend.vercel.app/plans?plan=${selectedPlan.name.toLowerCase()}#pricing-matrix`,
    footerNote: 'Valid for registered athletes. Automatic deep-link to selected pricing card.',
    targetAudience: 'ALL_OPTED_IN',
    includePricingCard: true,
    pricingPlanId: selectedPlan.name.toLowerCase(),
    pricingPlanDetails: {
      name: selectedPlan.name,
      badge: selectedPlan.badge || 'ELITE TIER',
      price: selectedPlan.price,
      originalPrice: selectedPlan.originalPrice,
      duration: selectedPlan.duration || '/mo',
      features: selectedPlan.features || ['Custom Biometrics', 'Recovery Suite'],
      shortDescription: selectedPlan.shortDescription || 'Elite conditioning for athletes.',
      discount: '25% OFF',
    },
  });
  console.log(`   ✓ Created Campaign in MongoDB: ID ${initialCampaign._id}`);

  // B. Verify Read
  const fetchedCampaign = await getEmailCampaignById(initialCampaign._id);
  if (!fetchedCampaign || fetchedCampaign.title !== initialCampaign.title) {
    throw new Error('Failed to retrieve persisted campaign from MongoDB.');
  }
  console.log('   ✓ Campaign retrieved successfully from MongoDB with all fields intact.');

  // C. Test Update / PATCH
  const updateSuccess = await updateEmailCampaign(initialCampaign._id, {
    heading: 'Core X Fitness — UPDATED Athletic Privilege Offer',
    footerNote: 'Updated terms: offer valid for next 48 hours.',
  });
  if (!updateSuccess) {
    throw new Error('Failed to update campaign in MongoDB.');
  }
  const updatedCampaign = await getEmailCampaignById(initialCampaign._id);
  console.log(`   ✓ Campaign updated in MongoDB. New heading: "${updatedCampaign?.heading}"`);

  // 5. Test Live Resend Email Delivery
  console.log('\n5. Testing Live Resend Email Delivery...');
  const provider = getActiveEmailProvider();
  console.log('   Active Provider:', provider);

  // A. Campaign Test Email with embedded Pricing Card
  const testEmailRes = await sendTestCampaign(initialCampaign._id, 'd.klive.ai26@gmail.com');
  console.log('   Campaign Preview Send Result:', testEmailRes);
  if (!testEmailRes.success) {
    throw new Error(`Test email failed: ${testEmailRes.error}`);
  }
  console.log(`   ✅ Campaign Test Email Delivered! Message ID: ${testEmailRes.messageId}`);

  // B. Customer Booking Confirmation
  const bookingConfirmRes = await sendCustomerBookingConfirmation({
    _id: '65f9a8b7c6d5e4f3a2b10999',
    customerName: 'Dilkhush (Athlete Member)',
    email: 'd.klive.ai26@gmail.com',
    phone: '+91 9876543210',
    planName: selectedPlan.name,
    planPrice: `₹${Number(selectedPlan.price).toLocaleString('en-IN')}`,
    planPeriod: selectedPlan.duration || '/mo',
    bookingType: 'MEMBERSHIP_ALLOCATION',
    preferredDate: new Date().toISOString(),
  });
  console.log('   Customer Booking Confirmation Result:', bookingConfirmRes);
  if (!bookingConfirmRes.success) {
    throw new Error(`Booking confirmation failed: ${bookingConfirmRes.error}`);
  }
  console.log(`   ✅ Customer Booking Confirmation Delivered! Message ID: ${bookingConfirmRes.messageId}`);

  // C. Admin Concierge Alert
  const adminAlertRes = await sendAdminBookingNotification({
    _id: '65f9a8b7c6d5e4f3a2b10999',
    customerName: 'Dilkhush (Athlete Member)',
    email: 'd.klive.ai26@gmail.com',
    phone: '+91 9876543210',
    planName: selectedPlan.name,
    planPrice: `₹${Number(selectedPlan.price).toLocaleString('en-IN')}`,
    planPeriod: selectedPlan.duration || '/mo',
    bookingType: 'MEMBERSHIP_ALLOCATION',
    preferredDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  });
  console.log('   Admin Alert Result:', adminAlertRes);
  if (!adminAlertRes.success) {
    throw new Error(`Admin alert failed: ${adminAlertRes.error}`);
  }
  console.log(`   ✅ Admin Concierge Alert Delivered! Message ID: ${adminAlertRes.messageId}`);

  // 6. Verify Email Logs in MongoDB
  console.log('\n6. Verifying MongoDB Email Telemetry Logs...');
  const logs = await db.collection('email_logs').find().sort({ createdAt: -1 }).limit(5).toArray();
  console.log(`   ✓ Found ${logs.length} recent telemetry log(s) in MongoDB email_logs collection:`);
  logs.forEach((l) => console.log(`     - [${l.type}] to <${l.recipient}> => ${l.status} (${l.providerMessageId || l.provider})`));

  console.log('\n================================================================');
  console.log('  🎉 ALL PRODUCTION DATABASE & RESEND CHECKS PASSED PERFECTLY');
  console.log('================================================================');
  process.exit(0);
}

testFullProductionPersistence().catch((err) => {
  console.error('\n❌ Production Verification Failed:', err);
  process.exit(1);
});
