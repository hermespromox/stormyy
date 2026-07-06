import Link from 'next/link';
import NavBar from '@/components/NavBar';

export const metadata = { title: 'Legal Notice — Stormyy', description: 'Legal information for Stormyy' };

export default function LegalPage() {
  return (
    <>
      <NavBar />
      <main className="shell legal-page">
        <div className="legal-layout">
          <nav className="legal-sidebar">
            <Link href="/legal" className="legal-nav-link active">Legal Notice</Link>
            <Link href="/privacy" className="legal-nav-link">Privacy Policy</Link>
            <Link href="/terms" className="legal-nav-link">Terms of Service</Link>
          </nav>
          <div className="legal-content panel">
            <h1>Legal Notice</h1>
            <p className="legal-updated">Last updated: July 5, 2026</p>
            <p>In accordance with the French law n°2004-575 of June 21, 2004 (LCEN), the legal information for <strong>stormyy.vercel.app</strong> is as follows.</p>
            <h2>1. Publisher</h2>
            <ul className="legal-list">
              <li><strong>Company:</strong> THELI SAS</li>
              <li><strong>Legal form:</strong> Simplified Joint Stock Company (SAS)</li>
              <li><strong>Share capital:</strong> €1,000</li>
              <li><strong>RCS:</strong> Paris 940 357 981</li>
              <li><strong>SIRET:</strong> 940 357 981 00015</li>
              <li><strong>VAT:</strong> FR63 940 357 981</li>
              <li><strong>Registered office:</strong> 8 Rue des Cloys, 75018 Paris, France</li>
              <li><strong>Email:</strong> contact@stormyy.vercel.app / privacy@stormyy.vercel.app</li>
              <li><strong>Publication director:</strong> Hassine ACHOUR</li>
            </ul>
            <h2>2. Hosting provider</h2>
            <p>Vercel Inc. — 440 N Barranca Ave #4133, Covina CA 91723, United States. <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a></p>
            <h2>3. Intellectual property</h2>
            <p>All content on <strong>stormyy.vercel.app</strong> is protected by copyright and intellectual property law. Any reproduction without prior authorization is prohibited.</p>
            <h2>4. Personal data</h2>
            <p>See our <Link href="/privacy">Privacy Policy</Link>. GDPR compliant. Cookies strictly necessary only.</p>
            <h2>5. Liability</h2>
            <p>Stormyy is a decision-support tool. It does not provide certified business, legal, or investment advice. AI-generated content may be incomplete or inaccurate. Users should verify critical decisions with experts.</p>
            <h2>6. Cookies</h2>
            <p>Only strictly necessary cookies are used: Supabase session (auth). No profiling or advertising cookies.</p>
            <h2>7. Applicable law</h2>
            <p>Subject to French law. Disputes fall under the jurisdiction of the competent French courts.</p>
          </div>
        </div>
      </main>
    </>
  );
}
