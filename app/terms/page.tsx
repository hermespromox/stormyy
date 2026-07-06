import Link from 'next/link';
import NavBar from '@/components/NavBar';

export const metadata = { title: 'Terms of Service — Stormyy', description: 'Terms of Use and Sale for Stormyy' };

export default function TermsPage() {
  return (
    <>
      <NavBar />
      <main className="shell legal-page">
        <div className="legal-layout">
          <nav className="legal-sidebar">
            <Link href="/legal" className="legal-nav-link">Legal Notice</Link>
            <Link href="/privacy" className="legal-nav-link">Privacy Policy</Link>
            <Link href="/terms" className="legal-nav-link active">Terms of Service</Link>
          </nav>
          <div className="legal-content panel">
            <h1>Terms of Service</h1>
            <p className="legal-updated">Last updated: July 5, 2026</p>
            <p>By using Stormyy, you accept these terms. Stormyy is developed by <strong>THELI SAS</strong>, 8 Rue des Cloys, 75018 Paris. SIRET: 940 357 981 00015. VAT: FR63 940 357 981.</p>

            <h2>Terms of Use</h2>
            <h3>1. Service</h3>
            <p>Stormyy is a multi-model AI brainstorming tool. It runs user prompts through OpenRouter Fusion and returns synthesized answers for strategy, product, and startup decisions.</p>
            <h3>2. Access</h3>
            <p>Free tier: 5 brainstorms/month. Pro tier: 100 brainstorms/month (€29/mo HT). Requires a registered account with email confirmation.</p>
            <h3>3. Use</h3>
            <p>AI-generated content may be incomplete, inaccurate, or biased. Stormyy is a decision-support tool, not a substitute for professional advice. Unauthorized mass extraction or resale of data is prohibited.</p>
            <h3>4. Intellectual property</h3>
            <p>All platform content remains the property of THELI SAS. Underlying AI model outputs are subject to OpenRouter&apos;s terms.</p>
            <h3>5. Availability</h3>
            <p>Service may be interrupted for technical reasons or API availability. No guarantee of uptime.</p>

            <h2>General Terms of Sale</h2>
            <h3>1. Plans</h3>
            <div className="legal-table-wrap">
              <table className="legal-table">
                <thead><tr><th>Plan</th><th>Price (ex-VAT)</th><th>Includes</th></tr></thead>
                <tbody>
                  <tr><td>Free</td><td>€0/mo</td><td>5 brainstorms/month</td></tr>
                  <tr><td>Pro</td><td>€29/mo</td><td>100 brainstorms/month, priority processing</td></tr>
                </tbody>
              </table>
            </div>
            <p>VAT calculated by Stripe. Payment via Stripe. Access activated immediately after payment.</p>
            <h3>2. Renewal & cancellation</h3>
            <p>Monthly auto-renew. Cancel anytime via <Link href="/account">account page</Link>. Takes effect at end of billing period.</p>
            <h3>3. Refunds</h3>
            <p>No refunds for billed periods, except billing errors at THELI SAS discretion.</p>
            <h3>4. Applicable law</h3>
            <p>Governed by French law. Disputes: amicable resolution within 30 days, otherwise Commercial Court of Paris.</p>
          </div>
        </div>
      </main>
    </>
  );
}
