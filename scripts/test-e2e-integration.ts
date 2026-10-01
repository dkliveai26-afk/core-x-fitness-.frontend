import {
  upsertContact,
  unsubscribeByToken,
  getEligibleCampaignRecipients,
  getAudienceStats,
  setMarketingConsent,
} from '../src/lib/email/contacts-service';
import {
  sendCustomerBookingConfirmation,
  sendAdminBookingNotification,
  sendEmail,
} from '../src/lib/email/email-service';
import {
  createEmailCampaign,
  sendTestCampaign,
  getEmailCampaignById,
} from '../src/lib/email/campaign-service';

console.log('====================================================');
console.log('  CORE X FITNESS - E2E FULL INTEGRATION SUITE');
console.log('====================================================\n');

let passed = 0;
let total = 0;

function assert(condition: boolean, name: string) {
  total++;
  if (condition) {
    console.log(`✅ PASS: ${name}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${name}`);
    process.exitCode = 1;
  }
}

async function runE2ESuite() {
  try {
    // 1. Test Customer Contact Upsert & Normalization
    console.log('\n--- Scenario 1: Booking Customer Contact Registration ---');
    const testEmail1 = `athlete_test_${Date.now()}@example.com`;
    const contact1 = await upsertContact({
      email: testEmail1,
      name: 'Devin Thorne',
      phone: '+91 9988776655',
      source: 'BOOKING',
      marketingOptIn: true,
      latestPlan: 'Apex Athletic Tier',
    });

    assert(Boolean(contact1), 'Booking contact upsert returned valid contact record');
    assert(contact1?.email === testEmail1.toLowerCase(), 'Email normalized to lowercase');
    assert(contact1?.marketingOptIn === true, 'Marketing consent stored as true');
    assert(Boolean(contact1?.unsubscribeToken), 'Unsubscribe token generated for contact');
    assert(contact1?.totalBookings === 1, 'Total bookings count initialized to 1');

    // 2. Test Deduplication on Duplicate Interaction
    console.log('\n--- Scenario 2: Deduplication on Repeat Bookings ---');
    const duplicateContact = await upsertContact({
      email: testEmail1.toUpperCase(),
      name: 'Devin Thorne Updated',
      source: 'BOOKING',
      latestPlan: 'Apex Athletic Tier',
    });

    assert(duplicateContact?.email === testEmail1.toLowerCase(), 'Normalized email matched on repeat booking');
    assert(duplicateContact?.totalBookings === 2, 'Total bookings incremented without creating duplicate record');

    // 3. Test Non-Consented Contact Registration
    console.log('\n--- Scenario 3: Contact Inquiry with Marketing Opt-Out ---');
    const testEmail2 = `inquiry_no_consent_${Date.now()}@example.com`;
    const contact2 = await upsertContact({
      email: testEmail2,
      name: 'Priya Verma',
      phone: '+91 9123456789',
      source: 'CONTACT',
      marketingOptIn: false,
      latestPlan: 'General Inquiry',
    });

    assert(contact2?.marketingOptIn === false, 'Marketing consent stored as false for unconsented inquiry');

    // 4. Test Audience Segmentation & Consent Filtering
    console.log('\n--- Scenario 4: Audience Eligibility & Segmentation ---');
    const eligibleRecipients = await getEligibleCampaignRecipients('ALL_OPTED_IN');
    const eligibleEmails = eligibleRecipients.map((r) => r.email);

    assert(eligibleEmails.includes(testEmail1.toLowerCase()), 'Opted-in customer is present in eligible recipients list');
    assert(!eligibleEmails.includes(testEmail2.toLowerCase()), 'Non-consented contact is strictly excluded from promotional list');

    // 5. Test Unsubscribe Workflow
    console.log('\n--- Scenario 5: 1-Click Secure Unsubscribe Workflow ---');
    const unsubToken = contact1?.unsubscribeToken || '';
    const unsubResult = await unsubscribeByToken(unsubToken);

    assert(unsubResult.success === true, 'Unsubscribe by token returned success');
    assert(unsubResult.email === testEmail1.toLowerCase(), 'Unsubscribe verified correct target email');

    // Re-verify eligibility after unsubscribe
    const postUnsubRecipients = await getEligibleCampaignRecipients('ALL_OPTED_IN');
    const postUnsubEmails = postUnsubRecipients.map((r) => r.email);
    assert(!postUnsubEmails.includes(testEmail1.toLowerCase()), 'Unsubscribed athlete is immediately skipped from future campaigns');

    // 6. Test Transactional Booking Emails
    console.log('\n--- Scenario 6: Transactional Booking Emails ---');
    const bookingResult = await sendCustomerBookingConfirmation({
      _id: '65f9a8b7c6d5e4f3a2b10987',
      customerName: 'Devin Thorne',
      email: testEmail1,
      phone: '+91 9988776655',
      planName: 'Apex Athletic Tier',
      planPrice: '₹14,999',
      planPeriod: '/quarter',
      bookingType: 'MEMBERSHIP_ALLOCATION',
      preferredDate: '2026-10-15',
    });

    assert(bookingResult.success === true, 'Customer booking confirmation email dispatched safely');
    assert(Boolean(bookingResult.messageId), 'Booking email returned valid message ID');

    const adminAlertResult = await sendAdminBookingNotification({
      _id: '65f9a8b7c6d5e4f3a2b10987',
      customerName: 'Devin Thorne',
      email: testEmail1,
      phone: '+91 9988776655',
      planName: 'Apex Athletic Tier',
      planPrice: '₹14,999',
      planPeriod: '/quarter',
      bookingType: 'MEMBERSHIP_ALLOCATION',
      preferredDate: '2026-10-15',
    });

    assert(adminAlertResult.success === true, 'Admin booking notification email dispatched safely');

    // 7. Test Campaign Lifecycle
    console.log('\n--- Scenario 7: Email Campaign Creation & Test Email ---');
    const campaign = await createEmailCampaign({
      title: 'E2E Test Durga Puja Promo',
      subject: 'Special 20% Privilege Access for Core X Athletes',
      heading: 'Durga Puja VIP Membership Offer',
      bodyMessage: 'Enjoy comprehensive access to all training chambers and biometric diagnostics.',
      offerBadge: 'SEASONAL PRIVILEGE',
      imageUrl: '/uploads/campaigns/sample.png',
      ctaText: 'Claim Offer',
      ctaUrl: 'https://corexfitness.com/plans',
      targetAudience: 'ALL_OPTED_IN',
    });

    assert(Boolean(campaign._id), 'Campaign created with MongoDB ObjectId');
    assert(campaign.status === 'DRAFT', 'Campaign initial status is DRAFT');

    const testEmailResult = await sendTestCampaign(campaign._id, 'dilkhushdeveloper@gmail.com');
    assert(testEmailResult.success === true, 'Test preview email sent successfully to admin tester');

    console.log('\n====================================================');
    console.log(`  E2E TEST SUITE COMPLETED: ${passed} / ${total} PASSED ✅`);
    console.log('====================================================\n');
  } catch (error) {
    console.error('E2E Test Failure:', error);
    process.exitCode = 1;
  }
}

runE2ESuite();
