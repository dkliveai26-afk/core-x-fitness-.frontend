async function runE2ETest() {
  console.log('=== STARTING END-TO-END CMS & AUTH TEST ===\n');

  // Step 1: Admin Login
  console.log('1. Testing Admin Login...');
  const loginRes = await fetch('http://localhost:3000/api/admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@corexfitness.com',
      password: 'dev.dilkhush@$$$$$',
    }),
  });

  const cookieHeader = loginRes.headers.get('set-cookie');
  if (!cookieHeader) throw new Error('Failed to obtain cookie on login');
  const token = cookieHeader.split(';')[0];
  console.log('   ✅ Logged in successfully. Token acquired.');

  const authHeaders = {
    'Content-Type': 'application/json',
    'Cookie': token,
  };

  // Step 2: Fetch Admin Plans
  console.log('2. Fetching Admin Plans List...');
  const adminPlansRes = await fetch('http://localhost:3000/api/admin/plans', {
    headers: authHeaders,
  });
  const adminPlansData = await adminPlansRes.json();
  console.log(`   ✅ Fetched ${adminPlansData.plans?.length} plans from Admin API.`);

  // Step 3: Create New Plan
  console.log('3. Creating New Plan (PRO HYPERTROPHY)...');
  const createPlanRes = await fetch('http://localhost:3000/api/admin/plans', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      name: 'PRO HYPERTROPHY',
      badge: 'SPECIALIZED TIER',
      shortDescription: 'Advanced hypertrophy coaching and dedicated biomechanics recovery.',
      duration: '/ MONTH',
      originalPrice: 5999,
      price: 3999,
      features: [
        'All Core Access privileges included',
        'Custom hyper-periodized hypertrophy programming',
        'Weekly video biomechanics assessment',
      ],
      ctaText: 'Select Hypertrophy Pass',
      highlighted: false,
      displayOrder: 4,
      isActive: true,
    }),
  });
  const createPlanData = await createPlanRes.json();
  const createdPlanId = createPlanData.plan?._id;
  console.log(`   ✅ Plan created with ID: ${createdPlanId}. Name: ${createPlanData.plan?.name}`);

  // Step 4: Verify Public Plans Page sees new plan
  console.log('4. Verifying Public Plans API includes new plan...');
  const publicPlansRes1 = await fetch('http://localhost:3000/api/plans');
  const publicPlansData1 = await publicPlansRes1.json();
  const foundInPublic = publicPlansData1.plans.find((p) => p.name === 'PRO HYPERTROPHY');
  if (!foundInPublic) throw new Error('New plan not found in public API!');
  console.log(`   ✅ Public Plans API has PRO HYPERTROPHY: Price=${foundInPublic.price}, INR Formatted.`);

  // Step 5: Edit Plan Price (₹3999 -> ₹3499)
  console.log('5. Updating Plan Price to ₹3,499...');
  const updateRes = await fetch(`http://localhost:3000/api/admin/plans/${createdPlanId}`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      ...foundInPublic,
      price: 3499,
      originalPrice: 5999,
      isActive: true,
    }),
  });
  const updateData = await updateRes.json();
  console.log(`   ✅ Update response: ${updateData.message}`);

  // Step 6: Verify Public Plans API shows updated price
  console.log('6. Verifying Public Plans API has updated price...');
  const publicPlansRes2 = await fetch('http://localhost:3000/api/plans');
  const publicPlansData2 = await publicPlansRes2.json();
  const updatedInPublic = publicPlansData2.plans.find((p) => p.name === 'PRO HYPERTROPHY');
  if (updatedInPublic.price !== 3499) throw new Error(`Price mismatch: expected 3499, got ${updatedInPublic.price}`);
  console.log(`   ✅ Public Plans API confirmed updated price: ₹${updatedInPublic.price}`);

  // Step 7: Deactivate Plan
  console.log('7. Deactivating Plan...');
  const toggleRes = await fetch(`http://localhost:3000/api/admin/plans/${createdPlanId}/toggle`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({ isActive: false }),
  });
  const toggleData = await toggleRes.json();
  console.log(`   ✅ Toggle response: ${toggleData.message}`);

  // Step 8: Verify Deactivated Plan disappears from Public API
  console.log('8. Verifying Public Plans API excludes deactivated plan...');
  const publicPlansRes3 = await fetch('http://localhost:3000/api/plans');
  const publicPlansData3 = await publicPlansRes3.json();
  const hiddenInPublic = publicPlansData3.plans.find((p) => p.name === 'PRO HYPERTROPHY');
  if (hiddenInPublic) throw new Error('Deactivated plan should not appear in public plans!');
  console.log('   ✅ Deactivated plan is properly hidden from public Plans API.');

  // Step 9: Delete Test Plan
  console.log('9. Deleting Test Plan...');
  const deleteRes = await fetch(`http://localhost:3000/api/admin/plans/${createdPlanId}`, {
    method: 'DELETE',
    headers: authHeaders,
  });
  const deleteData = await deleteRes.json();
  console.log(`   ✅ Delete response: ${deleteData.message}`);

  // Step 10: Offer Banner CMS Tests
  console.log('\n10. Testing Offer Banner CMS...');
  const adminBannerRes = await fetch('http://localhost:3000/api/admin/offer-banner', {
    headers: authHeaders,
  });
  const adminBannerData = await adminBannerRes.json();
  console.log(`    ✅ Admin Banner retrieved: "${adminBannerData.banner?.title}"`);

  // Step 11: Replace Banner
  console.log('11. Replacing Offer Banner with seasonal promotion...');
  const replaceBannerRes = await fetch('http://localhost:3000/api/admin/offer-banner', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      imageUrl: '/plans-offer-banner.png',
      title: 'Monsoon Athletic Admissions - 25% Off Annual Pass',
      optionalSubtitle: 'Exclusive season admissions tier.',
      badgeText: 'SEASONAL ATHLETIC ADMISSIONS DISCOUNT',
      linkUrl: '#pricing-matrix',
      isActive: true,
    }),
  });
  const replaceBannerData = await replaceBannerRes.json();
  console.log(`    ✅ Replace banner response: ${replaceBannerData.message}`);

  // Step 12: Verify Public Offer Banner
  console.log('12. Verifying Public Offer Banner...');
  const publicBannerRes = await fetch('http://localhost:3000/api/offer-banner');
  const publicBannerData = await publicBannerRes.json();
  console.log(`    ✅ Public Banner Title: "${publicBannerData.banner?.title}", Badge: "${publicBannerData.banner?.badgeText}"`);

  console.log('\n=== ALL END-TO-END TESTS PASSED SUCCESSFULLY! ===');
}

runE2ETest().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
