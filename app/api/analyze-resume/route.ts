import { NextResponse } from 'next/server'
import OpenAI from 'openai'

export const runtime = 'nodejs'

// ================================================================
// OpenAI client
// ================================================================
let client: OpenAI | null = null

function getClient() {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return client
}

const MODEL = process.env.AI_MODEL || 'gpt-5-mini'

// ================================================================
// Universal extractor for Responses API output (text + JSON)
// ================================================================
function extractTextAndJSON(aiResult: any): { raw: string; json: any | null } {
  if (!aiResult) return { raw: '', json: null }

  let rawText = ''

  // 1. Standard Responses API: aiResult.output[]
  if (Array.isArray(aiResult.output)) {
    for (const block of aiResult.output) {
      // output_text blocks
      if (block?.type === 'output_text' && Array.isArray(block.content)) {
        for (const c of block.content) {
          if (typeof c?.text === 'string') rawText += c.text + '\n'
        }
      }

      // message-style blocks
      if (block?.type === 'message' && Array.isArray(block.content)) {
        for (const c of block.content) {
          if (typeof c?.text === 'string') rawText += c.text + '\n'
        }
      }

      // generic text field on block
      if (typeof block?.text === 'string') {
        rawText += block.text + '\n'
      }
    }
  }

  // 2. Fallback shapes (some SDKs/models)
  if (!rawText && typeof aiResult.output_text === 'string') {
    rawText = aiResult.output_text
  }

  if (!rawText) {
    const maybe =
      aiResult?.text ??
      aiResult?.message ??
      aiResult?.content ??
      aiResult?.response
    if (typeof maybe === 'string') rawText = maybe
  }

  rawText = rawText.trim()

  // 3. Try to parse JSON
  let parsed: any = null
  if (rawText) {
    try {
      parsed = JSON.parse(rawText)
    } catch {
      const jsonMatch = rawText.match(/\{[\s\S]*\}$/)
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0])
        } catch {
          parsed = null
        }
      }
    }
  }

  return { raw: rawText, json: parsed }
}

// ================================================================
// Rate limiting
// ================================================================
type RateEntry = {
  count: number
  lastTimestamp: number
  dayStart: number
}

type RateLimitResult =
  | { ok: true; entry: RateEntry }
  | { ok: false; reason: 'cooldown'; remaining: number }
  | { ok: false; reason: 'daily_limit' }

const rateStore = new Map<string, RateEntry>()

const MAX_PER_DAY = Number(process.env.RATE_LIMIT_MAX_PER_DAY || 5)
const COOLDOWN_SECONDS = Number(
  process.env.RATE_LIMIT_COOLDOWN_SECONDS || 30
)

function getClientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (!fwd) return 'unknown'
  return fwd.split(',')[0].trim()
}

function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now()
  const entry: RateEntry =
    rateStore.get(ip) ?? {
      count: 0,
      lastTimestamp: 0,
      dayStart: now,
    }

  // Reset daily window if more than 24h has passed
  if (now - entry.dayStart > 24 * 60 * 60 * 1000) {
    entry.count = 0
    entry.dayStart = now
  }

  const secondsSinceLast = (now - entry.lastTimestamp) / 1000

  if (secondsSinceLast < COOLDOWN_SECONDS) {
    return {
      ok: false,
      reason: 'cooldown',
      remaining: Math.ceil(COOLDOWN_SECONDS - secondsSinceLast),
    }
  }

  if (entry.count >= MAX_PER_DAY) {
    return { ok: false, reason: 'daily_limit' }
  }

  return { ok: true, entry }
}

// ================================================================
// Bullet normalizer (for AI prompt)
// ================================================================
function normalizeBullets(text: string): string {
  return text
    .replace(/^[\u2022\u25E6\u25AA\u2023\u2043●▪•]+/gm, '- ')
    .replace(/^\s*[•●▪]/gm, '- ')
    .replace(/^\s*[-–—]\s*/gm, '- ')
    .replace(
      /^\s*(Implemented|Led|Managed|Created|Developed|Built|Designed|Refactored|Enhanced|Optimized|Architected|Spearheaded|Coordinated|Maintained|Improved|Increased|Reduced|Collaborated|Solved|Trained|Mentored|Automated)\b/gm,
      '- $1'
    )
    .replace(/^- -/gm, '- ')
    .replace(/-\s+/g, '- ')
    .trim()
}

// ================================================================
// POST handler
// ================================================================
export async function POST(req: Request) {
  try {
    const ip = getClientIp(req)

    const body = await req.json().catch(() => null)
    const resumeText: string | undefined = body?.resumeText

    if (!resumeText || resumeText.trim().length < 30) {
      return NextResponse.json(
        { error: 'Resume text is too short or missing' },
        { status: 400 }
      )
    }

    // Rate limit check
    const rl = checkRateLimit(ip)
    if (!rl.ok) {
      if (rl.reason === 'cooldown') {
        return NextResponse.json(
          { error: 'cooldown', remaining: rl.remaining },
          { status: 429 }
        )
      }
      return NextResponse.json(
        { error: 'daily_limit' },
        { status: 429 }
      )
    }

    const cleaned = normalizeBullets(resumeText)

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
${cleaned}
`

    const aiResult = await getClient().responses.create({
      model: MODEL,
      input: prompt,
    })

    const { raw, json } = extractTextAndJSON(aiResult)

    if (!json) {
      console.error('AI JSON parse failure:', raw)
      return NextResponse.json(
        { error: 'invalid_ai_json', raw },
        { status: 500 }
      )
    }

    // Update rate entry now that the call succeeded
    const entry = rl.entry
    entry.count += 1
    entry.lastTimestamp = Date.now()
    rateStore.set(ip, entry)

    return NextResponse.json(
      {
        ok: true,
        summaryCritique: json.summaryCritique,
        bulletSuggestions: json.improvements,
        rewrittenSummary: json.rewrittenSummary,
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('AI REVIEW ERROR:', err)
    return NextResponse.json(
      { error: 'server_failure' },
      { status: 500 }
    )
  }
}
