import Link from "next/link";
import NavBar from "@/components/NavBar";

const examples = [
  "What could a senior dev team build in 2 months that HubSpot might acquire?",
  "Find 5 B2B SaaS ideas for revenue ops teams with clear MVP scope.",
  "Brainstorm AI workflow tools for agencies that can reach $20k MRR fast.",
  "What are 3 underrated acquisition targets for a fintech in 2026?",
];

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="shell">
        <section className="hero">
          <span className="eyebrow">OpenRouter Fusion brainstorming</span>
          <h1>Turn rough startup questions into sharper strategic options.</h1>
          <p className="hero-copy">
            Stormyy runs your prompt through a multi-model Fusion panel and returns a clean answer
            for product strategy, acquisition theses, MVP planning, and market bets.
          </p>
          <div className="actions">
            <Link href="/app" className="btn btn-primary">Start brainstorming</Link>
            <Link href="/#how" className="btn">How it works</Link>
          </div>
        </section>

        <section className="steps" id="how">
          <div className="card">
            <span className="card-num">01</span>
            <h3>Ask naturally</h3>
            <p>Paste a messy founder, investor, or product question. No rigid form required.</p>
          </div>
          <div className="card">
            <span className="card-num">02</span>
            <h3>Fusion deliberates</h3>
            <p>Several models analyze the same prompt, then a judge model synthesizes the strongest answer.</p>
          </div>
          <div className="card">
            <span className="card-num">03</span>
            <h3>Move faster</h3>
            <p>Get plain-text ideas, tradeoffs, and recommendations without opening ten tabs.</p>
          </div>
        </section>

        <section className="examples">
          <h2>Try prompts like:</h2>
          <div className="example-list">
            {examples.map((item) => (
              <div className="example" key={item}>{item}</div>
            ))}
          </div>
        </section>

        <section className="pricing" id="pricing">
          <h2 style={{ fontSize: '1.5rem', marginBottom: 4 }}>Pricing</h2>
          <p style={{ color: 'var(--muted)' }}>Start free. Upgrade when you need more.</p>
          <div className="pricing-grid">
            <div className="tier">
              <div className="tier-name">Free</div>
              <div className="tier-price">€0<small>/mo</small></div>
              <p className="tier-desc">For trying out Stormyy</p>
              <ul className="tier-features">
                <li>5 brainstorms per month</li>
                <li>Fusion multi-model analysis</li>
                <li>Saved history</li>
                <li>Full answer output</li>
              </ul>
              <Link href="/signup" className="btn">Get started</Link>
            </div>
            <div className="tier tier-popular">
              <div className="tier-name">Pro</div>
              <div className="tier-price">€29<small>/mo HT</small></div>
              <p className="tier-desc">For teams that brainstorm regularly</p>
              <ul className="tier-features">
                <li>100 brainstorms per month</li>
                <li>Fusion multi-model analysis</li>
                <li>Saved history</li>
                <li>Priority processing</li>
                <li>Email support</li>
              </ul>
              <Link href="/api/stripe/checkout?plan=pro" className="btn btn-primary">Get Pro</Link>
            </div>
          </div>
        </section>

        <section style={{ padding: '20px 0 40px' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--muted)', margin: 0 }}>
              Stormyy is a decision-support tool. It does not provide certified business, legal, or investment advice.
              AI-generated content may be incomplete or inaccurate. Verify critical decisions with experts.
            </p>
            <p style={{ marginTop: 12 }}>
              <Link href="/legal">Legal Notice</Link> · <Link href="/privacy">Privacy Policy</Link> · <Link href="/terms">Terms of Service</Link>
            </p>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-grid">
            <div className="footer-brand">
              <strong>↯ Stormyy</strong>
              <p>Multi-model AI brainstorming for ambitious teams. Powered by OpenRouter Fusion.</p>
              <p style={{ marginTop: 8, fontSize: 12 }}>THELI SAS — RCS Paris 940 357 981 · 8 Rue des Cloys, 75018 Paris</p>
            </div>
            <div className="footer-cols">
              <div className="footer-col">
                <span>Product</span>
                <Link href="/app">Open App</Link>
                <Link href="/#pricing">Pricing</Link>
                <Link href="/#how">How it works</Link>
              </div>
              <div className="footer-col">
                <span>Account</span>
                <Link href="/login">Log in</Link>
                <Link href="/signup">Create account</Link>
                <Link href="/account">My account</Link>
              </div>
              <div className="footer-col">
                <span>Legal</span>
                <Link href="/legal">Legal Notice</Link>
                <Link href="/privacy">Privacy Policy</Link>
                <Link href="/terms">Terms of Service</Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
