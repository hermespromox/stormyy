import { NextRequest, NextResponse } from 'next/server';
import { getCurrentConfirmedUser } from '@/lib/supabase/server';
import { getStripe } from '@/lib/billing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentConfirmedUser();
  if (!user) return NextResponse.redirect('/login', 303);

  const stripe = getStripe();
  const customerId = user.app_metadata?.stripe_customer_id as string | undefined;
  if (!stripe || !customerId) return NextResponse.redirect('/account?error=No billing account found', 303);

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${(process.env.NEXT_PUBLIC_SITE_URL || 'https://stormyy.vercel.app').replace(/\/$/, '')}/account`,
  });

  return NextResponse.redirect(session.url, 303);
}
