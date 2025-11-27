import { VercelRequest, VercelResponse } from '@vercel/node';
import { buffer } from 'micro';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  let event: Stripe.Event;

  try {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];
    
    if (!sig) {
        throw new Error('No Stripe signature found');
    }

    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Generate License
    const licenseKey = generateLicenseKey();
    const email = session.customer_details?.email;

    console.log(`Processing license for: ${email}, Key: ${licenseKey}`);

    if (email) {
      const { error } = await supabase
        .from('licenses')
        .insert({
          license_key: licenseKey,
          purchase_email: email,
          is_active: true,
          max_devices: 3,
        });

      if (error) {
        console.error('Supabase Error:', error);
        // Don't return 500 here to avoid Stripe retrying infinitely if it's a logic error, 
        // but technically we should retry for transient DB errors. 
        // For now, we log and continue.
        return res.status(500).json({ error: 'Database error' });
      }
    }
  }

  res.status(200).json({ received: true });
}

function generateLicenseKey() {
  // Format XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX
  const segment = () => Math.random().toString(36).substring(2, 10).toUpperCase();
  return `${segment()}-${segment()}-${segment()}-${segment()}`;
}
