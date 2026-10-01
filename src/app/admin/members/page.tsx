'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
  CheckCircle2,
  XCircle,
  Download,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  RefreshCw,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import * as XLSX from 'xlsx';

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
  status: 'ACTIVE_MEMBER' | 'PROSPECTIVE_LEAD' | 'INQUIRY_CONTACT' | 'REGISTERED_USER';
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
  const [sourceFilter, setSourceFilter] = useState<'ALL' | 'CLERK' | 'BOOKING' | 'CONTACT' | 'NEWSLETTER' | 'OPTED_IN' | 'OPTED_OUT'>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchMembers = useCallback(async () => {
    try {
      setError('');
      const res = await fetch('/api/admin/users', { credentials: 'same-origin' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to retrieve member profiles from database.');
      }
      setMembers(data.users || []);
      setTotal(data.total || (data.users || []).length);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err: any) {
      console.error('Fetch members error:', err);
      setError(err.message || 'Database connection notice.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Reset to page 1 whenever filters or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sourceFilter, pageSize]);

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      // 1. Source filter
      if (sourceFilter === 'CLERK' && !m.sources.some((s) => s.toLowerCase().includes('clerk'))) return false;
      if (sourceFilter === 'BOOKING' && m.totalBookings === 0 && !m.sources.some((s) => s.toLowerCase().includes('booking'))) return false;
      if (sourceFilter === 'CONTACT' && !m.sources.some((s) => s.toLowerCase().includes('contact'))) return false;
      if (sourceFilter === 'NEWSLETTER' && !m.sources.some((s) => s.toLowerCase().includes('newsletter'))) return false;
      if (sourceFilter === 'OPTED_IN' && (!m.marketingOptIn || Boolean(m.marketingOptOutAt))) return false;
      if (sourceFilter === 'OPTED_OUT' && (m.marketingOptIn && !m.marketingOptOutAt)) return false;

      // 2. Search query
      if (!search.trim()) return true;
      const q = search.toLowerCase().trim();
      return (
        m.fullName.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q) ||
        m.latestPlan.toLowerCase().includes(q) ||
        m.sources.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [members, search, sourceFilter]);

  // Paginated slice
  const totalFiltered = filteredMembers.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const paginatedMembers = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    return filteredMembers.slice(startIdx, startIdx + pageSize);
  }, [filteredMembers, currentPage, pageSize]);

  // Copy email helper
  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // Export audience CSV/Excel
  const handleExportCSV = () => {
    const exportData = filteredMembers.map((m) => ({
      'Full Name': m.fullName,
      'Email Address': m.email,
      'Phone Number': m.phone || 'N/A',
      'Origin Sources': m.sources.join(', '),
      'Latest Plan / Topic': m.latestPlan,
      'Account Status': m.status,
      'Marketing Opt-In': m.marketingOptIn && !m.marketingOptOutAt ? 'YES (Opted-In)' : 'NO (Opted-Out)',
      'Total Bookings': m.totalBookings,
      'Total Inquiries': m.inquiryCount,
      'First Registered': m.firstSeen ? new Date(m.firstSeen).toLocaleDateString() : 'N/A',
      'Last Interaction': m.lastActive ? new Date(m.lastActive).toLocaleDateString() : 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Core_X_Audience');
    XLSX.writeFile(workbook, `CoreX_Connected_Audience_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <AdminLayoutWrapper
      title="Members & Connected Audience"
      subtitle="Unified directory aggregating Clerk accounts, athlete reservations, contact inquiries, and newsletter subscribers."
      onRefresh={() => {
        setIsRefreshing(true);
        fetchMembers();
      }}
      isRefreshing={isRefreshing}
    >
      <div className="space-y-6 animate-fade-in">
        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between gap-3 text-rose-400 text-sm font-mono">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchMembers}
              className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg text-xs transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Query
            </button>
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
            <p className="text-[11px] text-slate-500 font-sans">Across all application channels</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0D1117] border border-white/5 space-y-1">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
              CLERK REGISTERED
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-display font-black text-sky-400">{stats.clerkUsers}</span>
              <span className="text-[10px] font-mono text-sky-400/80">AUTH ACCOUNTS</span>
            </div>
            <p className="text-[11px] text-slate-500 font-sans">Verified Clerk authentication</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0D1117] border border-white/5 space-y-1">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
              BOOKING CLIENTS
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-display font-black text-core-red">{stats.bookingsCount}</span>
              <span className="text-[10px] font-mono text-core-red/80">ALLOCATIONS</span>
            </div>
            <p className="text-[11px] text-slate-500 font-sans">Active reservation holders</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0D1117] border border-white/5 space-y-1">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
              MARKETING OPTED-IN
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-display font-black text-emerald-400">{stats.optedInCount}</span>
              <span className="text-[10px] font-mono text-emerald-400/80">REACHABLE</span>
            </div>
            <p className="text-[11px] text-slate-500 font-sans">Valid marketing consent</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#0D1117] border border-white/5 p-4 rounded-2xl flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by athlete name, email, phone, plan..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-core-red focus:ring-1 focus:ring-core-red transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
            {/* Quick Segment Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
              {[
                { id: 'ALL', label: 'All Contacts' },
                { id: 'CLERK', label: 'Clerk Auth' },
                { id: 'BOOKING', label: 'Bookings' },
                { id: 'CONTACT', label: 'Inquiries' },
                { id: 'NEWSLETTER', label: 'Newsletter' },
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

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              disabled={filteredMembers.length === 0}
              className="px-3 py-1.5 rounded-lg text-[11px] font-mono uppercase tracking-wider bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 flex items-center gap-1.5 transition-all disabled:opacity-40"
              title="Export filtered audience to Excel / CSV"
            >
              <Download className="w-3.5 h-3.5 text-core-red" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-core-red" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                {isLoading
                  ? 'Querying Audience Sources...'
                  : `Showing ${paginatedMembers.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-${Math.min(
                      currentPage * pageSize,
                      totalFiltered
                    )} of ${totalFiltered} Connected Contacts (${total} total in database)`}
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Clerk + MongoDB Multi-Source Aggregation
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
                  {search
                    ? `No contacts matched "${search}".`
                    : 'Athletes will automatically appear here as they register plans, submit inquiries, or sign in.'}
                </p>
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 rounded-lg transition-colors inline-block"
                  >
                    Clear Search Filter
                  </button>
                )}
              </div>
            ) : (
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-[11px] font-mono text-slate-400 uppercase bg-white/[0.02] border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4">Athlete / Contact</th>
                    <th className="px-6 py-4">Source Origin</th>
                    <th className="px-6 py-4">Plan / Interest</th>
                    <th className="px-6 py-4">Marketing Consent</th>
                    <th className="px-6 py-4">Activity Summary</th>
                    <th className="px-6 py-4">Registered & Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Athlete Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-core-red/15 border border-core-red/30 flex items-center justify-center text-core-red font-bold text-xs shrink-0">
                            {m.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-white text-sm">{m.fullName}</p>
                              {m.status === 'ACTIVE_MEMBER' && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-core-red/20 text-core-red border border-core-red/40 uppercase">
                                  Member
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mt-0.5">
                              <span>{m.email}</span>
                              <button
                                onClick={() => handleCopyEmail(m.email)}
                                className="text-slate-500 hover:text-white transition-colors"
                                title="Copy email address"
                              >
                                {copiedEmail === m.email ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                            {m.phone && m.phone !== 'N/A' && (
                              <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                                <Phone className="w-2.5 h-2.5" />
                                {m.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Source Badges */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                          {m.sources.map((s, idx) => (
                            <span
                              key={idx}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                                s.toLowerCase().includes('clerk')
                                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                                  : s.toLowerCase().includes('booking')
                                  ? 'bg-core-red/10 text-core-red border border-core-red/30'
                                  : s.toLowerCase().includes('contact')
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
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
                        {m.marketingOptIn && !m.marketingOptOutAt ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            OPTED-IN
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-slate-500/10 text-slate-400 border border-slate-500/20">
                            <XCircle className="w-3 h-3 text-slate-500" />
                            OPTED-OUT
                          </span>
                        )}
                      </td>

                      {/* Activity Count */}
                      <td className="px-6 py-4 text-xs font-mono text-slate-300">
                        {m.totalBookings > 0 && (
                          <span className="text-white font-bold block">
                            {m.totalBookings} reservation{m.totalBookings > 1 ? 's' : ''}
                          </span>
                        )}
                        {m.inquiryCount > 0 && (
                          <span className="text-slate-400 block">
                            {m.inquiryCount} inquiry{m.inquiryCount > 1 ? 's' : ''}
                          </span>
                        )}
                        {m.totalBookings === 0 && m.inquiryCount === 0 && (
                          <span className="text-slate-500 block">
                            {m.sources.includes('Clerk Registered') ? 'Clerk Auth User' : 'Subscriber'}
                          </span>
                        )}
                      </td>

                      {/* Registered & Last Active */}
                      <td className="px-6 py-4 text-xs font-mono">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>Active: {m.lastActive ? new Date(m.lastActive).toLocaleDateString() : 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                            <Calendar className="w-3 h-3 text-slate-600" />
                            <span>Joined: {m.firstSeen ? new Date(m.firstSeen).toLocaleDateString() : 'N/A'}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination Controls */}
          {totalFiltered > 0 && (
            <div className="p-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-400">Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs font-mono text-white focus:outline-none focus:border-core-red"
                >
                  <option value={10} className="bg-[#0D1117] text-white">10</option>
                  <option value={25} className="bg-[#0D1117] text-white">25</option>
                  <option value={50} className="bg-[#0D1117] text-white">50</option>
                  <option value={100} className="bg-[#0D1117] text-white">100</option>
                </select>
                <span className="text-xs font-mono text-slate-500">
                  Page {currentPage} of {totalPages}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .map((p, idx, arr) => (
                    <React.Fragment key={p}>
                      {idx > 0 && arr[idx - 1] !== p - 1 && (
                        <span className="text-slate-600 px-1 font-mono text-xs">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(p)}
                        className={`w-8 h-8 rounded-lg text-xs font-mono transition-all ${
                          currentPage === p
                            ? 'bg-core-red text-white font-bold'
                            : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
