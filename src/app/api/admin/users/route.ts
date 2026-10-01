import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getDatabase } from '@/lib/mongodb';
import { createClerkClient } from '@clerk/backend';

export const dynamic = 'force-dynamic';

export interface AggregatedUserItem {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  sources: string[];
  firstSeen: string;
  lastActive: string;
  totalBookings: number;
  latestPlan: string;
  latestBookingStatus: string;
  inquiryCount: number;
  marketingOptIn: boolean;
  marketingOptOutAt?: string | null;
  status: 'ACTIVE_MEMBER' | 'PROSPECTIVE_LEAD' | 'INQUIRY_CONTACT' | 'REGISTERED_USER';
  clerkUserId?: string;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin credentials required' },
        { status: 401 }
      );
    }

    const memberMap = new Map<string, AggregatedUserItem>();

    // 1. Fetch Registered Users from Clerk
    const clerkKey = process.env.CLERK_SECRET_KEY;
    if (clerkKey) {
      try {
        const clerk = createClerkClient({ secretKey: clerkKey });
        const clerkUsers = await clerk.users.getUserList({ limit: 100 });

        for (const u of clerkUsers.data) {
          const primaryEmail =
            u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId)?.emailAddress ||
            u.emailAddresses[0]?.emailAddress ||
            '';
          const email = primaryEmail.toLowerCase().trim();
          if (!email) continue;

          const primaryPhone =
            u.phoneNumbers.find((p) => p.id === u.primaryPhoneNumberId)?.phoneNumber ||
            u.phoneNumbers[0]?.phoneNumber ||
            'N/A';

          const fullName =
            [u.firstName, u.lastName].filter(Boolean).join(' ').trim() ||
            u.username ||
            'Registered Athlete';

          const createdDate = new Date(u.createdAt).toISOString();
          const lastActiveDate = u.lastSignInAt
            ? new Date(u.lastSignInAt).toISOString()
            : createdDate;

          memberMap.set(email, {
            id: u.id,
            clerkUserId: u.id,
            fullName,
            email,
            phone: primaryPhone,
            sources: ['Clerk Registered'],
            firstSeen: createdDate,
            lastActive: lastActiveDate,
            totalBookings: 0,
            latestPlan: 'Registered Account',
            latestBookingStatus: 'REGISTERED',
            inquiryCount: 0,
            marketingOptIn: true,
            status: 'REGISTERED_USER',
          });
        }
      } catch (clerkErr) {
        console.warn('Notice: Clerk user aggregation warning:', clerkErr);
      }
    }

    // 2. Fetch and Merge from MongoDB (Bookings, Inquiries, Contacts, Newsletter)
    try {
      const db = await getDatabase();

      // Query bookings
      const bookingsCol = db.collection('bookings');
      const allBookings = await bookingsCol.find().sort({ createdAt: -1 }).toArray();

      for (const b of allBookings) {
        const email = (b.email || '').toLowerCase().trim();
        if (!email) continue;

        const bCreated = b.createdAt ? new Date(b.createdAt).toISOString() : new Date().toISOString();

        if (memberMap.has(email)) {
          const existing = memberMap.get(email)!;
          existing.totalBookings += 1;
          if (!existing.sources.includes('Booking')) {
            existing.sources.push('Booking');
          }
          if (new Date(bCreated) > new Date(existing.lastActive)) {
            existing.lastActive = bCreated;
            existing.latestPlan = b.planName || existing.latestPlan;
            existing.latestBookingStatus = b.status || existing.latestBookingStatus;
          }
          if (existing.phone === 'N/A' && b.phone) {
            existing.phone = b.phone;
          }
          if (existing.fullName === 'Registered Athlete' && b.customerName) {
            existing.fullName = b.customerName;
          }
          existing.status = 'ACTIVE_MEMBER';
        } else {
          memberMap.set(email, {
            id: b._id.toString(),
            fullName: b.customerName || 'Athlete Member',
            email: b.email,
            phone: b.phone || 'N/A',
            sources: ['Booking'],
            firstSeen: bCreated,
            lastActive: bCreated,
            totalBookings: 1,
            latestPlan: b.planName || 'Membership Allocation',
            latestBookingStatus: b.status || 'CONFIRMED',
            inquiryCount: 0,
            marketingOptIn: b.marketingOptIn !== undefined ? Boolean(b.marketingOptIn) : true,
            status: 'ACTIVE_MEMBER',
          });
        }
      }

      // Query contacts / inquiries
      const contactsCol = db.collection('contacts');
      const allContacts = await contactsCol.find().sort({ createdAt: -1 }).toArray();

      for (const c of allContacts) {
        const email = (c.email || '').toLowerCase().trim();
        if (!email) continue;

        const cCreated = c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString();

        if (memberMap.has(email)) {
          const existing = memberMap.get(email)!;
          existing.inquiryCount += 1;
          const sourceLabel = c.sources ? 'Contact Form' : 'Contact';
          if (!existing.sources.includes(sourceLabel) && !existing.sources.includes('Contact')) {
            existing.sources.push(sourceLabel);
          }
          if (existing.phone === 'N/A' && c.phone) {
            existing.phone = c.phone;
          }
          if (c.marketingOptIn !== undefined) {
            existing.marketingOptIn = Boolean(c.marketingOptIn);
            if (c.marketingOptOutAt) existing.marketingOptOutAt = c.marketingOptOutAt;
          }
        } else {
          memberMap.set(email, {
            id: c._id.toString(),
            fullName: c.name || 'Inquiry Lead',
            email: c.email,
            phone: c.phone || 'N/A',
            sources: ['Contact'],
            firstSeen: cCreated,
            lastActive: cCreated,
            totalBookings: 0,
            latestPlan: c.latestPlan || c.topic || 'General Inquiry',
            latestBookingStatus: 'INQUIRY_ONLY',
            inquiryCount: 1,
            marketingOptIn: c.marketingOptIn !== undefined ? Boolean(c.marketingOptIn) : true,
            marketingOptOutAt: c.marketingOptOutAt || null,
            status: 'INQUIRY_CONTACT',
          });
        }
      }

      // Query marketing_contacts / newsletter if present
      try {
        const marketingCol = db.collection('marketing_contacts');
        const marketingDocs = await marketingCol.find().toArray();
        for (const m of marketingDocs) {
          const email = (m.email || '').toLowerCase().trim();
          if (email && memberMap.has(email)) {
            const existing = memberMap.get(email)!;
            if (m.marketingOptIn !== undefined) {
              existing.marketingOptIn = Boolean(m.marketingOptIn);
            }
            if (m.marketingOptOutAt) {
              existing.marketingOptOutAt = m.marketingOptOutAt;
            }
          }
        }
      } catch (mErr) {
        // Safe skip
      }
    } catch (dbErr) {
      console.warn('MongoDB query notice in /api/admin/users:', dbErr);
    }

    // Convert map to sorted array
    const usersData = Array.from(memberMap.values()).sort(
      (a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
    );

    // Provide stats
    const stats = {
      total: usersData.length,
      clerkUsers: usersData.filter((u) => u.sources.includes('Clerk Registered')).length,
      bookingsCount: usersData.filter((u) => u.totalBookings > 0).length,
      optedInCount: usersData.filter((u) => u.marketingOptIn).length,
      unsubscribedCount: usersData.filter((u) => !u.marketingOptIn || u.marketingOptOutAt).length,
    };

    return NextResponse.json({
      success: true,
      users: usersData,
      total: usersData.length,
      stats,
    });
  } catch (error) {
    console.error('API /api/admin/users critical error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve members list',
        users: [],
        total: 0,
      },
      { status: 500 }
    );
  }
}

