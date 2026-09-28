import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import {
  ensureDefaultAdmin,
  verifyPassword,
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

    // Ensure initial admin accounts exist in database
    await ensureDefaultAdmin();

    const db = await getDatabase();
    const adminsCol = db.collection('admins');

    const admin = await adminsCol.findOne({ email: email.trim().toLowerCase() });

    if (!admin || !admin.passwordHash) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const isMatch = verifyPassword(password, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const token = createAdminToken({
      id: admin._id.toString(),
      email: admin.email,
      name: admin.name || 'Core X Administrator',
      role: admin.role || 'admin',
    });

    const proto = req.headers.get('x-forwarded-proto') || req.nextUrl.protocol.replace(':', '');
    const isHttps = proto === 'https';
    const isProduction = process.env.NODE_ENV === 'production';
    const useSecureCookie = isProduction ? isHttps : false;

    const response = NextResponse.json({
      success: true,
      message: 'Admin authentication successful.',
      user: {
        id: admin._id.toString(),
        email: admin.email,
        name: admin.name || 'Core X Administrator',
        role: admin.role || 'admin',
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
