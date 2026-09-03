import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Payload = Record<string, unknown>;

function str(value: unknown, max = 4000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Payload;

  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: a filled hidden field means a bot. Answer 200 so it learns nothing.
  if (str(body.website)) {
    return NextResponse.json({ ok: true });
  }

  const enquiry = {
    name: str(body.name, 120),
    company: str(body.company, 160),
    email: str(body.email, 160),
    country: str(body.country, 80),
    category: str(body.category, 80),
    quantity: str(body.quantity, 120),
    message: str(body.message),
  };

  if (!enquiry.name || !enquiry.company || !enquiry.message) {
    return NextResponse.json(
      { ok: false, error: "Please complete the required fields." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(enquiry.email)) {
    return NextResponse.json(
      { ok: false, error: "That email address does not look right." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  // Without mail credentials the form still succeeds — the enquiry is logged so
  // nothing is lost while the mail provider is being set up.
  if (!apiKey || !to || !from) {
    console.info("[contact] enquiry received (mail delivery not configured)", enquiry);
    return NextResponse.json({ ok: true });
  }

  const lines = [
    `Name: ${enquiry.name}`,
    `Company: ${enquiry.company}`,
    `Email: ${enquiry.email}`,
    `Country: ${enquiry.country || "—"}`,
    `Category: ${enquiry.category || "—"}`,
    `Quantity: ${enquiry.quantity || "—"}`,
    "",
    enquiry.message,
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: enquiry.email,
        subject: `Sourcing enquiry — ${enquiry.company}`,
        text: lines,
      }),
    });

    if (!res.ok) {
      console.error("[contact] mail provider rejected the request", await res.text());
      return NextResponse.json(
        { ok: false, error: "We could not send that just now." },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("[contact] mail delivery failed", error);
    return NextResponse.json(
      { ok: false, error: "We could not send that just now." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
