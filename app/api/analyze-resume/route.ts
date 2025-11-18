import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import rateLimiter from '@/lib/rateLimiter';
import { getClientIp } from '@/lib/getClientIp';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AnalysisResult {
  summary: string;
  suggestions: string[];
  rewrittenSummary: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { resumeText, recaptchaToken } = body;

    // Validate input
    if (!resumeText || typeof resumeText !== 'string') {
      return NextResponse.json(
        { error: 'Resume text is required' },
        { status: 400 }
      );
    }

    // Check minimum length
    const cleanedText = resumeText.trim();
    if (cleanedText.length < 50) {
      return NextResponse.json(
        { error: 'Resume text is too short. Please provide at least 50 characters.' },
        { status: 400 }
      );
    }

    if (!recaptchaToken || typeof recaptchaToken !== 'string') {
      return NextResponse.json(
        { error: 'reCAPTCHA token is required' },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (!recaptchaSecret) {
      console.error('RECAPTCHA_SECRET_KEY is not configured');
      return NextResponse.json(
        { error: 'reCAPTCHA verification is not configured' },
        { status: 500 }
      );
    }

    const recaptchaResponse = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${recaptchaSecret}&response=${recaptchaToken}`,
      }
    );

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success || (recaptchaData.score && recaptchaData.score < 0.5)) {
      return NextResponse.json(
        { error: 'Failed reCAPTCHA verification. Please try again.' },
        { status: 403 }
      );
    }

    // Server-side rate limiting
    const clientIp = getClientIp(request);
    const rateLimitCheck = rateLimiter.check(clientIp);

    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          error: rateLimitCheck.error,
          retryAfter: rateLimitCheck.retryAfter,
        },
        { status: 429 }
      );
    }

    // Call OpenAI with GPT model from env
    const model = process.env.AI_MODEL || 'gpt-5-mini';

    const prompt = `You are an expert resume editor. Analyze the following resume text and produce three things:

1. A short 2–3 paragraph critique focusing on clarity, structure, impact, and readability.
2. A bullet list of the top 8–12 specific improvements the user should make.
3. A rewritten professional summary (2–3 sentences) that is clear, concise, and uses strong action verbs.

Do NOT invent work experience or details not found in the text. Do NOT comment on formatting beyond what is visible in the plain text. If information is missing, simply note that it appears incomplete.

Resume text:
${cleanedText}

Please respond in the following JSON format:
{
  "summary": "your 2-3 paragraph critique here",
  "suggestions": ["suggestion 1", "suggestion 2", ...],
  "rewrittenSummary": "your rewritten summary here"
}`;

    try {
      const completion = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume editor and career advisor. Provide constructive, actionable feedback.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      });

      const responseContent = completion.choices[0]?.message?.content;

      if (!responseContent) {
        throw new Error('No response from AI');
      }

      const analysisResult: AnalysisResult = JSON.parse(responseContent);

      // Validate the response structure
      if (!analysisResult.summary || !Array.isArray(analysisResult.suggestions) || !analysisResult.rewrittenSummary) {
        throw new Error('Invalid response format from AI');
      }

      return NextResponse.json({
        success: true,
        analysis: analysisResult,
      });

    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      return NextResponse.json(
        { error: 'AI request failed. Please try again later.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Analyze resume error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Reject non-POST requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
