import { Stripe } from 'stripe';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

// Vercel/Next.js config to disable body parsing for Stripe signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

// Initialize Clients
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper: Generate License Key (CADMUS-XXXX-XXXX-XXXX-XXXX)
const generateLicenseKey = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segment = () => {
    let s = '';
    for (let i = 0; i < 4; i++) {
      s += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return s;
  };
  return `CADMUS-${segment()}-${segment()}-${segment()}-${segment()}`;
};

// Helper: Get Raw Body from stream
const getRawBody = async (readable) => {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  let event;

  try {
    const rawBody = await getRawBody(req);
    const signature = req.headers['stripe-signature'];
    
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`⚠️  Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const customerEmail = session.customer_details?.email;
    const customerName = session.customer_details?.name || 'Valued Customer';

    if (!customerEmail) {
      console.error('No email found in session');
      // Return 200 to acknowledge receipt even if we can't process (avoids loop)
      return res.status(200).json({ received: true });
    }

    console.log(`Processing checkout for: ${customerEmail}`);

    try {
      // 1. Generate License Key
      const licenseKey = generateLicenseKey();

      // 2. Insert into Supabase
      const { error: dbError } = await supabase
        .from('licenses')
        .insert([
          {
            license_key: licenseKey,
            purchase_email: customerEmail,
            is_active: true,
            max_devices: 3,
            notes: session.id,
          },
        ]);

      if (dbError) {
        throw new Error(`Supabase Insert Failed: ${dbError.message}`);
      }

      // 3. Send Email via Resend
      console.log('Attempting to send email...');
      const { error: emailError } = await resend.emails.send({
        from: 'FontPair AI <license@fontpairai.com>',
        to: [customerEmail],
        subject: 'Your FontPair AI License Key',
        html: `
    <!DOCTYPE html>
    <html>
    <body style="background-color: #F2EFE8; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        
        <div style="background-color: #008080; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">FontPair AI</h1>
        </div>

        <div style="padding: 40px; color: #1A3431;">
          <p style="font-size: 18px; margin-bottom: 20px;">Hi ${customerName},</p>
          <p style="line-height: 1.6; margin-bottom: 30px;">Thank you for joining the studio. Your perpetual license is ready.</p>
          
          <div style="background-color: #F8F5EF; border: 2px dashed #008080; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 30px;">
            <p style="margin: 0 0 10px 0; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Your License Key</p>
            <code style="font-family: monospace; font-size: 24px; font-weight: bold; color: #D47C2E; letter-spacing: 2px;">${licenseKey}</code>
          </div>

          <div style="text-align: center; margin-bottom: 40px;">
            <a href="https://app.fontpairai.com" style="background-color: #D47C2E; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 5px; font-weight: bold; display: inline-block;">Launch App & Activate</a>
          </div>

          <div style="background-color: #e6f2f2; padding: 20px; border-radius: 8px;">
            <p style="margin: 0; font-size: 14px; font-weight: bold; margin-bottom: 10px;">Quick Start:</p>
            <ol style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
              <li>Click the button above to open the app.</li>
              <li>Paste your key into the activation screen.</li>
              <li>Start pairing fonts.</li>
            </ol>
          </div>
        </div>

        <div style="padding: 20px; text-align: center; background-color: #1A3431; color: #8B7355; font-size: 12px;">
          <p style="margin: 0;">A Neon Beacon Product</p>
          <p style="margin: 5px 0 0 0;">Invoice ID: ${session.id}</p>
        </div>
      </div>
    </body>
    </html>
  `,
      });

      if (emailError) {
        console.error('Email error:', emailError);
        throw new Error(`Resend Email Failed: ${emailError.message}`);
      }

      console.log('Email sent successfully');
      console.log(`Success: License ${licenseKey} sent to ${customerEmail}`);

    } catch (error) {
      console.error('Error processing checkout:', error.message);
      // We still return 200 to Stripe to prevent them from retrying indefinitely 
      // if it's an internal error that won't be fixed by a retry (like a bad API key)
      // In a production env, you might want to alert yourself here.
    }
  }

  res.status(200).json({ received: true });
}
