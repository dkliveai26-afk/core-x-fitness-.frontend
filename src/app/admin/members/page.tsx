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
} from 'lucide-react';

interface MemberItem {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  firstSeen: string;
  lastActive: string;
  totalBookings: number;
  latestPlan: string;
  latestBookingStatus: string;
  inquiryCount: number;
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchMembers = useCallback(async () => {
    try {
      setError('');
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Failed to retrieve member profiles from MongoDB.');
      const data = await res.json();
      setMembers(data.users || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Database error.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const filteredMembers = members.filter((m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      m.fullName.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.phone.toLowerCase().includes(q) ||
      m.latestPlan.toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayoutWrapper
      title="Members & Athletic Leads"
      subtitle="Aggregated customer profiles, engagement history, and membership allocations in MongoDB."
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

        {/* Filter Controls Bar */}
        <div className="bg-[#0D1117] border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search athlete by name, email, plan..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-core-red focus:ring-1 focus:ring-core-red transition-all"
            />
          </div>

          <div className="text-xs font-mono text-slate-400">
            <span>Showing {filteredMembers.length} of {total} registered athletes</span>
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-core-red" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                {isLoading ? 'Querying MongoDB...' : `${total} Total Member Profiles`}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-16 text-center space-y-3">
                <div className="w-8 h-8 rounded-full border-2 border-core-red/30 border-t-core-red animate-spin mx-auto" />
                <p className="text-xs font-mono text-slate-500">Querying database profiles...</p>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="p-16 text-center space-y-3">
                <Users className="w-10 h-10 text-slate-700 mx-auto" />
                <h3 className="text-base font-bold text-slate-300 uppercase font-heading">0 Members Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-sans">
                  Athletes will automatically appear here as they register plans and submit inquiries on the website.
                </p>
              </div>
            ) : (
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-[11px] font-mono text-slate-400 uppercase bg-white/[0.02] border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4">Athlete</th>
                    <th className="px-6 py-4">Current Plan</th>
                    <th className="px-6 py-4">Activity Count</th>
                    <th className="px-6 py-4">Last Active</th>
                    <th className="px-6 py-4">Status</th>
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
                            {m.phone !== 'N/A' && (
                              <p className="text-[11px] text-slate-500 font-mono">{m.phone}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Dumbbell className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-xs text-slate-200 font-medium">{m.latestPlan}</span>
                        </div>
                      </td>

                      {/* Activity */}
                      <td className="px-6 py-4 text-xs font-mono text-slate-300">
                        <span className="text-white font-bold">{m.totalBookings}</span> bookings /{' '}
                        <span className="text-slate-400">{m.inquiryCount} inquiries</span>
                      </td>

                      {/* Last Active */}
                      <td className="px-6 py-4 text-xs font-mono text-slate-400">
                        {m.lastActive ? new Date(m.lastActive).toLocaleDateString() : 'N/A'}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {m.latestBookingStatus}
                        </span>
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
