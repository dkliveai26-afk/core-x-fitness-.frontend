import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { getDatabase } from '@/lib/mongodb';
import {
  EmailLogEntry,
  EmailProviderName,
  SendEmailPayload,
  SendEmailResult,
} from '@/types/email';
import {
  generateBookingConfirmationHtml,
  generateAdminBookingNotificationHtml,
  generateMarketingCampaignHtml,
  generateWelcomeConfirmationHtml,
} from './email-templates';

// Configurable sender details
const DEFAULT_FROM_NAME = process.env.EMAIL_FROM_NAME || 'CORE X FITNESS';
const DEFAULT_FROM_ADDRESS =
  process.env.EMAIL_FROM_ADDRESS ||
  process.env.RESEND_FROM_EMAIL ||
  'onboarding@resend.dev';

const ADMIN_NOTIFICATION_RECIPIENT =
  process.env.ADMIN_NOTIFICATION_EMAIL ||
  process.env.ADMIN_EMAILS?.split(',')[0]?.trim() ||
  'd.klive.ai26@gmail.com';

/**
 * Identify the active email provider configuration
 */
export function getActiveEmailProvider(): {
  provider: EmailProviderName;
  isConfigured: boolean;
  fromAddress: string;
  fromName: string;
} {
  if (process.env.RESEND_API_KEY) {
    return {
      provider: 'RESEND',
      isConfigured: true,
      fromAddress: DEFAULT_FROM_ADDRESS,
      fromName: DEFAULT_FROM_NAME,
    };
  }

  if (process.env.BREVO_API_KEY) {
    return {
      provider: 'BREVO',
      isConfigured: true,
      fromAddress: DEFAULT_FROM_ADDRESS,
      fromName: DEFAULT_FROM_NAME,
    };
  }

  if (
    process.env.SMTP_HOST &&
    (process.env.SMTP_USER || process.env.SMTP_PASSWORD || process.env.SMTP_PASS)
  ) {
    return {
      provider: 'SMTP',
      isConfigured: true,
      fromAddress: DEFAULT_FROM_ADDRESS,
      fromName: DEFAULT_FROM_NAME,
    };
  }

  return {
    provider: 'DEVELOPMENT_SIMULATED',
    isConfigured: false,
    fromAddress: DEFAULT_FROM_ADDRESS,
    fromName: DEFAULT_FROM_NAME,
  };
}

/**
 * Send email via Resend official SDK with domain fallback
 */
async function sendViaResend(
  payload: SendEmailPayload,
  apiKey: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const resend = new Resend(apiKey);
    const fromAddress = payload.fromEmail || DEFAULT_FROM_ADDRESS;
    const fromName = payload.fromName || DEFAULT_FROM_NAME;
    const from = `${fromName} <${fromAddress}>`;
    const to = Array.isArray(payload.to) ? payload.to : [payload.to];

    const result = await resend.emails.send({
      from,
      to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      replyTo: payload.replyTo,
    });

    if (result.error) {
      // If error is domain verification related and we tried a custom domain, fallback to onboarding@resend.dev
      if (fromAddress !== 'onboarding@resend.dev' && (result.error.message?.includes('domain') || result.error.message?.includes('verify'))) {
        const fallbackResult = await resend.emails.send({
          from: `${fromName} <onboarding@resend.dev>`,
          to,
          subject: payload.subject,
          html: payload.html,
          text: payload.text,
          replyTo: payload.replyTo,
        });
        if (fallbackResult.data?.id) {
          return { success: true, messageId: fallbackResult.data.id };
        }
      }
      return { success: false, error: result.error.message || 'Resend delivery error' };
    }

    return { success: true, messageId: result.data?.id || `resend_${Date.now()}` };
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error communicating with Resend' };
  }
}

/**
 * Send email via Brevo / Sendinblue API
 */
async function sendViaBrevo(
  payload: SendEmailPayload,
  apiKey: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const to = (Array.isArray(payload.to) ? payload.to : [payload.to]).map((email) => ({
      email,
      name: payload.recipientName || undefined,
    }));

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: payload.fromName || DEFAULT_FROM_NAME,
          email: payload.fromEmail || DEFAULT_FROM_ADDRESS,
        },
        to,
        subject: payload.subject,
        htmlContent: payload.html,
        textContent: payload.text,
        replyTo: payload.replyTo ? { email: payload.replyTo } : undefined,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, error: data.message || `Brevo API error (${res.status})` };
    }

    return { success: true, messageId: data.messageId || `brevo_${Date.now()}` };
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error communicating with Brevo' };
  }
}

