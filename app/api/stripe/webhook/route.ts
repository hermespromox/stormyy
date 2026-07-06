import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripe, syncSubscriptionToUser, updateUserBilling } from '@/lib/billing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function syncCustomerToUser(stripe: Stripe, customerId: string) {
  const customer = await stripe.customers.retrieve(customerId);
  if (!customer || 'deleted' in customer) return;
  const userId = (customer as Stripe.Customer).metadata?.supabase_user_id;
  if (!userId) return;
  await updateUserBilling(userId, { stripe_customer_id: customerId });
  const subs = await stripe.subscriptions.list({ customer: customerId, limit: 1, expand: ['data.items.data.price'] });
  if (subs.data.length > 0) await syncSubscriptionToUser(userId, subs.data[0]);
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) return NextResponse.json({ error: 'Webhook secret missing' }, { status: 500 });

  const body = await req.text();
  const signature = req.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid signature';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        if (customerId) await syncCustomerToUser(stripe, customerId);
        const subId = session.subscription as string | undefined;
        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId, { expand: ['items.data.price'] });
          const customer = await stripe.customers.retrieve(customerId);
          if (customer && !('deleted' in customer)) {
            const userId = (customer as Stripe.Customer).metadata?.supabase_user_id;
            if (userId) await syncSubscriptionToUser(userId, sub);
          }
        }
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const customer = await stripe.customers.retrieve(customerId);
        if (customer && !('deleted' in customer)) {
          const userId = (customer as Stripe.Customer).metadata?.supabase_user_id;
          if (userId) await syncSubscriptionToUser(userId, sub);
        }
        break;
      }
      default:
        break;
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
