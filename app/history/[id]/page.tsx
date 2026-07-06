import Link from 'next/link';
import { redirect } from 'next/navigation';
import NavBar from '@/components/NavBar';
import { getCurrentConfirmedUser } from '@/lib/supabase/server';
import { postgresPool } from '@/lib/pool';

export default async function HistoryDetailPage({ params }: { params: { id: string } }) {
  const user = await getCurrentConfirmedUser();
  if (!user) redirect('/login');

  const pool = postgresPool();
  let item: any = null;

  if (pool) {
    try {
      const res = await pool.query(
        `SELECT id, prompt, answer, created_at FROM stormyy.brainstorms WHERE id = $1 AND user_id = $2`,
        [params.id, user.id]
      );
      item = res.rows[0] || null;
    } catch {}
  }

  if (!item) {
    return (
      <>
        <NavBar />
        <main className="shell" style={{ textAlign: 'center', padding: '80px 0' }}>
          <h1 style={{ fontSize: '1.5rem' }}>Brainstorm not found</h1>
          <Link href="/history" className="btn" style={{ marginTop: 12 }}>Back to history</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main className="shell" style={{ padding: '24px 0 60px' }}>
        <Link href="/history" className="btn btn-sm" style={{ marginBottom: 16 }}>← Back</Link>
        <div className="panel" style={{ marginBottom: 16 }}>
          <p className="kicker" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Prompt</p>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{item.prompt}</p>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12 }}>{new Date(item.created_at).toLocaleString('en-US')}</p>
        </div>
        <div className="panel">
          <p className="kicker" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Fusion Answer</p>
          <pre className="answer" style={{ margin: 0 }}>{item.answer || 'No answer saved.'}</pre>
        </div>
      </main>
    </>
  );
}
