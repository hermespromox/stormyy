"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";

const starterPrompt = "We're a team of 20+ experienced developers. We want to build a tool and sell it to HubSpot within 2 months. HubSpot acquired a lot of companies lately. Suggest the top 5 products we could build, with reasoning.";

export default function BrainstormApp() {
  const [prompt, setPrompt] = useState(starterPrompt);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const wordCount = useMemo(() => prompt.trim().split(/\s+/).filter(Boolean).length, [prompt]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const response = await fetch("/api/brainstorm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Stormyy failed to brainstorm.");
      setAnswer(data.answer || "No answer returned.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app-shell">
      <nav className="nav app-nav">
        <Link href="/" className="brand"><span className="bolt">↯</span> Stormyy</Link>
        <div className="status-dot"><span /> Fusion ready</div>
      </nav>

      <section className="workspace">
        <div className="panel input-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Brainstorm prompt</p>
              <h1>Ask Stormyy</h1>
            </div>
            <div className="counter">{wordCount} words</div>
          </div>

          <form onSubmit={submit}>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Ask a strategy, product, startup, market, or acquisition question..."
              minLength={8}
              required
            />
            <div className="form-row">
              <button className="primary" disabled={loading || prompt.trim().length < 8}>
                {loading ? "Storming..." : "Run Fusion brainstorm"}
              </button>
              <button type="button" className="secondary" onClick={() => setPrompt("")}>Clear</button>
            </div>
          </form>
        </div>

        <div className="panel output-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Plain-text answer</p>
              <h2>Result</h2>
            </div>
          </div>

          {loading && <div className="loading">Fusion panel is thinking. This can take a little longer than a normal LLM call.</div>}
          {error && <div className="error">{error}</div>}
          {!loading && !error && !answer && <div className="empty">Your brainstorm will appear here.</div>}
          {answer && <pre className="answer">{answer}</pre>}
        </div>
      </section>
    </main>
  );
}
