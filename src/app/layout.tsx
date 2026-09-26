import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { siteConfig } from '@/data/site';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Luxury Athletic Club & Performance Lab`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'Core X Fitness',
    'luxury gym',
    'Olympic weightlifting facility',
    'athletic performance lab',
    'biometric recovery',
    'personal training',
    'cryotherapy gym',
    'Eleiko equipment club',
  ],
  authors: [{ name: 'CORE X FITNESS' }],
  creator: 'CORE X FITNESS',
  publisher: 'CORE X FITNESS',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: `${siteConfig.name} | Forged in Discipline. Defined by Strength.`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Core X Fitness Facility',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} | Luxury Athletic Club`,
    description: siteConfig.description,
    images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&auto=format&fit=crop&q=80'],
    creator: '@corexfitness',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      { url: '/favicon.ico' },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#050607',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsClub',
    name: siteConfig.legalName,
    alternateName: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      postalCode: siteConfig.address.zip,
      addressCountry: 'US',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '05:00',
        closes: '23:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '06:00',
        closes: '21:00',
      },
    ],
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Eleiko Olympic Weightlifting Platforms', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Sub-Zero Cryotherapy Suite', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Hyperbaric Oxygen Chamber', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Private Executive Locker Suites', value: true },
    ],
  };

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-core-void text-slate-100 selection:bg-core-red selection:text-white flex flex-col">
        <ClerkProvider
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: '#FF2A2A',
              colorBackground: '#0B0D10',
              colorInputBackground: '#050607',
              colorInputText: '#FFFFFF',
              colorText: '#FFFFFF',
              colorTextSecondary: '#94A3B8',
              borderRadius: '0.75rem',
              colorDanger: '#FF2A2A',
            },
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}