import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getCurrentConfirmedUser } from '@/lib/supabase/server';
import { getStripe, getStripePriceId, ensureStripeCustomer, syncSubscriptionToUser } from '@/lib/billing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function origin() {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://stormyy.vercel.app').replace(/\/$/, '');
}

const VALID_PLANS = ['pro'] as const;

async function startCheckout(req: NextRequest, plan: string | null) {
  if (!plan || !VALID_PLANS.includes(plan as typeof VALID_PLANS[number])) {
    return NextResponse.redirect(`${origin()}/account?error=${encodeURIComponent('Invalid plan.')}`, 303);
  }

  const user = await getCurrentConfirmedUser();
  if (!user) {
    const next = `/api/stripe/checkout?plan=${encodeURIComponent(plan)}`;
    return NextResponse.redirect(
      `${origin()}/login?message=${encodeURIComponent('Log in to choose a plan.')}&next=${encodeURIComponent(next)}`,
      303
    );
  }

  const stripe = getStripe();
  const priceId = getStripePriceId(plan);

  if (!stripe || !priceId) {
    return NextResponse.redirect(`${origin()}/account?error=${encodeURIComponent('Stripe not configured.')}`, 303);
  }

  try {
    const customerId = await ensureStripeCustomer(user);

    // Check existing subscription
    const existingSubId = user.app_metadata?.stripe_subscription_id as string | undefined;
    const existingStatus = user.app_metadata?.stripe_subscription_status as string | undefined;

    if (existingSubId && existingStatus && ['active', 'trialing'].includes(existingStatus)) {
      try {
        const existingSub = await stripe.subscriptions.retrieve(existingSubId);
        await stripe.subscriptions.update(existingSubId, {
          items: [{ id: existingSub.items.data[0]?.id, price: priceId }],
          proration_behavior: 'create_prorations',
          cancel_at_period_end: false,
        });
        const updatedSub = await stripe.subscriptions.retrieve(existingSubId);
        await syncSubscriptionToUser(user.id, updatedSub);
        return NextResponse.redirect(`${origin()}/account?message=${encodeURIComponent('Plan updated to Pro.')}`, 303);
      } catch {
        // Fall through to checkout
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      client_reference_id: user.id,
      locale: 'en',
      billing_address_collection: 'required',
      customer_update: { address: 'auto', name: 'auto' },
      automatic_tax: { enabled: true },
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin()}/account?message=${encodeURIComponent('Subscription activated.')}`,
      cancel_url: `${origin()}/account`,
      metadata: { supabase_user_id: user.id, plan, app: 'stormyy' },
      subscription_data: { metadata: { supabase_user_id: user.id, plan, app: 'stormyy' } },
      allow_promotion_codes: true,
    });

    if (!session.url) {
      return NextResponse.redirect(`${origin()}/account?error=${encodeURIComponent('Session unavailable.')}`, 303);
    }
    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create Stripe session.';
    return NextResponse.redirect(`${origin()}/account?error=${encodeURIComponent(message)}`, 303);
  }
}

export async function GET(req: NextRequest) {
  const plan = req.nextUrl.searchParams.get('plan') || null;
  return startCheckout(req, plan);
}

export async function POST(req: NextRequest) {
  let plan: string | null = null;
  try {
    const body = await req.json();
    plan = body?.plan || null;
  } catch {}
  return startCheckout(req, plan);
}
