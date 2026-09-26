import crypto from 'crypto';
import { cookies } from 'next/headers';
import { getDatabase } from './mongodb';
import { ObjectId } from 'mongodb';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'admin';
  createdAt?: string;
}

export interface AdminTokenPayload {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'admin';
  iat: number;
  exp: number;
}

export { ADMIN_COOKIE_NAME } from './admin-constants';
import { ADMIN_COOKIE_NAME } from './admin-constants';
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || process.env.CLERK_SECRET_KEY || 'corex_fitness_secure_admin_jwt_secret_key_2026_x';

/**
 * Secure password hashing using Node.js crypto scrypt (memory-hard, cryptographic standard)
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derivedKey}`;
}

/**
 * Verify password against stored salt:hash using constant-time comparison
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) return false;
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}

/**
 * Base64 URL encoding helper
 */
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

/**
 * Create a signed JWT token for admin session
 */
export function createAdminToken(user: { id: string; email: string; name: string; role: 'superadmin' | 'admin' }): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminTokenPayload = {
    id: user.id,
    email: user.email.toLowerCase(),
    name: user.name,
    role: user.role,
    iat: now,
    exp: now + 7 * 24 * 60 * 60, // 7 days
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(signatureInput)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${signatureInput}.${signature}`;
}

/**
 * Verify and decode admin JWT token
 */
export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;
    const signatureInput = `${encodedHeader}.${encodedPayload}`;

    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(signatureInput)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (signatureBuffer.length !== expectedBuffer.length) return null;
    if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) return null;

    const payload: AdminTokenPayload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Initialize default admin in MongoDB if collection is empty
 */
export async function ensureDefaultAdmin(): Promise<void> {
  try {
    const db = await getDatabase();
    const adminsCol = db.collection('admins');
    const count = await adminsCol.countDocuments();

    if (count === 0) {
      const defaultAdmins = [
        {
          email: 'admin@corexfitness.com',
          passwordHash: hashPassword('dev.dilkhush@$$$$$'),
          name: 'Core X Admin',
          role: 'superadmin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          email: 'dilkhushdeveloper@gmail.com',
          passwordHash: hashPassword('dev.dilkhush@$$$$$'),
          name: 'Dilkhush (Lead Admin)',
          role: 'superadmin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      await adminsCol.insertMany(defaultAdmins);
      console.log('✅ Seeded default admin credentials into MongoDB admins collection.');
    }
  } catch (error) {
    console.error('Error ensuring default admin in MongoDB:', error);
  }
}

/**
 * Server-side session verification for Admin routes and Server Components
 */
export async function getAdminSession(): Promise<{ isAuthenticated: boolean; user: AdminUser | null }> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (!token) {
      return { isAuthenticated: false, user: null };
    }

    const payload = verifyAdminToken(token);
    if (!payload) {
      return { isAuthenticated: false, user: null };
    }

    return {
      isAuthenticated: true,
      user: {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        role: payload.role,
      },
    };
  } catch (error) {
    console.error('Error in getAdminSession:', error);
    return { isAuthenticated: false, user: null };
  }
}
