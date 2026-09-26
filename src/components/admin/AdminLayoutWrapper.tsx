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

  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/auth/me');
        if (!res.ok) {
          router.push('/admin/login');
          return;
        }
        const data = await res.json();
        if (isMounted) {
          if (data.isAuthenticated && data.user) {
            setAdminUser(data.user);
          } else {
            router.push('/admin/login');
          }
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to verify admin auth:', err);
        if (isMounted) {
          router.push('/admin/login');
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
      <div className="min-h-screen bg-[#050607] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 rounded-full border-2 border-core-red/30 border-t-core-red animate-spin" />
        <p className="text-xs font-mono text-slate-500 tracking-widest uppercase">
          INITIALIZING SECURE ADMIN CONSOLE...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050607] text-slate-100 flex font-sans overflow-hidden">
      {/* LEFT SIDEBAR */}
      <AdminSidebar user={adminUser} />

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <AdminHeader
          title={title}
          subtitle={subtitle}
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
        />

        <main className="flex-1 overflow-y-auto p-6 lg:p-10 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
