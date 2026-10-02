'use client';

import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';

/**
 * Headless AuthSyncHandler component that automatically synchronizes signed-in / signed-up
 * athletes with MongoDB marketing contacts and triggers the Welcome Confirmation email.
 */
export function AuthSyncHandler() {
  const { isLoaded, isSignedIn, user } = useUser();
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user || hasSyncedRef.current) {
      return;
    }

    const email =
      user.primaryEmailAddress?.emailAddress ||
      user.emailAddresses?.[0]?.emailAddress;

    if (!email) return;

    const sessionKey = `corex_user_synced_${user.id}`;
    if (typeof window !== 'undefined' && sessionStorage.getItem(sessionKey)) {
      hasSyncedRef.current = true;
      return;
    }

    const fullName =
      user.fullName ||
      [user.firstName, user.lastName].filter(Boolean).join(' ').trim() ||
      user.username ||
      'Athlete';

    hasSyncedRef.current = true;

    fetch('/api/auth/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name: fullName,
        userId: user.id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && typeof window !== 'undefined') {
          sessionStorage.setItem(sessionKey, 'true');
        }
      })
      .catch((err) => {
        console.warn('Auth sync notice:', err);
      });
  }, [isLoaded, isSignedIn, user]);

  return null;
}
