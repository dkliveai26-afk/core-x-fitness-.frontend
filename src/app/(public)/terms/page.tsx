import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Dumbbell, Award, Scale } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | CORE X FITNESS Luxury Athletic Club',
  description: 'Terms of service and facility admission rules for CORE X FITNESS Club & Performance Labs.',
};

export default function TermsPage() {
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
            <Scale className="w-3.5 h-3.5" />
            TERMS OF MEMBERSHIP & ADMISSION
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white">
            TERMS OF SERVICE // CLUB GOVERNANCE
          </h1>
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            STANDARD OPERATING PROCEDURES // METROPOLIS & KOLKATA LABS
          </p>
        </div>

        <div className="space-y-10 text-sm font-sans leading-relaxed text-slate-300">
          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-white uppercase flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-core-red" />
              1. Facility Etiquette & Safety Protocol
            </h2>
            <p>
              Athletes must respect the training floor, Olympic lifting platforms, and calibrated Eleiko plates. Re-racking weight plates is mandatory. Closed-toe athletic footwear and appropriate training apparel are required across all discipline zones.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-white uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-core-red" />
              2. Membership Allocation & Capacity Rules
            </h2>
            <p>
              To maintain our premier 1:4 athlete-to-floor density, membership allocations are strictly individual and non-transferable. Tier upgrades and allocations are granted upon review by the VIP Admissions Committee.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-bold text-lg text-white uppercase flex items-center gap-2">
              <Award className="w-4 h-4 text-core-red" />
              3. Recovery Suite & Coaching Sessions
            </h2>
            <p>
              Reservations for Cryotherapy, Infrared Sauna, and Master Coaching sessions require a minimum of 6 hours advance notice for cancellations to ensure equitable availability for all active members.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
