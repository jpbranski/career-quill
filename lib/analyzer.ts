// Non-AI resume analysis utilities

export interface AnalysisResult {
  score: number; // 0-100
  wordCount: number;
  readingTimeMinutes: number;
  suggestions: Suggestion[];
  metrics: Metrics;
}

export interface Suggestion {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  category: 'structure' | 'content' | 'formatting' | 'keywords';
  title: string;
  description: string;
  priority: number; // 1-5, 5 being highest
}

export interface Metrics {
  hasContactInfo: boolean;
  hasSummary: boolean;
  hasExperience: boolean;
  hasEducation: boolean;
  hasSkills: boolean;
  bulletCount: number;
  actionVerbCount: number;
  quantifiedBullets: number;
  paragraphCount: number;
  longParagraphs: number;
  averageBulletLength: number;
  keywordDensity: { [key: string]: number };
  dateConsistency: boolean;
}

// Action verbs commonly used in strong resumes
const ACTION_VERBS = [
  'achieved', 'improved', 'developed', 'created', 'implemented', 'designed',
  'managed', 'led', 'built', 'launched', 'increased', 'reduced', 'streamlined',
  'optimized', 'analyzed', 'coordinated', 'established', 'generated', 'delivered',
  'spearheaded', 'collaborated', 'mentored', 'architected', 'engineered',
];

// Numbers and quantifiers
const QUANTIFIER_REGEX = /\d+[%KkMm+]?|\$\d+|[+-]?\d+%/g;

/**
 * Analyze resume text and provide suggestions
 */
export function analyzeResume(text: string): AnalysisResult {
  const suggestions: Suggestion[] = [];
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;
  const readingTimeMinutes = Math.ceil(wordCount / 200); // Average reading speed

  // Extract metrics
  const metrics = extractMetrics(text);

  // Generate suggestions based on analysis
  if (wordCount < 200) {
    suggestions.push({
      id: 'word-count-low',
      type: 'warning',
      category: 'content',
      title: 'Resume is too short',
      description: `Your resume has only ${wordCount} words. Aim for 300-600 words for a complete picture.`,
      priority: 4,
    });
  } else if (wordCount > 800) {
    suggestions.push({
      id: 'word-count-high',
      type: 'warning',
      category: 'content',
      title: 'Resume is too long',
      description: `Your resume has ${wordCount} words. Consider trimming to 300-600 words for better readability.`,
      priority: 3,
    });
  }

  if (!metrics.hasContactInfo) {
    suggestions.push({
      id: 'missing-contact',
      type: 'error',
      category: 'structure',
      title: 'Missing contact information',
      description: 'Include your email, phone number, and location.',
      priority: 5,
    });
  }

  if (!metrics.hasSummary) {
    suggestions.push({
      id: 'missing-summary',
      type: 'warning',
      category: 'structure',
      title: 'Consider adding a professional summary',
      description: 'A 2-3 sentence summary helps recruiters quickly understand your value.',
      priority: 3,
    });
  }

  if (!metrics.hasSkills) {
    suggestions.push({
      id: 'missing-skills',
      type: 'warning',
      category: 'structure',
      title: 'Add a skills section',
      description: 'A dedicated skills section helps with ATS (Applicant Tracking Systems).',
      priority: 4,
    });
  }

  if (metrics.bulletCount < 3) {
    suggestions.push({
      id: 'few-bullets',
      type: 'info',
      category: 'formatting',
      title: 'Use more bullet points',
      description: 'Bullet points improve readability. Aim for 3-5 bullets per experience.',
      priority: 3,
    });
  }

  if (metrics.actionVerbCount < metrics.bulletCount * 0.6) {
    suggestions.push({
      id: 'weak-action-verbs',
      type: 'warning',
      category: 'content',
      title: 'Use more action verbs',
      description: 'Start bullet points with strong action verbs like "achieved", "developed", "led".',
      priority: 4,
    });
  }

  if (metrics.quantifiedBullets < metrics.bulletCount * 0.4) {
    suggestions.push({
      id: 'not-quantified',
      type: 'warning',
      category: 'content',
      title: 'Quantify your achievements',
      description: 'Add numbers, percentages, or metrics to at least 40% of your bullet points.',
      priority: 5,
    });
  }

  if (metrics.longParagraphs > 0) {
    suggestions.push({
      id: 'long-paragraphs',
      type: 'warning',
      category: 'formatting',
      title: 'Paragraphs are too long',
      description: `${metrics.longParagraphs} paragraph(s) exceed 4 lines. Break them into bullet points.`,
      priority: 3,
    });
  }

  if (!metrics.dateConsistency) {
    suggestions.push({
      id: 'date-inconsistency',
      type: 'info',
      category: 'formatting',
      title: 'Inconsistent date formatting',
      description: 'Use a consistent date format throughout (e.g., "Jan 2020" or "01/2020").',
      priority: 2,
    });
  }

  if (metrics.averageBulletLength > 150) {
    suggestions.push({
      id: 'bullet-too-long',
      type: 'info',
      category: 'formatting',
      title: 'Bullet points are too long',
      description: 'Keep bullet points concise (under 150 characters when possible).',
      priority: 2,
    });
  }

  // Calculate overall score
  const score = calculateScore(metrics, wordCount);

  return {
    score,
    wordCount,
    readingTimeMinutes,
    suggestions: suggestions.sort((a, b) => b.priority - a.priority),
    metrics,
  };
}

