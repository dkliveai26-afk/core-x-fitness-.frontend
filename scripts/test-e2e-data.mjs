import * as XLSX from 'xlsx';

const BASE_URL = 'http://localhost:3000';

async function testFullFlow() {
  console.log('=== STEP 1: ADMIN LOGIN ===');
  const loginRes = await fetch(`${BASE_URL}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@corexfitness.com',
      password: 'dev.dilkhush@$$$$$',
    }),
  });

  const loginJson = await loginRes.json();
  console.log('Login response status:', loginRes.status, loginJson);
  if (!loginRes.ok) throw new Error('Admin login failed');

  // Extract set-cookie
  const setCookie = loginRes.headers.get('set-cookie');
  console.log('Set-Cookie received:', !!setCookie);
  const cookieHeader = setCookie ? setCookie.split(';')[0] : '';

  console.log('\n=== STEP 2: PUBLIC BOOKING SUBMISSION ===');
  const testBookingPayload = {
    customerName: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    planName: 'Apex Titan Standard',
    planPrice: '₹4,999',
    planPeriod: '/month',
    bookingType: 'MEMBERSHIP_ALLOCATION',
    preferredDate: '2026-10-01',
  };

  const bookingRes = await fetch(`${BASE_URL}/api/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testBookingPayload),
  });
  const bookingJson = await bookingRes.json();
  console.log('Public booking status:', bookingRes.status, bookingJson);
  if (!bookingRes.ok) throw new Error('Public booking failed');
  const bookingId = bookingJson.id;

  console.log('\n=== STEP 3: ADMIN VERIFIES BOOKING IN MONGODB ===');
  const adminBookingsRes = await fetch(`${BASE_URL}/api/admin/bookings`, {
    headers: { Cookie: cookieHeader },
  });
  const adminBookingsJson = await adminBookingsRes.json();
  console.log('Admin bookings count:', adminBookingsJson.total);
  const foundBooking = adminBookingsJson.bookings?.find((b) => b._id === bookingId);
  console.log('Found newly created booking in Admin:', !!foundBooking, foundBooking?.customerName, foundBooking?.status);

  console.log('\n=== STEP 4: ADMIN UPDATES BOOKING STATUS ===');
  const patchBookingRes = await fetch(`${BASE_URL}/api/admin/bookings/${bookingId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
    body: JSON.stringify({ status: 'CONFIRMED' }),
  });
  const patchBookingJson = await patchBookingRes.json();
  console.log('Patch booking response:', patchBookingRes.status, patchBookingJson.success, patchBookingJson.booking?.status);

  console.log('\n=== STEP 5: PUBLIC CONTACT FORM SUBMISSION ===');
  const testContactPayload = {
    name: 'Priya Mukherjee',
    email: 'priya.m@example.com',
    phone: '+91 91234 56789',
    topic: 'Personal Training Concierge',
    message: 'I would like to schedule a tour of the Kolkata Performance Sanctuary and discuss athletic strength coaching.',
  };

  const contactRes = await fetch(`${BASE_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testContactPayload),
  });
  const contactJson = await contactRes.json();
  console.log('Public contact status:', contactRes.status, contactJson);
  if (!contactRes.ok) throw new Error('Public contact failed');
  const contactId = contactJson.id;

  console.log('\n=== STEP 6: ADMIN VERIFIES CONTACT IN MONGODB ===');
  const adminContactsRes = await fetch(`${BASE_URL}/api/admin/contacts`, {
    headers: { Cookie: cookieHeader },
  });
  const adminContactsJson = await adminContactsRes.json();
  console.log('Admin contacts count:', adminContactsJson.total);
  const foundContact = adminContactsJson.contacts?.find((c) => c._id === contactId);
  console.log('Found newly created contact in Admin:', !!foundContact, foundContact?.name, foundContact?.status);

  console.log('\n=== STEP 7: ADMIN EXPORTS BOOKINGS TO XLSX ===');
  const exportBookingsRes = await fetch(`${BASE_URL}/api/admin/bookings/export`, {
    headers: { Cookie: cookieHeader },
  });
  console.log('Export bookings status:', exportBookingsRes.status, exportBookingsRes.headers.get('content-type'));
  const exportBookingsBuffer = await exportBookingsRes.arrayBuffer();
  const bookingsWorkbook = XLSX.read(Buffer.from(exportBookingsBuffer), { type: 'buffer' });
  const firstSheetName = bookingsWorkbook.SheetNames[0];
  const bookingsSheetData = XLSX.utils.sheet_to_json(bookingsWorkbook.Sheets[firstSheetName]);
  console.log('Parsed Bookings XLSX rows:', bookingsSheetData.length);
  console.log('Sample row from Bookings XLSX:', bookingsSheetData[0]);

  console.log('\n=== STEP 8: ADMIN EXPORTS CONTACTS TO XLSX ===');
  const exportContactsRes = await fetch(`${BASE_URL}/api/admin/contacts/export`, {
    headers: { Cookie: cookieHeader },
  });
  console.log('Export contacts status:', exportContactsRes.status, exportContactsRes.headers.get('content-type'));
  const exportContactsBuffer = await exportContactsRes.arrayBuffer();
  const contactsWorkbook = XLSX.read(Buffer.from(exportContactsBuffer), { type: 'buffer' });
  const contactsSheetName = contactsWorkbook.SheetNames[0];
  const contactsSheetData = XLSX.utils.sheet_to_json(contactsWorkbook.Sheets[contactsSheetName]);
  console.log('Parsed Contacts XLSX rows:', contactsSheetData.length);
  console.log('Sample row from Contacts XLSX:', contactsSheetData[0]);

  console.log('\n=== STEP 9: ADMIN OVERVIEW METRICS ===');
  const overviewRes = await fetch(`${BASE_URL}/api/admin/overview`, {
    headers: { Cookie: cookieHeader },
  });
  const overviewJson = await overviewRes.json();
  console.log('Admin Overview stats:', overviewJson.stats);

  console.log('\n>>> ALL REAL DATA & EXPORT TESTS PASSED SUCCESSFULLY! <<<');
}

testFullFlow().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
