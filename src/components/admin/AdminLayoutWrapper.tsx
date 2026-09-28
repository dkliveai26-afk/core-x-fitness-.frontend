'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function AdminLayoutWrapper({
  children,
  title,
  subtitle,
  onRefresh,
  isRefreshing,
}: AdminLayoutWrapperProps) {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/auth/me', {
          credentials: 'same-origin',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!res.ok) {
          if (isMounted) {
            window.location.href = '/admin/login';
          }
          return;
        }

        const data = await res.json();
        if (isMounted) {
          if (data.isAuthenticated && data.user) {
            setAdminUser(data.user);
            setIsLoading(false);
          } else {
            window.location.href = '/admin/login';
          }
        }
      } catch (err: any) {
        console.warn('Admin auth verification notice:', err.message);
        if (isMounted) {
          // On genuine network disconnect, stop loading but keep layout safe
          setIsLoading(false);
        }
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050607] flex flex-col items-center justify-center space-y-4 px-4 text-center">
        <div className="w-10 h-10 rounded-full border-2 border-core-red/30 border-t-core-red animate-spin" />
        <p className="text-xs font-mono text-slate-500 tracking-widest uppercase">
          INITIALIZING SECURE ADMIN CONSOLE...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050607] text-slate-100 flex font-sans overflow-hidden">
      {/* SIDEBAR (Desktop Fixed + Mobile Slide Drawer) */}
      <AdminSidebar
        user={adminUser}
        isOpenMobile={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <AdminHeader
          title={title}
          subtitle={subtitle}
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
          onToggleMobileMenu={() => setIsMobileOpen((prev) => !prev)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
