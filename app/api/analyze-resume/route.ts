import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import rateLimiter from '@/lib/rateLimiter';
import { getClientIp } from '@/lib/getClientIp';

// Use the AI_MODEL from env or default to gpt-5-mini
const MODEL = process.env.AI_MODEL || 'gpt-5-mini';

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Apply server-side rate limiting
    const clientIp = getClientIp(request);
    const rateLimitCheck = rateLimiter.check(clientIp);

    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { error: rateLimitCheck.error || 'Rate limit exceeded' },
        {
          status: 429,
          headers: rateLimitCheck.retryAfter
            ? { 'Retry-After': rateLimitCheck.retryAfter.toString() }
            : {}
        }
      );
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Parse request body
    const { resumeText } = await request.json();

    if (!resumeText || typeof resumeText !== 'string') {
      return NextResponse.json(
        { error: 'Invalid resume text provided' },
        { status: 400 }
      );
    }

    // Prepare the prompt for structured AI analysis
    const prompt = `You are an expert resume reviewer and career coach with deep knowledge of ATS optimization, industry best practices, and compelling professional narratives. Analyze the following resume and provide actionable, specific feedback.

Resume Text:
${resumeText}

Please provide:
1. A detailed critique (2-3 paragraphs) covering:
   - Overall strengths and unique selling points
   - Key weaknesses and areas for improvement
   - ATS compatibility and keyword optimization
   - Structure, formatting, and readability

2. Specific improvement suggestions (8-12 actionable bullet points) focusing on:
   - Strengthening bullet points with action verbs and quantifiable metrics
   - Highlighting impact and achievements over responsibilities
   - Improving keyword density for ATS
   - Enhancing clarity and professional tone
   - Tailoring content to target roles

3. An improved version of the professional summary (if one exists) that:
   - Captures the candidate's unique value proposition
   - Uses strong, industry-relevant keywords
   - Demonstrates measurable achievements
   - Maintains concise, compelling language

Format your response as JSON with this exact structure:
{
  "summary": "Your detailed 2-3 paragraph critique...",
  "bulletSuggestions": ["Specific suggestion 1", "Specific suggestion 2", ...] (8-12 items),
  "improvedSummary": "Your rewritten professional summary..." (or null if no summary exists in the resume)
}`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a professional resume reviewer with expertise in ATS optimization, career coaching, and professional branding. Always respond with valid JSON that provides specific, actionable feedback.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    });

    // Extract the response
    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response
    const feedback = JSON.parse(aiResponse);

    // Validate the response structure
    if (!feedback.summary || !Array.isArray(feedback.bulletSuggestions)) {
      throw new Error('Invalid AI response format');
    }

    return NextResponse.json(feedback);
  } catch (error: any) {
    console.error('Error in analyze-resume API:', error);

    // Handle specific OpenAI errors
    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'AI service quota exceeded. Please try again later.' },
        { status: 503 }
      );
    }

    if (error.code === 'invalid_api_key') {
      return NextResponse.json(
        { error: 'AI service configuration error' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to analyze resume. Please try again.' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
