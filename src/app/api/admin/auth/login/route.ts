import { NextRequest, NextResponse } from 'next/server';
import {
  authenticateAdmin,
  createAdminToken,
  ADMIN_COOKIE_NAME,
} from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }
    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Password is required.' }, { status: 400 });
    }

    const authResult = await authenticateAdmin(email, password);

    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: authResult.error || 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const admin = authResult.user;

    const token = createAdminToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    const proto = req.headers.get('x-forwarded-proto') || req.nextUrl.protocol.replace(':', '');
    const isHttps = proto === 'https';
    const isProduction = process.env.NODE_ENV === 'production';
    const useSecureCookie = isProduction ? isHttps : false;

    const response = NextResponse.json({
      success: true,
      message: 'Admin authentication successful.',
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    // Prevent caching of auth response
    response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');

    // Set HTTP-Only Cookie with universal device compatibility
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: useSecureCookie,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('API /api/admin/auth/login error:', error);
    return NextResponse.json({ error: 'Authentication service error. Please try again.' }, { status: 500 });
  }
}
