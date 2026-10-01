import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getDatabase } from '@/lib/mongodb';
import { getAdminOfferBanner, revalidateOfferBannerCache } from '@/lib/offer-banner';
import path from 'path';
import fs from 'fs/promises';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    const banner = await getAdminOfferBanner();
    return NextResponse.json({ success: true, banner });
  } catch (error: any) {
    console.error('API /api/admin/offer-banner GET error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch admin offer banner.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    let imageUrl = '';
    let title = '';
    let optionalSubtitle = '';
    let badgeText = 'LIMITED TIME ATHLETIC ADMISSIONS DISCOUNT';
    let linkUrl = '#pricing-matrix';
    let isActive = true;

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const imageFile = formData.get('image') as File | null;
      title = (formData.get('title') as string) || '';
      optionalSubtitle = (formData.get('optionalSubtitle') as string) || '';
      badgeText = (formData.get('badgeText') as string) || badgeText;
      linkUrl = (formData.get('linkUrl') as string) || linkUrl;
      const activeVal = formData.get('isActive');
      isActive = activeVal === null ? true : activeVal === 'true' || activeVal === '1';

      if (imageFile && imageFile.size > 0) {
        // Validate MIME type or filename extension
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
        const fileName = imageFile.name || 'banner.png';
        const isAllowedExt = /\.(png|jpe?g|webp|svg|gif)$/i.test(fileName);
        const isAllowedMime = allowedTypes.includes(imageFile.type) || imageFile.type.startsWith('image/');

        if (!isAllowedMime && !isAllowedExt) {
          return NextResponse.json(
            { error: 'Invalid file type. Allowed formats: PNG, JPG, JPEG, WEBP, SVG, GIF.' },
            { status: 400 }
          );
        }

        // Validate size (10MB max)
        const maxSizeBytes = 10 * 1024 * 1024;
        if (imageFile.size > maxSizeBytes) {
          return NextResponse.json(
            { error: 'Image size exceeds the 10MB limit. Please upload an optimized banner.' },
            { status: 400 }
          );
        }

        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const mimeType = imageFile.type || (/\.png$/i.test(fileName) ? 'image/png' : 'image/jpeg');
        const base64Data = buffer.toString('base64');
        const dataUri = `data:${mimeType};base64,${base64Data}`;
        imageUrl = dataUri;

        // In non-serverless local environments, optionally write file to disk
        try {
          const timestamp = Date.now();
          const cleanName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
          const filename = `banner_${timestamp}_${cleanName}`;

          const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'banners');
          await fs.mkdir(uploadDir, { recursive: true });

          const filePath = path.join(uploadDir, filename);
          await fs.writeFile(filePath, buffer);

          imageUrl = `/uploads/banners/${filename}`;
        } catch {
          // In read-only serverless environments (Vercel/Lambda), safely persist as in-memory base64 data URI in MongoDB
          imageUrl = dataUri;
        }
      } else {
        const existingUrl = formData.get('imageUrl') as string;
        if (existingUrl) {
          imageUrl = existingUrl;
        } else {
          return NextResponse.json({ error: 'Please provide an image file or URL for the banner.' }, { status: 400 });
        }
      }
    } else {
      const body = await req.json();
      imageUrl = body.imageUrl || '';
      title = body.title || '';
      optionalSubtitle = body.optionalSubtitle || '';
      badgeText = body.badgeText || badgeText;
      linkUrl = body.linkUrl || linkUrl;
      isActive = body.isActive !== undefined ? Boolean(body.isActive) : true;

      if (!imageUrl) {
        return NextResponse.json({ error: 'Image URL is required.' }, { status: 400 });
      }
    }

    const db = await getDatabase();
    const bannerCol = db.collection('offer_banners');

    // Rule: Exactly ONE active offer banner exists for the plans page
    // Deactivate all previous banners
    await bannerCol.updateMany({}, { $set: { isActive: false } });

    const newBannerDoc = {
      imageUrl,
      title: title.trim(),
      optionalSubtitle: optionalSubtitle.trim(),
      badgeText: badgeText.trim(),
      linkUrl: linkUrl.trim(),
      isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await bannerCol.insertOne(newBannerDoc);

    revalidateOfferBannerCache();

    return NextResponse.json({
      success: true,
      message: 'Offer banner replaced and updated successfully.',
      banner: {
        ...newBannerDoc,
        _id: result.insertedId.toString(),
      },
    });
  } catch (error: any) {
    console.error('API /api/admin/offer-banner POST error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update offer banner.' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getAdminSession();
    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 401 });
    }

    const db = await getDatabase();
    const bannerCol = db.collection('offer_banners');

    // Deactivate all offer banners
    await bannerCol.updateMany({}, { $set: { isActive: false, updatedAt: new Date().toISOString() } });

    revalidateOfferBannerCache();

    return NextResponse.json({
      success: true,
      message: 'Offer banner deactivated from website.',
    });
  } catch (error: any) {
    console.error('API /api/admin/offer-banner DELETE error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to deactivate offer banner.' }, { status: 500 });
  }
}