/**
 * Send email via SMTP / Nodemailer
 */
async function sendViaSmtp(
  payload: SendEmailPayload
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const port = Number(process.env.SMTP_PORT || 587);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      },
    });

    const from = `"${payload.fromName || DEFAULT_FROM_NAME}" <${payload.fromEmail || DEFAULT_FROM_ADDRESS}>`;
    const to = Array.isArray(payload.to) ? payload.to.join(', ') : payload.to;

    const info = await transporter.sendMail({
      from,
      to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      replyTo: payload.replyTo,
    });

    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    return { success: false, error: error.message || 'SMTP transmission error' };
  }
}

/**
 * Record email dispatch status to MongoDB telemetry logs
 */
export async function logEmailDispatch({
  recipient,
  recipientName,
  campaignId,
  type,
  subject,
  status,
  provider,
  providerMessageId,
  errorMessage,
}: {
  recipient: string;
  recipientName?: string;
  campaignId?: string;
  type: EmailLogEntry['type'];
  subject: string;
  status: 'SENT' | 'FAILED' | 'QUEUED';
  provider: EmailProviderName;
  providerMessageId?: string;
  errorMessage?: string;
}): Promise<void> {
  try {
    const db = await getDatabase();
    const logsCol = db.collection('email_logs');

    const now = new Date().toISOString();
    const logDoc: EmailLogEntry = {
      recipient,
      recipientName,
      campaignId,
      type,
      subject,
      status,
      provider,
      providerMessageId,
      errorMessage,
      sentAt: now,
      createdAt: now,
    };

    await logsCol.insertOne(logDoc as any);
  } catch (err) {
    console.error('Failed to write email log to MongoDB:', err);
  }
}

/**
 * Core sendEmail function with multi-provider routing, logging, and retry
 */
