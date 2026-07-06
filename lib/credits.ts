import { Pool } from 'pg';

export async function ensureStormyySchema(pool: Pool) {
  await pool.query(`
    CREATE SCHEMA IF NOT EXISTS stormyy;
    CREATE TABLE IF NOT EXISTS stormyy.brainstorms (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
      prompt text NOT NULL,
      answer text,
      models jsonb,
      created_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS stormyy_brainstorms_user_id_idx
      ON stormyy.brainstorms(user_id);
    CREATE INDEX IF NOT EXISTS stormyy_brainstorms_created_at_idx
      ON stormyy.brainstorms(created_at DESC);
  `);
}

export async function countUserMonthlyBrainstorms(pool: Pool, userId: string): Promise<number> {
  try {
    await ensureStormyySchema(pool);
    const res = await pool.query(
      `SELECT count(*) as cnt FROM stormyy.brainstorms WHERE user_id = $1 AND created_at >= date_trunc('month', now())`,
      [userId]
    );
    return Number(res.rows[0]?.cnt) || 0;
  } catch {
    return 0;
  }
}
