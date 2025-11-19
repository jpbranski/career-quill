// ================================================
// Resume Analyzer (Improved)
// Reads action verbs from /data/ACTION_VERBS.txt
// ================================================

import fs from "fs";
import path from "path";

// ==================================================
// 1. LOAD ACTION VERBS FROM TXT FILE
// Supports comma-separated or newline-separated lists
// ==================================================
let ACTION_VERB_CACHE: string[] | null = null;

function loadActionVerbs(): string[] {
  if (ACTION_VERB_CACHE) return ACTION_VERB_CACHE;

  try {
    const filePath = path.join(process.cwd(), "data", "ACTION_VERBS.txt");
    const content = fs.readFileSync(filePath, "utf8");

    ACTION_VERB_CACHE = content
      .split(/[\n,]+/)         // split on comma OR newline
      .map((v) => v.trim().toLowerCase())
      .filter((v) => v.length > 0);

    return ACTION_VERB_CACHE;
  } catch (err) {
    console.error("Failed to load ACTION_VERBS.txt:", err);
    ACTION_VERB_CACHE = [];
    return ACTION_VERB_CACHE;
  }
}

const ACTION_VERBS = loadActionVerbs();

// ==================================================
// 2. REGEX + HELPERS
// ==================================================

// Universal bullet detection (handles hyphens + unicode bullets)
const BULLET_REGEX = /^\s*(?:[-‐-–—•●▪▫◦‣⁃*]+\s+)(.+)$/;

// PDF spacing cleanup (fixes "pro fi cien t" → "proficient")
function fixOcrSpacing(text: string) {
  return text.replace(/([a-z])\s+([a-z])/gi, "$1$2");
}

// Quantifier detection ($5k, 42%, 12+, 300M, etc.)
const QUANTIFIER_REGEX = /\b(\$?\d+[%kKmM]?|\d+%|\d+\+)\b/g;

// ==================================================
// 3. BULLET EXTRACTION + RECONSTRUCTION
// ==================================================

function extractBullets(lines: string[]): string[] {
  const bullets: string[] = [];
  let buffer = "";

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const match = line.match(BULLET_REGEX);

    if (match) {
      // Flush previous bullet
      if (buffer) bullets.push(buffer.trim());
      buffer = match[1].trim();
    } else if (buffer && /^[A-Za-z0-9]/.test(line)) {
      // Continuation line (PDF-wrapped bullet)
      buffer += " " + line;
    } else {
      // Neither bullet nor continuation
      if (buffer) {
        bullets.push(buffer.trim());
        buffer = "";
      }
    }
  }

  if (buffer) bullets.push(buffer.trim());
  return bullets;
}

// ==================================================
// 4. ACTION VERB + QUANTIFIER COUNTING
// ==================================================

function countActionVerbs(bullets: string[]): number {
  let count = 0;
  for (const b of bullets) {
    const firstWord = b.split(/\s+/)[0].toLowerCase();
    if (ACTION_VERBS.includes(firstWord)) count++;
  }
  return count;
}

function countQuantifiedBullets(bullets: string[]): number {
  return bullets.filter((b) => QUANTIFIER_REGEX.test(b)).length;
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
  };
}

// ==================================================
// 6. SCORING SYSTEM
// ==================================================

function calculateScore(metrics: any, wordCount: number): number {
  let score = 0;

  // Structure (40 pts)
  if (metrics.hasContactInfo) score += 10;
  if (metrics.hasSummary) score += 5;
  if (metrics.hasExperience) score += 15;
  if (metrics.hasEducation) score += 5;
  if (metrics.hasSkills) score += 5;

  // Content (40 pts)
  const actionRatio =
    metrics.bulletCount > 0
      ? metrics.actionVerbCount / metrics.bulletCount
      : 0;

  score += actionRatio * 20;

  const quantRatio =
    metrics.bulletCount > 0
      ? metrics.quantifiedBullets / metrics.bulletCount
      : 0;

  score += quantRatio * 20;

  // Formatting (20 pts)
  if (metrics.bulletCount >= 3) score += 5;
  if (metrics.longParagraphs === 0) score += 5;
  if (metrics.dateConsistency) score += 5;
  if (wordCount >= 300 && wordCount <= 600) score += 5;

  return Math.round(Math.min(100, score));
}

// ==================================================
// 7. MAIN ANALYZER ENTRY POINT
// ==================================================

export function analyzeResume(text: string) {
  // Fix PDF OCR weirdness
  const cleaned = fixOcrSpacing(text);

  const lines = cleaned
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const words = cleaned.split(/\s+/).filter((w) => w);
  const wordCount = words.length;
  const readingTimeMinutes = Math.ceil(wordCount / 200);

  // Bullets
  const bullets = extractBullets(lines);
  const bulletCount = bullets.length;

  // Action verbs
  const actionVerbCount = countActionVerbs(bullets);

  // Quantifiers
  const quantifiedBullets = countQuantifiedBullets(bullets);

  // Paragraphs
  const paragraphs = cleaned
    .split(/\n\s*\n/)
    .filter((p) => p.trim().length > 0);

  const longParagraphs = paragraphs.filter(
    (p) => p.split(/\n/).length > 4
  ).length;

  // Sections
  const sections = detectSections(cleaned);

  // Average bullet length
  const averageBulletLength =
    bulletCount > 0
      ? bullets.reduce((s, b) => s + b.length, 0) / bulletCount
      : 0;

  // Date consistency check
  const datePatterns = [
    /\d{2}\/\d{4}/g,
    /\w{3}\s+\d{4}/g,
    /\d{4}-\d{2}/g,
  ];
  const dateCounts = datePatterns.map((p) => cleaned.match(p)?.length || 0);
  const dateConsistency = dateCounts.filter((c) => c > 0).length <= 1;

  // Build metrics object
  const metrics = {
    ...sections,
    bulletCount,
    actionVerbCount,
    quantifiedBullets,
    paragraphCount: paragraphs.length,
    longParagraphs,
    averageBulletLength,
    dateConsistency,
  };

  // Generate score
  const score = calculateScore(metrics, wordCount);

  return {
    score,
    wordCount,
    readingTimeMinutes,
    suggestions: [], // Add later if needed
    metrics,
  };
}