/**
 * Extract metrics from resume text
 */
function extractMetrics(text: string): Metrics {
  const lines = text.split('\n').filter((line) => line.trim().length > 0);
  const lowerText = text.toLowerCase();

  // Check for sections
  const hasContactInfo = /@/.test(text) && /\d{3}/.test(text); // has email and phone
  const hasSummary = /summary|objective|profile/i.test(text);
  const hasExperience = /experience|employment|work history/i.test(text);
  const hasEducation = /education|academic|degree/i.test(text);
  const hasSkills = /skills|technologies|competencies/i.test(text);

  // Count bullets
  const bulletLines = lines.filter((line) => /^[\s]*[-•●∙◦▪▫]/.test(line));
  const bulletCount = bulletLines.length;

  // Count action verbs
  let actionVerbCount = 0;
  bulletLines.forEach((line) => {
    const firstWord = line.trim().replace(/^[-•●∙◦▪▫]\s*/, '').split(/\s+/)[0]?.toLowerCase();
    if (firstWord && ACTION_VERBS.includes(firstWord)) {
      actionVerbCount++;
    }
  });

  // Count quantified bullets
  const quantifiedBullets = bulletLines.filter((line) => QUANTIFIER_REGEX.test(line)).length;

  // Count paragraphs and long paragraphs
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 0);
  const paragraphCount = paragraphs.length;
  const longParagraphs = paragraphs.filter((p) => p.split('\n').length > 4).length;

  // Calculate average bullet length
  const totalBulletLength = bulletLines.reduce((sum, line) => sum + line.length, 0);
  const averageBulletLength = bulletCount > 0 ? totalBulletLength / bulletCount : 0;

  // Check date consistency
  const datePatterns = [
    /\d{2}\/\d{4}/g, // 01/2020
    /\w{3}\s+\d{4}/g, // Jan 2020
    /\d{4}-\d{2}/g, // 2020-01
  ];
  const dateFormats = datePatterns.map((pattern) => (text.match(pattern) || []).length);
  const dateConsistency = dateFormats.filter((count) => count > 0).length <= 1;

  // Keyword density (top technical keywords)
  const keywords = extractKeywords(lowerText);

  return {
    hasContactInfo,
    hasSummary,
    hasExperience,
    hasEducation,
    hasSkills,
    bulletCount,
    actionVerbCount,
    quantifiedBullets,
    paragraphCount,
    longParagraphs,
    averageBulletLength,
    keywordDensity: keywords,
    dateConsistency,
  };
}

/**
 * Extract common keywords and their frequency
 */
function extractKeywords(text: string): { [key: string]: number } {
  const commonKeywords = [
    'javascript', 'python', 'java', 'react', 'node', 'typescript', 'aws', 'docker',
    'leadership', 'management', 'agile', 'scrum', 'team', 'project', 'development',
  ];

  const keywords: { [key: string]: number } = {};

  commonKeywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches && matches.length > 0) {
      keywords[keyword] = matches.length;
    }
  });

  return keywords;
}

/**
 * Calculate overall resume score (0-100)
 */
function calculateScore(metrics: Metrics, wordCount: number): number {
  let score = 0;

  // Structure (40 points)
  if (metrics.hasContactInfo) score += 10;
  if (metrics.hasSummary) score += 5;
  if (metrics.hasExperience) score += 15;
  if (metrics.hasEducation) score += 5;
  if (metrics.hasSkills) score += 5;

  // Content quality (40 points)
  const actionVerbRatio = metrics.bulletCount > 0 ? metrics.actionVerbCount / metrics.bulletCount : 0;
  score += actionVerbRatio * 20;

  const quantifiedRatio = metrics.bulletCount > 0 ? metrics.quantifiedBullets / metrics.bulletCount : 0;
  score += quantifiedRatio * 20;

  // Formatting (20 points)
  if (metrics.bulletCount >= 3) score += 5;
  if (metrics.longParagraphs === 0) score += 5;
  if (metrics.dateConsistency) score += 5;
  if (wordCount >= 300 && wordCount <= 600) score += 5;

  return Math.round(Math.min(100, score));
}
