'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { AdminLayoutWrapper } from '@/components/admin/AdminLayoutWrapper';
import {
  Search,
  Trash2,
  AlertCircle,
  CalendarCheck,
  User,
  Phone,
  Mail,
  Download,
  FileSpreadsheet,
} from 'lucide-react';

interface BookingItem {
  _id: string;
  customerName: string;
  email: string;
  phone: string;
  planName: string;
  planPrice: string;
  bookingType: string;
  preferredDate: string;
  status: string;
  notes?: Array<{ id: string; text: string; author: string; createdAt: string }>;
  createdAt: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setError('');
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      params.append('limit', '50');

      const res = await fetch(`/api/admin/bookings?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to retrieve bookings from MongoDB.');
      const data = await res.json();
      setBookings(data.bookings || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with database.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status in MongoDB.');

      // Update local state instantly after successful DB write
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
      );
    } catch (err: any) {
      alert(err.message || 'Database update failed.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this reservation from MongoDB?')) return;
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to remove booking from database.');

      setBookings((prev) => prev.filter((b) => b._id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
    } catch (err: any) {
      alert(err.message || 'Delete operation failed.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      const res = await fetch('/api/admin/bookings/export');
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.error || 'No data available to export.');
        return;
      }

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      const timestamp = new Date().toISOString().split('T')[0];
      a.download = `corex_bookings_export_${timestamp}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to download Excel file. Please check database connection.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AdminLayoutWrapper
      title="Bookings & Allocations"
      subtitle="Direct database management for athlete membership and service reservations."
      onRefresh={() => {
        setIsRefreshing(true);
        fetchBookings();
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

        {/* Filter & Action Controls Bar */}
        <div className="bg-[#0D1117] border border-white/5 p-4 rounded-2xl flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone, plan..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-core-red focus:ring-1 focus:ring-core-red transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
            {/* Status Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all ${
                    statusFilter === st
                      ? 'bg-core-red text-white shadow-glow-red'
                      : 'bg-white/[0.02] text-slate-400 hover:text-white hover:bg-white/5 border border-white/5'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Export to Excel Button */}
            <button
              onClick={handleExportExcel}
              disabled={isExporting || total === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(16,185,129,0.1)]"
              title="Download real bookings from MongoDB as Excel .xlsx"
            >
              <FileSpreadsheet className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
              <span>{isExporting ? 'Exporting...' : 'Export Excel (.xlsx)'}</span>
            </button>
          </div>
        </div>

        {/* Bookings Table Container */}
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-core-red" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                {isLoading ? 'Querying MongoDB...' : `${total} Total Bookings in Database`}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-16 text-center space-y-3">
                <div className="w-8 h-8 rounded-full border-2 border-core-red/30 border-t-core-red animate-spin mx-auto" />
                <p className="text-xs font-mono text-slate-500">Querying live MongoDB records...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="p-16 text-center space-y-3">
                <CalendarCheck className="w-10 h-10 text-slate-700 mx-auto" />
                <h3 className="text-base font-bold text-slate-300 uppercase font-heading">No bookings yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-sans">
                  No reservations match the current database filter. When athletes book plans on the website, they will appear here in real time.
                </p>
              </div>
            ) : (
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-[11px] font-mono text-slate-400 uppercase bg-white/[0.02] border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4">Athlete / Applicant</th>
                    <th className="px-6 py-4">Plan / Service</th>
                    <th className="px-6 py-4">Submission Date</th>
                    <th className="px-6 py-4">Database Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Customer Info */}
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-white text-sm flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-500" />
                            {b.customerName}
                          </p>
                          <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-slate-600" />
                            {b.email}
                          </p>
                          {b.phone && (
                            <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
                              <Phone className="w-3 h-3 text-slate-600" />
                              {b.phone}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Plan / Service */}
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-slate-200 text-xs">{b.planName}</p>
                          <p className="text-[11px] font-mono text-core-red font-bold">{b.planPrice}</p>
                          <span className="text-[10px] text-slate-500 font-mono uppercase block">{b.bookingType}</span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-xs font-mono text-slate-400">
                        {b.createdAt ? new Date(b.createdAt).toLocaleString() : 'N/A'}
                      </td>

                      {/* Status Dropdown */}
                      <td className="px-6 py-4">
                        <select
                          value={b.status?.toUpperCase() || 'PENDING'}
                          disabled={updatingId === b._id}
                          onChange={(e) => handleStatusChange(b._id, e.target.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase tracking-wider border bg-[#0A0D14] focus:outline-none focus:ring-1 cursor-pointer transition-all ${
                            b.status?.toUpperCase() === 'CONFIRMED'
                              ? 'border-emerald-500/40 text-emerald-400 focus:ring-emerald-500'
                              : b.status?.toUpperCase() === 'COMPLETED'
                              ? 'border-blue-500/40 text-blue-400 focus:ring-blue-500'
                              : b.status?.toUpperCase() === 'CANCELLED'
                              ? 'border-rose-500/40 text-rose-400 focus:ring-rose-500'
                              : 'border-amber-500/40 text-amber-400 focus:ring-amber-500'
                          }`}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(b._id)}
                          disabled={updatingId === b._id}
                          className="p-2 rounded-lg bg-white/[0.02] border border-white/5 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-colors disabled:opacity-50"
                          title="Delete from MongoDB"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
