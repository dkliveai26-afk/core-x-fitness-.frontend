import { NextResponse } from 'next/server';
import { getActiveOfferBanner } from '@/lib/offer-banner';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const banner = await getActiveOfferBanner();
    return NextResponse.json(
      { success: true, banner },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error('Public offer banner API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve active offer banner' },
      { status: 500 }
    );
  }
}
