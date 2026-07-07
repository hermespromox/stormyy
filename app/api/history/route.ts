import { NextResponse } from 'next/server';
import { getCurrentConfirmedUser } from '@/lib/supabase/server';
import { postgresPool } from '@/lib/pool';
import { listBrainstorms } from '@/lib/credits';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentConfirmedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const pool = postgresPool();
  const items = await listBrainstorms(pool, user.id, 50);
  return NextResponse.json({
    items: items.map((r) => ({
      id: r.id,
      prompt: r.prompt?.slice(0, 120),
      created_at: r.created_at,
    })),
  });
}
