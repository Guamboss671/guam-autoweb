import { NextRequest, NextResponse } from 'next/server';
import { handleStripeWebhook } from '../../../../../packages/agents/subscription/stripe.js';

export async function POST(req: NextRequest) {
  const rawBody = Buffer.from(await req.arrayBuffer());
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  try {
    await handleStripeWebhook(rawBody, signature);
    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('[Stripe Webhook]', err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export const runtime = 'nodejs';
