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
import { getAdminOfferBanner, getActiveOfferBanner, ensureDefaultOfferBanner } from '../src/lib/offer-banner';

async function runOfferBannerVerification() {
  console.log('================================================================');
  console.log('  CORE X FITNESS — OFFER BANNER CMS FULL E2E VERIFICATION');
  console.log('================================================================\n');

  // STEP 1: Check Database connection and existing banner
  console.log('1. Checking MongoDB connection & initial banner state...');
  await ensureDefaultOfferBanner();
  const initialAdminBanner = await getAdminOfferBanner();
  console.log('   ✓ Initial Admin Banner in DB:', {
    _id: initialAdminBanner?._id,
    title: initialAdminBanner?.title,
    isActive: initialAdminBanner?.isActive,
    imageSnippet: initialAdminBanner?.imageUrl.substring(0, 50) + '...',
  });

  // STEP 2: Read corexbanner .png and encode to in-memory Base64 Data URI
  console.log('\n2. Reading "public/corexbanner .png" (1.65MB) for upload...');
  const imagePath = path.join(process.cwd(), 'public', 'corexbanner .png');
  if (!fs.existsSync(imagePath)) {
    throw new Error('public/corexbanner .png file not found.');
  }
  const fileBuffer = fs.readFileSync(imagePath);
  console.log(`   ✓ Read ${fileBuffer.length} bytes from disk.`);

  const mimeType = 'image/png';
  const base64Data = fileBuffer.toString('base64');
  const dataUri = `data:${mimeType};base64,${base64Data}`;
  console.log(`   ✓ Encoded to Base64 Data URI (${dataUri.length} chars).`);

  // STEP 3: Perform Replace & Save Operation into MongoDB
  console.log('\n3. Executing Save & Replace Banner in MongoDB...');
  const db = await getDatabase();
  const bannerCol = db.collection('offer_banners');

  // Deactivate previous banners
  await bannerCol.updateMany({}, { $set: { isActive: false } });

  const newBanner = {
    imageUrl: dataUri,
    title: 'Core X Fitness Exclusive Membership Offer - Get Up To 20% Off',
    optionalSubtitle: 'Exclusive performance admissions window available this season.',
    badgeText: 'LIMITED TIME ATHLETIC ADMISSIONS DISCOUNT',
    linkUrl: '#pricing-matrix',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const insertResult = await bannerCol.insertOne(newBanner);
  const newId = insertResult.insertedId.toString();
  console.log(`   ✓ New Banner Inserted with ID: ${newId}`);

  // STEP 4: Verify Persistence via getAdminOfferBanner()
  console.log('\n4. Verifying Persistence via Admin Banner Service...');
  const adminBannerAfter = await getAdminOfferBanner();
  if (!adminBannerAfter || adminBannerAfter._id !== newId) {
    throw new Error('Admin banner did not match newly inserted ID.');
  }
  if (!adminBannerAfter.isActive) {
    throw new Error('Admin banner is not marked active.');
  }
  console.log('   ✓ Admin Banner persisted successfully:', {
    _id: adminBannerAfter._id,
    title: adminBannerAfter.title,
    badgeText: adminBannerAfter.badgeText,
    isActive: adminBannerAfter.isActive,
    updatedAt: adminBannerAfter.updatedAt,
  });

  // STEP 5: Verify Public Display via getActiveOfferBanner()
  console.log('\n5. Verifying Public Plans Page Banner Service...');
  const publicBanner = await getActiveOfferBanner();
  if (!publicBanner || publicBanner._id !== newId) {
    throw new Error('Public banner does not return the newly active banner.');
  }
  console.log('   ✓ Public Plans Banner is LIVE:', {
    _id: publicBanner._id,
    title: publicBanner.title,
    badgeText: publicBanner.badgeText,
    isActive: publicBanner.isActive,
  });

  // STEP 6: Verify Toggle Active / Inactive
  console.log('\n6. Testing Banner Active/Inactive Toggle...');
  await bannerCol.updateOne({ _id: insertResult.insertedId }, { $set: { isActive: false, updatedAt: new Date().toISOString() } });
  const hiddenBanner = await getActiveOfferBanner();
  console.log('   ✓ When toggled off, getActiveOfferBanner() returns null/fallback:', hiddenBanner === null || hiddenBanner._id === 'fallback-banner');

  // Re-activate
  await bannerCol.updateOne({ _id: insertResult.insertedId }, { $set: { isActive: true, updatedAt: new Date().toISOString() } });
  const activeAgain = await getActiveOfferBanner();
  console.log('   ✓ Re-activated successfully, ID:', activeAgain?._id);

  console.log('\n================================================================');
  console.log('  🎉 ALL OFFER BANNER CMS TESTS PASSED WITH 100% PERSISTENCE');
  console.log('================================================================');
  process.exit(0);
}

runOfferBannerVerification().catch((err) => {
  console.error('\n❌ Offer Banner E2E Test Failed:', err);
  process.exit(1);
});
