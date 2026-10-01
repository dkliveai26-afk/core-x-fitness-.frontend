export type EmailType =
  | 'BOOKING_CONFIRMATION'
  | 'ADMIN_NOTIFICATION'
  | 'MARKETING_CAMPAIGN'
  | 'TEST_EMAIL';

export type EmailDeliveryStatus =
  | 'DRAFT'
  | 'QUEUED'
  | 'SENDING'
  | 'SENT'
  | 'FAILED'
  | 'CANCELLED';

export type EmailProviderName = 'RESEND' | 'BREVO' | 'SMTP' | 'DEVELOPMENT_SIMULATED';

export type ContactSource =
  | 'BOOKING'
  | 'CONTACT'
  | 'REGISTRATION'
  | 'FOOTER_NEWSLETTER'
  | 'MANUAL';

export interface MarketingContact {
  _id?: string;
  email: string;
  name: string;
  phone?: string;
  sources: ContactSource[];
  marketingOptIn: boolean;
  marketingOptInAt?: string;
  marketingOptOutAt?: string;
  unsubscribeToken: string;
  totalBookings: number;
  totalInquiries: number;
  latestPlan?: string;
  lastActiveAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailCampaign {
  _id: string;
  title: string;
  subject: string;
  preheader?: string;
  heading: string;
  bodyMessage: string;
  offerBadge?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  footerNote?: string;
  targetAudience: 'ALL_OPTED_IN' | 'BOOKINGS_ONLY' | 'CONTACTS_ONLY';
  includePricingCard?: boolean;
  pricingPlanId?: string;
  pricingPlanDetails?: {
    name: string;
    badge?: string;
    price: number;
    originalPrice?: number;
    duration: string;
    features: string[];
    shortDescription?: string;
    discount?: string;
  };
  status: EmailDeliveryStatus;
  totalEligibleRecipients: number;
  sentCount: number;
  failedCount: number;
  scheduledAt?: string;
  sentAt?: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface EmailLogEntry {
  _id?: string;
  recipient: string;
  recipientName?: string;
  campaignId?: string;
  type: EmailType;
  subject: string;
  status: 'SENT' | 'FAILED' | 'QUEUED';
  provider: EmailProviderName;
  providerMessageId?: string;
  errorMessage?: string;
  sentAt: string;
  createdAt: string;
}

export interface SendEmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  fromName?: string;
  fromEmail?: string;
  replyTo?: string;
  emailType?: EmailType;
  campaignId?: string;
  recipientName?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  provider: EmailProviderName;
  error?: string;
}
