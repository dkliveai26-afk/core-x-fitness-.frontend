import { Resend } from 'resend';

async function testResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('❌ RESEND_API_KEY is not set in environment.');
    process.exit(1);
  }
  const resend = new Resend(apiKey);

  console.log('Testing live Resend API key...');
  try {
    const data = await resend.emails.send({
      from: 'CORE X FITNESS <onboarding@resend.dev>',
      to: 'd.klive.ai26@gmail.com',
      subject: 'Core X Fitness - Real Resend Integration Verification',
      html: `
        <div style="font-family: sans-serif; background: #0A0D14; color: #FFFFFF; padding: 30px; border-radius: 12px; border: 1px solid #FF2A2A;">
          <h1 style="color: #FFFFFF; margin: 0 0 10px 0;">CORE <span style="color: #FF2A2A;">X</span> FITNESS</h1>
          <p style="color: #10B981; font-weight: bold; font-size: 16px;">✅ Resend Production API Key Verified</p>
          <p style="color: #94A3B8; font-size: 14px;">Your Resend key has been authenticated successfully. Booking confirmation emails, admin alerts, and promotional offer broadcasts are fully active.</p>
          <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748B;">Core X Fitness Flagship Facility // Automated System Verification</p>
        </div>
      `,
    });

    console.log('Resend Response:', data);
    if (data.error) {
      console.error('❌ Resend Error:', data.error);
    } else {
      console.log('✅ Real email sent successfully! Message ID:', data.data?.id);
    }
  } catch (err) {
    console.error('❌ Exception sending with Resend:', err);
  }
}

testResend();
