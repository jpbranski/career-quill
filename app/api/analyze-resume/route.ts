import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Use the model from env or default to gpt-4o-mini
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
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

    // Prepare the prompt for AI analysis
    const prompt = `You are an expert resume reviewer and career coach. Analyze the following resume and provide constructive feedback.

Resume Text:
${resumeText}

Please provide:
1. A brief summary (2-3 sentences) of the resume's strengths and areas for improvement
2. 3-5 specific suggestions for improving bullet points (focus on action verbs, quantifiable metrics, and impact)
3. An improved version of the professional summary (if one exists in the resume)

Format your response as JSON with the following structure:
{
  "summary": "Your overall assessment...",
  "bulletSuggestions": ["Suggestion 1", "Suggestion 2", ...],
  "improvedSummary": "Your improved summary..." (or null if no summary exists in the resume)
}`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a professional resume reviewer with expertise in ATS optimization and career coaching. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
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
