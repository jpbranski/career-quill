import { NextRequest, NextResponse } from 'next/server';

interface RecaptchaResponse {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

export async function POST(request: NextRequest) {
  try {
    // Check if reCAPTCHA secret key is configured
    if (!process.env.RECAPTCHA_SECRET_KEY) {
      return NextResponse.json(
        { ok: false, error: 'reCAPTCHA not configured' },
        { status: 500 }
      );
    }

    // Parse request body
    const { recaptchaToken } = await request.json();

    if (!recaptchaToken || typeof recaptchaToken !== 'string') {
      return NextResponse.json(
        { ok: false, error: 'Invalid reCAPTCHA token' },
        { status: 400 }
      );
    }

    // Verify with Google reCAPTCHA API
    const verificationURL = 'https://www.google.com/recaptcha/api/siteverify';
    const verificationResponse = await fetch(verificationURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
    });

    const verificationData: RecaptchaResponse = await verificationResponse.json();

    // Check if verification was successful
    if (!verificationData.success) {
      console.error('reCAPTCHA verification failed:', verificationData['error-codes']);
      return NextResponse.json(
        { ok: false, error: 'Captcha verification failed' },
        { status: 400 }
      );
    }

    // Check the score (for reCAPTCHA v3, score should be >= 0.5)
    if (verificationData.score !== undefined && verificationData.score < 0.5) {
      console.warn('reCAPTCHA score too low:', verificationData.score);
      return NextResponse.json(
        { ok: false, error: 'Captcha score too low' },
        { status: 400 }
      );
    }

    // Verification successful
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Error verifying reCAPTCHA:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to verify captcha' },
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
