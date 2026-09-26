import React from 'react';
import { Search, Filter, MoreHorizontal, UserX, UserCheck } from 'lucide-react';
import Image from 'next/image';

const users = [
  { id: '1', name: 'Dilkhush Kumar', email: 'dilkhushdeveloper@gmail.com', joined: 'Oct 01, 2026', plan: 'Admin', status: 'Active', avatar: '/gymlogo1.png' }, // Placeholder for real avatar
  { id: '2', name: 'Kabir Singh', email: 'kabir.s@example.com', joined: 'Sep 25, 2026', plan: 'Annual Membership', status: 'Active', avatar: '' },
  { id: '3', name: 'Ananya Verma', email: 'ananya.v@example.com', joined: 'Sep 20, 2026', plan: 'Quarterly Membership', status: 'Active', avatar: '' },
  { id: '4', name: 'Ritesh Deshmukh', email: 'ritesh.d@example.com', joined: 'Aug 15, 2026', plan: 'Monthly Pass', status: 'Expired', avatar: '' },
  { id: '5', name: 'Sanya Malhotra', email: 'sanya.m@example.com', joined: 'Jul 10, 2026', plan: 'Drop-in', status: 'Inactive', avatar: '' },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-white uppercase tracking-tight">Users & Members</h1>
          <p className="text-sm text-slate-400 mt-1">Manage registered accounts and memberships.</p>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search users..." 
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
                <th className="px-6 py-4">Profile</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => (
                <tr key={item.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                        {item.avatar ? (
                          <div className="w-full h-full bg-core-red flex items-center justify-center font-bold text-white text-xs">
                            {item.name.charAt(0)}
                          </div>
                        ) : (
                          <span className="font-bold text-slate-400 text-sm">{item.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-200">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-slate-300 font-medium bg-white/5 px-2.5 py-1 rounded-md text-xs border border-white/5">
                      {item.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {item.joined}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                      item.status === 'Expired' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                      'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-white transition-colors" title="Manage User">
                        <UserCheck className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-rose-500 hover:text-rose-400 transition-colors" title="Revoke Access">
                        <UserX className="w-4 h-4" />
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
          <span>Showing 1 to 5 of 1,284 entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-white/5 rounded hover:bg-white/5 transition-colors">Prev</button>
            <button className="px-3 py-1 border border-white/5 rounded bg-white/5 text-white transition-colors">1</button>
            <button className="px-3 py-1 border border-white/5 rounded hover:bg-white/5 transition-colors">2</button>
            <button className="px-3 py-1 border border-white/5 rounded hover:bg-white/5 transition-colors">...</button>
            <button className="px-3 py-1 border border-white/5 rounded hover:bg-white/5 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
