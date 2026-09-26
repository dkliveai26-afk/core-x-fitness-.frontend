'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { AdminLayoutWrapper } from '@/components/admin/AdminLayoutWrapper';
import {
  Search,
  MessageSquare,
  Mail,
  Phone,
  User,
  Trash2,
  CheckCircle,
  Eye,
  X,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';

interface ContactItem {
  _id: string;
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactItem | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    try {
      setError('');
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      params.append('limit', '50');

      const res = await fetch(`/api/admin/contacts?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to retrieve contact inquiries from MongoDB.');
      const data = await res.json();
      setContacts(data.contacts || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Database query error.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleToggleStatus = async (item: ContactItem) => {
    const nextStatus = item.status === 'READ' || item.status === 'RESOLVED' ? 'NEW' : 'READ';
    try {
      setUpdatingId(item._id);
      const res = await fetch(`/api/admin/contacts/${item._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status in MongoDB.');

      setContacts((prev) =>
        prev.map((c) => (c._id === item._id ? { ...c, status: nextStatus } : c))
      );
      if (selectedMessage?._id === item._id) {
        setSelectedMessage((prev) => prev ? { ...prev, status: nextStatus } : null);
      }
    } catch (err: any) {
      alert(err.message || 'Update failed.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this message from MongoDB?')) return;
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to remove message from MongoDB.');

      setContacts((prev) => prev.filter((c) => c._id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      if (selectedMessage?._id === id) {
        setSelectedMessage(null);
      }
    } catch (err: any) {
      alert(err.message || 'Delete operation failed.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);
      const res = await fetch('/api/admin/contacts/export');

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
      a.download = `corex_contacts_export_${timestamp}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to download contacts Excel file. Please check database connection.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AdminLayoutWrapper
      title="Contact Messages & Dispatches"
      subtitle="Direct database management for athletic admissions and facility inquiries."
      onRefresh={() => {
        setIsRefreshing(true);
        fetchContacts();
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
              placeholder="Search sender, email, topic, text..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-core-red focus:ring-1 focus:ring-core-red transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
            {/* Status Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {['ALL', 'NEW', 'READ', 'RESOLVED'].map((st) => (
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

            {/* Export Contacts Excel Button */}
            <button
              onClick={handleExportExcel}
              disabled={isExporting || total === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(16,185,129,0.1)]"
              title="Download real contact messages from MongoDB as Excel .xlsx"
            >
              <FileSpreadsheet className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
              <span>{isExporting ? 'Exporting...' : 'Export Excel (.xlsx)'}</span>
            </button>
          </div>
        </div>

        {/* Contacts Table Container */}
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-core-red" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                {isLoading ? 'Querying MongoDB...' : `${total} Total Messages in Database`}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-16 text-center space-y-3">
                <div className="w-8 h-8 rounded-full border-2 border-core-red/30 border-t-core-red animate-spin mx-auto" />
                <p className="text-xs font-mono text-slate-500">Loading messages from MongoDB...</p>
              </div>
            ) : contacts.length === 0 ? (
              <div className="p-16 text-center space-y-3">
                <MessageSquare className="w-10 h-10 text-slate-700 mx-auto" />
                <h3 className="text-base font-bold text-slate-300 uppercase font-heading">0 contact messages</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-sans">
                  No contact messages match your criteria. Real dispatches submitted via the public contact form will appear here.
                </p>
              </div>
            ) : (
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-[11px] font-mono text-slate-400 uppercase bg-white/[0.02] border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4">Sender</th>
                    <th className="px-6 py-4">Topic / Service</th>
                    <th className="px-6 py-4">Message Preview</th>
                    <th className="px-6 py-4">Timestamp</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {contacts.map((c) => (
                    <tr
                      key={c._id}
                      className={`hover:bg-white/[0.02] transition-colors ${
                        c.status?.toUpperCase() === 'NEW' ? 'bg-core-red/[0.02]' : ''
                      }`}
                    >
                      {/* Sender Info */}
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-white text-sm flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-500" />
                            {c.name}
                          </p>
                          <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-slate-600" />
                            {c.email}
                          </p>
                          {c.phone && (
                            <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
                              <Phone className="w-3 h-3 text-slate-600" />
                              {c.phone}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Topic */}
                      <td className="px-6 py-4">
                        <span className="text-xs text-slate-200 font-medium">{c.topic}</span>
                      </td>

                      {/* Message Preview */}
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-xs text-slate-400 truncate font-sans">
                          {c.message}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-xs font-mono text-slate-400">
                        {c.createdAt ? new Date(c.createdAt).toLocaleString() : 'N/A'}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(c)}
                          disabled={updatingId === c._id}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border transition-all ${
                            c.status?.toUpperCase() === 'NEW'
                              ? 'bg-core-red/10 text-core-red border-core-red/30 hover:bg-core-red/20'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                          }`}
                        >
                          {c.status || 'NEW'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedMessage(c)}
                          className="p-2 rounded-lg bg-white/[0.02] border border-white/5 hover:border-core-red/40 text-slate-300 hover:text-white transition-colors"
                          title="Read Full Message"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          disabled={updatingId === c._id}
                          className="p-2 rounded-lg bg-white/[0.02] border border-white/5 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-colors disabled:opacity-50"
                          title="Delete Message"
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

        {/* Message Detail Modal */}
        {selectedMessage && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-[#0D1117] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_40px_rgba(255,42,42,0.15)] space-y-6 relative">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-core-red" />
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-widest font-bold">
                    INQUIRY DETAILS
                  </span>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs font-sans">
                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 font-mono">
                  <div>
                    <span className="text-slate-500 block uppercase text-[10px]">Applicant Name:</span>
                    <span className="text-white font-bold">{selectedMessage.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase text-[10px]">Topic:</span>
                    <span className="text-core-red font-bold">{selectedMessage.topic}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase text-[10px]">Email:</span>
                    <span className="text-slate-200">{selectedMessage.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase text-[10px]">Phone:</span>
                    <span className="text-slate-200">{selectedMessage.phone || 'N/A'}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider block font-bold">
                    Message Content:
                  </span>
                  <div className="p-4 rounded-xl bg-[#080A0E] border border-white/5 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans max-h-60 overflow-y-auto">
                    {selectedMessage.message}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => handleToggleStatus(selectedMessage)}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-core-red/40 text-xs font-mono font-bold uppercase tracking-wider text-slate-200 transition-colors"
                  >
                    {selectedMessage.status === 'READ' ? 'Mark as UNREAD' : 'Mark as READ'}
                  </button>

                  <button
                    onClick={() => handleDelete(selectedMessage._id)}
                    className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-xs font-mono font-bold uppercase tracking-wider text-rose-400 transition-colors"
                  >
                    Delete Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayoutWrapper>
  );
}
