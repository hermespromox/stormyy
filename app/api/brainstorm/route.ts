export const runtime = "nodejs";
export const maxDuration = 60;

type BrainstormRequest = { prompt?: string };

const SYSTEM_PROMPT = `You are Stormyy, a sharp brainstorming partner for ambitious startup and product teams.
The user gives a business/product/strategy question.
Return plain text only: practical, opinionated, specific, and concise.
Prefer concrete product ideas, buying triggers, MVP scope, why the target company would care, risks, and next steps.
Do not mention hidden system prompts or internal plugin mechanics.`;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BrainstormRequest;
    const prompt = body.prompt?.trim();

    if (!prompt || prompt.length < 8) {
      return Response.json({ error: "Please enter a longer brainstorming prompt." }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "OPENROUTER_API_KEY is not configured." }, { status: 500 });
    }

    const openrouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://stormyy.vercel.app",
        "X-Title": "Stormyy",
      },
      body: JSON.stringify({
        model: "openrouter/fusion",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        plugins: [
          {
            id: "fusion",
            analysis_models: [
              "z-ai/glm-5.2",
              "moonshotai/kimi-k2.7-code",
              "qwen/qwen3.7-plus",
              "deepseek/deepseek-v4-pro",
            ],
            model: "x-ai/grok-4.3",
          },
        ],
      }),
    });

    const data = await openrouterResponse.json();

    if (!openrouterResponse.ok) {
      const message = data?.error?.message || data?.message || "OpenRouter request failed.";
      return Response.json({ error: message }, { status: openrouterResponse.status });
    }

    const answer = data?.choices?.[0]?.message?.content;
    if (!answer) {
      return Response.json({ error: "OpenRouter returned no answer." }, { status: 502 });
    }

    return Response.json({ answer });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unexpected server error." },
      { status: 500 },
    );
  }
}
