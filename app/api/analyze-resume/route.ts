import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

// ----------------------------------------------------
// OpenAI Client
// ----------------------------------------------------
let client: OpenAI | null = null;

function getClient() {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });
  }
  return client;
}

const MODEL = process.env.OPENAI_MODEL || "gpt-5-mini";

// ----------------------------------------------------
// Bullet normalization
// ----------------------------------------------------
function normalizeBullets(text: string): string {
  return text
    .replace(/^[\u2022\u25E6\u25AA\u2023\u2043●▪•]+/gm, "- ")
    .replace(/^\s*[•●▪]/gm, "- ")
    .replace(/^\s*[-–—]\s*/gm, "- ")
    .replace(
      /^\s*(Implemented|Led|Managed|Created|Developed|Built|Designed|Refactored|Enhanced|Optimized|Architected|Spearheaded|Coordinated|Maintained|Improved|Increased|Reduced|Collaborated|Solved|Trained|Mentored|Automated)\b/gm,
      "- $1"
    )
    .replace(/^- -/gm, "- ")
    .replace(/-\s+/g, "- ")
    .trim();
}

// ----------------------------------------------------
// Rate limiting
// ----------------------------------------------------
type RateEntry = {
  count: number;
  lastTimestamp: number;
  dayStart: number;
};

type RateLimitResult =
  | { ok: true; entry: RateEntry }
  | { ok: false; reason: "cooldown"; remaining: number }
  | { ok: false; reason: "daily_limit" };

const rateStore = new Map<string, RateEntry>();

const MAX_PER_DAY = Number(process.env.RATE_LIMIT_MAX_PER_DAY || 5);
const COOLDOWN_SECONDS = Number(
  process.env.RATE_LIMIT_COOLDOWN_SECONDS || 30
);

function getClientIp(req: Request) {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd ? fwd.split(",")[0].trim() : "unknown";
}

function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const entry =
    rateStore.get(ip) ||
    ({
      count: 0,
      lastTimestamp: 0,
      dayStart: now,
    } as RateEntry);

  // Reset daily window
  if (now - entry.dayStart > 24 * 60 * 60 * 1000) {
    entry.count = 0;
    entry.dayStart = now;
  }

  // Cooldown
  const sinceLast = (now - entry.lastTimestamp) / 1000;
  if (sinceLast < COOLDOWN_SECONDS) {
    return {
      ok: false,
      reason: "cooldown",
      remaining: Math.ceil(COOLDOWN_SECONDS - sinceLast),
    };
  }

  // Daily limit
  if (entry.count >= MAX_PER_DAY) {
    return { ok: false, reason: "daily_limit" };
  }

  return { ok: true, entry };
}

// ----------------------------------------------------
// JSON extraction helper
// ----------------------------------------------------
function safeExtractJson(text: string): any | null {
  try {
    const match = text.match(/```json([\s\S]*?)```/i);
    const raw = match ? match[1].trim() : text.trim();
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ----------------------------------------------------
// POST Handler
// ----------------------------------------------------
export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const body = await req.json().catch(() => null);

    const resumeText = body?.resumeText as string | undefined;
    if (!resumeText || resumeText.trim().length < 30) {
      return NextResponse.json(
        { error: "Resume text is too short or missing" },
        { status: 400 }
      );
    }

    // Rate limit enforcement
    const rl = checkRateLimit(ip);
    if (!rl.ok) {
      if (rl.reason === "cooldown") {
        return NextResponse.json(
          { error: "cooldown", remaining: rl.remaining },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: "daily_limit" },
        { status: 429 }
      );
    }

    const cleaned = normalizeBullets(resumeText);

    const systemPrompt = `
You are a resume evaluation engine. Always return STRICT JSON ONLY — no prose.
The JSON must follow EXACTLY this structure:

{
  "summaryCritique": "string",
  "improvements": ["string"],
  "rewrittenSummary": "string"
}

Your job:
- Evaluate the resume
- Suggest improvements
- Rewrite the summary to be more effective
`.trim();

    const userPrompt = `
Analyze the following resume content and return JSON exactly matching the required schema.

Resume:
${cleaned}
    `.trim();

    // ----------------------------------------------------
    // Chat Completion Request
    // ----------------------------------------------------
    const completion = await getClient().chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    // ==========================================
    // ALWAYS LOG RAW RESPONSE
    // ==========================================
    console.log("=== RAW COMPLETION RESPONSE START ===");
    console.dir(completion, { depth: null });
    console.log("=== RAW COMPLETION RESPONSE END ===");

    const text = completion.choices?.[0]?.message?.content || "";

    // Log raw model text
    console.log("=== RAW MODEL TEXT START ===");
    console.log(text);
    console.log("=== RAW MODEL TEXT END ===");

    // JSON parsing attempt
    const json = safeExtractJson(text);

    if (json) {
      console.log("=== PARSED JSON START ===");
      console.dir(json, { depth: null });
      console.log("=== PARSED JSON END ===");
    } else {
      console.error("=== JSON PARSE FAILED — RAW TEXT BELOW ===");
      console.error(text);
    }

    if (!json) {
      return NextResponse.json(
        { error: "invalid_ai_json" },
        { status: 500 }
      );
    }

    // Update rate entry
    const entry = rl.entry;
    entry.count++;
    entry.lastTimestamp = Date.now();
    rateStore.set(ip, entry);

    return NextResponse.json(
      {
        ok: true,
        summaryCritique: json.summaryCritique,
        bulletSuggestions: json.improvements,
        rewrittenSummary: json.rewrittenSummary,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("AI REVIEW ERROR:", err);
    return NextResponse.json(
      { error: "server_failure" },
      { status: 500 }
    );
  }
}
