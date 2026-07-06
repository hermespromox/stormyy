import Link from 'next/link';
import { redirect } from 'next/navigation';
import NavBar from '@/components/NavBar';
import { getCurrentConfirmedUser } from '@/lib/supabase/server';
import { postgresPool } from '@/lib/pool';
import { ensureStormyySchema } from '@/lib/credits';

export default async function HistoryPage() {
  const user = await getCurrentConfirmedUser();
  if (!user) redirect('/login');

  const pool = postgresPool();
  let items: any[] = [];

  if (pool) {
    try {
      await ensureStormyySchema(pool);
      const res = await pool.query(
        `SELECT id, prompt, created_at FROM stormyy.brainstorms WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
        [user.id]
      );
      items = res.rows;
    } catch {}
  }

  return (
    <>
      <NavBar />
      <main className="shell" style={{ padding: '24px 0 60px' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: 20 }}>Brainstorm History</h1>
        {items.length === 0 ? (
          <div className="empty" style={{ padding: 40, textAlign: 'center', border: '1px dashed var(--line)', borderRadius: 'var(--radius)' }}>
            <p style={{ color: 'var(--muted)' }}>No brainstorms yet.</p>
            <Link href="/app" className="btn btn-primary" style={{ marginTop: 12 }}>Start brainstorming</Link>
          </div>
        ) : (
          <div className="history-list">
            {items.map((item) => (
              <Link href={`/history/${item.id}`} key={item.id} className="history-item">
                <span className="preview">{item.prompt?.slice(0, 100)}{item.prompt?.length > 100 ? '...' : ''}</span>
                <span className="date">{new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
