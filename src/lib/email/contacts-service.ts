import crypto from 'crypto';
import { getDatabase } from '@/lib/mongodb';
import { MarketingContact, ContactSource } from '@/types/email';

/**
 * Generate a cryptographically secure, URL-safe unsubscribe token
 */
export function generateUnsubscribeToken(): string {
  return crypto.randomBytes(24).toString('hex');
}

/**
 * Normalizes email address for consistent indexing and deduplication
 */
export function normalizeEmail(email: string): string {
  return (email || '').trim().toLowerCase();
}

/**
 * Upsert or synchronize an athlete contact into the marketing & contacts registry.
 * Deduplicates by normalized email and tracks sources, consent, and engagement.
 */
export async function upsertContact({
  email,
  name,
  phone,
  source,
  marketingOptIn = false,
  latestPlan,
}: {
  email: string;
  name?: string;
  phone?: string;
  source: ContactSource;
  marketingOptIn?: boolean;
  latestPlan?: string;
}): Promise<MarketingContact | null> {
  try {
    const cleanEmail = normalizeEmail(email);
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return null;
    }

    const db = await getDatabase();
    const contactsCol = db.collection('marketing_contacts');

    const now = new Date().toISOString();
    const existing = await contactsCol.findOne({ email: cleanEmail });

    if (!existing) {
      const newContact: MarketingContact = {
        email: cleanEmail,
        name: (name || cleanEmail.split('@')[0] || 'Athlete').trim(),
        phone: phone ? String(phone).trim() : undefined,
        sources: [source],
        marketingOptIn: Boolean(marketingOptIn),
        marketingOptInAt: marketingOptIn ? now : undefined,
        marketingOptOutAt: undefined,
        unsubscribeToken: generateUnsubscribeToken(),
        totalBookings: source === 'BOOKING' ? 1 : 0,
        totalInquiries: source === 'CONTACT' ? 1 : 0,
        latestPlan: latestPlan || undefined,
        lastActiveAt: now,
        createdAt: now,
        updatedAt: now,
      };

      await contactsCol.insertOne(newContact as any);
      return newContact;
    }

    // Update existing contact safely
    const updateDoc: any = {
      $set: {
        lastActiveAt: now,
        updatedAt: now,
      },
      $addToSet: {
        sources: source,
      },
    };

    if (name && name.trim()) {
      updateDoc.$set.name = name.trim();
    }
    if (phone && phone.trim()) {
      updateDoc.$set.phone = phone.trim();
    }
    if (latestPlan) {
      updateDoc.$set.latestPlan = latestPlan;
    }
    if (!existing.unsubscribeToken) {
      updateDoc.$set.unsubscribeToken = generateUnsubscribeToken();
    }

    // Handle marketing consent changes
    if (marketingOptIn === true && !existing.marketingOptIn) {
      updateDoc.$set.marketingOptIn = true;
      updateDoc.$set.marketingOptInAt = now;
      updateDoc.$unset = { marketingOptOutAt: '' };
    }

    if (source === 'BOOKING') {
      updateDoc.$inc = { totalBookings: 1 };
    } else if (source === 'CONTACT') {
      updateDoc.$inc = { ...(updateDoc.$inc || {}), totalInquiries: 1 };
    }

    await contactsCol.updateOne({ email: cleanEmail }, updateDoc);
    const updated = await contactsCol.findOne({ email: cleanEmail });
    return updated as unknown as MarketingContact;
  } catch (error) {
    console.error('Error in upsertContact:', error);
    return null;
  }
}

/**
 * Opt-out / unsubscribe user using their unique secure token
 */
export async function unsubscribeByToken(token: string): Promise<{ success: boolean; email?: string; error?: string }> {
  try {
    if (!token || typeof token !== 'string') {
      return { success: false, error: 'Invalid or missing unsubscribe token.' };
    }

    const db = await getDatabase();
    const contactsCol = db.collection('marketing_contacts');

    const contact = await contactsCol.findOne({ unsubscribeToken: token.trim() });
    if (!contact) {
      return { success: false, error: 'Unsubscribe link is invalid or expired.' };
    }

    const now = new Date().toISOString();
    await contactsCol.updateOne(
      { _id: contact._id },
      {
        $set: {
          marketingOptIn: false,
          marketingOptOutAt: now,
          updatedAt: now,
        },
      }
    );

    return { success: true, email: contact.email };
  } catch (error: any) {
    console.error('Error in unsubscribeByToken:', error);
    return { success: false, error: error.message || 'Failed to process unsubscribe request.' };
  }
}

/**
 * Opt-out / unsubscribe user by email directly (Admin action or manual request)
 */
export async function setMarketingConsent(
  email: string,
  optIn: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const cleanEmail = normalizeEmail(email);
    if (!cleanEmail) return { success: false, error: 'Email is required.' };

    const db = await getDatabase();
    const contactsCol = db.collection('marketing_contacts');
    const now = new Date().toISOString();

    const result = await contactsCol.updateOne(
      { email: cleanEmail },
      {
        $set: {
          marketingOptIn: optIn,
          ...(optIn ? { marketingOptInAt: now } : { marketingOptOutAt: now }),
          updatedAt: now,
        },
      },
      { upsert: false }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: 'Contact not found.' };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update consent.' };
  }
}

/**
 * Retrieve eligible recipients for an email campaign based on marketing consent and audience filter.
 * Targets ALL eligible registered and opted-in users in the database while strictly excluding unsubscribed users.
 */
