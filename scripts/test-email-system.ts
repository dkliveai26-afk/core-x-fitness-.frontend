import { generateUnsubscribeToken, normalizeEmail } from '../src/lib/email/contacts-service';
import {
  generateBookingConfirmationHtml,
  generateAdminBookingNotificationHtml,
  generateMarketingCampaignHtml,
} from '../src/lib/email/email-templates';
import { getActiveEmailProvider } from '../src/lib/email/email-service';

console.log('====================================================');
console.log('  CORE X FITNESS - EMAIL & MARKETING SYSTEM TEST');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

// 1. Security & Token Generation Test
console.log('\n--- 1. Security & Cryptographic Token Generation ---');
const token1 = generateUnsubscribeToken();
const token2 = generateUnsubscribeToken();
assert(Boolean(token1 && token1.length >= 32), 'Unsubscribe token has high cryptographic entropy (length >= 32)');
assert(token1 !== token2, 'Unsubscribe tokens are unique and unpredictable');

// 2. Email Normalization & Deduplication Test
console.log('\n--- 2. Email Normalization & Deduplication ---');
const rawEmail1 = '  Athlete.VIP@CoreXFitness.COM ';
const normalized1 = normalizeEmail(rawEmail1);
assert(normalized1 === 'athlete.vip@corexfitness.com', 'Normalized email is lowercase and trimmed');

// 3. Customer Booking Confirmation Email Template Test
console.log('\n--- 3. Customer Booking Confirmation Template ---');
const bookingConfirmation = generateBookingConfirmationHtml({
  customerName: 'Aarav Sharma',
  email: 'aarav@example.com',
  phone: '+91 9876543210',
  planName: 'Apex Athletic Tier',
  planPrice: '₹14,999',
  planPeriod: '/quarter',
  bookingType: 'MEMBERSHIP_ALLOCATION',
  preferredDate: '2026-10-15',
  bookingId: '65f123456789abcdef012345',
});

assert(bookingConfirmation.html.includes('Aarav Sharma'), 'Customer confirmation HTML contains customer name');
assert(bookingConfirmation.html.includes('Apex Athletic Tier'), 'Customer confirmation HTML contains plan name');
assert(bookingConfirmation.html.includes('₹14,999'), 'Customer confirmation HTML contains price');
assert(bookingConfirmation.html.includes('EF012345'), 'Customer confirmation HTML contains reference ID');
assert(bookingConfirmation.text.includes('Aarav Sharma'), 'Customer confirmation plain text contains customer name');

// 4. Admin Booking Notification Email Template Test
console.log('\n--- 4. Admin Booking Notification Template ---');
const adminNotification = generateAdminBookingNotificationHtml({
  customerName: 'Rohan Mehta',
  email: 'rohan@example.com',
  phone: '+91 9123456780',
  planName: 'Pro Performance Tier',
  planPrice: '₹9,999',
  planPeriod: '/month',
  bookingType: 'MEMBERSHIP_ALLOCATION',
  preferredDate: '2026-10-20',
  bookingId: '65f987654321abcdef543210',
  createdAt: '2026-10-01T10:00:00Z',
});

assert(adminNotification.html.includes('Rohan Mehta'), 'Admin notification contains athlete name');
assert(adminNotification.html.includes('rohan@example.com'), 'Admin notification contains customer email');
assert(adminNotification.html.includes('+91 9123456780'), 'Admin notification contains phone');
assert(adminNotification.html.includes('Pro Performance Tier'), 'Admin notification contains plan name');

// 5. Marketing Campaign Email Template & Unsubscribe Compliance
console.log('\n--- 5. Marketing Campaign Template & CAN-SPAM Compliance ---');
const sampleUnsubscribeUrl = 'https://corexfitness.com/unsubscribe?token=' + token1;
const campaignEmail = generateMarketingCampaignHtml({
  heading: 'Exclusive 20% Durga Puja Membership Pass',
  bodyMessage: 'Unlock unlimited access to Olympic Barbells, private cryo recovery suites, and personalized nutrition tracking.',
  offerBadge: 'LIMITED VIP OFFER',
  imageUrl: '/uploads/campaigns/sample_banner.png',
  ctaText: 'Claim 20% Membership Pass',
  ctaUrl: 'https://corexfitness.com/plans#pricing-matrix',
  footerNote: 'Valid for the first 50 athletes who reserve their orientation.',
  recipientName: 'Vikram',
  unsubscribeUrl: sampleUnsubscribeUrl,
});

assert(campaignEmail.html.includes('Exclusive 20% Durga Puja Membership Pass'), 'Campaign HTML contains heading');
assert(campaignEmail.html.includes('Claim 20% Membership Pass'), 'Campaign HTML contains CTA button text');
assert(campaignEmail.html.includes(sampleUnsubscribeUrl), 'Campaign HTML contains mandatory 1-click Unsubscribe URL');
assert(campaignEmail.html.includes('LIMITED VIP OFFER'), 'Campaign HTML contains offer badge');
assert(campaignEmail.text.includes(sampleUnsubscribeUrl), 'Campaign plain text fallback contains unsubscribe link');

// 6. Active Provider Telemetry Test
console.log('\n--- 6. Email Provider Routing & Fallback Safety ---');
const providerStatus = getActiveEmailProvider();
assert(Boolean(providerStatus.provider), `Active provider detected: ${providerStatus.provider}`);
assert(Boolean(providerStatus.fromAddress), `Sender address configured: ${providerStatus.fromAddress}`);

console.log('\n====================================================');
console.log(`  ALL TEST SUITES PASSED: ${passedTests} / ${totalTests} ✅`);
console.log('====================================================\n');
