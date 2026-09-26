import React from 'react';
import { Search, Filter, MoreHorizontal, Eye, CheckCircle, Clock } from 'lucide-react';

const bookings = [
  { id: '1', customer: 'Vikram Singh', phone: '+91 9876543210', service: 'Cryotherapy Session', date: 'Oct 15, 2026', time: '02:00 PM', status: 'Confirmed' },
  { id: '2', customer: 'Neha Gupta', phone: '+91 8765432109', service: 'Personal Training', date: 'Oct 15, 2026', time: '04:30 PM', status: 'Pending' },
  { id: '3', customer: 'Rohan Desai', phone: '+91 7654321098', service: 'Recovery Lounge', date: 'Oct 16, 2026', time: '09:00 AM', status: 'Confirmed' },
  { id: '4', customer: 'Ayesha Khan', phone: '+91 6543210987', service: 'Diet Consultation', date: 'Oct 16, 2026', time: '11:15 AM', status: 'Completed' },
  { id: '5', customer: 'Arjun Mehta', phone: '+91 5432109876', service: 'Body Composition Analysis', date: 'Oct 17, 2026', time: '10:00 AM', status: 'Cancelled' },
];

export default function AdminBookingsPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-white uppercase tracking-tight">Bookings</h1>
          <p className="text-sm text-slate-400 mt-1">Manage facility and trainer reservations.</p>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search bookings..." 
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
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Plan / Service</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((item) => (
                <tr key={item.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-200">{item.customer}</p>
                    <p className="text-xs text-slate-500">{item.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-300 font-medium">{item.service}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {item.date}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {item.time}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                      item.status === 'Confirmed' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                      item.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                      'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-white transition-colors" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-emerald-500 hover:text-emerald-400 transition-colors" title="Confirm Booking">
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
          <span>Showing 1 to 5 of 42 entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-white/5 rounded hover:bg-white/5 transition-colors">Prev</button>
            <button className="px-3 py-1 border border-white/5 rounded bg-white/5 text-white transition-colors">1</button>
            <button className="px-3 py-1 border border-white/5 rounded hover:bg-white/5 transition-colors">2</button>
            <button className="px-3 py-1 border border-white/5 rounded hover:bg-white/5 transition-colors">3</button>
            <button className="px-3 py-1 border border-white/5 rounded hover:bg-white/5 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
