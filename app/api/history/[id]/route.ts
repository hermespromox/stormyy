import { NextResponse } from 'next/server';
import { getCurrentConfirmedUser } from '@/lib/supabase/server';
import { postgresPool } from '@/lib/pool';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentConfirmedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const pool = postgresPool();
  if (!pool) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });

  try {
    const res = await pool.query(
      `SELECT id, prompt, answer, created_at FROM stormyy.brainstorms WHERE id = $1 AND user_id = $2`,
      [params.id, user.id]
    );
    if (res.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(res.rows[0]);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentConfirmedUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const pool = postgresPool();
  if (!pool) return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });

  try {
    await pool.query(`DELETE FROM stormyy.brainstorms WHERE id = $1 AND user_id = $2`, [params.id, user.id]);
    return NextResponse.json({ deleted: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
