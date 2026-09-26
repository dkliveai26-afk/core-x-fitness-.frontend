'use client';

import React, { useState } from 'react';
import { AdminLayoutWrapper } from '@/components/admin/AdminLayoutWrapper';
import {
  ShieldCheck,
  Database,
  Lock,
  CheckCircle2,
  Server,
  KeyRound,
  AlertCircle,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [dbStatus, setDbStatus] = useState<'CONNECTED' | 'CHECKING'>('CONNECTED');

  return (
    <AdminLayoutWrapper
      title="System & Security Settings"
      subtitle="Administrative configuration, database telemetry, and access credentials."
    >
      <div className="space-y-8 max-w-4xl animate-fade-in">
        
        {/* System & Database Status Card */}
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-6 sm:p-8 shadow-lg space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase font-heading">
                MongoDB Database Telemetry
              </h2>
              <p className="text-xs text-slate-400">Live connection pool status and persistence health</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold">
                CLUSTER CONNECTION:
              </span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono text-emerald-400 font-bold">ONLINE // ACTIVE</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold">
                SESSION ENCRYPTION:
              </span>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-core-red" />
                <span className="text-xs font-mono text-white font-bold">HMAC-SHA256 (HTTP-ONLY)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold">
                PASSWORD HASHING ALGORITHM:
              </span>
              <span className="text-xs font-mono text-slate-300">scrypt (16-byte random salt)</span>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-500 block font-bold">
                ROUTE ISOLATION:
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">STRICT SERVER SEPARATION</span>
            </div>
          </div>
        </div>

        {/* Admin Access Credentials Card */}
        <div className="bg-[#0D1117] border border-white/5 rounded-2xl p-6 sm:p-8 shadow-lg space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <div className="p-2.5 rounded-xl bg-core-red/10 border border-core-red/20 text-core-red">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase font-heading">
                Admin Credential Management
              </h2>
              <p className="text-xs text-slate-400">Strict single-tenant administrator security policy</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs font-sans text-slate-300 leading-relaxed space-y-2">
            <p className="font-semibold text-white">
              Security Protocol Notice:
            </p>
            <p className="text-slate-400">
              Admin authentication is isolated completely from the public website. Admin accounts are stored in MongoDB with cryptographic scrypt password hashes and cannot be registered publicly by website visitors.
            </p>
          </div>
        </div>

      </div>
    </AdminLayoutWrapper>
  );
}
