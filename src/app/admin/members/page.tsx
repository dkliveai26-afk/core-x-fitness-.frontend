'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { AdminLayoutWrapper } from '@/components/admin/AdminLayoutWrapper';
import {
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  Activity,
  AlertCircle,
  Dumbbell,
  UserCheck,
  ShieldCheck,
  Sparkles,
  Filter,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface MemberItem {
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
  status: string;
  clerkUserId?: string;
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    clerkUsers: 0,
    bookingsCount: 0,
    optedInCount: 0,
    unsubscribedCount: 0,
  });
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'ALL' | 'CLERK' | 'BOOKING' | 'CONTACT' | 'OPTED_IN'>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchMembers = useCallback(async () => {
    try {
      setError('');
      const res = await fetch('/api/admin/users', { credentials: 'same-origin' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to retrieve member profiles.');
      }
      setMembers(data.users || []);
      setTotal(data.total || (data.users || []).length);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Database connection notice.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const filteredMembers = members.filter((m) => {
    // 1. Source filter
    if (sourceFilter === 'CLERK' && !m.sources.some((s) => s.toLowerCase().includes('clerk'))) return false;
    if (sourceFilter === 'BOOKING' && m.totalBookings === 0 && !m.sources.some((s) => s.toLowerCase().includes('booking'))) return false;
    if (sourceFilter === 'CONTACT' && !m.sources.some((s) => s.toLowerCase().includes('contact'))) return false;
    if (sourceFilter === 'OPTED_IN' && !m.marketingOptIn) return false;

    // 2. Search query
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      m.fullName.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.phone.toLowerCase().includes(q) ||
      m.latestPlan.toLowerCase().includes(q) ||
      m.sources.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <AdminLayoutWrapper
      title="Members & Athletic Audience"
      subtitle="Unified customer directory aggregating Clerk accounts, athlete reservations, and marketing consent."
      onRefresh={() => {
        setIsRefreshing(true);
        fetchMembers();
      }}
      isRefreshing={isRefreshing}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-400 text-sm font-mono">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Audience Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#0D1117] border border-white/5 space-y-1">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
              TOTAL AUDIENCE
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-display font-black text-white">{total}</span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">CONNECTED</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0D1117] border border-white/5 space-y-1">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
              CLERK REGISTERED
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-display font-black text-sky-400">{stats.clerkUsers}</span>
              <span className="text-[10px] font-mono text-sky-400/80">AUTH USERS</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0D1117] border border-white/5 space-y-1">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
              BOOKING CLIENTS
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-display font-black text-core-red">{stats.bookingsCount}</span>
              <span className="text-[10px] font-mono text-core-red/80">ALLOCATIONS</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0D1117] border border-white/5 space-y-1">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
              MARKETING OPTED-IN
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-display font-black text-emerald-400">{stats.optedInCount}</span>
              <span className="text-[10px] font-mono text-emerald-400/80">ELIGIBLE FOR CAMPAIGNS</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#0D1117] border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone, plan..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-core-red focus:ring-1 focus:ring-core-red transition-all"
            />
          </div>

          {/* Quick Segment Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {[
              { id: 'ALL', label: 'All Contacts' },
              { id: 'CLERK', label: 'Clerk Auth' },
              { id: 'BOOKING', label: 'Bookings' },
              { id: 'CONTACT', label: 'Inquiries' },
              { id: 'OPTED_IN', label: 'Opted-In' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSourceFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
                  sourceFilter === tab.id
                    ? 'bg-core-red text-white font-bold shadow-glow-red'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-core-red" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                {isLoading ? 'Querying Audience Sources...' : `Showing ${filteredMembers.length} of ${total} Contacts`}
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-500 hidden sm:block">
              Clerk + MongoDB Unified Directory
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-16 text-center space-y-3">
                <div className="w-8 h-8 rounded-full border-2 border-core-red/30 border-t-core-red animate-spin mx-auto" />
                <p className="text-xs font-mono text-slate-500">Aggregating profiles across Clerk & MongoDB...</p>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="p-16 text-center space-y-3">
                <Users className="w-10 h-10 text-slate-700 mx-auto" />
                <h3 className="text-base font-bold text-slate-300 uppercase font-heading">No Contacts Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-sans">
                  {search ? 'No contacts matched your search query.' : 'Athletes will automatically appear here as they register plans or sign in.'}
                </p>
              </div>
            ) : (
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-[11px] font-mono text-slate-400 uppercase bg-white/[0.02] border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4">Athlete / Contact</th>
                    <th className="px-6 py-4">Source Origin</th>
                    <th className="px-6 py-4">Plan / Interest</th>
                    <th className="px-6 py-4">Marketing Consent</th>
                    <th className="px-6 py-4">Activity</th>
                    <th className="px-6 py-4">Last Seen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Athlete Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-core-red/15 border border-core-red/30 flex items-center justify-center text-core-red font-bold text-xs shrink-0">
                            {m.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-white text-sm">{m.fullName}</p>
                            <p className="text-xs text-slate-400 font-mono">{m.email}</p>
                            {m.phone && m.phone !== 'N/A' && (
                              <p className="text-[11px] text-slate-500 font-mono">{m.phone}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Source Badges */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                          {m.sources.map((s, idx) => (
                            <span
                              key={idx}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                                s.toLowerCase().includes('clerk')
                                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                                  : s.toLowerCase().includes('booking')
                                  ? 'bg-core-red/10 text-core-red border border-core-red/30'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Plan / Interest */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Dumbbell className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-xs text-slate-200 font-medium">{m.latestPlan}</span>
                        </div>
                      </td>

                      {/* Marketing Consent */}
                      <td className="px-6 py-4">
                        {m.marketingOptIn ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            OPTED-IN
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-slate-500/10 text-slate-500 border border-slate-500/20">
                            <XCircle className="w-3 h-3" />
                            OPTED-OUT
                          </span>
                        )}
                      </td>

                      {/* Activity Count */}
                      <td className="px-6 py-4 text-xs font-mono text-slate-300">
                        {m.totalBookings > 0 && (
                          <span className="text-white font-bold block">{m.totalBookings} reservation{m.totalBookings > 1 ? 's' : ''}</span>
                        )}
                        {m.inquiryCount > 0 && (
                          <span className="text-slate-400 block">{m.inquiryCount} inquiry{m.inquiryCount > 1 ? 's' : ''}</span>
                        )}
                        {m.totalBookings === 0 && m.inquiryCount === 0 && (
                          <span className="text-slate-500 block">Registered User</span>
                        )}
                      </td>

                      {/* Last Seen */}
                      <td className="px-6 py-4 text-xs font-mono text-slate-400">
                        {m.lastActive ? new Date(m.lastActive).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}

