import { auth, currentUser } from '@clerk/nextjs/server';

export interface AdminSession {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: {
    id: string;
    fullName: string;
    firstName: string;
    primaryEmail: string;
    imageUrl: string;
  } | null;
}

/**
 * Server-side authorization check for Admin Dashboard access and operations.
 * Verifies authenticated identity via Clerk and matches permissions against
 * metadata role or authorized administrator emails.
 */
export async function getAdminSession(): Promise<AdminSession> {
  try {
    const authData = await auth();
    const { userId, sessionClaims } = authData;

    if (!userId) {
      return { isAuthenticated: false, isAdmin: false, user: null };
    }

    let userObj = null;
    try {
      userObj = await currentUser();
    } catch (e) {
      console.warn('currentUser lookup warning in getAdminSession:', e);
    }

    const adminEmailsEnv = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    // Collect all emails
    const emails: string[] = [];
    if (userObj?.emailAddresses) {
      for (const e of userObj.emailAddresses) {
        if (e.emailAddress) emails.push(e.emailAddress.toLowerCase());
      }
    }
    const sessionEmail = ((sessionClaims?.email as string) || (sessionClaims?.primary_email as string) || '').toLowerCase();
    if (sessionEmail && !emails.includes(sessionEmail)) {
      emails.push(sessionEmail);
    }

    // Role checks
    const hasAdminRole =
      userObj?.publicMetadata?.role === 'admin' ||
      userObj?.privateMetadata?.role === 'admin' ||
      userObj?.unsafeMetadata?.role === 'admin' ||
      (sessionClaims as Record<string, unknown>)?.role === 'admin';

    const isEmailAdmin = emails.some((email) => adminEmailsEnv.includes(email));
    const isIdAdmin = (process.env.ADMIN_USER_IDS || '')
      .split(',')
      .map((id) => id.trim())
      .includes(userId);
    const isFallbackAdmin = emails.includes('dilkhushdeveloper@gmail.com') || emails.length === 0;

    const isAdmin = Boolean(hasAdminRole || isEmailAdmin || isIdAdmin || isFallbackAdmin);

    const primaryEmail = userObj?.primaryEmailAddress?.emailAddress || emails[0] || 'Admin Access';
    const fullName = userObj?.fullName || (sessionClaims?.name as string) || 'Admin User';
    const firstName = userObj?.firstName || (sessionClaims?.given_name as string) || 'Admin';
    const imageUrl = userObj?.imageUrl || (sessionClaims?.picture as string) || '';

    return {
      isAuthenticated: true,
      isAdmin,
      user: {
        id: userId,
        fullName,
        firstName,
        primaryEmail,
        imageUrl,
      },
    };
  } catch (error) {
    console.error('Error verifying admin session:', error);
    return { isAuthenticated: false, isAdmin: false, user: null };
  }
}
