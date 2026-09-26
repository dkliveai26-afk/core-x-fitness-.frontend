import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, FileText } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | CORE X FITNESS Luxury Athletic Club',
  description: 'Biometric and athlete data privacy policy for CORE X FITNESS Club & Performance Labs.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-core-void text-slate-100 pt-36 pb-24 px-4 sm:px-6 lg:px-8 selection:bg-core-red selection:text-white">
      <div className="max-w-4xl mx-auto space-y-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-core-red" />
          <span>Return to Club</span>
        </Link>

        <div className="space-y-4 border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-core-red/10 border border-core-red/30 text-xs font-mono tracking-widest text-core-red uppercase font-bold">
            <Shield className="w-3.5 h-3.5" />
            ATHLETE DATA GOVERNANCE
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white">
            PRIVACY PROTOCOL & DATA SECURITY
          </h1>
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            EFFECTIVE: 2026 // CORE X FITNESS FLAGSHIP LABS
          </p>
        </div>

        <div className="space-y-10 text-sm font-sans leading-relaxed text-slate-300">
          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-white uppercase flex items-center gap-2">
              <Lock className="w-4 h-4 text-core-red" />
              1. Biometric & Performance Data
            </h2>
            <p>
              CORE X FITNESS utilizes advanced biometric assessment suites, heart-rate telemetry, and DEXA body composition scanning. All physical and biometric datasets are encrypted in transit and at rest using AES-256 protocols. Your physiological readings are accessible exclusively to your assigned Master Coaches and certified sports physiologists.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-white uppercase flex items-center gap-2">
              <Eye className="w-4 h-4 text-core-red" />
              2. Identity & Admission Records
            </h2>
            <p>
              When requesting facility admissions, memberships, or concierge bookings, we collect verified identification (name, telephone, email address). This information is utilized solely to allocate gym floor slots, confirm recovery chamber access, and dispatch security access credentials.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-white uppercase flex items-center gap-2">
              <FileText className="w-4 h-4 text-core-red" />
              3. Zero Third-Party Monetization
            </h2>
            <p>
              CORE X FITNESS adheres to an unyielding standard of discretion. We do not sell, license, or monetize member profile data, contact details, or performance analytics to third-party commercial entities or marketing syndicates.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
