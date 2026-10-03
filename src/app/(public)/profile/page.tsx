'use client';

import React from 'react';
import Link from 'next/link';
import { useUser, SignedIn, SignedOut, useClerk } from '@clerk/nextjs';
import { useAuthModal } from '@/context/AuthModalContext';
import { MyMembershipSection } from '@/components/profile/MyMembershipSection';
import {
  User,
  ShieldCheck,
  Calendar,
  Settings,
  ArrowUpRight,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  Dumbbell,
  Utensils,
  ChevronRight,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { openModal } = useAuthModal();
  const { openUserProfile } = useClerk();

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : 'Active Athlete';

  return (
    <div className="min-h-screen bg-core-void text-slate-100 pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-core-red/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-8">
        {/* Signed Out State */}
        <SignedOut>
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-[#0A0D14]/90 border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.9)] max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-core-red/10 border border-core-red/30 flex items-center justify-center mb-5 shadow-glow-red">
              <ShieldCheck className="w-8 h-8 text-core-red" />
            </div>
            <span className="text-[11px] font-mono text-core-red uppercase tracking-[0.25em] font-bold mb-2 block">
              AUTHENTICATION REQUIRED
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight mb-3">
              Athlete Member Portal
            </h1>
            <p className="text-sm text-slate-400 font-sans leading-relaxed mb-6">
              Please sign in with your athlete credentials to view your active memberships, concierge bookings, and club passport.
            </p>
            <button
              onClick={() => openModal('signIn')}
              className="px-8 py-3.5 rounded-xl bg-red-gradient text-white font-heading font-bold text-xs uppercase tracking-widest shadow-glow-red hover:brightness-110 active:scale-95 transition-all"
            >
              Sign In to Access Portal
            </button>
          </div>
        </SignedOut>

        {/* Signed In State */}
        <SignedIn>
          {/* Athlete Profile Passport Hero Header */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#111520] to-[#0A0D14] border border-white/10 p-6 sm:p-8 lg:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
            <div className="absolute top-0 right-0 w-80 h-80 bg-core-red/10 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* User Avatar & Identity Details */}
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ring-2 ring-core-red/80 shadow-glow-red overflow-hidden flex items-center justify-center bg-core-dark">
                    {user?.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt={user.fullName || 'Athlete Profile'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-display font-black text-white">
                        {user?.firstName ? user.firstName[0] : 'CX'}
                      </span>
                    )}
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-[#0A0D14]" title="Active Account" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-core-red/10 border border-core-red/25 text-core-red text-[10px] font-mono uppercase tracking-widest font-bold">
                      VERIFIED ATHLETE
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      ID: {user?.id ? user.id.slice(-8) : 'ACTIVE'}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white uppercase tracking-tight truncate max-w-md">
                    {user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Athlete Member'}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 font-mono flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-core-red flex-shrink-0" />
                    <span>{user?.primaryEmailAddress?.emailAddress || 'No email attached'}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons & Passport Badge */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => openUserProfile()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-white/25 hover:bg-white/[0.08] text-slate-300 hover:text-white font-mono text-xs font-semibold uppercase tracking-wider transition-all"
                >
                  <Settings className="w-4 h-4 text-core-red" />
                  <span>Account Settings</span>
                </button>

                <Link
                  href="/plans#pricing-matrix"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-gradient text-white font-heading font-bold text-xs uppercase tracking-widest shadow-glow-red hover:brightness-110 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Explore Plans</span>
                </Link>
              </div>
            </div>

            {/* Quick Passport Summary Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-0.5">
                  Member Since
                </span>
                <span className="text-xs font-mono font-bold text-white">
                  {memberSince}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-0.5">
                  Facility Access
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  24/7 Keycard
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-0.5">
                  Home Facility
                </span>
                <span className="text-xs font-mono font-bold text-white truncate block">
                  Uttarpara Facility
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-0.5">
                  Concierge Status
                </span>
                <span className="text-xs font-mono font-bold text-core-red">
                  VIP Priority
                </span>
              </div>
            </div>
          </div>

          {/* Core Feature: My Membership Section */}
          <div className="rounded-3xl bg-[#080B10]/80 border border-white/10 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            <MyMembershipSection showHeader={true} />
          </div>

          {/* Quick Hub Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Diet & Nutrition */}
            <Link
              href="/diet"
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-core-red/40 hover:bg-white/[0.04] transition-all group flex items-start justify-between"
            >
              <div className="space-y-1">
                <div className="w-9 h-9 rounded-xl bg-core-red/10 border border-core-red/20 flex items-center justify-center mb-2">
                  <Utensils className="w-4 h-4 text-core-red" />
                </div>
                <h4 className="text-sm font-heading font-bold text-white uppercase tracking-wider">
                  Nutritional Protocols
                </h4>
                <p className="text-xs text-slate-400 font-sans">
                  Custom meal timing and macronutrient splits for training days.
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-core-red group-hover:translate-x-1 transition-all" />
            </Link>

            {/* Facility & Equipment */}
            <Link
              href="/about"
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-core-red/40 hover:bg-white/[0.04] transition-all group flex items-start justify-between"
            >
              <div className="space-y-1">
                <div className="w-9 h-9 rounded-xl bg-core-red/10 border border-core-red/20 flex items-center justify-center mb-2">
                  <Dumbbell className="w-4 h-4 text-core-red" />
                </div>
                <h4 className="text-sm font-heading font-bold text-white uppercase tracking-wider">
                  Facility & Equipment
                </h4>
                <p className="text-xs text-slate-400 font-sans">
                  Eleiko Olympic racks, cryotherapy chambers, and recovery suites.
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-core-red group-hover:translate-x-1 transition-all" />
            </Link>

            {/* VIP Concierge Desk */}
            <Link
              href="/contact"
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-core-red/40 hover:bg-white/[0.04] transition-all group flex items-start justify-between"
            >
              <div className="space-y-1">
                <div className="w-9 h-9 rounded-xl bg-core-red/10 border border-core-red/20 flex items-center justify-center mb-2">
                  <Phone className="w-4 h-4 text-core-red" />
                </div>
                <h4 className="text-sm font-heading font-bold text-white uppercase tracking-wider">
                  Direct Concierge
                </h4>
                <p className="text-xs text-slate-400 font-sans">
                  Reach out for private trainer allocation or recovery bookings.
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-core-red group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </SignedIn>
      </div>
    </div>
  );
}
