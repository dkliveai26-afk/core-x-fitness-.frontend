'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarCheck,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

interface AdminSidebarProps {
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
}

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Bookings', href: '/admin/bookings', icon: CalendarCheck },
  { name: 'Contact Messages', href: '/admin/contacts', icon: MessageSquare },
  { name: 'Members & Leads', href: '/admin/members', icon: Users },
  { name: 'System Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className="w-64 bg-[#0A0D14] border-r border-white/5 flex flex-col h-screen shrink-0">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-white/5 gap-3">
        <Link href="/admin/dashboard" className="block">
          <Image
            src="/gymlogo1.png"
            alt="CORE X FITNESS"
            width={140}
            height={40}
            className="w-32 h-auto object-contain"
          />
        </Link>
        <span className="px-2 py-0.5 rounded bg-core-red/10 border border-core-red/30 text-[9px] font-mono font-bold text-core-red uppercase tracking-widest">
          ADMIN
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-core-red/10 text-white border border-core-red/30 font-semibold shadow-[0_0_20px_rgba(255,42,42,0.15)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <item.icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-core-red' : 'text-slate-500 group-hover:text-white'
                }`}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Admin Profile & Logout Section */}
      <div className="p-4 border-t border-white/5 space-y-3">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="w-9 h-9 rounded-full bg-core-red/20 border border-core-red/30 flex items-center justify-center text-core-red font-bold text-xs shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.name || 'Administrator'}</p>
            <p className="text-[10px] text-slate-400 font-mono truncate">{user?.email || 'admin@corexfitness.com'}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-rose-400 hover:text-white hover:bg-rose-500/10 border border-rose-500/20 transition-all disabled:opacity-50"
        >
          <LogOut className="w-4 h-4" />
          <span>{isLoggingOut ? 'Signing Out...' : 'Log Out'}</span>
        </button>
      </div>
    </aside>
  );
}
