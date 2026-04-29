import Stripe from 'stripe';
import { supabase } from '../../db/index.js';
import type { Plan } from '../../shared/types/index.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PLAN_PRICES: Record<Plan, string> = {
  starter: process.env.STRIPE_PRICE_STARTER!,
  growth: process.env.STRIPE_PRICE_GROWTH!,
  pro: process.env.STRIPE_PRICE_PRO!,
};

const PLAN_AMOUNTS: Record<Plan, number> = {
  starter: 7900,
  growth: 14900,
  pro: 24900,
};

export async function createCheckoutSession(clientId: string, plan: Plan, returnUrl: string) {
  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('id', clientId)
    .single();

  if (!client) throw new Error('Client not found');

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: client.email,
    line_items: [{ price: PLAN_PRICES[plan as Plan], quantity: 1 }],
    success_url: `${returnUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${returnUrl}/cancel`,
    metadata: { client_id: clientId, plan },
    subscription_data: {
      metadata: { client_id: clientId },
    },
  });

  return session;
}

export async function handleStripeWebhook(rawBody: Buffer, signature: string) {
  const event = stripe.webhooks.constructEvent(
    rawBody,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const { client_id, plan } = session.metadata!;

      await supabase.from('clients').update({
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string,
        plan,
        monthly_amount: PLAN_AMOUNTS[plan as Plan],
        status: 'active',
        onboarded_at: new Date().toISOString(),
      }).eq('id', client_id);

      // Trigger domain + site go-live
      await triggerSiteGoLive(client_id);
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      await supabase
        .from('clients')
        .update({ status: 'cancelled' })
        .eq('stripe_subscription_id', sub.id);
      break;
    }
  }
}

async function triggerSiteGoLive(clientId: string) {
  const { data: site } = await supabase
    .from('sites')
    .select('*')
    .eq('client_id', clientId)
    .single();

  if (site) {
    await supabase
      .from('sites')
      .update({ status: 'live' })
      .eq('id', site.id);
  }
}
