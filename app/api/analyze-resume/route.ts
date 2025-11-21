import { NextResponse } from "next/server";
import OpenAI from "openai";

// --------------------------------------
// Runtime (force Node.js runtime)
// --------------------------------------
export const runtime = "nodejs";

// --------------------------------------
// OpenAI client
// --------------------------------------
let openai: OpenAI | null = null;

function getOpenAI() {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

const MODEL = process.env.AI_MODEL || "gpt-5-mini";

// --------------------------------------
// Rate limiting
// --------------------------------------
type RateLimitEntry = {
  count: number;
  lastTimestamp: number;
  dayStart: number;
};

type RateLimitResult =
  | { ok: true; entry: RateLimitEntry }
  | { ok: false; type: "cooldown"; remaining: number }
  | { ok: false; type: "daily_limit" };

const rateStore = new Map<string, RateLimitEntry>();

const MAX_PER_DAY = Number(process.env.RATE_LIMIT_MAX_PER_DAY || 5);
const COOLDOWN_SECONDS = Number(
  process.env.RATE_LIMIT_COOLDOWN_SECONDS || 30
);

function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (!fwd) return "unknown";
  return fwd.split(",")[0].trim();
}

function checkServerRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const existing =
    rateStore.get(ip) ||
    ({
      count: 0,
      lastTimestamp: 0,
      dayStart: now,
    } as RateLimitEntry);

  // Reset daily window if more than 24h passed
  if (now - existing.dayStart > 24 * 60 * 60 * 1000) {
    existing.count = 0;
    existing.dayStart = now;
  }

  const secondsSinceLast = (now - existing.lastTimestamp) / 1000;

  if (secondsSinceLast < COOLDOWN_SECONDS) {
    return {
      ok: false,
      type: "cooldown",
      remaining: Math.ceil(COOLDOWN_SECONDS - secondsSinceLast),
    };
  }

  if (existing.count >= MAX_PER_DAY) {
    return { ok: false, type: "daily_limit" };
  }

  return { ok: true, entry: existing };
}

// --------------------------------------
// Bullet & structure normalizer
// --------------------------------------
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

// --------------------------------------
// Responses API type guard
// --------------------------------------
type TextBlock = {
  type: "output_text";
  content: { type: string; text: string }[];
};

function isTextBlock(item: any): item is TextBlock {
  return (
    item &&
    typeof item === "object" &&
    item.type === "output_text" &&
    Array.isArray(item.content) &&
    item.content.length > 0 &&
    typeof item.content[0]?.text === "string"
  );
}

// --------------------------------------
// POST handler
// --------------------------------------
export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    // Parse JSON body safely
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { resumeText } = body ?? {};
    const cleanedResume = normalizeBullets(resumeText || "");

    if (!resumeText || resumeText.trim().length < 30) {
      return NextResponse.json(
        { error: "Resume text is too short or missing" },
        { status: 400 }
      );
    }

    // Rate limit checks
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

    // Build prompt
    const prompt = `
You are an expert résumé editor. You are analyzing résumé text extracted from a PDF, which may contain OCR or text-extraction artifacts such as:
- Incorrect spacing inside words (e.g., "profi cien t", "engi neer")
- Broken ligatures
- Random line breaks
- Bullet symbols converted into "-"
- Words split across lines

STRICTLY IGNORE all spacing or OCR artifacts. Do NOT list them as issues. ONLY focus on the quality of the writing, clarity, strength of bullet points, action verbs, quantification, impact, and professional tone.

Analyze the following normalized résumé text (bullets begin with "- ") and produce a STRICT JSON object with:

- "summaryCritique": A 2–3 paragraph critique focusing on clarity, relevance, impact, and effectiveness of the content (NOT formatting or extraction errors).
- "improvements": 8–12 specific suggestions that improve bullet impact, action verbs, quantification, readability, and structure—but NEVER include spacing/OCR errors or cosmetic formatting.
- "rewrittenSummary": A polished 2–3 sentence professional summary written in a confident, recruiter-friendly tone.

The output MUST be valid JSON only, with NO text outside the JSON.

Résumé text:
${cleanedResume}
`;

    // Call OpenAI Responses API
    const client = getOpenAI();
    const aiResult = await client.responses.create({
      model: MODEL,
      input: prompt,
    });

    // Extract first output block; type as any to dodge SDK union friction,
    // then validate with our own runtime guard.
    const rawItem: any = (aiResult as any).output?.[0];

    if (!isTextBlock(rawItem)) {
      console.error(
        "AI ERROR: Unexpected output block:",
        JSON.stringify(rawItem, null, 2)
      );
      return NextResponse.json(
        { error: "AI returned an unexpected output format." },
        { status: 500 }
      );
    }

    const textBlock: TextBlock = rawItem;
    const outputText = textBlock.content[0].text;

    // Parse JSON produced by the model
    let parsed: any;
    try {
      parsed = JSON.parse(outputText);
    } catch {
      const jsonMatch = outputText.match(/\{[\s\S]*\}$/);
      if (!jsonMatch) {
        console.error("JSON PARSE FAIL:", outputText);
        return NextResponse.json(
          {
            error: "AI output was not valid JSON.",
            raw: outputText,
          },
          { status: 500 }
        );
      }
      parsed = JSON.parse(jsonMatch[0]);
    }

    // Update rate limiting entry (we know rl.ok === true here)
    if (rl.ok) {
      const entry = rl.entry;
      entry.count += 1;
      entry.lastTimestamp = Date.now();
      rateStore.set(ip, entry);
    }

    return NextResponse.json(
      {
        ok: true,
        summaryCritique: parsed.summaryCritique,
        bulletSuggestions: parsed.improvements,
        rewrittenSummary: parsed.rewrittenSummary,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(
      "UNEXPECTED AI ROUTE ERROR:",
      typeof err === "string" ? err : JSON.stringify(err, null, 2)
    );
    return NextResponse.json(
      { error: "Failed to analyze resume." },
      { status: 500 }
    );
  }
}
