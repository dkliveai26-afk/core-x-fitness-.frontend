import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getAdminSession();
  if (!session.isAuthenticated || !session.user) {
    return NextResponse.json({ isAuthenticated: false, user: null }, { status: 401 });
  }

  return NextResponse.json({
    isAuthenticated: true,
    user: session.user,
  });
}
