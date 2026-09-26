import React from 'react';
import { Search, Filter, Plus, Edit2, Trash2 } from 'lucide-react';

const plans = [
  { id: '1', name: 'Annual Membership', price: '₹24,000', duration: '12 Months', members: 450, status: 'Active' },
  { id: '2', name: 'Quarterly Pass', price: '₹7,500', duration: '3 Months', members: 210, status: 'Active' },
  { id: '3', name: 'Monthly Standard', price: '₹3,000', duration: '1 Month', members: 580, status: 'Active' },
  { id: '4', name: 'Personal Training (10 Sessions)', price: '₹15,000', duration: 'Flexible', members: 32, status: 'Active' },
  { id: '5', name: 'Cryotherapy Add-on', price: '₹5,000', duration: 'Per Session', members: 12, status: 'Inactive' },
];

export default function AdminPlansPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-white uppercase tracking-tight">Membership Plans</h1>
          <p className="text-sm text-slate-400 mt-1">Manage pricing, durations, and active plans.</p>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search plans..." 
              className="w-full sm:w-64 bg-[#0D1117] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-core-red/50 focus:ring-1 focus:ring-core-red/50 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 bg-core-red/10 border border-core-red/30 hover:bg-core-red/20 text-core-red px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-colors">
            <Plus className="w-4 h-4" />
            New Plan
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0D1117] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="text-xs text-slate-500 uppercase bg-white/[0.02] border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Plan Name</th>
                <th className="px-6 py-4">Price (₹)</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Members Enrolled</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((item) => (
                <tr key={item.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-200">{item.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-core-red font-bold">{item.price}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {item.duration}
                  </td>
                  <td className="px-6 py-4 text-slate-300 font-medium">
                    {item.members}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                      'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-white transition-colors" title="Edit Plan">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-rose-500 hover:text-rose-400 transition-colors" title="Delete Plan">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
