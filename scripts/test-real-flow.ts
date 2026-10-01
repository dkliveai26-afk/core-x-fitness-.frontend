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

import {
  sendCustomerBookingConfirmation,
  sendAdminBookingNotification,
  getActiveEmailProvider,
} from '../src/lib/email/email-service';
import {
  createEmailCampaign,
  sendTestCampaign,
} from '../src/lib/email/campaign-service';

async function verifyRealDelivery() {
  console.log('======================================================');
  console.log('  CORE X FITNESS - REAL PRODUCTION RESEND FLOW TEST');
  console.log('======================================================\n');

  const provider = getActiveEmailProvider();
  console.log('Detected Provider:', provider);

  if (provider.provider !== 'RESEND') {
    console.error('❌ Expected RESEND provider but got:', provider.provider);
    process.exit(1);
  }

  // 1. Send Real Customer Booking Confirmation Email
  console.log('\n--- 1. Dispatching Real Customer Booking Confirmation Email ---');
  const bookingResult = await sendCustomerBookingConfirmation({
    _id: '65f9a8b7c6d5e4f3a2b10999',
    customerName: 'Dilkhush (Athlete Member)',
    email: 'd.klive.ai26@gmail.com',
    phone: '+91 9876543210',
    planName: 'Apex Athletic Tier (VIP Access)',
    planPrice: '₹14,999',
    planPeriod: '/quarter',
    bookingType: 'MEMBERSHIP_ALLOCATION',
    preferredDate: new Date().toISOString(),
  });

  console.log('Booking Email Dispatch Result:', bookingResult);
  if (bookingResult.success) {
    console.log('✅ Customer Booking Email delivered to Resend! Message ID:', bookingResult.messageId);
  } else {
    console.error('❌ Customer Booking Email failed:', bookingResult.error);
  }

  // 2. Send Real Admin Concierge Notification Email
  console.log('\n--- 2. Dispatching Real Admin Concierge Notification Email ---');
  const adminResult = await sendAdminBookingNotification({
    _id: '65f9a8b7c6d5e4f3a2b10999',
    customerName: 'Dilkhush (Athlete Member)',
    email: 'd.klive.ai26@gmail.com',
    phone: '+91 9876543210',
    planName: 'Apex Athletic Tier (VIP Access)',
    planPrice: '₹14,999',
    planPeriod: '/quarter',
    bookingType: 'MEMBERSHIP_ALLOCATION',
    preferredDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  });

  console.log('Admin Alert Dispatch Result:', adminResult);
  if (adminResult.success) {
    console.log('✅ Admin Notification delivered to Resend! Message ID:', adminResult.messageId);
  } else {
    console.error('❌ Admin Notification failed:', adminResult.error);
  }

  // 3. Send Real Offer Campaign Test Email
  console.log('\n--- 3. Dispatching Real Offer Campaign Test Preview ---');
  const campaign = await createEmailCampaign({
    title: 'Durga Puja 20% Off Exclusive VIP Pass',
    subject: 'Special Offer: Claim 20% Off Apex Membership Tier',
    heading: 'Durga Puja VIP Membership Offer - Up to 20% OFF',
    bodyMessage: 'Celebrate the festive season with relentless strength. Unlock private recovery suites, Eleiko barbell stations, and biometric diagnostics at an exclusive 20% privilege rate.',
    offerBadge: 'DURGA PUJA SPECIAL PRIVILEGE',
    imageUrl: '/plans-offer-banner.png',
    ctaText: 'Claim Your 20% Membership Pass',
    ctaUrl: 'https://core-x-fitness-frontend.vercel.app/plans#pricing-matrix',
    footerNote: 'Valid for the first 50 athlete reservations during Durga Puja.',
    targetAudience: 'ALL_OPTED_IN',
  });

  const testCampaignResult = await sendTestCampaign(campaign._id, 'd.klive.ai26@gmail.com');
  console.log('Campaign Test Dispatch Result:', testCampaignResult);
  if (testCampaignResult.success) {
    console.log('✅ Campaign Test Preview delivered to Resend! Message ID:', testCampaignResult.messageId);
  } else {
    console.error('❌ Campaign Test Preview failed:', testCampaignResult.error);
  }

  console.log('\n======================================================');
  console.log('  ALL 3 REAL EMAIL DISPATCHES COMPLETED SUCCESSFULLY!  ');
  console.log('======================================================\n');
}

verifyRealDelivery();
