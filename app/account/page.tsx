'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import { logoutAction } from '@/app/auth/actions';

type SessionData = {
  loggedIn: boolean;
  confirmed: boolean;
  email?: string;
  plan?: string;
  credits?: { plan: string; limit: number | null; used: number; remaining: number | null; unlimited: boolean } | null;
};

export default function AccountPage() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => { fetch('/api/session').then(r => r.json()).then(setSession).catch(() => {}); }, []);

  if (!session) return <><NavBar /><main className="shell" style={{ padding: 40 }}><p style={{ color: 'var(--muted)' }}>Loading...</p></main></>;
  if (!session.loggedIn) return <><NavBar /><main className="shell" style={{ textAlign: 'center', padding: 80 }}><h1>Log in</h1><Link href="/login" className="btn btn-primary" style={{ marginTop: 12 }}>Log in</Link></main></>;

  const plan = session.plan || 'free';
  const credits = session.credits;
  const email = session.email || '';
  const isPro = plan === 'pro';
  const isStaff = plan === 'staff';

  async function handleCancel() {
    setCancelling(true);
    try {
      await fetch('/api/stripe/cancel', { method: 'POST' });
      fetch('/api/session').then(r => r.json()).then(setSession);
    } catch {}
    setCancelling(false);
  }

  async function handleDelete() {
    if (deleteConfirm !== 'DELETE') return;
    setDeleting(true);
    try {
      const res = await fetch('/api/account/delete', { method: 'POST' });
      if (res.ok) window.location.href = '/';
    } catch {}
    setDeleting(false);
  }

  return (
    <>
      <NavBar />
      <main className="shell" style={{ padding: '24px 0 60px' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: 20 }}>Account</h1>

        <div className="account-grid">
          <div className="account-card">
            <h3>Profile</h3>
            <div className="stat"><span>Email</span><strong>{email}</strong></div>
            <div className="stat"><span>Plan</span><span className={`plan-badge ${plan}`}>{plan}</span></div>
            <div className="stat"><span>Member since</span><strong>{new Date().getFullYear()}</strong></div>
          </div>

          <div className="account-card">
            <h3>Usage</h3>
            {credits?.unlimited ? (
              <div className="stat"><span>Brainstorms</span><strong>∞ Unlimited</strong></div>
            ) : (
              <>
                <div className="stat"><span>Used this month</span><strong>{credits?.used ?? 0}</strong></div>
                <div className="stat"><span>Monthly limit</span><strong>{credits?.limit ?? '—'}</strong></div>
                <div className="stat"><span>Remaining</span><strong>{credits?.remaining ?? 0}</strong></div>
              </>
            )}
          </div>

          <div className="account-card">
            <h3>Subscription</h3>
            {isStaff ? (
              <p style={{ color: 'var(--muted)' }}>Staff account — unlimited access.</p>
            ) : isPro ? (
              <>
                <p style={{ marginBottom: 12, color: 'var(--green)', fontWeight: 600 }}>✓ Pro plan active</p>
                <button className="btn btn-danger btn-sm" onClick={handleCancel} disabled={cancelling}>
                  {cancelling ? 'Cancelling...' : 'Cancel subscription'}
                </button>
                <Link href="/api/stripe/portal" className="btn btn-sm" style={{ marginTop: 8 }}>Billing portal</Link>
              </>
            ) : (
              <>
                <p style={{ marginBottom: 12, color: 'var(--muted)' }}>Free plan — 5 brainstorms/month</p>
                <Link href="/api/stripe/checkout?plan=pro" className="btn btn-primary btn-sm">Upgrade to Pro — €29/mo HT</Link>
              </>
            )}
          </div>

          <div className="account-card">
            <h3>Quick Links</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              <Link href="/app" className="btn btn-sm">Brainstorm</Link>
              <Link href="/history" className="btn btn-sm">History</Link>
              <Link href="/legal" className="btn btn-sm">Legal Notice</Link>
              <Link href="/privacy" className="btn btn-sm">Privacy Policy</Link>
              <Link href="/terms" className="btn btn-sm">Terms of Service</Link>
            </div>
          </div>

          <div className="account-card" style={{ borderColor: 'var(--red)' }}>
            <h3 style={{ color: 'var(--red)' }}>Danger Zone</h3>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 12 }}>Permanently delete your account and all data. This cannot be undone.</p>
            <input
              type="text"
              placeholder="Type DELETE to confirm"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 8, marginBottom: 8, outline: 'none' }}
            />
            <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={deleteConfirm !== 'DELETE' || deleting}>
              {deleting ? 'Deleting...' : 'Delete account'}
            </button>
          </div>

          <div className="account-card">
            <h3>Log out</h3>
            <form action={logoutAction} method="post">
              <button className="btn btn-sm" type="submit">Log out</button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
