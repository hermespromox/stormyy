import { NextRequest, NextResponse } from 'next/server';
import { getCurrentConfirmedUser } from '@/lib/supabase/server';
import { getStripe, syncSubscriptionToUser } from '@/lib/billing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  const user = await getCurrentConfirmedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const stripe = getStripe();
  const subId = user.app_metadata?.stripe_subscription_id as string | undefined;
  if (!stripe || !subId) return NextResponse.json({ error: 'No active subscription' }, { status: 400 });

  try {
    const sub = await stripe.subscriptions.update(subId, { cancel_at_period_end: true });
    await syncSubscriptionToUser(user.id, sub);
    return NextResponse.json({ cancelled: true, currentPeriodEnd: sub.items?.data?.[0]?.current_period_end });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to cancel';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
