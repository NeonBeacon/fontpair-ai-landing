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
        from: 'FontPair AI <onboarding@resend.dev>', // Update with your verified domain if available
        to: [customerEmail],
        subject: 'Your FontPair AI License Key',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #EBE6D9; color: #2D4743; margin: 0; padding: 40px; }
              .container { max-width: 600px; margin: 0 auto; background-color: #F2EFE8; padding: 40px; border-radius: 8px; border: 1px solid #D4CAB6; }
              h1 { font-family: 'Courier New', Courier, monospace; color: #2D4743; letter-spacing: -0.5px; }
              .key-box { background-color: #2D4743; color: #F2EFE8; padding: 20px; text-align: center; font-family: 'Courier New', Courier, monospace; font-size: 24px; letter-spacing: 2px; margin: 30px 0; border-radius: 4px; }
              .footer { margin-top: 40px; font-size: 12px; color: #6B6560; text-align: center; }
              .highlight { color: #E67E22; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Welcome to the Studio.</h1>
              <p>Thank you for choosing <span class="highlight">FontPair AI</span>. You have taken a significant step towards typography mastery.</p>
              <p>Below is your personal license key. It is your passport to clarity in a sea of chaotic choices.</p>
              
              <div class="key-box">
                ${licenseKey}
              </div>
              
              <p>To activate, simply enter this key in the FontPair AI application settings.</p>
              
              <div class="footer">
                <p>FontPair AI &mdash; The Intelligent Typography Assistant</p>
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
