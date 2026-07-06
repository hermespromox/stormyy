import Link from 'next/link';
import NavBar from '@/components/NavBar';

export const metadata = { title: 'Privacy Policy — Stormyy', description: 'Privacy Policy for Stormyy' };

export default function PrivacyPage() {
  return (
    <>
      <NavBar />
      <main className="shell legal-page">
        <div className="legal-layout">
          <nav className="legal-sidebar">
            <Link href="/legal" className="legal-nav-link">Legal Notice</Link>
            <Link href="/privacy" className="legal-nav-link active">Privacy Policy</Link>
            <Link href="/terms" className="legal-nav-link">Terms of Service</Link>
          </nav>
          <div className="legal-content panel">
            <h1>Privacy Policy</h1>
            <p className="legal-updated">Last updated: July 5, 2026</p>
            <p>This policy explains how THELI SAS collects, uses, and protects your personal data when you use <strong>stormyy.vercel.app</strong>. Established in accordance with the GDPR and applicable French regulations.</p>
            <h2>1. Data controller</h2>
            <div className="legal-box">
              <p><strong>THELI SAS</strong> — RCS Paris 940 357 981 — 8 Rue des Cloys, 75018 Paris — <a href="mailto:privacy@stormyy.vercel.app">privacy@stormyy.vercel.app</a></p>
            </div>
            <h2>2. Data collected</h2>
            <ul className="legal-list">
              <li><strong>Identity:</strong> Email address — account management — Contract performance</li>
              <li><strong>Payment:</strong> Stripe customer ID, invoices — subscription — Contract performance</li>
              <li><strong>Usage:</strong> Brainstorm prompts and answers — service delivery — Contract performance</li>
              <li><strong>Technical:</strong> Vercel logs — security — Legitimate interest</li>
            </ul>
            <h2>3. Subprocessors</h2>
            <ul className="legal-list">
              <li>Supabase Inc. — Auth & database (EU-hosted)</li>
              <li>Vercel Inc. — Hosting (US)</li>
              <li>Stripe Inc. — Payment processing</li>
              <li>OpenRouter — AI model API</li>
            </ul>
            <h2>4. Retention</h2>
            <ul className="legal-list">
              <li>Account: Duration of activity</li>
              <li>Brainstorm history: Duration of account</li>
              <li>Invoices: 10 years (legal requirement)</li>
              <li>Logs: Maximum 12 months</li>
            </ul>
            <h2>5. Account deletion</h2>
            <p>You can delete your account from your <Link href="/account">account page</Link>. This is irreversible. Cancel any active subscription first.</p>
            <h2>6. Your rights</h2>
            <p>Access, rectification, erasure, restriction, portability, objection. Write to <a href="mailto:privacy@stormyy.vercel.app">privacy@stormyy.vercel.app</a>. Response within 30 days. You may file a complaint with the <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">CNIL</a>.</p>
            <h2>7. No sale of data</h2>
            <p>THELI SAS does not sell, rent, or share personal data for commercial or advertising purposes.</p>
          </div>
        </div>
      </main>
    </>
  );
}
