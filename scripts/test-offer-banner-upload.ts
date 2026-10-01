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
import { getAdminOfferBanner, revalidateOfferBannerCache } from '../src/lib/offer-banner';

async function testOfferBannerUpload() {
  console.log('Testing Offer Banner Upload logic with public/corexbanner .png...');

  const filePath = path.join(process.cwd(), 'public', 'corexbanner .png');
  const buffer = fs.readFileSync(filePath);
  const size = buffer.length;
  console.log('Buffer read successfully, size:', size, 'bytes');

  // Let's test Base64 encoding
  const base64Data = buffer.toString('base64');
  const dataUri = `data:image/png;base64,${base64Data}`;
  console.log('Base64 data URI generated, length:', dataUri.length);

  // Let's test MongoDB update / insert
  const db = await getDatabase();
  const bannerCol = db.collection('offer_banners');

  await bannerCol.updateMany({}, { $set: { isActive: false } });
  console.log('Previous banners set to isActive: false');

  const newBannerDoc = {
    imageUrl: dataUri,
    title: 'Core X Fitness Exclusive Membership Offer - Get Up To 20% Off',
    optionalSubtitle: '',
    badgeText: 'LIMITED TIME ATHLETIC ADMISSIONS DISCOUNT',
    linkUrl: '#pricing-matrix',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const result = await bannerCol.insertOne(newBannerDoc);
  console.log('Inserted new banner into MongoDB, ID:', result.insertedId.toString());

  const currentBanner = await getAdminOfferBanner();
  console.log('Retrieved active banner from getAdminOfferBanner():', {
    _id: currentBanner?._id,
    title: currentBanner?.title,
    badgeText: currentBanner?.badgeText,
    isActive: currentBanner?.isActive,
    imageLength: currentBanner?.imageUrl.length,
  });

  console.log('✅ Offer banner update test PASSED!');
}

testOfferBannerUpload().catch((err) => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
