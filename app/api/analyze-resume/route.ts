import { NextResponse } from "next/server";
import OpenAI from "openai";

// --------------------------------------
// Runtime (force Node.js just in case) 
// --------------------------------------
export const runtime = "nodejs";

// --------------------------------------
// ENV + CONSTANTS
// --------------------------------------
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// GPT-5-mini (MUST NOT use json_object mode)
const MODEL = process.env.AI_MODEL || "gpt-5-mini";

// Rate limiter (in-memory)
const rateStore = new Map();
const MAX_PER_DAY = Number(process.env.RATE_LIMIT_MAX_PER_DAY || 5);
const COOLDOWN_SECONDS = Number(process.env.RATE_LIMIT_COOLDOWN_SECONDS || 30);

// --------------------------------------
// Helpers
// --------------------------------------
function getClientIp(req: Request) {
  const fwd = req.headers.get("x-forwarded-for");
  if (!fwd) return "unknown";
  return fwd.split(",")[0].trim();
}

function checkServerRateLimit(ip: string) {
  const now = Date.now();
  const entry = rateStore.get(ip) || {
    count: 0,
    lastTimestamp: 0,
    dayStart: now,
  };

  // Reset daily usage
  if (now - entry.dayStart > 24 * 60 * 60 * 1000) {
    entry.count = 0;
    entry.dayStart = now;
  }

  // Cooldown enforcement
  const secondsSinceLast = (now - entry.lastTimestamp) / 1000;
  if (secondsSinceLast < COOLDOWN_SECONDS) {
    return {
      ok: false,
      type: "cooldown",
      remaining: Math.ceil(COOLDOWN_SECONDS - secondsSinceLast),
    };
  }

  // Daily max enforcement
  if (entry.count >= MAX_PER_DAY) {
    return { ok: false, type: "daily_limit" };
  }

  return { ok: true, entry };
}

// --------------------------------------
// POST — Resume Analysis
// --------------------------------------
export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    // Parse incoming JSON
    let body;
    try {
      body = await req.json();
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { resumeText } = body;

    if (!resumeText || resumeText.trim().length < 30) {
      return NextResponse.json(
        { error: "Resume text is too short or missing" },
        { status: 400 }
      );
    }

    // Rate limit
    const rl = checkServerRateLimit(ip);
    if (!rl.ok) {
      if (rl.type === "cooldown") {
        return NextResponse.json(
          { error: "cooldown", remaining: rl.remaining },
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

    // --------------------------------------
    // Build prompt
    // --------------------------------------
    const prompt = `
You are an expert resume editor. Analyze the following resume text and produce a STRICT JSON object with keys:

- "summaryCritique": A concise 2–3 paragraph critique.
- "improvements": An array of 8–12 concrete improvement suggestions.
- "rewrittenSummary": A polished 2–3 sentence professional summary.

The output MUST be valid JSON only, no explanation or prose outside the JSON object.

Resume text:
${resumeText}
`;

    // --------------------------------------
    // Call OpenAI Responses API (GPT-5-mini)
    // ❗ NO json_object mode allowed
    // --------------------------------------
    const aiResult = await openai.responses.create({
      model: MODEL,
      input: prompt,
      // NO response_format here — gpt-5-mini does not support it
    });

    // Extract model output
    const outputText =
      aiResult.output_text ||
      aiResult.output?.[0]?.content?.[0]?.text;

    if (!outputText) {
      console.error("AI ERROR: Empty output", aiResult);
      return NextResponse.json(
        { error: "AI returned an empty response" },
        { status: 500 }
      );
    }

    // --------------------------------------
    // Attempt to parse JSON
    // GPT-5-mini may include extra whitespace or prose
    // --------------------------------------
    let parsed;
    try {
      // Try raw parse first
      parsed = JSON.parse(outputText);
    } catch (err) {
      // Try to extract final JSON from the text (if model added commentary)
      const jsonMatch = outputText.match(/\{[\s\S]*\}$/);
      if (!jsonMatch) {
        console.error("JSON PARSE FAIL:", outputText);
        return NextResponse.json(
          {
            error:
              "AI output was not valid JSON. Try using GPT-5.1 for structured output.",
            raw: outputText,
          },
          { status: 500 }
        );
      }

      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch (err2) {
        console.error("JSON PARSE FAIL 2:", outputText);
        return NextResponse.json(
          {
            error:
              "Failed to parse AI JSON output. GPT-5-mini may require switching to GPT-5.1.",
            raw: outputText,
          },
          { status: 500 }
        );
      }
    }

    // --------------------------------------
    // Save rate usage
    // --------------------------------------
    const { entry } = rl;
    entry.count++;
    entry.lastTimestamp = Date.now();
    rateStore.set(ip, entry);

    // --------------------------------------
    // Return response to UI
    // --------------------------------------
    return NextResponse.json(
      {
        ok: true,
        summaryCritique: parsed.summaryCritique,
        improvements: parsed.improvements,
        rewrittenSummary: parsed.rewrittenSummary,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("UNEXPECTED AI ROUTE ERROR:", JSON.stringify(err, null, 2));
    return NextResponse.json(
      { error: "Failed to analyze resume." },
      { status: 500 }
    );
  }
}
