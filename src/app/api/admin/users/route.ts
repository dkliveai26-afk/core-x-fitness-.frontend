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

    // 1. Fetch Registered Users from Clerk Auth
    const clerkKey = process.env.CLERK_SECRET_KEY;
    if (clerkKey) {
      try {
        const clerk = createClerkClient({ secretKey: clerkKey.trim().replace(/^["']|["']$/g, '') });
        const clerkUsers = await clerk.users.getUserList({ limit: 500 });

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
      } catch (clerkErr: any) {
        console.warn('Notice: Clerk user aggregation warning:', clerkErr?.message || clerkErr);
      }
    }

    // 2. Fetch and Merge from MongoDB (Bookings, Inquiries, Contacts, Newsletter Subscribers)
    try {
      const db = await getDatabase();

      // A. Query bookings collection
      try {
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
            if ((existing.phone === 'N/A' || !existing.phone) && b.phone) {
              existing.phone = b.phone;
            }
            if ((existing.fullName === 'Registered Athlete' || !existing.fullName) && b.customerName) {
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
      } catch (bErr: any) {
        console.warn('Notice: Bookings collection read notice:', bErr?.message);
      }

      // B. Query contacts collection
      try {
        const contactsCol = db.collection('contacts');
        const allContacts = await contactsCol.find().sort({ createdAt: -1 }).toArray();

        for (const c of allContacts) {
          const email = (c.email || '').toLowerCase().trim();
          if (!email) continue;

          const cCreated = c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString();

          if (memberMap.has(email)) {
            const existing = memberMap.get(email)!;
            existing.inquiryCount += 1;
            if (!existing.sources.includes('Contact')) {
              existing.sources.push('Contact');
            }
            if ((existing.phone === 'N/A' || !existing.phone) && c.phone) {
              existing.phone = c.phone;
            }
            if ((existing.fullName === 'Registered Athlete' || !existing.fullName) && c.name) {
              existing.fullName = c.name;
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
      } catch (cErr: any) {
        console.warn('Notice: Contacts collection read notice:', cErr?.message);
      }

      // C. Query marketing_contacts collection (Subscribers, VIP Leads, Direct Registry)
      try {
        const marketingCol = db.collection('marketing_contacts');
        const marketingDocs = await marketingCol.find().toArray();

        for (const m of marketingDocs) {
          const email = (m.email || '').toLowerCase().trim();
          if (!email) continue;

          const mCreated = m.createdAt ? new Date(m.createdAt).toISOString() : new Date().toISOString();
          const mLastActive = m.lastActiveAt ? new Date(m.lastActiveAt).toISOString() : mCreated;

          // Convert internal sources to user-facing labels
          const rawSources: string[] = Array.isArray(m.sources) ? m.sources : [];
          const convertedSources: string[] = [];
          for (const s of rawSources) {
            const sUpper = String(s).toUpperCase();
            if (sUpper.includes('CLERK') && !convertedSources.includes('Clerk Registered')) {
              convertedSources.push('Clerk Registered');
            } else if (sUpper.includes('BOOKING') && !convertedSources.includes('Booking')) {
              convertedSources.push('Booking');
            } else if (sUpper.includes('CONTACT') && !convertedSources.includes('Contact')) {
              convertedSources.push('Contact');
            } else if ((sUpper.includes('NEWSLETTER') || sUpper.includes('FOOTER')) && !convertedSources.includes('Newsletter')) {
              convertedSources.push('Newsletter');
            }
          }
          if (convertedSources.length === 0) {
            convertedSources.push('Newsletter');
          }

          if (memberMap.has(email)) {
            const existing = memberMap.get(email)!;
            for (const src of convertedSources) {
              if (!existing.sources.includes(src)) {
                existing.sources.push(src);
              }
            }
            if (m.marketingOptIn !== undefined) {
              existing.marketingOptIn = Boolean(m.marketingOptIn);
            }
            if (m.marketingOptOutAt) {
              existing.marketingOptOutAt = m.marketingOptOutAt;
            }
            if (m.name && (existing.fullName === 'Registered Athlete' || !existing.fullName || existing.fullName === 'Athlete')) {
              existing.fullName = m.name;
            }
            if (m.phone && (existing.phone === 'N/A' || !existing.phone)) {
              existing.phone = m.phone;
            }
            if (new Date(mLastActive) > new Date(existing.lastActive)) {
              existing.lastActive = mLastActive;
            }
            if (new Date(mCreated) < new Date(existing.firstSeen)) {
              existing.firstSeen = mCreated;
            }
            if (m.totalBookings && m.totalBookings > existing.totalBookings) {
              existing.totalBookings = m.totalBookings;
            }
            if (m.totalInquiries && m.totalInquiries > existing.inquiryCount) {
              existing.inquiryCount = m.totalInquiries;
            }
            if (existing.totalBookings > 0) {
              existing.status = 'ACTIVE_MEMBER';
            }
          } else {
            const isBooking = convertedSources.includes('Booking') || (m.totalBookings || 0) > 0;
            const isClerk = convertedSources.includes('Clerk Registered');
            const isContact = convertedSources.includes('Contact') || (m.totalInquiries || 0) > 0;

            const resolvedStatus: AggregatedUserItem['status'] = isBooking
              ? 'ACTIVE_MEMBER'
              : isClerk
              ? 'REGISTERED_USER'
              : isContact
              ? 'INQUIRY_CONTACT'
              : 'PROSPECTIVE_LEAD';

            memberMap.set(email, {
              id: m._id.toString(),
              fullName: m.name || (email.split('@')[0] ? email.split('@')[0].toUpperCase() : 'VIP Lead'),
              email: m.email,
              phone: m.phone || 'N/A',
              sources: convertedSources,
              firstSeen: mCreated,
              lastActive: mLastActive,
              totalBookings: m.totalBookings || 0,
              latestPlan: m.latestPlan || (isBooking ? 'Membership Allocation' : isContact ? 'General Inquiry' : 'VIP Newsletter Opt-In'),
              latestBookingStatus: isBooking ? 'CONFIRMED' : isContact ? 'INQUIRY_ONLY' : 'SUBSCRIBED',
              inquiryCount: m.totalInquiries || 0,
              marketingOptIn: m.marketingOptIn !== undefined ? Boolean(m.marketingOptIn) : true,
              marketingOptOutAt: m.marketingOptOutAt || null,
              status: resolvedStatus,
            });
          }
        }
      } catch (mErr: any) {
        console.warn('Notice: Marketing contacts collection read notice:', mErr?.message);
      }
    } catch (dbErr: any) {
      console.warn('Notice: MongoDB root query notice in /api/admin/users:', dbErr?.message);
    }

    // Convert map to sorted array (most recently active first)
    const usersData = Array.from(memberMap.values()).sort(
      (a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
    );

    // Calculate live accurate audience stats
    const stats = {
      total: usersData.length,
      clerkUsers: usersData.filter((u) => u.sources.includes('Clerk Registered')).length,
      bookingsCount: usersData.filter((u) => u.totalBookings > 0 || u.sources.includes('Booking')).length,
      optedInCount: usersData.filter((u) => u.marketingOptIn && !u.marketingOptOutAt).length,
      unsubscribedCount: usersData.filter((u) => !u.marketingOptIn || Boolean(u.marketingOptOutAt)).length,
    };

    return NextResponse.json({
      success: true,
      users: usersData,
      total: usersData.length,
      stats,
    });
  } catch (error: any) {
    console.error('API /api/admin/users critical error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to retrieve members list',
        users: [],
        total: 0,
      },
      { status: 500 }
    );
  }
}
