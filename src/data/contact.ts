export interface ContactChannel {
  id: string;
  iconName: 'phone' | 'mail' | 'map-pin' | 'clock' | 'shield-check' | 'message-square';
  label: string;
  title: string;
  primary: string;
  secondary?: string;
  actionUrl?: string;
  actionLabel?: string;
  badge?: string;
}

export interface QuickServiceItem {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
}

export const contactDetails = {
  headline: "LET'S BUILD WHAT'S NEXT.",
  subheadline: 'DIRECT CONCIERGE ACCESS & ATHLETIC INQUIRIES.',
  description:
    'Whether booking an architectural facility tour, requesting biometric assessment data, or securing membership admission, our executive concierge responds within 2 hours.',
  facility: {
    name: 'CORE X FITNESS',
    address: 'Debaipukur, Bhadrakali',
    area: 'Uttarpara, Hooghly, West Bengal 712232',
    landmark: 'Bireswar Banerjee Street, Above HDFC Bank',
    coordinates: '22.6869° N, 88.3470° E',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=CORE+X+FITNESS,+Bhadrakali,+Uttarpara,+Debaipukur,+West+Bengal+712232',
  },
  channels: {
    phonePrimary: '+91 (033) 2460-CORE',
    phoneSecondary: '+91 98300 12345',
    whatsapp: '+91 98300 54321',
    emailConcierge: 'concierge@corexfitness.com',
    emailAdmissions: 'admissions@corexfitness.com',
  },
  hours: {
    weekdays: '06:00 — 23:00',
    weekends: '06:00 — 23:00',
    biometricAccess: '24/7 Continuous Access for Black Tier & Founders',
  },
};

export const contactCards: ContactChannel[] = [
  {
    id: 'phone',
    iconName: 'phone',
    label: 'TELEPHONY // DIRECT',
    title: 'Concierge Desk',
    primary: '+91 (033) 2460-CORE',
    secondary: '+91 98300 12345',
    actionUrl: 'tel:+919830012345',
    actionLabel: 'Call Concierge',
    badge: 'INSTANT LINE',
  },
  {
    id: 'email',
    iconName: 'mail',
    label: 'DISPATCH // INQUIRIES',
    title: 'Admissions & Inquiries',
    primary: 'concierge@corexfitness.com',
    secondary: 'admissions@corexfitness.com',
    actionUrl: 'mailto:concierge@corexfitness.com',
    actionLabel: 'Send Dispatch',
    badge: '< 2HR SLA',
  },
  {
    id: 'location',
    iconName: 'map-pin',
    label: 'SANCTUARY // COORDINATES',
    title: 'Core X Facility',
    primary: 'Bhadrakali, Uttarpara',
    secondary: 'Debaipukur, West Bengal 712232',
    actionUrl: 'https://www.google.com/maps/search/?api=1&query=CORE+X+FITNESS,+Bhadrakali,+Uttarpara,+Debaipukur,+West+Bengal+712232',
    actionLabel: 'View On Maps',
    badge: 'OPEN 06:00-23:00',
  },
  {
    id: 'hours',
    iconName: 'clock',
    label: 'FACILITY // SCHEDULE',
    title: 'Operating Hours',
    primary: '05:00 — 23:00 Daily',
    secondary: '24/7 Biometric Access',
    badge: 'UNRESTRICTED',
  },
];

export const quickGuestServices: QuickServiceItem[] = [
  {
    id: 'day-pass',
    name: 'ATHLETIC DAY ACCESS PASS',
    price: '₹999',
    duration: 'Full Day Access',
    description: 'Complete floor access including Eleiko platforms, Prime strength machines, and infrared recovery bays.',
  },
  {
    id: 'assessment',
    name: 'BIOMETRIC & FORCE ASSESSMENT',
    price: '₹1,999',
    duration: '75 Minutes',
    description: 'VBT bar velocity profiling, joint mobility screening, and personalized training periodization review.',
  },
  {
    id: 'recovery-suite',
    name: 'SUB-ZERO CRYO & INFRARED COMBO',
    price: '₹1,499',
    duration: '45 Minutes',
    description: 'Contrast therapy session featuring sub-zero cryo chamber immersion and full-spectrum infrared pod.',
  },
];

export const inquiryTopics = [
  'Membership Admissions',
  'Private Coaching & VBT',
  'Private Concierge Tour',
  'Biometric Assessment (₹1,999)',
  'Day Pass Access (₹999)',
  'Corporate Partnership',
];
