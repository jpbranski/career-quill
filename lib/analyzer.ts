'use server'
// ================================================
// Resume Analyzer (Improved, FS-free)
// ================================================

import actionVerbsRaw from '@/data/ACTION_VERBS.json'

// Normalize verbs list
const ACTION_VERBS: string[] = (actionVerbsRaw as string[])
  .map(v => v.trim().toLowerCase())
  .filter(v => v.length > 0)

// ==================================================
// OCR / PDF CLEANUP
// ==================================================

// Repair broken PDF words and line breaks
function fixOcrSpacing(text: string) {
  let cleaned = text

  // Merge broken words: "Pro fi cient" → "Proficient"
  cleaned = cleaned.replace(/([A-Za-z])\s+([A-Za-z])/g, '$1$2')

  // Merge across line breaks: "Imple\nmented" → "Implemented"
  cleaned = cleaned.replace(/([a-z])\n([a-z])/gi, '$1 $2')

  // Normalize bullet leading spaces: "-   Implemented" → "- Implemented"
  cleaned = cleaned.replace(/([-•●▪◦‣⁃*]+)\s+([A-Za-z])/g, '$1 $2')

  return cleaned
}

// ==================================================
// 2. REGEX + HELPERS
// ==================================================

// Stronger bullet detection
const BULLET_REGEX =
  /^\s*(?:[-‐–—•●▪▫◦‣⁃*]+|\d+\.|\d+\))\s*(.+)$/i

// Treat leading verbs as bullets
const LEADING_VERB_BULLET_REGEX =
  /^\s*(Implemented|Led|Managed|Created|Developed|Built|Designed|Refactored|Enhanced|Optimized|Architected|Spearheaded|Coordinated|Maintained|Improved|Increased|Reduced|Collaborated|Solved|Trained|Mentored|Automated)\b/i

// Quantifiers like 35%, $2M, 140+, 12k
const QUANTIFIER_REGEX = /\b(\$?\d+[%kKmM]?|\d+%|\d+\+)\b/

// ==================================================
// 3. BULLET EXTRACTION + RECONSTRUCTION
// ==================================================

function extractBullets(lines: string[]): string[] {
  const bullets: string[] = []
  let buffer = ''

  for (const rawLine of lines) {
    const line = rawLine.trim()

    const bulletMatch = line.match(BULLET_REGEX)
    const verbAsBullet = !bulletMatch && LEADING_VERB_BULLET_REGEX.test(line)

    if (bulletMatch || verbAsBullet) {
      if (buffer) bullets.push(buffer.trim())
      buffer = bulletMatch ? bulletMatch[1].trim() : line
      continue
    }

    // PDF-wrapped continuation lines
    if (buffer && /^[A-Za-z0-9]/.test(line)) {
      buffer += ' ' + line
    } else {
      if (buffer) {
        bullets.push(buffer.trim())
        buffer = ''
      }
    }
  }

  if (buffer) bullets.push(buffer.trim())
  return bullets
}

// ==================================================
// 4. ACTION VERB + QUANTIFIER COUNTING
// ==================================================

function normalizeForVerbCheck(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ') // strip garbage
    .replace(/\s+/g, ' ')      // normalize spaces
    .trim()
}

function countActionVerbs(bullets: string[]): number {
  let count = 0

  for (const b of bullets) {
    const normalized = normalizeForVerbCheck(b)
    const words = normalized.split(' ').filter(Boolean)

    if (words.some(w => ACTION_VERBS.includes(w))) {
      count++
    }
  }

  return count
}

function countQuantifiedBullets(bullets: string[]): number {
  let count = 0
  for (const b of bullets) {
    if (QUANTIFIER_REGEX.test(b)) count++
  }
  return count
}

// ==================================================
// 5. SECTION DETECTION
// ==================================================

