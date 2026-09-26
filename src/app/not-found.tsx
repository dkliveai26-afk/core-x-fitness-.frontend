import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, ArrowLeft, ShieldAlert, Dumbbell, CalendarCheck2, Mail, LayoutDashboard } from 'lucide-react';

export const metadata = {
  title: '404: Unknown Route | CORE X FITNESS',
  description: 'The requested route does not exist in the Core X Performance matrix.',
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#06080B] text-white flex flex-col items-center justify-center p-6 selection:bg-core-red selection:text-white relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-core-red/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg p-8 sm:p-10 rounded-3xl bg-[#0C0F15]/90 backdrop-blur-2xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_40px_rgba(255,42,42,0.15)] text-center space-y-6">
        {/* Brand Emblem */}
        <div className="flex justify-center">
          <Image
            src="/gymlogo1.png"
            alt="CORE X FITNESS"
            width={200}
            height={60}
            className="w-44 h-auto object-contain"
            priority
          />
        </div>

        {/* 404 Visual Indicator */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-core-red/10 border border-core-red/30 text-[11px] font-mono tracking-[0.25em] text-core-red uppercase font-bold">
            <ShieldAlert className="w-3.5 h-3.5" />
            ERROR 404 // ROUTE NOT FOUND
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-white">
            THRESHOLD UNKNOWN
          </h1>
          <p className="text-xs font-sans text-slate-400 leading-relaxed max-w-sm mx-auto">
            The path you requested does not exist in the CORE X facility grid. Use the verified coordinates below to resume your session.
          </p>
        </div>

        {/* Quick Route Recovery Grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-2 text-left text-xs font-mono">
          <Link
            href="/"
            className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-core-red/40 transition-all flex items-center gap-2.5 text-slate-300 hover:text-white"
          >
            <Home className="w-4 h-4 text-core-red shrink-0" />
            <span className="truncate">Home Ground</span>
          </Link>

          <Link
            href="/about"
            className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-core-red/40 transition-all flex items-center gap-2.5 text-slate-300 hover:text-white"
          >
            <Dumbbell className="w-4 h-4 text-core-red shrink-0" />
            <span className="truncate">About Club</span>
          </Link>

          <Link
            href="/plans"
            className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-core-red/40 transition-all flex items-center gap-2.5 text-slate-300 hover:text-white"
          >
            <CalendarCheck2 className="w-4 h-4 text-core-red shrink-0" />
            <span className="truncate">Membership Plans</span>
          </Link>

          <Link
            href="/contact"
            className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-core-red/40 transition-all flex items-center gap-2.5 text-slate-300 hover:text-white"
          >
            <Mail className="w-4 h-4 text-core-red shrink-0" />
            <span className="truncate">Concierge Desk</span>
          </Link>
        </div>

        {/* Admin Portal Quick Link */}
        <div className="pt-2 border-t border-white/5">
          <Link
            href="/admin/dashboard"
            className="w-full py-3 rounded-xl bg-core-red/10 border border-core-red/30 hover:bg-core-red/20 text-core-red font-heading font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-glow-red"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Open Core X Admin Portal</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
