import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = body.token || body.recaptchaToken;
    const action = body.action || "resume_verification";


    if (!token) {
      return NextResponse.json({ ok: false, error: "Missing token" }, { status: 400 });
    }

    if (
      !process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
      !process.env.RECAPTCHA_API_KEY ||
      !process.env.GCLOUD_PROJECT_ID
    ) {
      return NextResponse.json(
        { ok: false, error: "Missing reCAPTCHA environment variables" },
        { status: 500 }
      );
    }

    const verifyUrl = `https://recaptchaenterprise.googleapis.com/v1/projects/${process.env.GCLOUD_PROJECT_ID}/assessments?key=${process.env.RECAPTCHA_API_KEY}`;

    const payload = {
      event: {
        token,
        expectedAction: action ?? "resume_verification",
        siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
      },
    };

    const googleRes = await fetch(verifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await googleRes.json();

    const score = result?.riskAnalysis?.score ?? 0;

    return NextResponse.json({
      ok: score >= 0.5,
      score,
      reasons: result?.riskAnalysis?.reasons,
    });
  } catch (err) {
    console.error("reCAPTCHA verification error:", err);
    return NextResponse.json({ ok: false, error: "Verification failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
