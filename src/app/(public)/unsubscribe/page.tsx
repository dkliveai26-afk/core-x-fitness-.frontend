'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, AlertCircle, ArrowLeft, Mail, ShieldCheck } from 'lucide-react';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [unsubscribedEmail, setUnsubscribedEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isResubscribing, setIsResubscribing] = useState(false);
  const [resubscribed, setResubscribed] = useState(false);

  useEffect(() => {
    if (!token) {
      setErrorMsg('No unsubscribe token provided.');
      setIsLoading(false);
      return;
    }

    async function processUnsubscribe() {
      try {
        const res = await fetch(`/api/unsubscribe?token=${encodeURIComponent(token || '')}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setIsSuccess(true);
          setUnsubscribedEmail(data.email || '');
        } else {
          setErrorMsg(data.error || 'Failed to process unsubscribe request.');
        }
      } catch (err: any) {
        setErrorMsg('Network error processing request.');
      } finally {
        setIsLoading(false);
      }
    }

    processUnsubscribe();
  }, [token]);

  const handleResubscribe = async () => {
    if (!unsubscribedEmail) return;
    setIsResubscribing(true);
    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: unsubscribedEmail,
          resubscribe: true,
        }),
      });
      if (res.ok) {
        setResubscribed(true);
      }
    } catch {}
    setIsResubscribing(false);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full rounded-3xl bg-[#0D1117] border border-white/10 p-8 sm:p-10 shadow-2xl text-center space-y-6 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-core-red/10 blur-3xl pointer-events-none" />

        {isLoading ? (
          <div className="space-y-4 py-8">
            <div className="w-10 h-10 border-2 border-core-red/30 border-t-core-red rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
              Updating your email preferences...
            </p>
          </div>
        ) : isSuccess ? (
          <div className="space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-400 font-bold block">
                PREFERENCES UPDATED
              </span>
              <h1 className="text-2xl font-display font-bold text-white uppercase">
                {resubscribed ? 'YOU ARE OPTED IN' : 'YOU HAVE BEEN UNSUBSCRIBED'}
              </h1>
              <p className="text-xs font-sans text-slate-400 leading-relaxed">
                {resubscribed ? (
                  <span>
                    Your preference has been updated. You will receive future CORE X promotional announcements and athlete guides at <strong className="text-white">{unsubscribedEmail}</strong>.
                  </span>
                ) : (
                  <span>
                    <strong className="text-white">{unsubscribedEmail || 'Your email'}</strong> will no longer receive promotional campaigns or offer announcements from Core X Fitness.
                  </span>
                )}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] font-mono text-slate-400 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Transactional booking confirmations are unaffected.</span>
            </div>

            {!resubscribed ? (
              <div className="pt-2 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleResubscribe}
                  disabled={isResubscribing}
                  className="text-xs font-mono text-slate-400 hover:text-white underline transition-colors"
                >
                  {isResubscribing ? 'Updating...' : 'Opted out by mistake? Click to re-subscribe.'}
                </button>

                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white font-mono text-xs uppercase tracking-wider transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Homepage</span>
                </Link>
              </div>
            ) : (
              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-core-red hover:bg-[#E61E1E] text-white font-mono text-xs uppercase tracking-wider transition-all"
                >
                  <span>Return to Homepage</span>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            <div className="w-16 h-16 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-rose-400 font-bold block">
                UNSUBSCRIBE ERROR
              </span>
              <h1 className="text-xl font-display font-bold text-white uppercase">
                LINK INVALID OR EXPIRED
              </h1>
              <p className="text-xs font-sans text-slate-400">
                {errorMsg || 'We could not locate this subscription record.'}
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white font-mono text-xs uppercase tracking-wider transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Homepage</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-core-red/30 border-t-core-red rounded-full animate-spin" />
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
