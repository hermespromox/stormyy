import { Pool } from 'pg';

export type BrainstormListItem = {
  id: string;
  prompt: string;
  created_at: string;
};

export type BrainstormDetail = BrainstormListItem & {
  answer: string | null;
};

function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ''), key };
}

async function stormyyFetch<T>(path: string, init: RequestInit = {}): Promise<T | null> {
  const config = supabaseConfig();
  if (!config) return null;
  const res = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      'Content-Type': 'application/json',
      'Accept-Profile': 'stormyy',
      'Content-Profile': 'stormyy',
      ...(init.headers || {}),
    },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  if (res.status === 204) return null;
  const text = await res.text();
  if (!text) return null;
  return JSON.parse(text) as T;
}

export async function ensureStormyySchema(pool: Pool | null) {
  if (!pool) return;
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

function normalizeListRow(row: any): BrainstormListItem {
  return {
    id: String(row.id),
    prompt: row.prompt || '',
    created_at: String(row.created_at),
  };
}

function normalizeDetailRow(row: any): BrainstormDetail {
  return {
    id: String(row.id),
    prompt: row.prompt || '',
    answer: row.answer || null,
    created_at: String(row.created_at),
  };
}

export async function countUserMonthlyBrainstorms(pool: Pool | null, userId: string): Promise<number> {
  if (pool) {
    try {
      await ensureStormyySchema(pool);
      const res = await pool.query(
        `SELECT count(*) as cnt FROM stormyy.brainstorms WHERE user_id = $1 AND created_at >= date_trunc('month', now())`,
        [userId]
      );
      return Number(res.rows[0]?.cnt) || 0;
    } catch {
      // fall through to REST
    }
  }

  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const rows = await stormyyFetch<Array<{ id: string }>>(
    `brainstorms?select=id&user_id=eq.${encodeURIComponent(userId)}&created_at=gte.${encodeURIComponent(firstOfMonth)}`
  );
  return Array.isArray(rows) ? rows.length : 0;
}

export async function saveBrainstorm(pool: Pool | null, userId: string, prompt: string, answer: string): Promise<string | null> {
  if (pool) {
    try {
      await ensureStormyySchema(pool);
      const res = await pool.query(
        `INSERT INTO stormyy.brainstorms (user_id, prompt, answer) VALUES ($1, $2, $3) RETURNING id`,
        [userId, prompt, answer]
      );
      return res.rows[0]?.id ? String(res.rows[0].id) : null;
    } catch {
      // fall through to REST
    }
  }

  const rows = await stormyyFetch<Array<{ id: string }>>('brainstorms', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ user_id: userId, prompt, answer }),
  });
  return Array.isArray(rows) && rows[0]?.id ? String(rows[0].id) : null;
}

export async function listBrainstorms(pool: Pool | null, userId: string, limit = 50): Promise<BrainstormListItem[]> {
  if (pool) {
    try {
      await ensureStormyySchema(pool);
      const res = await pool.query(
        `SELECT id, prompt, created_at FROM stormyy.brainstorms WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`,
        [userId, limit]
      );
      return res.rows.map(normalizeListRow);
    } catch {
      // fall through to REST
    }
  }

  const rows = await stormyyFetch<any[]>(
    `brainstorms?select=id,prompt,created_at&user_id=eq.${encodeURIComponent(userId)}&order=created_at.desc&limit=${limit}`
  );
  return Array.isArray(rows) ? rows.map(normalizeListRow) : [];
}

export async function getBrainstorm(pool: Pool | null, userId: string, id: string): Promise<BrainstormDetail | null> {
  if (pool) {
    try {
      await ensureStormyySchema(pool);
      const res = await pool.query(
        `SELECT id, prompt, answer, created_at FROM stormyy.brainstorms WHERE id = $1 AND user_id = $2`,
        [id, userId]
      );
      return res.rows[0] ? normalizeDetailRow(res.rows[0]) : null;
    } catch {
      // fall through to REST
    }
  }

  const rows = await stormyyFetch<any[]>(
    `brainstorms?select=id,prompt,answer,created_at&id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(userId)}&limit=1`
  );
  return Array.isArray(rows) && rows[0] ? normalizeDetailRow(rows[0]) : null;
}

export async function deleteBrainstorm(pool: Pool | null, userId: string, id: string): Promise<boolean> {
  if (pool) {
    try {
      await ensureStormyySchema(pool);
      await pool.query(`DELETE FROM stormyy.brainstorms WHERE id = $1 AND user_id = $2`, [id, userId]);
      return true;
    } catch {
      // fall through to REST
    }
  }

  await stormyyFetch(
    `brainstorms?id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(userId)}`,
    { method: 'DELETE', headers: { Prefer: 'return=minimal' } }
  );
  return true;
}
