import React from 'react';
import { Search, Filter, MoreHorizontal, Eye, CheckCircle, XCircle } from 'lucide-react';

const inquiries = [
  { id: '1', name: 'Rahul Sharma', email: 'rahul.s@example.com', phone: '+91 9876543210', inquiry: 'Looking for personal training for weight loss.', date: 'Oct 15, 2026', status: 'Pending' },
  { id: '2', name: 'Priya Patel', email: 'priya.p@example.com', phone: '+91 8765432109', inquiry: 'Interested in the Cryotherapy session pricing.', date: 'Oct 14, 2026', status: 'Contacted' },
  { id: '3', name: 'Amit Kumar', email: 'amit.k@example.com', phone: '+91 7654321098', inquiry: 'Do you offer annual corporate memberships?', date: 'Oct 12, 2026', status: 'Resolved' },
  { id: '4', name: 'Sneha Reddy', email: 'sneha.r@example.com', phone: '+91 6543210987', inquiry: 'Need a customized diet plan.', date: 'Oct 10, 2026', status: 'Pending' },
  { id: '5', name: 'Vikram Singh', email: 'vikram.s@example.com', phone: '+91 5432109876', inquiry: 'What are the timings for the recovery lounge?', date: 'Oct 09, 2026', status: 'Resolved' },
];

export default function AdminInquiriesPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-white uppercase tracking-tight">Inquiries</h1>
          <p className="text-sm text-slate-400 mt-1">Manage contact form submissions and leads.</p>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search inquiries..." 
              className="w-full sm:w-64 bg-[#0D1117] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-core-red/50 focus:ring-1 focus:ring-core-red/50 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 bg-[#0D1117] border border-white/10 hover:bg-white/5 text-slate-300 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0D1117] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-slate-500 uppercase bg-white/[0.02] border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Inquiry</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((item) => (
                <tr key={item.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-200">{item.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-300">{item.email}</p>
                    <p className="text-xs text-slate-500">{item.phone}</p>
                  </td>
                  <td className="px-6 py-4 max-w-[200px] truncate text-slate-400">
                    {item.inquiry}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {item.date}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                      item.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                      'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-white transition-colors" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-emerald-500 hover:text-emerald-400 transition-colors" title="Mark Resolved">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
          <span>Showing 1 to 5 of 24 entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-white/5 rounded hover:bg-white/5 transition-colors">Prev</button>
            <button className="px-3 py-1 border border-white/5 rounded bg-white/5 text-white transition-colors">1</button>
            <button className="px-3 py-1 border border-white/5 rounded hover:bg-white/5 transition-colors">2</button>
            <button className="px-3 py-1 border border-white/5 rounded hover:bg-white/5 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
