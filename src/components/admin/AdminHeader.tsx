'use client';

import React from 'react';
import { Database, ShieldCheck, RefreshCw } from 'lucide-react';

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function AdminHeader({ title, subtitle, onRefresh, isRefreshing }: AdminHeaderProps) {
  return (
    <header className="h-20 bg-[#0A0D14]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 lg:px-10 z-10 shrink-0">
      <div>
        {title && (
          <h1 className="text-xl font-display font-black text-white uppercase tracking-tight">
            {title}
          </h1>
        )}
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-core-red ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync DB'}</span>
          </button>
        )}

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <Database className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">MONGODB LIVE</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>
    </header>
  );
}
