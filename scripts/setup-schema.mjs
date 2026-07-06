import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
  ssl: { rejectUnauthorized: false }
});

const sql = `
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
`;

try {
  await pool.query(sql);
  console.log('✅ Stormyy schema created successfully!');
  
  // Verify
  const res = await pool.query('SELECT schemaname, tablename FROM pg_tables WHERE schemaname = $1', ['stormyy']);
  console.log('Tables in stormyy schema:', res.rows.map(r => r.tablename).join(', '));
} catch (err) {
  console.error('❌ Error:', err.message);
} finally {
  await pool.end();
}
