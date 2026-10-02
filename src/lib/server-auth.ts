import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { verifyToken, createClerkClient } from '@clerk/backend';

export interface AuthenticatedClerkResult {
  userId: string | null;
  verifiedEmails: string[];
}

/**
 * Multi-layer server-side authentication resolver for Clerk requests in Next.js App Router.
 * 1. Checks Clerk Next.js App Router auth()
 * 2. Checks Authorization: Bearer <token> (JWT verifyToken with secret key)
 * 3. Checks __session cookie (JWT verifyToken with secret key)
 * 4. Resolves verified email addresses via Clerk Backend BAPI
 */
export async function getAuthenticatedClerkUser(
  req: NextRequest
): Promise<AuthenticatedClerkResult> {
  let userId: string | null = null;
  const verifiedEmails: string[] = [];
  const rawKey = process.env.CLERK_SECRET_KEY || '';
  const secretKey = rawKey.trim().replace(/^["']|["']$/g, '');

  // Layer 1: Next.js App Router auth()
  try {
    const authData = await auth();
    if (authData?.userId) {
      userId = authData.userId;
      const claims = authData.sessionClaims as Record<string, any> | undefined;
      const claimEmail = (
        claims?.email ||
        claims?.primary_email ||
        claims?.user_email ||
        ''
      )
        .toLowerCase()
        .trim();
      if (claimEmail && !verifiedEmails.includes(claimEmail)) {
        verifiedEmails.push(claimEmail);
      }
    }
  } catch (authErr) {
    console.warn('auth() lookup notice in getAuthenticatedClerkUser:', authErr);
  }

  // Layer 2: Authorization: Bearer <token> header (from useAuth().getToken())
  if (!userId && secretKey) {
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '').trim();
      if (token) {
        try {
          const payload = await verifyToken(token, { secretKey });
          if (payload && payload.sub) {
            userId = payload.sub;
            const tokenEmail = (
              (payload as any).email ||
              (payload as any).primary_email ||
              ''
            )
              .toLowerCase()
              .trim();
            if (tokenEmail && !verifiedEmails.includes(tokenEmail)) {
              verifiedEmails.push(tokenEmail);
            }
          }
        } catch (tokenErr) {
          console.warn('Bearer token verification notice in getAuthenticatedClerkUser:', tokenErr);
        }
      }
    }
  }

  // Layer 3: Direct __session cookie verification with secret key
  if (!userId && secretKey) {
    const sessionCookie = req.cookies.get('__session')?.value;
    if (sessionCookie) {
      try {
        const payload = await verifyToken(sessionCookie, { secretKey });
        if (payload && payload.sub) {
          userId = payload.sub;
          const cookieEmail = (
            (payload as any).email ||
            (payload as any).primary_email ||
            ''
          )
            .toLowerCase()
            .trim();
          if (cookieEmail && !verifiedEmails.includes(cookieEmail)) {
            verifiedEmails.push(cookieEmail);
          }
        }
      } catch (cookieErr) {
        console.warn('Session cookie verification notice in getAuthenticatedClerkUser:', cookieErr);
      }
    }
  }

  // Fetch full verified emails via Clerk BAPI for complete account coverage
  if (userId && secretKey) {
    try {
      const clerk = createClerkClient({ secretKey });
      const user = await clerk.users.getUser(userId);
      if (user?.emailAddresses) {
        for (const e of user.emailAddresses) {
          if (e.emailAddress) {
            const clean = e.emailAddress.toLowerCase().trim();
            if (!verifiedEmails.includes(clean)) {
              verifiedEmails.push(clean);
            }
          }
        }
      }
    } catch (bapiErr: any) {
      console.warn('Clerk BAPI user lookup notice in getAuthenticatedClerkUser:', bapiErr?.message);
    }
  }

  return { userId, verifiedEmails };
}
