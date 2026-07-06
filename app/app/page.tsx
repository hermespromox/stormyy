'use client';

import { FormEvent, useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import NavBar from '@/components/NavBar';

const starterPrompt = "We're a team of 20+ experienced developers. We want to build a tool and sell it to HubSpot within 2 months. HubSpot acquired a lot of companies lately. Suggest the top 5 products we could build, with reasoning.";

type SessionData = {
  loggedIn: boolean;
  confirmed: boolean;
  plan?: string;
  credits?: { plan: string; limit: number | null; used: number; remaining: number | null; unlimited: boolean } | null;
};

export default function BrainstormApp() {
  const [prompt, setPrompt] = useState(starterPrompt);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [session, setSession] = useState<SessionData | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/session').then(r => r.json()).then(setSession).catch(() => {});
  }, []);

  const wordCount = useMemo(() => prompt.trim().split(/\s+/).filter(Boolean).length, [prompt]);

  const credits = session?.credits;
  const limit = credits?.limit;
  const used = credits?.used ?? 0;
  const unlimited = credits?.unlimited;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setAnswer('');
    setSaved(false);

    try {
      const response = await fetch('/api/brainstorm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Stormyy failed to brainstorm.');
      setAnswer(data.answer || 'No answer returned.');
      setSaved(Boolean(data.saved));
      // Refresh credits
      fetch('/api/session').then(r => r.json()).then(setSession).catch(() => {});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  if (session && !session.loggedIn) {
    return (
      <>
        <NavBar />
        <main className="shell" style={{ textAlign: 'center', padding: '80px 0' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>Log in to brainstorm</h1>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>You need an account to use Stormyy.</p>
          <div className="actions">
            <Link href="/login" className="btn btn-primary">Log in</Link>
            <Link href="/signup" className="btn">Create account</Link>
          </div>
        </main>
      </>
    );
  }

  if (session && session.loggedIn && !session.confirmed) {
    return (
      <>
        <NavBar />
        <main className="shell" style={{ textAlign: 'center', padding: '80px 0' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>Confirm your email</h1>
          <p style={{ color: 'var(--muted)' }}>Check your inbox to activate your account.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main className="shell">
        <div className="workspace">
          <div className="panel input-panel">
            <div className="panel-heading">
              <div>
                <p className="kicker">Brainstorm prompt</p>
                <h1>Ask Stormyy</h1>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="counter">{wordCount} words</span>
                {!unlimited && limit !== null && limit !== undefined && (
                  <div className="credits-bar" style={{ marginTop: 4, justifyContent: 'flex-end' }}>
                    <span>{used} / {limit}</span>
                    <div className="bar"><span style={{ width: `${limit > 0 ? Math.min(100, (used / limit) * 100) : 0}%` }} /></div>
                  </div>
                )}
                {unlimited && <div className="credits-bar" style={{ justifyContent: 'flex-end' }}><span>∞ unlimited</span></div>}
              </div>
            </div>
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask a strategy, product, startup, market, or acquisition question..."
                minLength={8}
                required
                style={{ flex: 1 }}
              />
              <div className="form-row">
                <button className="btn btn-primary" type="submit" disabled={loading || prompt.trim().length < 8}>
                  {loading ? 'Storming...' : 'Run Fusion brainstorm'}
                </button>
                <button type="button" className="btn" onClick={() => { setPrompt(''); setAnswer(''); setError(''); }}>Clear</button>
              </div>
            </form>
          </div>

          <div className="panel output-panel">
            <div className="panel-heading">
              <div>
                <p className="kicker">Fusion answer</p>
                <h2>Result</h2>
              </div>
              {saved && <span style={{ fontSize: 13, color: 'var(--green)' }}>✓ Saved to history</span>}
            </div>
            <div className="output-area">
              {loading && <div className="loading">Fusion panel is thinking.<br/>This can take longer than a normal LLM call.</div>}
              {error && <div className="error-box">{error}</div>}
              {!loading && !error && !answer && <div className="empty">Your brainstorm will appear here.</div>}
              {answer && <pre className="answer">{answer}</pre>}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