export async function sendEmail(payload: SendEmailPayload): Promise<SendEmailResult> {
  const { provider, isConfigured } = getActiveEmailProvider();
  const recipient = Array.isArray(payload.to) ? payload.to[0] : payload.to;

  let result: { success: boolean; messageId?: string; error?: string } = {
    success: false,
  };

  // Attempt dispatch based on provider
  if (provider === 'RESEND' && process.env.RESEND_API_KEY) {
    result = await sendViaResend(payload, process.env.RESEND_API_KEY);
    // 1-time retry on transient network glitch
    if (!result.success && !result.error?.includes('validation')) {
      await new Promise((r) => setTimeout(r, 800));
      result = await sendViaResend(payload, process.env.RESEND_API_KEY);
    }
  } else if (provider === 'BREVO' && process.env.BREVO_API_KEY) {
    result = await sendViaBrevo(payload, process.env.BREVO_API_KEY);
    if (!result.success) {
      await new Promise((r) => setTimeout(r, 800));
      result = await sendViaBrevo(payload, process.env.BREVO_API_KEY);
    }
  } else if (provider === 'SMTP') {
    result = await sendViaSmtp(payload);
  } else {
    // Development / Fallback Simulated Mode
    console.log(`[CORE X EMAIL SIMULATOR] To: ${recipient} | Subject: "${payload.subject}"`);
    result = {
      success: true,
      messageId: `simulated_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    };
  }

  // Record dispatch log in MongoDB
  await logEmailDispatch({
    recipient: Array.isArray(payload.to) ? payload.to.join(', ') : payload.to,
    recipientName: payload.recipientName,
    campaignId: payload.campaignId,
    type: payload.emailType || 'MARKETING_CAMPAIGN',
    subject: payload.subject,
    status: result.success ? 'SENT' : 'FAILED',
    provider,
    providerMessageId: result.messageId,
    errorMessage: result.error,
  });

  return {
    success: result.success,
    messageId: result.messageId,
    provider,
    error: result.error,
  };
}

/**
 * Dispatches Customer Booking Confirmation Email
 */
export async function sendCustomerBookingConfirmation(booking: {
  _id: string;
  customerName: string;
  email: string;
  phone?: string;
  planName: string;
  planPrice: string;
  planPeriod?: string;
  bookingType?: string;
  preferredDate?: string;
}): Promise<SendEmailResult> {
  const { html, text } = generateBookingConfirmationHtml({
    customerName: booking.customerName,
    email: booking.email,
    phone: booking.phone,
    planName: booking.planName,
    planPrice: booking.planPrice,
    planPeriod: booking.planPeriod,
    bookingType: booking.bookingType,
    preferredDate: booking.preferredDate,
    bookingId: booking._id,
  });

  const subject = `Booking Confirmed: VIP Membership Reservation at CORE X FITNESS [Ref #${booking._id.slice(-8).toUpperCase()}]`;

  return sendEmail({
    to: booking.email,
    subject,
    html,
    text,
    emailType: 'BOOKING_CONFIRMATION',
    recipientName: booking.customerName,
  });
}

/**
 * Dispatches Admin Booking Notification Email
 */
export async function sendAdminBookingNotification(booking: {
  _id: string;
  customerName: string;
  email: string;
  phone?: string;
  planName: string;
  planPrice: string;
  planPeriod?: string;
  bookingType?: string;
  preferredDate?: string;
  createdAt?: string;
}): Promise<SendEmailResult> {
  const { html, text } = generateAdminBookingNotificationHtml({
    customerName: booking.customerName,
    email: booking.email,
    phone: booking.phone,
    planName: booking.planName,
    planPrice: booking.planPrice,
    planPeriod: booking.planPeriod,
    bookingType: booking.bookingType,
    preferredDate: booking.preferredDate,
    bookingId: booking._id,
    createdAt: booking.createdAt || new Date().toISOString(),
  });

  const subject = `[NEW ATHLETE RESERVATION] ${booking.customerName} - ${booking.planName}`;

  return sendEmail({
    to: ADMIN_NOTIFICATION_RECIPIENT,
    subject,
    html,
    text,
    emailType: 'ADMIN_NOTIFICATION',
    recipientName: 'Core X Admin Concierge',
  });
}

/**
 * Dispatches Branded Customer Sign-Up Welcome / Account Confirmation Email
 */
export async function sendUserSignupWelcomeEmail({
  email,
  name,
  userId,
}: {
  email: string;
  name?: string;
  userId?: string;
}): Promise<SendEmailResult> {
  const cleanEmail = (email || '').trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return {
      success: false,
      provider: 'DEVELOPMENT_SIMULATED',
      error: 'Invalid or missing recipient email address.',
    };
  }

  // Check if welcome email was already dispatched to prevent duplicate sends
  try {
    const db = await getDatabase();
    const contactsCol = db.collection('marketing_contacts');
    const existing = await contactsCol.findOne({ email: cleanEmail });

    if (existing && existing.welcomeEmailSentAt) {
      return {
        success: true,
        messageId: 'already_sent',
        provider: 'RESEND',
      };
    }
  } catch (dbErr) {
    console.warn('Notice in sendUserSignupWelcomeEmail DB check:', dbErr);
  }

  const { html, text } = generateWelcomeConfirmationHtml({
    customerName: name || 'Athlete',
    email: cleanEmail,
  });

  const subject = 'Welcome to CORE X FITNESS — Your Account is Ready';

  const result = await sendEmail({
    to: cleanEmail,
    subject,
    html,
    text,
    emailType: 'WELCOME_CONFIRMATION',
    recipientName: name || 'Athlete',
  });

  // If email dispatch succeeded, record timestamp and upsert contact in MongoDB
  if (result.success) {
    try {
      const db = await getDatabase();
      const contactsCol = db.collection('marketing_contacts');
      const now = new Date().toISOString();
      await contactsCol.updateOne(
        { email: cleanEmail },
        {
          $set: {
            welcomeEmailSentAt: now,
            lastActiveAt: now,
            updatedAt: now,
          },
          $addToSet: {
            sources: 'REGISTRATION',
          },
        },
        { upsert: true }
      );
    } catch (err) {
      console.warn('Failed to record welcomeEmailSentAt in MongoDB:', err);
    }
  }

  return result;
}