function detectSections(text: string) {
  return {
    hasContactInfo: /@/.test(text) && /\d{3}/.test(text),
    hasSummary: /summary|objective|profile/i.test(text),
    hasExperience: /experience|employment|work history/i.test(text),
    hasEducation: /education|academic|degree/i.test(text),
    hasSkills: /skills|technologies|competencies/i.test(text),
  }
}

// ==================================================
// 6. SCORING SYSTEM (unchanged)
// ==================================================

function calculateScore(metrics: any, wordCount: number): number {
  let score = 0

  // Structure (40 pts)
  if (metrics.hasContactInfo) score += 10
  if (metrics.hasSummary) score += 5
  if (metrics.hasExperience) score += 15
  if (metrics.hasEducation) score += 5
  if (metrics.hasSkills) score += 5

  // Content (40 pts)
  const actionRatio =
    metrics.bulletCount > 0
      ? metrics.actionVerbCount / metrics.bulletCount
      : 0

  score += actionRatio * 20

  const quantRatio =
    metrics.bulletCount > 0
      ? metrics.quantifiedBullets / metrics.bulletCount
      : 0

  score += quantRatio * 20

  // Formatting (20 pts)
  if (metrics.bulletCount >= 3) score += 5
  if (metrics.longParagraphs === 0) score += 5
  if (metrics.dateConsistency) score += 5
  if (wordCount >= 300 && wordCount <= 600) score += 5

  return Math.round(Math.min(100, score))
}

// ==================================================
// TYPES
// ==================================================

export interface Suggestion {
  id: string
  type: 'error' | 'warning' | 'info' | 'success'
  title: string
  description: string
  category: 'structure' | 'content' | 'formatting' | 'keywords'
}

export interface AnalysisResult {
  score: number
  wordCount: number
  readingTimeMinutes: number
  suggestions: Suggestion[]
  metrics: {
    hasContactInfo: boolean
    hasSummary: boolean
    hasExperience: boolean
    hasEducation: boolean
    hasSkills: boolean
    bulletCount: number
    actionVerbCount: number
    quantifiedBullets: number
    paragraphCount: number
    longParagraphs: number
    averageBulletLength: number
    dateConsistency: boolean
  }
}

// ==================================================
// 8. SUGGESTION GENERATOR (unchanged)
// ==================================================

