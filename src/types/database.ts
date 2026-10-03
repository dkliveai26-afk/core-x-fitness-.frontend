export type InquiryStatus = 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'RESOLVED' | 'ARCHIVED';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'CANCELLED' | 'COMPLETED';

export interface AdminInternalNote {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface ContactSubmission {
  _id: string;
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  status: InquiryStatus;
  notes?: AdminInternalNote[];
  createdAt: string;
  updatedAt: string;
}

export interface BookingSubmission {
  _id: string;
  customerName: string;
  email: string;
  phone: string;
  state: string;
  city: string;
  planName: string;
  planPrice: string;
  planPeriod: string;
  bookingType: 'MEMBERSHIP_ALLOCATION' | 'PRIVATE_TOUR' | 'ASSESSMENT' | 'CUSTOM';
  preferredDate?: string;
  status: BookingStatus;
  notes?: AdminInternalNote[];
  clerkUserId?: string;
  marketingOptIn?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlanItem {
  _id: string;
  name: string;
  badge: string;
  shortDescription: string;
  duration: string;
  originalPrice: number;
  price: number;
  currency: 'INR';
  discount?: string;
  features: string[];
  ctaText: string;
  highlighted?: boolean;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OfferBannerItem {
  _id: string;
  imageUrl: string;
  title?: string;
  optionalSubtitle?: string;
  badgeText?: string;
  linkUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export * from './email';
