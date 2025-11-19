import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { token, action } = await request.json();

    if (!token) {
      return NextResponse.json({ ok: false, error: "Missing token" }, { status: 400 });
    }

    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    const apiKey = process.env.RECAPTCHA_API_KEY;
    const projectId = process.env.GCLOUD_PROJECT_ID;

    if (!siteKey || !apiKey || !projectId) {
      console.error("Missing Env Vars: Check NEXT_PUBLIC_RECAPTCHA_SITE_KEY, RECAPTCHA_API_KEY, GCLOUD_PROJECT_ID");
      return NextResponse.json(
        { ok: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Construct the Enterprise URL
    const verifyUrl = `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${apiKey}`;

    const payload = {
      event: {
        token,
        expectedAction: action, // Ensure this matches what you sent from frontend
        siteKey,
      },
    };

    const googleRes = await fetch(verifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await googleRes.json();

    // Check for valid response structure
    if (!result.riskAnalysis) {
      console.error("Google Enterprise Error:", result);
      return NextResponse.json({ ok: false, error: "Verification failed upstream" });
    }

    const score = result.riskAnalysis.score;
    const reasons = result.riskAnalysis.reasons || [];
    
    console.log(`Captcha Score: ${score} | Action: ${action}`);

    // Threshold is usually 0.5 (0.0 is bot, 1.0 is human)
    if (score >= 0.5) {
        return NextResponse.json({ ok: true, score });
    } else {
        return NextResponse.json({ ok: false, score, reasons });
    }

  } catch (err) {
    console.error("reCAPTCHA API route error:", err);
    return NextResponse.json({ ok: false, error: "Internal Server Error" }, { status: 500 });
  }
}