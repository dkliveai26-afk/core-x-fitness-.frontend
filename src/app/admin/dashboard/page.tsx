'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { AdminLayoutWrapper } from '@/components/admin/AdminLayoutWrapper';
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  MessageSquare,
  Users,
  Activity,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

interface OverviewData {
  stats: {
    totalBookings: number;
    pendingBookings: number;
    activeBookings: number;
    completedBookings: number;
    totalInquiries: number;
    newInquiries: number;
  };
  recentContacts: Array<{
    _id: string;
    name: string;
    email: string;
    phone: string;
    topic: string;
    message: string;
    status: string;
    createdAt: string;
  }>;
  recentBookings: Array<{
    _id: string;
    customerName: string;
    email: string;
    phone: string;
    planName: string;
    planPrice: string;
    status: string;
    createdAt: string;
  }>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchOverview = useCallback(async () => {
    try {
      setError('');
      const res = await fetch('/api/admin/overview');
      if (!res.ok) throw new Error('Failed to load dashboard metrics from MongoDB.');
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Database connection error.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchOverview();
  };

  const stats = data?.stats;

  return (
    <AdminLayoutWrapper
      title="Dashboard Overview"
      subtitle="Live athletic operations, real-time database state, and admissions telemetry."
      onRefresh={handleRefresh}
      isRefreshing={isRefreshing}
    >
      <div className="space-y-8 animate-fade-in">
        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-400 text-sm font-mono">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Real MongoDB Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Bookings */}
          <div className="bg-[#0D1117] border border-white/5 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-core-red">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 font-bold">
                MONGODB
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white font-heading">
                {isLoading ? '...' : `${stats?.totalBookings ?? 0}`}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">Total Reservations</p>
            </div>
          </div>

          {/* Pending Bookings */}
          <div className="bg-[#0D1117] border border-white/5 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-amber-500/80 font-bold">
                ACTION REQ
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white font-heading">
                {isLoading ? '...' : `${stats?.pendingBookings ?? 0}`}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">Pending Confirmation</p>
            </div>
          </div>

          {/* Confirmed / Active Bookings */}
          <div className="bg-[#0D1117] border border-white/5 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-500/80 font-bold">
                CONFIRMED
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white font-heading">
                {isLoading ? '...' : `${stats?.activeBookings ?? 0}`}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">Active Athlete Plans</p>
            </div>
          </div>

          {/* Contact Messages */}
          <div className="bg-[#0D1117] border border-white/5 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-blue-400 font-bold">
                {stats?.newInquiries ? `${stats.newInquiries} NEW` : 'SYNCED'}
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white font-heading">
                {isLoading ? '...' : `${stats?.totalInquiries ?? 0}`}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">Contact Inquiries</p>
            </div>
          </div>
        </div>

        {/* Real Data Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Reservations */}
          <div className="bg-[#0D1117] border border-white/5 rounded-2xl flex flex-col shadow-lg overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-wider font-heading">
                  Recent Bookings
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Live submissions from public membership forms</p>
              </div>
              <Link
                href="/admin/bookings"
                className="text-xs font-mono font-bold text-core-red hover:text-white transition-colors flex items-center gap-1 uppercase tracking-wider"
              >
                <span>View All</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-2 flex-1">
              {isLoading ? (
                <div className="p-8 text-center text-xs font-mono text-slate-500">
                  Loading real bookings from MongoDB...
                </div>
              ) : !data?.recentBookings || data.recentBookings.length === 0 ? (
                <div className="p-12 text-center space-y-2">
                  <CalendarCheck className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-sm font-semibold text-slate-400">0 bookings recorded</p>
                  <p className="text-xs text-slate-600 font-mono">New reservations from the website will appear here automatically.</p>
                </div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="text-[11px] font-mono text-slate-500 uppercase bg-white/[0.02]">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg">Customer</th>
                      <th className="px-4 py-3">Plan</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentBookings.map((b) => (
                      <tr key={b._id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-slate-200 text-xs">{b.customerName}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{b.email || b.phone || 'No contact'}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-xs text-slate-300 font-medium">{b.planName}</span>
                          <span className="text-[10px] text-slate-500 block font-mono">{b.planPrice}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                            b.status?.toUpperCase() === 'CONFIRMED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : b.status?.toUpperCase() === 'COMPLETED'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : b.status?.toUpperCase() === 'CANCELLED'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {b.status || 'PENDING'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Recent Contact Inquiries */}
          <div className="bg-[#0D1117] border border-white/5 rounded-2xl flex flex-col shadow-lg overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-white uppercase tracking-wider font-heading">
                  Contact Inquiries
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Live dispatches from the public contact page</p>
              </div>
              <Link
                href="/admin/contacts"
                className="text-xs font-mono font-bold text-core-red hover:text-white transition-colors flex items-center gap-1 uppercase tracking-wider"
              >
                <span>View All</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-2 flex-1">
              {isLoading ? (
                <div className="p-8 text-center text-xs font-mono text-slate-500">
                  Loading inquiries from MongoDB...
                </div>
              ) : !data?.recentContacts || data.recentContacts.length === 0 ? (
                <div className="p-12 text-center space-y-2">
                  <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-sm font-semibold text-slate-400">0 contact messages</p>
                  <p className="text-xs text-slate-600 font-mono">Inquiries submitted on the contact page will appear here.</p>
                </div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="text-[11px] font-mono text-slate-500 uppercase bg-white/[0.02]">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg">Sender</th>
                      <th className="px-4 py-3">Topic</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentContacts.map((c) => (
                      <tr key={c._id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-slate-200 text-xs">{c.name}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{c.email || c.phone}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-xs text-slate-300 font-medium truncate block max-w-[180px]">
                            {c.topic || 'General Inquiry'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                            c.status?.toUpperCase() === 'READ' || c.status?.toUpperCase() === 'RESOLVED'
                              ? 'bg-slate-500/10 text-slate-400 border border-white/10'
                              : 'bg-core-red/10 text-core-red border border-core-red/30'
                          }`}>
                            {c.status || 'NEW'}
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
      </div>
    </AdminLayoutWrapper>
  );
}
