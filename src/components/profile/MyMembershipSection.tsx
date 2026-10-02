'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useUser, useAuth } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dumbbell,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Clock3,
  XCircle,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Tag,
  CreditCard,
  User,
  Phone,
  Mail,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export interface UserBooking {
  _id: string;
  customerName: string;
  email: string;
  phone: string;
  planName: string;
  planPrice: string;
  planPeriod: string;
  bookingType: string;
  preferredDate: string;
  status: string;
  notes?: Array<{ id: string; text: string; author: string; createdAt: string }>;
  createdAt: string;
  updatedAt: string;
}

interface MyMembershipSectionProps {
  inClerkModal?: boolean;
  showHeader?: boolean;
}

export function MyMembershipSection({
  inClerkModal = false,
  showHeader = true,
}: MyMembershipSectionProps) {
  const { isSignedIn, isLoaded, user } = useUser();
  const { getToken } = useAuth();
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchBookings = useCallback(
    async (isManualRefresh = false) => {
      if (isManualRefresh) {
        setIsRefreshing(true);
      }
      setError(null);

      try {
        // Retrieve fresh Clerk JWT token to ensure server-side auth is 100% available
        let token: string | null = null;
        try {
          token = await getToken();
        } catch (tokenErr) {
          console.warn('Notice: getToken lookup notice:', tokenErr);
        }

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch('/api/user/bookings', {
          method: 'GET',
          headers,
          credentials: 'same-origin',
          cache: 'no-store',
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Server responded with status ${res.status}`);
        }

        const data = await res.json();
        setBookings(data.bookings || []);
        setLastUpdated(new Date());
        setError(null);
      } catch (err: any) {
        console.error('Fetch user bookings error:', err);
        setError(err.message || 'Unable to sync membership status from database.');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [getToken]
  );

  // Sync on mount and whenever user auth state resolves
  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        fetchBookings();
      } else {
        setIsLoading(false);
        setBookings([]);
      }
    }
  }, [isLoaded, isSignedIn, fetchBookings]);

  // Window focus listener for real-time status updates when admin modifies status
  useEffect(() => {
    const handleFocus = () => {
      if (isSignedIn) {
        fetchBookings();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isSignedIn, fetchBookings]);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 2500);
  };

  const formatDisplayDate = (dateString?: string) => {
    if (!dateString) return 'Pending Allocation';
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatDisplayDateTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const formatBookingType = (type?: string) => {
    if (!type) return 'Membership Allocation';
    switch (type.toUpperCase()) {
      case 'MEMBERSHIP_ALLOCATION':
        return 'Membership Tier Allocation';
      case 'PRIVATE_TOUR':
        return 'VIP Facility Tour';
      case 'ASSESSMENT':
        return 'Biometric Intake Assessment';
      case 'CUSTOM':
        return 'Custom Performance Package';
      default:
        return type.replace(/_/g, ' ');
    }
  };

  const renderStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    switch (s) {
      case 'CONFIRMED':
      case 'ACTIVE':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-bold tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>CONFIRMED</span>
          </div>
        );
      case 'PENDING':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[11px] font-bold tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>PENDING REVIEW</span>
          </div>
        );
      case 'COMPLETED':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[11px] font-bold tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <CheckCircle2 className="w-3 h-3 text-cyan-400" />
            <span>COMPLETED</span>
          </div>
        );
      case 'CANCELLED':
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-[11px] font-bold tracking-wider">
            <XCircle className="w-3 h-3 text-red-400" />
            <span>CANCELLED</span>
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-500/10 border border-slate-500/30 text-slate-300 font-mono text-[11px] font-bold tracking-wider">
            <span>{s}</span>
          </div>
        );
    }
  };

  const currentBooking = bookings.length > 0 ? bookings[0] : null;
  const previousBookings = bookings.length > 1 ? bookings.slice(1) : [];

  return (
    <section className={`w-full ${inClerkModal ? 'p-2 sm:p-4' : 'py-6 sm:py-8'}`}>
      {/* Section Header */}
      {showHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 mb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-core-red shadow-glow-red" />
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-core-red font-bold">
                MEMBER PASSPORT
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
              My Membership
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-sans mt-0.5">
              Review your active pass, booked tiers, and VIP concierge reservation statuses.
            </p>
          </div>

          {/* Sync Button & Timestamp */}
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="hidden md:inline-block text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <button
              onClick={() => fetchBookings(true)}
              disabled={isRefreshing || isLoading}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-core-red/40 hover:bg-white/[0.08] text-slate-300 hover:text-white font-mono text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
              title="Sync latest status from database"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-core-red ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync Status'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-4 animate-pulse">
          <div className="h-64 rounded-2xl bg-white/[0.03] border border-white/5 p-6 space-y-4">
            <div className="h-6 w-48 bg-white/10 rounded-lg" />
            <div className="h-10 w-72 bg-white/10 rounded-lg" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="h-16 bg-white/5 rounded-xl" />
              <div className="h-16 bg-white/5 rounded-xl" />
              <div className="h-16 bg-white/5 rounded-xl" />
              <div className="h-16 bg-white/5 rounded-xl" />
            </div>
          </div>
        </div>
      )}

      {/* Error Alert with Retry button */}
      {!isLoading && error && (
        <div className="p-5 rounded-2xl bg-core-red/10 border border-core-red/30 text-red-200 flex items-start gap-3.5 mb-6 shadow-[0_10px_30px_rgba(255,42,42,0.1)]">
          <AlertCircle className="w-5 h-5 text-core-red flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-xs space-y-1">
            <p className="font-heading font-bold text-white uppercase tracking-wide text-sm">
              Unable to load membership
            </p>
            <p className="text-slate-300">{error}</p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => fetchBookings(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-core-red text-white font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-glow-red cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Connection</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State: No Bookings */}
      {!isLoading && !error && bookings.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-[#0A0D14]/90 border border-white/10 p-8 sm:p-12 text-center shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
        >
          {/* Subtle Ambient Red Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-core-red/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-core-red/10 border border-core-red/30 flex items-center justify-center mx-auto mb-5 shadow-glow-red">
            <Dumbbell className="w-8 h-8 sm:w-10 sm:h-10 text-core-red" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-slate-400 font-mono text-[10px] uppercase tracking-[0.2em] font-semibold mb-3">
            No Active Allocation
          </span>

          <h3 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight mb-2">
            No membership booked yet.
          </h3>

          <p className="text-sm text-slate-400 max-w-md mx-auto mb-8 font-sans leading-relaxed">
            You haven't booked a membership plan yet. Select a performance tier to access our luxury athletic lab, Olympic lifting platforms, and biometric recovery suites.
          </p>

          <Link
            href="/plans#pricing-matrix"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-red-gradient text-white font-heading font-bold text-xs uppercase tracking-widest shadow-glow-red hover:brightness-110 active:scale-[0.98] transition-all group"
          >
            <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
            <span>Explore Plans</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      )}

      {/* Active & Historical Bookings Display */}
      {!isLoading && !error && bookings.length > 0 && (
        <div className="space-y-6">
          {/* PRIMARY / LATEST BOOKING CARD */}
          {currentBooking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#11151E] to-[#0A0D14] border border-core-red/40 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(255,42,42,0.12)] p-6 sm:p-8"
            >
              {/* Luxury Accent Glows */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-core-red/15 rounded-full blur-3xl pointer-events-none -z-10" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-core-crimson/10 rounded-full blur-3xl pointer-events-none -z-10" />

              {/* Card Top Pill Badge: CURRENT / LATEST */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-core-red text-white font-mono text-[10px] font-extrabold uppercase tracking-widest shadow-glow-red">
                    {bookings.length > 1 ? 'CURRENT / LATEST' : 'ACTIVE ALLOCATION'}
                  </span>
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    {formatBookingType(currentBooking.bookingType)}
                  </span>
                </div>
                <div>{renderStatusBadge(currentBooking.status)}</div>
              </div>

              {/* Hero Plan Header */}
              <div className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-core-red uppercase tracking-[0.2em] font-bold block">
                    TIER RESERVATION
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
                    {currentBooking.planName}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Official booking under <span className="text-slate-200 font-semibold">{currentBooking.customerName}</span>
                  </p>
                </div>

                <div className="flex flex-col md:items-end">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    Investment
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
                      {currentBooking.planPrice}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {currentBooking.planPeriod}
                    </span>
                  </div>
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-4 border-t border-white/10">
                {/* Booking ID */}
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between group">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <Tag className="w-3 h-3 text-core-red" />
                    Booking ID
                  </span>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <span className="font-mono text-xs font-bold text-white tracking-wider truncate" title={currentBooking._id}>
                      #{currentBooking._id.slice(-8).toUpperCase()}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyId(currentBooking._id)}
                      className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Copy full Booking ID"
                    >
                      {copiedId === currentBooking._id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  {copiedId === currentBooking._id && (
                    <span className="text-[9px] font-mono text-emerald-400 mt-1">Copied to clipboard</span>
                  )}
                </div>

                {/* Preferred Date */}
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <Calendar className="w-3 h-3 text-core-red" />
                    Preferred Start
                  </span>
                  <span className="font-mono text-xs font-bold text-white mt-1">
                    {formatDisplayDate(currentBooking.preferredDate)}
                  </span>
                </div>

                {/* Booking Date */}
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <Clock className="w-3 h-3 text-core-red" />
                    Booked On
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-300 mt-1 truncate" title={formatDisplayDateTime(currentBooking.createdAt)}>
                    {formatDisplayDate(currentBooking.createdAt)}
                  </span>
                </div>

                {/* Contact On File */}
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <Mail className="w-3 h-3 text-core-red" />
                    Registered Contact
                  </span>
                  <span className="font-mono text-xs font-medium text-slate-300 truncate mt-1" title={currentBooking.email}>
                    {currentBooking.email}
                  </span>
                </div>
              </div>

              {/* VIP Concierge Notice Banner */}
              <div className="mt-5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-core-red flex-shrink-0" />
                  <span className="font-sans">
                    Present your <strong>Booking ID</strong> at the Core X concierge desk on 740 Grand Ave upon arrival.
                  </span>
                </div>
                <Link
                  href="/contact"
                  className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-core-red hover:text-white uppercase tracking-wider font-bold transition-colors flex-shrink-0"
                >
                  <span>Concierge Help</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          )}

          {/* PREVIOUS BOOKINGS HISTORY LIST (if multiple bookings exist) */}
          {previousBookings.length > 0 && (
            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Clock3 className="w-4 h-4 text-slate-400" />
                  <h4 className="text-sm font-heading font-bold text-white uppercase tracking-wider">
                    Booking History ({previousBookings.length})
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                  Archived Records
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {previousBookings.map((b, idx) => (
                  <div
                    key={b._id || idx}
                    className="p-4 sm:p-5 rounded-2xl bg-[#0B0E14] border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-heading font-bold text-white uppercase tracking-wide">
                          {b.planName}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          ({b.planPrice} {b.planPeriod})
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-mono">
                        <span>ID: #{b._id.slice(-8).toUpperCase()}</span>
                        <span>•</span>
                        <span>Booked: {formatDisplayDate(b.createdAt)}</span>
                        <span>•</span>
                        <span>Preferred: {formatDisplayDate(b.preferredDate)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <div>{renderStatusBadge(b.status)}</div>
                      <button
                        type="button"
                        onClick={() => handleCopyId(b._id)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-mono text-[10px] transition-colors flex items-center gap-1 cursor-pointer"
                        title="Copy ID"
                      >
                        {copiedId === b._id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy ID</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Action Bar to Explore Other Plans */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <p className="text-xs text-slate-400 font-sans">
              Looking to upgrade or add recovery suite sessions?
            </p>
            <Link
              href="/plans#pricing-matrix"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-core-red hover:text-white font-bold uppercase tracking-wider transition-colors"
            >
              <span>Explore All Membership Tiers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
