import { NextResponse } from 'next/server';
import { getPublicPlans } from '@/lib/plans';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const plans = await getPublicPlans();
    return NextResponse.json(
      { success: true, plans },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error('Public plans API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve membership plans' },
      { status: 500 }
    );
  }
}
