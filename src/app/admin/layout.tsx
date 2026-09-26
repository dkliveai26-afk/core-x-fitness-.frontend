import React from 'react';

export const metadata = {
  title: 'Core X Fitness | Internal Management Portal',
  description: 'Enterprise internal management system for CORE X FITNESS.',
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = 'force-dynamic';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050607] text-slate-100 font-sans selection:bg-[#FF2A2A] selection:text-white">
      {children}
    </div>
  );
}
