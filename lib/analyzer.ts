'use server'

// ================================================
// Resume Analyzer (Improved + Realistic Scoring)
// ================================================

import actionVerbsRaw from '@/data/ACTION_VERBS.json'

// Normalize verbs
const ACTION_VERBS: string[] = (actionVerbsRaw as string[])
  .map(v => v.trim().toLowerCase())
  .filter(v => v.length > 0)

// ==================================================
// OCR CLEANUP (FINAL VERSION)
// ==================================================
function fixOcrSpacing(text: string) {
  let cleaned = text

  // 1. Merge broken intra-word spaces
  cleaned = cleaned.replace(/([A-Za-z])\s+([A-Za-z])/g, '$1$2')

  // 2. Merge wrapped broken words
  cleaned = cleaned.replace(/([a-z])\n([a-z])/gi, '$1 $2')

  // 3. Lowercase→Uppercase word boundary
  cleaned = cleaned.replace(/([a-z])([A-Z])/g, '$1 $2')

  // 4. Fix verb+the smashups (most common OCR issue)
  cleaned = cleaned.replace(
    /\b(Implemented|Lead|Led|Refactored|Created|Designed|Optimized|Built|Managed|Developed)(the)/gi,
    '$1 the '
  )

  // 5. Fix verb+CapitalWord merges
  cleaned = cleaned.replace(
    /\b(Implemented|Lead|Led|Refactored|Created|Designed|Optimized|Built|Managed|Developed)([A-Z])/g,
    '$1 $2'
  )

  // 6. Normalize bullet spacing
  cleaned = cleaned.replace(/([-•●▪◦‣⁃*])\s+([A-Za-z])/g, '$1 $2')

  // 7. Force REAL bullets to new lines (prevents 62-bullet overflow)
  cleaned = cleaned.replace(/(?:^|\s)([•●▪◦‣⁃*])\s+/g, '\n$1 ')

  return cleaned
}

// ==================================================
// BULLET + QUANTIFIER PARSING
// ==================================================

const BULLET_REGEX =
  /^\s*(?:[-‐–—•●▪▫◦‣⁃*]+|\d+\.|\d+\))\s*(.+)$/i

const LEADING_VERB_BULLET_REGEX =
  /^\s*(Implemented|Led|Managed|Created|Developed|Built|Designed|Refactored|Enhanced|Optimized|Architected|Spearheaded|Coordinated|Maintained|Improved|Increased|Reduced|Collaborated|Solved|Trained|Mentored|Automated)\b/i

const QUANTIFIER_REGEX = /\b(\$?\d+[%kKmM]?|\d+%|\d+\+)\b/

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
// ACTION VERB + QUANTIFIER COUNTING
// ==================================================

function countActionVerbs(bullets: string[]): number {
  let count = 0

  for (const b of bullets) {
    const lower = b.toLowerCase()

    // NEW: substring verb matching (OCR friendly)
    if (ACTION_VERBS.some(v => lower.includes(v))) {
      count++
    }
  }

  return count
}

function countQuantifiedBullets(bullets: string[]): number {
  return bullets.filter(b => QUANTIFIER_REGEX.test(b)).length
}

// ==================================================
// SECTION DETECTION
// ==================================================

function detectSections(text: string) {
  return {
    hasContactInfo: /@/.test(text) && /\d{3}/.test(text),
    hasSummary: /summary|objective|profile/i.test(text),
    hasExperience: /experience|employment|work history/i.test(text),
    hasEducation: /education|degree|bachelor|master|university/i.test(text),
    hasSkills: /skills|technologies|competencies|tools/i.test(text),
  }
}

// ==================================================
//  ⚡ IMPROVED SCORING MODEL (REALISTIC)
// ==================================================