export async function getEligibleCampaignRecipients(
  targetAudience: 'ALL_OPTED_IN' | 'REGISTERED_USERS' | 'BOOKINGS_ONLY' | 'CONTACTS_ONLY' = 'ALL_OPTED_IN'
): Promise<Array<{ email: string; name: string; unsubscribeToken: string }>> {
  try {
    const db = await getDatabase();
    const contactsCol = db.collection('marketing_contacts');

    // Sync ALL Clerk registered users to marketing_contacts (Full paginated loop)
    const clerkKey = process.env.CLERK_SECRET_KEY;
    if (clerkKey) {
      try {
        const { createClerkClient } = await import('@clerk/backend');
        const clerk = createClerkClient({ secretKey: clerkKey.trim().replace(/^["']|["']$/g, '') });
        let offset = 0;
        const limit = 500;
        let hasMore = true;

        while (hasMore) {
          const clerkUsersBatch = await clerk.users.getUserList({ limit, offset });
          const users = clerkUsersBatch.data || [];

          for (const u of users) {
            const email =
              u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId)?.emailAddress ||
              u.emailAddresses[0]?.emailAddress;

            if (email) {
              const fullName =
                [u.firstName, u.lastName].filter(Boolean).join(' ').trim() ||
                u.username ||
                'Registered Athlete';

              // Only insert if not already present, preserving user opt-out status if already configured
              const existing = await contactsCol.findOne({ email: normalizeEmail(email) });
              if (!existing) {
                await upsertContact({
                  email,
                  name: fullName,
                  source: 'CLERK_USER',
                  marketingOptIn: true,
                  latestPlan: 'Registered Athlete Account',
                });
              }
            }
          }

          offset += users.length;
          if (users.length < limit || offset >= (clerkUsersBatch.totalCount || 0)) {
            hasMore = false;
          }
        }
      } catch (clerkSyncErr) {
        console.warn('Notice: Clerk sync in getEligibleCampaignRecipients:', clerkSyncErr);
      }
    }

    // Build database query for eligible recipients:
    // 1. Valid email exists
    // 2. marketingOptIn === true
    // 3. User has NOT unsubscribed (marketingOptOutAt is null/undefined)
    const query: any = {
      marketingOptIn: true,
      marketingOptOutAt: { $in: [null, undefined, ''] },
      email: { $exists: true, $regex: /@/ },
    };

    if (targetAudience === 'REGISTERED_USERS') {
      query.sources = { $in: ['REGISTRATION', 'CLERK_USER'] };
    } else if (targetAudience === 'BOOKINGS_ONLY') {
      query.sources = 'BOOKING';
    } else if (targetAudience === 'CONTACTS_ONLY') {
      query.sources = 'CONTACT';
    }

    const contacts = await contactsCol
      .find(query, { projection: { email: 1, name: 1, unsubscribeToken: 1 } })
      .toArray();

    // Deduplicate by normalized lowercase email
    const recipientMap = new Map<string, { email: string; name: string; unsubscribeToken: string }>();
    for (const c of contacts) {
      const cleanEmail = normalizeEmail(c.email);
      if (cleanEmail && !recipientMap.has(cleanEmail)) {
        recipientMap.set(cleanEmail, {
          email: cleanEmail,
          name: c.name || 'Athlete',
          unsubscribeToken: c.unsubscribeToken || generateUnsubscribeToken(),
        });
      }
    }

    return Array.from(recipientMap.values());
  } catch (error) {
    console.error('Error fetching eligible campaign recipients:', error);
    return [];
  }
}

/**
 * Aggregate contact and consent metrics for Admin Panel
 */
export async function getAudienceStats(): Promise<{
  totalContacts: number;
  optedIn: number;
  unsubscribed: number;
  notOptedIn: number;
  registeredCount: number;
  bookingsCount: number;
  contactsCount: number;
}> {
  try {
    const db = await getDatabase();
    const contactsCol = db.collection('marketing_contacts');

    // Make sure indexes exist for fast queries
    await contactsCol.createIndex({ email: 1 }, { unique: true }).catch(() => {});
    await contactsCol.createIndex({ marketingOptIn: 1 }).catch(() => {});
    await contactsCol.createIndex({ unsubscribeToken: 1 }).catch(() => {});

    const [totalContacts, optedIn, unsubscribed, registeredCount, bookingsCount, contactsCount] =
      await Promise.all([
        contactsCol.countDocuments(),
        contactsCol.countDocuments({ marketingOptIn: true, marketingOptOutAt: { $in: [null, undefined, ''] } }),
        contactsCol.countDocuments({ marketingOptOutAt: { $exists: true, $nin: [null, undefined, ''] } }),
        contactsCol.countDocuments({ sources: { $in: ['REGISTRATION', 'CLERK_USER'] } }),
        contactsCol.countDocuments({ sources: 'BOOKING' }),
        contactsCol.countDocuments({ sources: 'CONTACT' }),
      ]);

    const notOptedIn = Math.max(0, totalContacts - optedIn);

    return {
      totalContacts,
      optedIn,
      unsubscribed,
      notOptedIn,
      registeredCount,
      bookingsCount,
      contactsCount,
    };
  } catch (error) {
    console.error('Error getting audience stats:', error);
    return {
      totalContacts: 0,
      optedIn: 0,
      unsubscribed: 0,
      notOptedIn: 0,
      registeredCount: 0,
      bookingsCount: 0,
      contactsCount: 0,
    };
  }
}

