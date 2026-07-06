'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

type Session = {
  loggedIn: boolean;
  confirmed: boolean;
  email?: string;
  plan?: string;
  credits?: { plan: string; limit: number | null; used: number; remaining: number | null; unlimited: boolean } | null;
};

export default function NavBar() {
  const [session, setSession] = useState<Session | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/session').then(r => r.json()).then(setSession).catch(() => {});
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const loggedIn = session?.loggedIn && session?.confirmed;
  const email = session?.email || '';
  const plan = session?.plan || 'free';
  const initial = email ? email[0].toUpperCase() : '?';

  return (
    <nav className="nav">
      <div className="shell nav-inner">
        <Link href="/" className="brand"><span className="bolt">↯</span> Stormyy</Link>
        <div className="nav-links">
          <Link href="/app">Open App</Link>
          <Link href="/#pricing">Pricing</Link>
          <Link href="/#how">How it works</Link>
        </div>
        {!loggedIn && (
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/login" className="btn btn-sm">Log in</Link>
            <Link href="/signup" className="btn btn-sm btn-primary">Get started</Link>
          </div>
        )}
        {loggedIn && (
          <div className="nav-user" ref={ref}>
            <div className="nav-avatar" onClick={() => setOpen(!open)}>
              <div className="avatar-circle">{initial}</div>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{email.split('@')[0]}</span>
              <span className={`plan-badge ${plan}`}>{plan}</span>
            </div>
            {open && (
              <div className="dropdown">
                <Link href="/app">Brainstorm</Link>
                <Link href="/history">History</Link>
                <Link href="/account">Account</Link>
                <Link href="/legal">Legal</Link>
                <form action="/auth/actions" method="post">
                  <input type="hidden" name="action" value="logout" />
                  <button type="submit" style={{ width: '100%', textAlign: 'left', background: 'none', border: 0, padding: '10px 16px', fontSize: 14, cursor: 'pointer' }}>Log out</button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
