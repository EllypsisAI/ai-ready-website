import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { verifyWebhookSignature } from '@/lib/stripe';
import { saveOrder } from '@/lib/kv';
import { nanoid } from 'nanoid';
import type { Order } from '@/types/report';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const event = verifyWebhookSignature(body, signature);

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      const email = session.customer_email || session.customer_details?.email;
      const url = session.metadata?.url;

      if (!email || !url) {
        console.error('Missing email or URL in session metadata');
        return NextResponse.json(
          { error: 'Missing required metadata' },
          { status: 400 }
        );
      }

      // Generate unique report ID
      const reportId = nanoid(16);

      // Create order record
      const order: Order = {
        sessionId: session.id,
        email,
        url,
        reportId,
        status: 'processing',
        createdAt: new Date().toISOString(),
      };

      // Save order to KV
      await saveOrder(order);

      console.log(`[WEBHOOK] Order created: ${reportId} for ${email}`);

      // Trigger report generation asynchronously
      // Note: In production, you might want to use a queue system
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

      fetch(`${baseUrl}/api/reports/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, url, email }),
      }).catch(error => {
        console.error('[WEBHOOK] Failed to trigger report generation:', error);
      });

      return NextResponse.json({ received: true, reportId });
    }

    // Return success for other event types
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
