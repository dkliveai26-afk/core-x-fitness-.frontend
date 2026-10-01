/**
 * High-performance, bulletproof responsive HTML email templates for Core X Fitness.
 * Compatible with Gmail, Apple Mail, Outlook, Yahoo, and mobile clients.
 */

const BASE_STYLES = `
  body {
    margin: 0;
    padding: 0;
    background-color: #050607;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #E2E8F0;
    -webkit-font-smoothing: antialiased;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }
  table {
    border-collapse: separate;
    mso-table-lspace: 0pt;
    mso-table-rspace: 0pt;
    width: 100%;
  }
  td {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    font-size: 14px;
    vertical-align: top;
  }
  img {
    border: none;
    -ms-interpolation-mode: bicubic;
    max-width: 100%;
  }
  .btn-primary {
    background: linear-gradient(135deg, #FF2A2A 0%, #D80000 100%);
    background-color: #FF2A2A;
    color: #FFFFFF !important;
    text-decoration: none;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 14px 28px;
    border-radius: 12px;
    display: inline-block;
    border: 1px solid rgba(255, 42, 42, 0.4);
  }
`;

/**
 * Customer Booking Confirmation Email Template
 */
export function generateBookingConfirmationHtml({
  customerName,
  email,
  phone,
  planName,
  planPrice,
  planPeriod,
  bookingType,
  preferredDate,
  bookingId,
}: {
  customerName: string;
  email: string;
  phone?: string;
  planName: string;
  planPrice: string;
  planPeriod?: string;
  bookingType?: string;
  preferredDate?: string;
  bookingId: string;
}): { html: string; text: string } {
  const shortId = bookingId ? bookingId.slice(-8).toUpperCase() : 'VIP-RESERVE';
  const formattedDate = preferredDate ? new Date(preferredDate).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : 'Scheduled with Concierge';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Core X Fitness - Reservation Confirmation</title>
  <style>${BASE_STYLES}</style>
</head>
<body style="background-color: #050607; margin: 0; padding: 30px 10px;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center">
        <!-- Container Card -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #0D1117; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.8);">
          
          <!-- Top Red Glow Bar -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #FF2A2A 0%, #FF6B6B 50%, #FF2A2A 100%);"></td>
          </tr>

          <!-- Header / Brand -->
          <tr>
            <td style="padding: 36px 36px 20px 36px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 0.15em; color: #FFFFFF; text-transform: uppercase;">
                CORE <span style="color: #FF2A2A;">X</span> FITNESS
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 11px; font-family: monospace; letter-spacing: 0.2em; color: #94A3B8; text-transform: uppercase;">
                VIP ATHLETE RESERVATION // CONFIRMED
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 0 36px 36px 36px;">
              <p style="font-size: 16px; color: #FFFFFF; font-weight: 600; margin: 0 0 12px 0;">
                Welcome, ${customerName}.
              </p>
              <p style="font-size: 14px; color: #94A3B8; line-height: 1.6; margin: 0 0 24px 0;">
                Your athletic reservation for <strong style="color: #FFFFFF;">${planName}</strong> has been logged directly with our VIP Admissions desk. Our master concierge is reviewing your intake profile.
              </p>

              <!-- Reservation Summary Box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #161B22; border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding-bottom: 12px; font-size: 11px; font-family: monospace; color: #64748B; text-transform: uppercase; letter-spacing: 0.1em;">
                          RESERVATION REF:
                        </td>
                        <td style="padding-bottom: 12px; text-align: right; font-size: 13px; font-family: monospace; font-weight: 700; color: #FF2A2A;">
                          #${shortId}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 12px; font-size: 11px; font-family: monospace; color: #64748B; text-transform: uppercase; letter-spacing: 0.1em;">
                          SELECTED TIER / PLAN:
                        </td>
                        <td style="padding-bottom: 12px; text-align: right; font-size: 13px; font-weight: 600; color: #FFFFFF;">
                          ${planName}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 12px; font-size: 11px; font-family: monospace; color: #64748B; text-transform: uppercase; letter-spacing: 0.1em;">
                          RATE / INVESTMENT:
                        </td>
                        <td style="padding-bottom: 12px; text-align: right; font-size: 13px; font-weight: 700; color: #10B981;">
                          ${planPrice} ${planPeriod || ''}
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 11px; font-family: monospace; color: #64748B; text-transform: uppercase; letter-spacing: 0.1em;">
                          ORIENTATION DATE:
                        </td>
                        <td style="text-align: right; font-size: 13px; color: #E2E8F0;">
                          ${formattedDate}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- What's Next Guidelines -->
              <h2 style="font-size: 13px; font-family: monospace; font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 12px 0;">
                Next Steps For Your Orientation:
              </h2>
              <ul style="margin: 0 0 28px 0; padding-left: 20px; color: #94A3B8; font-size: 13px; line-height: 1.6;">
                <li style="margin-bottom: 8px;">Please arrive 10 minutes before your preferred time at our Flagship Facility.</li>
                <li style="margin-bottom: 8px;">Private biometric scan and Eleiko equipment calibration will be conducted.</li>
                <li>Digital VIP pass will be activated upon facility check-in.</li>
              </ul>

              <!-- Facility Support Note -->
              <div style="padding: 16px; border-radius: 12px; background-color: rgba(255,42,42,0.06); border: 1px solid rgba(255,42,42,0.2); text-align: center;">
                <p style="margin: 0; font-size: 12px; color: #CBD5E1;">
                  Need to adjust your orientation schedule? Reply directly to this email or call our desk at <strong style="color: #FFFFFF;">+91 98765 43210</strong>.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; background-color: #090C10; border-top: 1px solid rgba(255,255,255,0.04); text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 11px; color: #64748B; font-family: monospace;">
                CORE X FITNESS FLAGSHIP FACILITY // SECTOR 14, NOIDA, UP
              </p>
              <p style="margin: 0; font-size: 11px; color: #475569;">
                This transactional email was sent regarding your membership reservation #${shortId}.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `
CORE X FITNESS - RESERVATION CONFIRMATION
==========================================

Hello ${customerName},

Your athletic reservation for ${planName} has been logged directly with our VIP Admissions desk.

RESERVATION DETAILS:
- Reference ID: #${shortId}
- Selected Tier: ${planName}
- Rate: ${planPrice} ${planPeriod || ''}
- Orientation Date: ${formattedDate}
- Customer Email: ${email}
${phone ? `- Customer Phone: ${phone}` : ''}

Next Steps:
1. Please arrive 10 minutes before your preferred time at our Flagship Facility.
2. Private biometric scan and Eleiko equipment calibration will be conducted.
3. Digital VIP pass will be activated upon facility check-in.

Need help? Contact concierge at +91 98765 43210 or reply to this email.

CORE X FITNESS
Sector 14, Noida, UP
  `.trim();

  return { html, text };
}

/**
 * Admin Notification Email Template (Dispatched to gym management on new booking)
 */
export function generateAdminBookingNotificationHtml({
  customerName,
  email,
  phone,
  planName,
  planPrice,
  planPeriod,
  bookingType,
  preferredDate,
  bookingId,
  createdAt,
}: {
  customerName: string;
  email: string;
  phone?: string;
  planName: string;
  planPrice: string;
  planPeriod?: string;
  bookingType?: string;
  preferredDate?: string;
  bookingId: string;
  createdAt: string;
}): { html: string; text: string } {
  const shortId = bookingId ? bookingId.slice(-8).toUpperCase() : 'VIP-ENTRY';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Athlete Booking Notification</title>
  <style>${BASE_STYLES}</style>
</head>
<body style="background-color: #050607; margin: 0; padding: 30px 10px;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #0D1117; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; overflow: hidden;">
          
          <tr>
            <td style="height: 4px; background: #FF2A2A;"></td>
          </tr>

          <tr>
            <td style="padding: 28px 32px 16px 32px;">
              <span style="font-size: 11px; font-family: monospace; color: #FF2A2A; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;">
                [NEW ATHLETE RESERVATION LOGGED]
              </span>
              <h1 style="margin: 8px 0 0 0; font-size: 20px; font-weight: 800; color: #FFFFFF;">
                ${customerName} booked ${planName}
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 0 32px 32px 32px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #161B22; border-radius: 12px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 20px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="padding-bottom: 10px; font-size: 12px; font-family: monospace; color: #64748B;">ATHLETE NAME:</td>
                        <td style="padding-bottom: 10px; text-align: right; font-size: 13px; font-weight: 700; color: #FFFFFF;">${customerName}</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px; font-size: 12px; font-family: monospace; color: #64748B;">EMAIL:</td>
                        <td style="padding-bottom: 10px; text-align: right; font-size: 13px; font-mono; color: #38BDF8;">
                          <a href="mailto:${email}" style="color: #38BDF8; text-decoration: none;">${email}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px; font-size: 12px; font-family: monospace; color: #64748B;">PHONE:</td>
                        <td style="padding-bottom: 10px; text-align: right; font-size: 13px; font-mono; color: #E2E8F0;">
                          ${phone ? `<a href="tel:${phone}" style="color: #E2E8F0; text-decoration: none;">${phone}</a>` : 'Not provided'}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px; font-size: 12px; font-family: monospace; color: #64748B;">MEMBERSHIP PLAN:</td>
                        <td style="padding-bottom: 10px; text-align: right; font-size: 13px; font-weight: 700; color: #FF2A2A;">${planName}</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px; font-size: 12px; font-family: monospace; color: #64748B;">PRICE:</td>
                        <td style="padding-bottom: 10px; text-align: right; font-size: 13px; font-weight: 700; color: #10B981;">${planPrice} ${planPeriod || ''}</td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 10px; font-size: 12px; font-family: monospace; color: #64748B;">PREFERRED DATE:</td>
                        <td style="padding-bottom: 10px; text-align: right; font-size: 12px; color: #E2E8F0;">${preferredDate || 'Immediate'}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; font-family: monospace; color: #64748B;">DB RECORD ID:</td>
                        <td style="text-align: right; font-size: 11px; font-family: monospace; color: #94A3B8;">${bookingId}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="font-size: 12px; color: #94A3B8; margin: 0 0 20px 0;">
                This booking has been saved to MongoDB. You can review all applications and adjust status in the Admin Console.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `
[NEW ATHLETE RESERVATION]
==========================
Athlete: ${customerName}
Plan: ${planName} (${planPrice} ${planPeriod || ''})
Email: ${email}
Phone: ${phone || 'N/A'}
Preferred Date: ${preferredDate || 'Immediate'}
Booking ID: ${bookingId}
Submission Time: ${createdAt}
  `.trim();

  return { html, text };
}

/**
 * Marketing & Offer Campaign Email Template (Bulletproof luxury responsive HTML)
 */
export function generateMarketingCampaignHtml({
  heading,
  bodyMessage,
  offerBadge,
  imageUrl,
  ctaText,
  ctaUrl,
  footerNote,
  recipientName = 'Athlete',
  unsubscribeUrl,
  includePricingCard,
  pricingPlanDetails,
}: {
  heading: string;
  bodyMessage: string;
  offerBadge?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  footerNote?: string;
  recipientName?: string;
  unsubscribeUrl: string;
  includePricingCard?: boolean;
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
}): { html: string; text: string } {
  // Convert newlines to formatted HTML paragraphs safely
  const formattedBody = bodyMessage
    .split(/\n\n+/)
    .map((p) => `<p style="font-size: 15px; line-height: 1.7; color: #CBD5E1; margin: 0 0 16px 0;">${p.replace(/\n/g, '<br/>')}</p>`)
    .join('');

  // Generate Email Pricing Card HTML if requested
  let pricingCardHtml = '';
  if (includePricingCard && pricingPlanDetails) {
    const {
      name,
      badge,
      price,
      originalPrice,
      duration,
      features = [],
      shortDescription,
      discount,
    } = pricingPlanDetails;

    const formattedPrice = `₹${price.toLocaleString('en-IN')}`;
    const formattedOriginal = originalPrice ? `₹${originalPrice.toLocaleString('en-IN')}` : '';

    pricingCardHtml = `
      <!-- Embedded Membership Plan Card -->
      <div style="margin: 28px 0; background: linear-gradient(180deg, #1C0F12 0%, #12151B 100%); border: 2px solid #FF2A2A; border-radius: 18px; padding: 24px; box-shadow: 0 15px 35px rgba(255,42,42,0.18);">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td>
              <!-- Badge & Plan Name -->
              <div style="margin-bottom: 12px;">
                <span style="display: inline-block; padding: 3px 10px; border-radius: 999px; background-color: rgba(255,42,42,0.2); border: 1px solid rgba(255,42,42,0.4); font-size: 9px; font-family: monospace; font-weight: 700; color: #FF2A2A; letter-spacing: 0.15em; text-transform: uppercase;">
                  ${badge || 'OFFICIAL MEMBERSHIP TIER'}
                </span>
                <h3 style="margin: 8px 0 0 0; font-size: 22px; font-weight: 900; color: #FFFFFF; text-transform: uppercase; letter-spacing: 0.05em;">
                  ${name} TIER
                </h3>
              </div>

              <!-- Price Cluster -->
              <div style="margin-bottom: 14px;">
                ${formattedOriginal ? `
                  <div style="margin-bottom: 4px;">
                    <span style="font-family: monospace; font-size: 13px; text-decoration: line-through; color: #94A3B8;">${formattedOriginal}</span>
                    ${discount ? `
                      <span style="margin-left: 6px; padding: 2px 8px; border-radius: 999px; background-color: rgba(255,42,42,0.25); color: #FF2A2A; font-size: 9px; font-family: monospace; font-weight: 700; text-transform: uppercase;">
                        ${discount}
                      </span>
                    ` : ''}
                  </div>
                ` : ''}
                <div>
                  <span style="font-size: 32px; font-weight: 900; color: #FFFFFF; letter-spacing: -0.02em;">
                    ${formattedPrice}
                  </span>
                  <span style="font-size: 13px; color: #94A3B8; font-family: monospace; text-transform: uppercase; margin-left: 4px;">
                    ${duration || '/ MONTH'}
                  </span>
                </div>
              </div>

              ${shortDescription ? `
                <p style="font-size: 13px; color: #CBD5E1; margin: 0 0 18px 0; line-height: 1.5;">
                  ${shortDescription}
                </p>
              ` : ''}

              <!-- Features List -->
              ${features && features.length > 0 ? `
                <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; margin-bottom: 20px;">
                  <span style="font-size: 10px; font-family: monospace; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 700; display: block; margin-bottom: 10px;">
                    INCLUDED PRIVILEGES:
                  </span>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    ${features.map((f) => `
                      <tr>
                        <td style="width: 20px; vertical-align: top; padding-bottom: 8px; color: #FF2A2A; font-size: 14px; font-weight: bold;">
                          ✓
                        </td>
                        <td style="vertical-align: top; padding-bottom: 8px; font-size: 12px; color: #E2E8F0; line-height: 1.4;">
                          ${f}
                        </td>
                      </tr>
                    `).join('')}
                  </table>
                </div>
              ` : ''}
            </td>
          </tr>
        </table>
      </div>
    `;
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${heading}</title>
  <style>${BASE_STYLES}</style>
</head>
<body style="background-color: #050607; margin: 0; padding: 30px 10px;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center">
        <!-- Main Frame -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #0D1117; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px rgba(0,0,0,0.9);">
          
          <!-- Top Accent Bar -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #FF2A2A 0%, #FF6B6B 50%, #FF2A2A 100%);"></td>
          </tr>

          <!-- Brand Logo Header -->
          <tr>
            <td style="padding: 32px 32px 20px 32px; text-align: center;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 900; letter-spacing: 0.15em; color: #FFFFFF; text-transform: uppercase;">
                CORE <span style="color: #FF2A2A;">X</span> FITNESS
              </h1>
              ${offerBadge ? `
                <div style="margin-top: 10px;">
                  <span style="display: inline-block; padding: 4px 12px; border-radius: 999px; background-color: rgba(255,42,42,0.12); border: 1px solid rgba(255,42,42,0.35); font-size: 10px; font-family: monospace; font-weight: 700; color: #FF2A2A; letter-spacing: 0.15em; text-transform: uppercase;">
                    ${offerBadge}
                  </span>
                </div>
              ` : ''}
            </td>
          </tr>

          <!-- Campaign Banner Image (if provided) -->
          ${imageUrl ? `
          <tr>
            <td style="padding: 0 20px 24px 20px; text-align: center;">
              <div style="border-radius: 14px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); background-color: #000000;">
                <img src="${imageUrl}" alt="${heading}" style="width: 100%; height: auto; display: block; border: 0;" />
              </div>
            </td>
          </tr>
          ` : ''}

          <!-- Campaign Content -->
          <tr>
            <td style="padding: 0 36px 36px 36px;">
              <h2 style="font-size: 20px; font-weight: 800; color: #FFFFFF; margin: 0 0 16px 0; line-height: 1.3;">
                ${heading}
              </h2>

              <div style="margin-bottom: 20px;">
                ${formattedBody}
              </div>

              <!-- Included Pricing Plan Card -->
              ${pricingCardHtml}

              <!-- CTA Button -->
              ${ctaText && ctaUrl ? `
              <div style="text-align: center; margin: 28px 0 24px 0;">
                <a href="${ctaUrl}" class="btn-primary" target="_blank" style="background: linear-gradient(135deg, #FF2A2A 0%, #D80000 100%); background-color: #FF2A2A; color: #FFFFFF !important; text-decoration: none; font-weight: 700; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; padding: 14px 32px; border-radius: 12px; display: inline-block; border: 1px solid rgba(255, 42, 42, 0.4); box-shadow: 0 10px 25px rgba(255,42,42,0.3);">
                  ${ctaText}
                </a>
              </div>
              ` : ''}

              ${footerNote ? `
              <div style="padding: 14px 18px; border-radius: 10px; background-color: #161B22; border: 1px solid rgba(255,255,255,0.05); margin-top: 24px;">
                <p style="margin: 0; font-size: 12px; color: #94A3B8; line-height: 1.5;">
                  ${footerNote}
                </p>
              </div>
              ` : ''}
            </td>
          </tr>

          <!-- Compliance & Unsubscribe Footer -->
          <tr>
            <td style="padding: 24px 36px; background-color: #090C10; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 11px; font-family: monospace; color: #64748B;">
                CORE X FITNESS // PREMIER HIGH-PERFORMANCE TRAINING
              </p>
              <p style="margin: 0 0 12px 0; font-size: 11px; color: #475569;">
                Sector 14, Main Athletic Boulevard, Noida, UP, India
              </p>
              <p style="margin: 0; font-size: 11px; color: #64748B;">
                You received this email because you opted into Core X Fitness dispatches. 
                <a href="${unsubscribeUrl}" style="color: #94A3B8; text-decoration: underline; margin-left: 4px;">Unsubscribe immediately</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `
CORE X FITNESS
${offerBadge ? `[${offerBadge}]\n` : ''}
==========================================

${heading}

${bodyMessage}

${includePricingCard && pricingPlanDetails ? `
[FEATURED MEMBERSHIP TIER]
${pricingPlanDetails.name} Tier (${pricingPlanDetails.badge || 'Official Plan'})
Price: ₹${pricingPlanDetails.price.toLocaleString('en-IN')} ${pricingPlanDetails.duration || '/ MONTH'}
${pricingPlanDetails.shortDescription || ''}
Privileges:
${(pricingPlanDetails.features || []).map((f) => `- ${f}`).join('\n')}
` : ''}

${ctaText && ctaUrl ? `\n--> ${ctaText}: ${ctaUrl}\n` : ''}
${footerNote ? `\nNote: ${footerNote}\n` : ''}

==========================================
Core X Fitness, Sector 14, Noida, UP, India
To unsubscribe from marketing emails, visit:
${unsubscribeUrl}
  `.trim();

  return { html, text };
}
