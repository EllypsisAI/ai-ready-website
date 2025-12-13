import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { email, url } = await request.json();

    // Validate input
    if (!email || !url) {
      return NextResponse.json(
        { error: 'Email and URL are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Create Stripe Checkout session
    const session = await createCheckoutSession(email, url);

    return NextResponse.json({
      sessionId: session.id,
      sessionUrl: session.url,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
