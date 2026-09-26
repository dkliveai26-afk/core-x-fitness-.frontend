'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock, Mail, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid email or password.');
      }

      // Success! Navigate directly to Admin Dashboard
      router.push('/admin/dashboard');
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please check credentials.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050607] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-core-red selection:text-white relative overflow-hidden">
      {/* Background Red Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-core-red/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Split Login Container */}
      <div className="w-full max-w-5xl h-auto min-h-[580px] lg:h-[680px] bg-[#0A0D14] border border-white/5 rounded-3xl overflow-hidden flex flex-col lg:flex-row shadow-[0_40px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(255,42,42,0.06)] relative z-10">
        
        {/* LEFT SIDE: Admin Login Form */}
        <div className="w-full lg:w-[55%] p-8 sm:p-12 lg:p-14 flex flex-col justify-center relative bg-gradient-to-b from-[#0A0D14] to-[#050607]">
          
          {/* Header Cluster */}
          <div className="w-full max-w-md mx-auto mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-mono font-bold uppercase tracking-widest mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Website</span>
            </Link>

            <Image
              src="/gymlogo1.png"
              alt="CORE X FITNESS"
              width={160}
              height={48}
              className="w-32 sm:w-36 h-auto object-contain mb-5"
              priority
            />

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-core-red/10 border border-core-red/20 text-core-red text-[10px] font-mono uppercase tracking-[0.2em] font-bold">
                <ShieldCheck className="w-3 h-3" />
                Admin Access
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
                Welcome Back
              </h1>
              <p className="text-slate-400 text-xs font-sans">
                Enter your administrative credentials to access the internal operating system.
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-4">
            {/* Error Notification */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-rose-400 text-xs font-mono">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-slate-400 text-[11px] font-bold uppercase tracking-wider font-mono block">
                ADMIN EMAIL
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@corexfitness.com"
                  className="w-full bg-[#0D1117]/90 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-core-red focus:ring-1 focus:ring-core-red/50 transition-all shadow-inner placeholder-slate-600"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-slate-400 text-[11px] font-bold uppercase tracking-wider font-mono block">
                  PASSWORD
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0D1117]/90 border border-white/10 text-white rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-core-red focus:ring-1 focus:ring-core-red/50 transition-all shadow-inner placeholder-slate-600 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-red-gradient text-white font-heading font-bold uppercase tracking-widest text-xs border border-core-red/50 hover:bg-core-red transition-all shadow-glow-red mt-2 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Sign In to Admin</span>
              )}
            </button>

            {/* Security Notice */}
            <div className="pt-2 text-center">
              <span className="text-[10px] font-mono text-slate-600 tracking-widest uppercase">
                ENCRYPTED ADMIN PROTOCOL // ZERO SOCIAL AUTH
              </span>
            </div>
          </form>
        </div>

        {/* RIGHT SIDE: Visual Panel */}
        <div className="w-full lg:w-[45%] h-64 lg:h-auto relative hidden sm:block overflow-hidden">
          <div className="absolute inset-0 bg-core-red/10 mix-blend-overlay z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-transparent to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0A0D14]/90 z-10" />

          <Image
            src="/admin_auth_side_visual.jpg"
            alt="Core X Fitness Athletic Visual"
            fill
            className="object-cover object-center scale-105 hover:scale-110 transition-transform duration-[10s] ease-out"
            priority
          />

          <div className="absolute bottom-8 right-8 z-20 text-right">
            <span className="text-[10px] font-mono text-white/50 tracking-[0.3em] uppercase block mb-1">
              Core X Kolkata
            </span>
            <span className="text-xs font-heading text-white/80 tracking-widest font-bold uppercase">
              Performance Lab
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
