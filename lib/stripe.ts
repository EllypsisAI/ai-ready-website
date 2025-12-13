import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

/**
 * Create a Stripe Checkout session for the AI-Ready Implementation Guide
 */
export async function createCheckoutSession(
  email: string,
  url: string
): Promise<Stripe.Checkout.Session> {
  const priceCents = parseInt(process.env.PRODUCT_PRICE_CENTS || '9700');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const hostname = new URL(url).hostname;

  return stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'AI-Ready Implementation Guide',
            description: `Full site analysis and personalized roadmap for ${hostname}`,
            images: [`${baseUrl}/og-image.png`], // Optional: add OG image
          },
          unit_amount: priceCents,
        },
        quantity: 1,
      },
    ],
    metadata: {
      url,
      timestamp: Date.now().toString(),
    },
    success_url: `${baseUrl}/report/pending?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/?canceled=true`,
  });
}

/**
 * Verify Stripe webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}
