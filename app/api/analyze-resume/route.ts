import { NextResponse } from "next/server";
import OpenAI from "openai";

// -------------------------------
// ENV + CONSTS
// -------------------------------
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.AI_MODEL || "gpt-5.1-mini";

// Server-side in-memory rate limiter (per IP)
const rateStore = new Map();

// 5 / day & 30s cooldown defaults
const MAX_PER_DAY = Number(process.env.RATE_LIMIT_MAX_PER_DAY || 5);
const COOLDOWN_SECONDS = Number(process.env.RATE_LIMIT_COOLDOWN_SECONDS || 30);

// -------------------------------
// Helper: Get client IP
// -------------------------------
function getClientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (!forwarded) return "unknown";
  return forwarded.split(",")[0].trim();
}

// -------------------------------
// Helper: Server-side rate limit
// -------------------------------
function checkServerRateLimit(ip: string) {
  const now = Date.now();
  const entry = rateStore.get(ip) || {
    count: 0,
    lastTimestamp: 0,
    dayStart: now,
  };

  // Reset daily counter if >24h
  if (now - entry.dayStart > 24 * 60 * 60 * 1000) {
    entry.count = 0;
    entry.dayStart = now;
  }

  // Enforce cooldown
  const secondsSinceLast = (now - entry.lastTimestamp) / 1000;
  if (secondsSinceLast < COOLDOWN_SECONDS) {
    return {
      ok: false,
      type: "cooldown",
      remaining: Math.ceil(COOLDOWN_SECONDS - secondsSinceLast),
    };
  }

  // Enforce daily max
  if (entry.count >= MAX_PER_DAY) {
    return {
      ok: false,
      type: "daily_limit",
    };
  }

  return { ok: true, entry };
}

// -------------------------------
// POST
// -------------------------------
export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    // Parse inbound request JSON
    let body;
    try {
      body = await req.json();
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid JSON body." },
        { status: 400 }
      );
    }

    const { resumeText } = body;

    if (!resumeText || resumeText.trim().length < 30) {
      return NextResponse.json(
        { error: "Resume text is too short or missing." },
        { status: 400 }
      );
    }

    // Rate limiting check
    const rl = checkServerRateLimit(ip);
    if (!rl.ok) {
      if (rl.type === "cooldown") {
        return NextResponse.json(
          {
            error: "cooldown",
            remaining: rl.remaining,
          },
          { status: 429 }
        );
      }
      if (rl.type === "daily_limit") {
        return NextResponse.json(
          { error: "daily_limit" },
          { status: 429 }
        );
      }
    }

    // -------------------------------
    // Construct analysis prompt
    // -------------------------------
    const prompt = `
You are an expert resume editor. Analyze the following resume text and produce a JSON object with:

1. "summaryCritique": A concise 2–3 paragraph critique.
2. "improvements": An array of 8–12 specific improvement suggestions.
3. "rewrittenSummary": A polished 2–3 sentence professional summary.

Do NOT invent details not present in the text.
Do NOT comment on visual formatting (you only see plain text).

Resume text:
${resumeText}
`;

    // -------------------------------
    // OpenAI Responses API (GPT-5.1-mini)
    // -------------------------------
    const aiResult = await openai.responses.create({
      model: MODEL,
      input: prompt,
      response_format: { type: "json_object" },
    });

    // Extract output text from Responses API
    const outputText =
      aiResult.output_text || aiResult.output?.[0]?.content?.[0]?.text;

    if (!outputText) {
      console.error("AI ERROR: Empty output from model", aiResult);
      return NextResponse.json(
        { error: "AI returned an empty response." },
        { status: 500 }
      );
    }

    // Parse JSON
    let parsed;
    try {
      parsed = JSON.parse(outputText);
    } catch (err) {
      console.error("AI JSON PARSE ERROR:", outputText);
      return NextResponse.json(
        { error: "Failed to parse AI output." },
        { status: 500 }
      );
    }

    // -------------------------------
    // Save rate limit usage
    // -------------------------------
    const { entry } = rl;
    entry.count++;
    entry.lastTimestamp = Date.now();
    rateStore.set(ip, entry);

    // -------------------------------
    // Return response
    // -------------------------------
    return NextResponse.json(
      {
        ok: true,
        summaryCritique: parsed.summaryCritique,
        improvements: parsed.improvements,
        rewrittenSummary: parsed.rewrittenSummary,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("UNEXPECTED AI ROUTE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to analyze resume." },
      { status: 500 }
    );
  }
}
