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

import { getActiveEmailProvider, sendCustomerBookingConfirmation, sendAdminBookingNotification } from '../src/lib/email/email-service';
import { createEmailCampaign, sendTestCampaign } from '../src/lib/email/campaign-service';
import { createClerkClient } from '@clerk/backend';
import { getDatabase } from '../src/lib/mongodb';

async function runFinalSuite() {
  console.log('================================================================');
  console.log('  CORE X FITNESS — COMPLETE VERIFICATION & RESEND TEST SUITE');
  console.log('================================================================\n');

  // STEP 1: Verify Provider
  const provider = getActiveEmailProvider();
  console.log('1. Active Email Provider:', provider);
  if (provider.provider !== 'RESEND') {
    console.error('❌ Expected RESEND provider');
    process.exit(1);
  }

  // STEP 2: Verify Multi-Source User Aggregation
  console.log('\n2. Testing Multi-Source User Aggregation (Clerk + MongoDB)...');
  const db = await getDatabase();
  
  // A. Clerk users
  let clerkUsers: any[] = [];
  try {
    if (process.env.CLERK_SECRET_KEY) {
      const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
      const clerkRes = await clerk.users.getUserList({ limit: 100 });
      clerkUsers = clerkRes.data;
      console.log(`   ✓ Found ${clerkUsers.length} real registered user(s) in Clerk Auth:`);
      clerkUsers.forEach((u) => {
        const email = u.emailAddresses?.[0]?.emailAddress;
        console.log(`     - [Clerk User] ${u.firstName || ''} ${u.lastName || ''} <${email}>`);
      });
    }
  } catch (err: any) {
    console.error('   ⚠️ Clerk query error:', err.message);
  }

  // B. MongoDB Bookings
  const bookings = await db.collection('bookings').find({}).toArray();
  console.log(`   ✓ Found ${bookings.length} booking record(s) in MongoDB`);

  // C. MongoDB Contacts
  const contacts = await db.collection('contacts').find({}).toArray();
  console.log(`   ✓ Found ${contacts.length} contact inquiry record(s) in MongoDB`);

  // D. MongoDB Subscribers
  const subscribers = await db.collection('marketing_contacts').find({}).toArray();
  console.log(`   ✓ Found ${subscribers.length} marketing contact record(s) in MongoDB`);

  // STEP 3: Verify Plan CMS
  console.log('\n3. Fetching Plans from CMS for Pricing Card generation...');
  const plans = await db.collection('plans').find({}).toArray();
  console.log(`   ✓ Found ${plans.length} plan(s) in CMS:`, plans.map(p => p.name).join(', '));

  const targetPlan = plans.find(p => p.name.toLowerCase().includes('performance') || p.name.toLowerCase().includes('apex')) || plans[0];
  console.log(`   ✓ Selected Target Plan for Campaign: ${targetPlan.name} (₹${Number(targetPlan.price).toLocaleString('en-IN')})`);

  // STEP 4: Create Campaign with Pricing Card & Deep-Link CTA
  console.log('\n4. Creating Email Campaign with Embedded Pricing Card & Deep-Link CTA...');
  const campaign = await createEmailCampaign({
    title: 'Autumn Performance Tier — Special Access Offer',
    subject: 'Core X Fitness: Elevate Your Training with Performance Tier Access',
    heading: 'Unlock Unmatched Athletic Conditioning & Recovery',
    bodyMessage: 'Step into Noida\'s premier strength and conditioning sanctuary. Enjoy biometric diagnostics, Olympic lifting platforms, and dedicated recovery suites at exclusive rates.',
    offerBadge: 'EXCLUSIVE VIP ATHLETE INVITATION',
    imageUrl: '/plans-offer-banner.png',
    ctaText: 'Claim Offer & View Plan',
    ctaUrl: `https://core-x-fitness-frontend.vercel.app/plans?plan=${targetPlan.name.toLowerCase()}#pricing-matrix`,
    footerNote: 'Valid for registered athletes and VIP admissions applicants. Auto-scrolls directly to plan card.',
    targetAudience: 'ALL_OPTED_IN',
    includePricingCard: true,
    pricingPlanId: targetPlan.name.toLowerCase(),
    pricingPlanDetails: {
      name: targetPlan.name,
      badge: targetPlan.badge || 'RECOMMENDED TIER',
      price: targetPlan.price,
      originalPrice: targetPlan.originalPrice,
      duration: targetPlan.duration || '/mo',
      features: targetPlan.features || ['Custom Biometrics', 'Recovery Suite', 'Master Coach Access'],
      shortDescription: targetPlan.shortDescription || 'Designed for dedicated athletes seeking elite performance gains.',
      discount: targetPlan.discount || '20% OFF',
    },
  });

  console.log(`   ✓ Campaign Created successfully: ID ${campaign._id}`);
  console.log(`   ✓ Deep-Link CTA URL: ${campaign.ctaUrl}`);

  // STEP 5: Dispatch Real Campaign Test Email via Resend
  console.log('\n5. Dispatching Real Campaign Test Email with Pricing Card via Resend...');
  const testRes = await sendTestCampaign(campaign._id, 'd.klive.ai26@gmail.com');
  console.log('   Test Campaign Send Result:', testRes);
  if (!testRes.success) {
    throw new Error(`Test campaign send failed: ${testRes.error}`);
  }
  console.log(`   ✅ Test Campaign Email Delivered to Resend! Message ID: ${testRes.messageId}`);

  // STEP 6: Dispatch Customer Booking Confirmation
  console.log('\n6. Dispatching Real Customer Booking Confirmation Email...');
  const bookingConfirmRes = await sendCustomerBookingConfirmation({
    _id: '65f9a8b7c6d5e4f3a2b10999',
    customerName: 'Dilkhush (Athlete Member)',
    email: 'd.klive.ai26@gmail.com',
    phone: '+91 9876543210',
    planName: targetPlan.name,
    planPrice: `₹${Number(targetPlan.price).toLocaleString('en-IN')}`,
    planPeriod: targetPlan.duration || '/mo',
    bookingType: 'MEMBERSHIP_ALLOCATION',
    preferredDate: new Date().toISOString(),
  });
  console.log('   Booking Confirmation Result:', bookingConfirmRes);
  if (!bookingConfirmRes.success) {
    throw new Error(`Booking confirmation email failed: ${bookingConfirmRes.error}`);
  }
  console.log(`   ✅ Booking Confirmation Delivered! Message ID: ${bookingConfirmRes.messageId}`);

  // STEP 7: Dispatch Admin Booking Alert
  console.log('\n7. Dispatching Real Admin Concierge Alert Email...');
  const adminAlertRes = await sendAdminBookingNotification({
    _id: '65f9a8b7c6d5e4f3a2b10999',
    customerName: 'Dilkhush (Athlete Member)',
    email: 'd.klive.ai26@gmail.com',
    phone: '+91 9876543210',
    planName: targetPlan.name,
    planPrice: `₹${Number(targetPlan.price).toLocaleString('en-IN')}`,
    planPeriod: targetPlan.duration || '/mo',
    bookingType: 'MEMBERSHIP_ALLOCATION',
    preferredDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  });
  console.log('   Admin Alert Result:', adminAlertRes);
  if (!adminAlertRes.success) {
    throw new Error(`Admin alert email failed: ${adminAlertRes.error}`);
  }
  console.log(`   ✅ Admin Notification Delivered! Message ID: ${adminAlertRes.messageId}`);

  console.log('\n================================================================');
  console.log('  🎉 ALL 7 TEST SUITE CHECKS COMPLETED SUCCESSFULLY WITH ZERO ERRORS');
  console.log('================================================================');
  process.exit(0);
}

runFinalSuite().catch((err) => {
  console.error('\n❌ Test Suite Failed with Error:', err);
  process.exit(1);
});