function calculateScore(metrics: any, wordCount: number): number {
  let score = 0

  // 1. Structure (25 pts)
  if (metrics.hasContactInfo) score += 5
  if (metrics.hasSummary) score += 5
  if (metrics.hasExperience) score += 8
  if (metrics.hasEducation) score += 3
  if (metrics.hasSkills) score += 4

  // 2. Content Quality (50 pts)
  // Action verbs (heavily weighted)
  const actionRatio =
    metrics.bulletCount > 0
      ? metrics.actionVerbCount / metrics.bulletCount
      : 0

  score += Math.min(1, actionRatio * 1.5) * 25 // up to 25 pts

  // Quantifiers (impact)
  const quantRatio =
    metrics.bulletCount > 0
      ? metrics.quantifiedBullets / metrics.bulletCount
      : 0

  score += Math.min(1, quantRatio * 2.0) * 20 // up to 20 pts

  // 3. Formatting (25 pts)
  if (metrics.bulletCount >= 5) score += 8
  if (metrics.longParagraphs === 0) score += 5
  if (metrics.dateConsistency) score += 5

  // Resume length (less strict)
  if (wordCount >= 250 && wordCount <= 900) score += 7

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
// SUGGESTIONS (unchanged)
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
        'Open with a 2–3 sentence summary that highlights your strengths.',
      category: 'structure'
    })
  }

  if (metrics.actionVerbCount / Math.max(1, metrics.bulletCount) < 0.4) {
    suggestions.push({
      id: 'more-action-verbs',
      type: 'warning',
      title: 'Strengthen bullets with action verbs',
      description: 'Start each bullet with a strong verb to emphasize ownership.',
      category: 'keywords'
    })
  }

  if (metrics.quantifiedBullets / Math.max(1, metrics.bulletCount) < 0.25) {
    suggestions.push({
      id: 'more-quantification',
      type: 'warning',
      title: 'Quantify more achievements',
      description: 'Use %, $, and counts to show measurable impact.',
      category: 'content'
    })
  }

  if (metrics.longParagraphs > 0) {
    suggestions.push({
      id: 'break-up-paragraphs',
      type: 'info',
      title: 'Break up dense paragraphs',
      description:
        'Long blocks are harder to scan. Convert them into bullets.',
      category: 'formatting'
    })
  }

  return suggestions
}

// ==================================================
// MAIN ANALYZER ENTRY POINT
// ==================================================

export async function analyzeResume(text: string): Promise<AnalysisResult> {
  const cleaned = fixOcrSpacing(text)

  const lines = cleaned
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0)

  const words = cleaned.split(/\s+/).filter(Boolean)
  const wordCount = words.length
  const readingTimeMinutes = Math.ceil(wordCount / 200)

  const bullets = extractBullets(lines)
  const bulletCount = bullets.length
  const actionVerbCount = countActionVerbs(bullets)
  const quantifiedBullets = countQuantifiedBullets(bullets)

  const paragraphs = cleaned.split(/\n\s*\n/).filter(p => p.trim())
  const longParagraphs = paragraphs.filter(p => p.split(/\n/).length > 4).length

  const sections = detectSections(cleaned)

  const averageBulletLength =
    bulletCount > 0
      ? bullets.reduce((s, b) => s + b.length, 0) / bulletCount
      : 0

  const datePatterns = [/\d{2}\/\d{4}/g, /\w{3}\s+\d{4}/g, /\d{4}-\d{2}/g]
  const dateCounts = datePatterns.map(p => cleaned.match(p)?.length || 0)
  const dateConsistency = dateCounts.filter(c => c > 0).length <= 1

  const metrics = {
    ...sections,
    bulletCount,
    actionVerbCount,
    quantifiedBullets,
    paragraphCount: paragraphs.length,
    longParagraphs,
    averageBulletLength,
    dateConsistency
  }

  const score = calculateScore(metrics, wordCount)
  const suggestions = buildSuggestions(metrics, wordCount, score)

  return {
    score,
    wordCount,
    readingTimeMinutes,
    suggestions,
    metrics
  }
}
