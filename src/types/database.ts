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
  planName: string;
  planPrice: string;
  planPeriod: string;
  bookingType: 'MEMBERSHIP_ALLOCATION' | 'PRIVATE_TOUR' | 'ASSESSMENT' | 'CUSTOM';
  preferredDate?: string;
  status: BookingStatus;
  notes?: AdminInternalNote[];
  clerkUserId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlanStat {
  _id: string;
  total: number;
  active: number;
  pending: number;
}

export interface DashboardStats {
  totalInquiries: number;
  newInquiries: number;
  activeBookings: number;
  resolvedRequests: number;
  totalBookings: number;
  recentActivity: Array<{
    id: string;
    type: 'inquiry' | 'booking';
    title: string;
    subtitle: string;
    timestamp: string;
    status: string;
  }>;
}
