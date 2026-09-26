import React from 'react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-white uppercase tracking-tight">Settings</h1>
          <p className="text-sm text-slate-400 mt-1">Configure global application preferences.</p>
        </div>
      </div>

      <div className="bg-[#0D1117] border border-white/5 p-8 rounded-2xl flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-slate-400 font-mono text-sm uppercase tracking-widest mb-2">Module Offline</p>
          <h2 className="text-white font-display text-xl">Settings configuration is pending integration.</h2>
        </div>
      </div>
    </div>
  );
}
