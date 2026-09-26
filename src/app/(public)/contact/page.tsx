import React from 'react';
import type { Metadata } from 'next';
import { ContactHeroBanner } from '@/components/contact/ContactHeroBanner';
import { ContactQuickCards } from '@/components/contact/ContactQuickCards';
import { ContactMainSection } from '@/components/contact/ContactMainSection';
import { ContactKineticBands } from '@/components/contact/ContactKineticBands';

export const metadata: Metadata = {
  title: 'Contact | CORE X FITNESS',
  description:
    'Connect with the CORE X FITNESS admissions board, schedule a private walkthrough of our 18,500 sq ft athletic sanctuary in Kolkata, or book biometric assessment sessions.',
  openGraph: {
    title: 'Contact // CORE X FITNESS Concierge & Admissions',
    description:
      'Direct admissions access, facility inquiries, and concierge bookings for CORE X FITNESS Kolkata.',
  },
};

export default function ContactPage() {
  return (
    <main className="w-full flex flex-col bg-core-void min-h-screen overflow-x-hidden">
      {/* 1. Cinematic Contact Hero Banner with Large Bodybuilder 1 */}
      <ContactHeroBanner />

      {/* 2. 3 Clean Contact Info Cards (Address, Contact Info, Hours) */}
      <ContactQuickCards />

      {/* 3. Main Contact Experience (Compact Form + Large Bodybuilder 2) */}
      <ContactMainSection />

      {/* 4. Continuous Moving Typography Strip directly above Footer */}
      <ContactKineticBands />
    </main>
  );
}
