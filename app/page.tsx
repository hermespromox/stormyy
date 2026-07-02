import Link from "next/link";

const examples = [
  "What could a senior dev team build in 2 months that HubSpot might acquire?",
  "Find 5 B2B SaaS ideas for revenue ops teams with clear MVP scope.",
  "Brainstorm AI workflow tools for agencies that can reach $20k MRR fast.",
];

export default function Home() {
  return (
    <main className="page-shell">
      <nav className="nav">
        <div className="brand"><span className="bolt">↯</span> Stormyy</div>
        <Link href="/app" className="nav-cta">Open app</Link>
      </nav>

      <section className="hero">
        <div className="eyebrow">OpenRouter Fusion brainstorming</div>
        <h1>Turn rough startup questions into sharper strategic options.</h1>
        <p className="hero-copy">
          Stormyy runs your prompt through a multi-model Fusion panel and returns a clean answer you can use for product strategy, acquisition theses, MVP planning, and market bets.
        </p>
        <div className="actions">
          <Link href="/app" className="primary">Start brainstorming</Link>
          <a href="#how" className="secondary">How it works</a>
        </div>
      </section>

      <section className="cards" id="how">
        <div className="card">
          <span>01</span>
          <h3>Ask naturally</h3>
          <p>Paste a messy founder, investor, or product question. No rigid form required.</p>
        </div>
        <div className="card">
          <span>02</span>
          <h3>Fusion deliberates</h3>
          <p>Several models analyze the same prompt, then a judge model synthesizes the strongest answer.</p>
        </div>
        <div className="card">
          <span>03</span>
          <h3>Move faster</h3>
          <p>Get plain-text ideas, tradeoffs, and recommendations without opening ten tabs.</p>
        </div>
      </section>

      <section className="examples">
        <h2>Try prompts like:</h2>
        <div className="example-list">
          {examples.map((item) => <div className="example" key={item}>{item}</div>)}
        </div>
      </section>
    </main>
  );
}
