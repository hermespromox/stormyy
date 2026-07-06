import { NextResponse } from 'next/server';
import { getCurrentConfirmedUser } from '@/lib/supabase/server';
import { postgresPool } from '@/lib/pool';
import { ensureStormyySchema } from '@/lib/credits';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentConfirmedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const pool = postgresPool();
  if (!pool) return NextResponse.json({ items: [] });

  try {
    await ensureStormyySchema(pool);
    const res = await pool.query(
      `SELECT id, prompt, created_at FROM stormyy.brainstorms WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [user.id]
    );
    return NextResponse.json({
      items: res.rows.map((r: any) => ({
        id: r.id,
        prompt: r.prompt?.slice(0, 120),
        created_at: r.created_at,
      })),
    });
  } catch (err) {
    return NextResponse.json({ items: [] });
  }
}