function buildSuggestions(
  metrics: AnalysisResult['metrics'],
  wordCount: number,
  score: number
): Suggestion[] {
  const suggestions: Suggestion[] = []

  if (!metrics.hasSummary) {
    suggestions.push({
      id: 'add-summary',
      type: 'warning',
      title: 'Add a concise professional summary',
      description:
        'Open your resume with a 2–3 sentence summary that highlights your role, years of experience, and key strengths.',
      category: 'structure',
    })
  }

  if (!metrics.hasSkills) {
    suggestions.push({
      id: 'add-skills',
      type: 'warning',
      title: 'Include a clear skills section',
      description:
        'Add a dedicated skills section that groups tools, technologies, and core competencies in a scannable list.',
      category: 'structure',
    })
  }

  if (!metrics.hasExperience) {
    suggestions.push({
      id: 'add-experience',
      type: 'error',
      title: 'Highlight your work experience',
      description:
        'Recruiters expect a work experience section with role titles, employers, dates, and impact-focused bullet points.',
      category: 'structure',
    })
  }

  if (metrics.bulletCount === 0) {
    suggestions.push({
      id: 'no-bullets',
      type: 'error',
      title: 'Add bullet points for impact',
      description:
        'Use bullet points under each role to describe your achievements. Start with strong verbs and focus on measurable outcomes.',
      category: 'content',
    })
  } else {
    const actionRatio =
      metrics.actionVerbCount / Math.max(1, metrics.bulletCount)
    const quantRatio =
      metrics.quantifiedBullets / Math.max(1, metrics.bulletCount)

    if (actionRatio < 0.6) {
      suggestions.push({
        id: 'more-action-verbs',
        type: 'warning',
        title: 'Strengthen bullets with action verbs',
        description:
          'Start each bullet with a strong action verb such as “Led”, “Implemented”, “Optimized”, or “Designed” to emphasize ownership.',
        category: 'keywords',
      })
    }

    if (quantRatio < 0.3) {
      suggestions.push({
        id: 'more-quantification',
        type: 'warning',
        title: 'Quantify more of your achievements',
        description:
          'Include numbers (%, $, counts, time saved) to show scale and impact, e.g., “Reduced processing time by 35%”.',
        category: 'content',
      })
    }
  }

  if (metrics.longParagraphs > 0) {
    suggestions.push({
      id: 'break-up-paragraphs',
      type: 'info',
      title: 'Break up dense paragraphs',
      description:
        'Long blocks of text are hard to scan. Convert long paragraphs into 2–3 bullets that each focus on a single achievement.',
      category: 'formatting',
    })
  }

  if (!metrics.dateConsistency) {
    suggestions.push({
      id: 'date-consistency',
      type: 'info',
      title: 'Use a consistent date format',
      description:
        'Pick one date format (e.g., “Jan 2022 – Present”) and use it consistently.',
      category: 'formatting',
    })
  }

  if (wordCount < 250 || wordCount > 800) {
    suggestions.push({
      id: 'length-balance',
      type: 'info',
      title: 'Adjust overall resume length',
      description:
        'Aim for roughly 300–600 words for a one-page resume.',
      category: 'structure',
    })
  }

  if (score < 60 && suggestions.length < 3) {
    suggestions.push({
      id: 'overall-strength',
      type: 'warning',
      title: 'Overall resume strength can be improved',
      description:
        'Focus on adding impact-focused bullets, quantifying results, and tightening wording.',
      category: 'content',
    })
  }

  return suggestions
}

// ==================================================
// 9. MAIN ANALYZER ENTRY POINT
// ==================================================

export async function analyzeResume(text: string): Promise<AnalysisResult> {
  // Fix PDF OCR weirdness
  const cleaned = fixOcrSpacing(text)

  const lines = cleaned
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0)

  const words = cleaned.split(/\s+/).filter(w => w)
  const wordCount = words.length
  const readingTimeMinutes = Math.ceil(wordCount / 200)

  // Bullets
  const bullets = extractBullets(lines)
  const bulletCount = bullets.length

  // Action verbs
  const actionVerbCount = countActionVerbs(bullets)

  // Quantifiers
  const quantifiedBullets = countQuantifiedBullets(bullets)

  // Paragraphs
  const paragraphs = cleaned
    .split(/\n\s*\n/)
    .filter(p => p.trim().length > 0)

  const longParagraphs = paragraphs.filter(
    p => p.split(/\n/).length > 4
  ).length

  // Sections
  const sections = detectSections(cleaned)

  // Average bullet length
  const averageBulletLength =
    bulletCount > 0
      ? bullets.reduce((s, b) => s + b.length, 0) / bulletCount
      : 0

  // Date consistency check
  const datePatterns = [/\d{2}\/\d{4}/g, /\w{3}\s+\d{4}/g, /\d{4}-\d{2}/g]
  const dateCounts = datePatterns.map(
    p => cleaned.match(p)?.length || 0
  )
  const dateConsistency =
    dateCounts.filter(c => c > 0).length <= 1

  const metrics = {
    ...sections,
    bulletCount,
    actionVerbCount,
    quantifiedBullets,
    paragraphCount: paragraphs.length,
    longParagraphs,
    averageBulletLength,
    dateConsistency,
  }

  // Score
  const score = calculateScore(metrics, wordCount)

  // Suggestions
  const suggestions = buildSuggestions(metrics, wordCount, score)

  return {
    score,
    wordCount,
    readingTimeMinutes,
    suggestions,
    metrics,
  }
}
