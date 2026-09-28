'use client';

import React from 'react';
import { Database, RefreshCw, Menu } from 'lucide-react';

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onToggleMobileMenu?: () => void;
}

export function AdminHeader({
  title,
  subtitle,
  onRefresh,
  isRefreshing,
  onToggleMobileMenu,
}: AdminHeaderProps) {
  return (
    <header className="h-20 bg-[#0A0D14]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 sm:px-6 lg:px-10 z-10 shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle */}
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle navigation drawer"
          >
            <Menu className="w-5 h-5 text-slate-300" />
          </button>
        )}

        <div>
          {title && (
            <h1 className="text-lg sm:text-xl font-display font-black text-white uppercase tracking-tight">
              {title}
            </h1>
          )}
          {subtitle && <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-core-red ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isRefreshing ? 'Syncing...' : 'Sync DB'}</span>
          </button>
        )}

        <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <Database className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">MONGODB LIVE</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>
    </header>
  );
}
