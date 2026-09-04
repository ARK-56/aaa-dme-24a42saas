import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

interface VerificationPayload {
  name?: string;
  email?: string;
  code?: string;
}

export async function POST(req: Request) {
  let payload: VerificationPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload format" },
      { status: 400 }
    );
  }

  const { name, email, code } = payload;
  if (!email || !code) {
    return NextResponse.json(
      { error: "Missing required fields: email and code" },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "RESEND_API_KEY is not configured" },
      { status: 503 }
    );
  }

  const from = process.env.RESEND_FROM_EMAIL ?? "AAA DME <onboarding@resend.dev>";

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: "Verify your AAA DME Account",
        html: `<p>Dear ${name || "User"},</p>
<p>Your AAA DME account verification code is: <strong>${code}</strong>. This code expires in 10 minutes.</p>
<p>If you did not request this, you can safely ignore this email.</p>
<p>Best regards,<br>AAA DME Healthcare Team</p>`,
      }),
    });

    const text = await res.text();
    if (!res.ok) {
      let message = `Resend API returned status ${res.status}`;
      try {
        const parsed = JSON.parse(text);
        if (parsed?.message) message = parsed.message;
      } catch {
        // Non-JSON error body — keep the status-based message.
      }
      console.error("[Resend Error]", res.status, text);
      return NextResponse.json({ error: message }, { status: 502 });
    }

    let data: unknown = { rawResponse: text };
    try {
      data = JSON.parse(text);
    } catch {
      // Resend returned a non-JSON success body; pass it through as-is.
    }

    return NextResponse.json({
      success: true,
      message: "Verification email sent via Resend",
      data,
    });
  } catch (err) {
    console.error("[Resend Request Error]", err);
    const message = err instanceof Error ? err.message : "Failed to send email";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
