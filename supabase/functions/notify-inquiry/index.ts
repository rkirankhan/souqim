// Edge Function called by a Supabase database webhook on INSERT into
// service_inquiries. Sends a notification to the Nizvio team and an
// acknowledgement to the requester via Resend.
//
// Required secret: RESEND_API_KEY
// Optional env vars (with sensible defaults):
//   INQUIRY_TO_EMAIL    — where the team notification goes (default info@nizvio.com)
//   INQUIRY_FROM_EMAIL  — the From: address (default onboarding@resend.dev,
//                         works without domain verification)
//   SEND_ACK            — set to "false" to disable the requester acknowledgement.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface InquiryRecord {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  business_name: string | null;
  business_stage: string[];
  services_interested: string[];
  brief: string | null;
}

interface WebhookPayload {
  type: string;
  table: string;
  record: InquiryRecord;
  old_record: unknown;
}

const SERVICE_LABELS: Record<string, string> = {
  website: "Simple startup website",
  social: "Social media starter pack",
  listing: "Listing optimization",
  brand: "Brand starter (logo + colours)",
};

const STAGE_LABELS: Record<string, string> = {
  "women-led": "Women-led",
  "startup": "Startup",
  "home-based": "Home-based",
  "established": "Established",
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function pretty(values: string[], dict: Record<string, string>): string {
  if (values.length === 0) return "—";
  return values.map((v) => dict[v] ?? v).join(", ");
}

async function sendEmail(args: {
  apiKey: string;
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
}): Promise<Response> {
  return await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${args.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: args.from,
      to: [args.to],
      reply_to: args.replyTo,
      subject: args.subject,
      html: args.html,
    }),
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY is not set" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const toEmail = Deno.env.get("INQUIRY_TO_EMAIL") ?? "info@nizvio.com";
    const fromEmail =
      Deno.env.get("INQUIRY_FROM_EMAIL") ??
      "Nizvio <onboarding@resend.dev>";
    const sendAck = (Deno.env.get("SEND_ACK") ?? "true") !== "false";

    const payload = (await req.json()) as WebhookPayload;

    if (payload.type !== "INSERT" || payload.table !== "service_inquiries") {
      return new Response(
        JSON.stringify({ skipped: true, reason: "not an inquiry insert" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const r = payload.record;

    const teamHtml = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;color:#1f1f1f">
        <h2 style="font-size:20px;margin:0 0 16px 0;color:#C2410C">New service inquiry</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.5">
          <tr><td style="padding:8px 0;color:#6b6b6b;width:130px">Name</td><td style="padding:8px 0"><strong>${escapeHtml(r.name)}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#6b6b6b">Email</td><td style="padding:8px 0"><a href="mailto:${escapeHtml(r.email)}" style="color:#C2410C">${escapeHtml(r.email)}</a></td></tr>
          ${r.phone ? `<tr><td style="padding:8px 0;color:#6b6b6b">Phone</td><td style="padding:8px 0">${escapeHtml(r.phone)}</td></tr>` : ""}
          ${r.business_name ? `<tr><td style="padding:8px 0;color:#6b6b6b">Business</td><td style="padding:8px 0">${escapeHtml(r.business_name)}</td></tr>` : ""}
          <tr><td style="padding:8px 0;color:#6b6b6b">Stage</td><td style="padding:8px 0">${escapeHtml(pretty(r.business_stage ?? [], STAGE_LABELS))}</td></tr>
          <tr><td style="padding:8px 0;color:#6b6b6b">Services</td><td style="padding:8px 0">${escapeHtml(pretty(r.services_interested ?? [], SERVICE_LABELS))}</td></tr>
        </table>
        ${
          r.brief
            ? `<div style="margin-top:20px;padding:16px;background:#FAF6F1;border-left:3px solid #C2410C;border-radius:6px;white-space:pre-wrap;font-size:14px;line-height:1.55">${escapeHtml(r.brief)}</div>`
            : ""
        }
        <p style="font-size:12px;color:#8a8a8a;margin-top:24px">
          Reply to this email to write directly to the requester.
        </p>
      </div>
    `;

    const ackHtml = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;color:#1f1f1f">
        <h2 style="font-size:20px;margin:0 0 12px 0;color:#C2410C">Thanks ${escapeHtml(
          r.name.split(" ")[0] || r.name,
        )} — we got your request.</h2>
        <p style="font-size:15px;line-height:1.6;color:#3f3f3f">
          We'll read it properly and get back to you within one working day with a few quick questions and a fixed-price quote.
        </p>
        <p style="font-size:15px;line-height:1.6;color:#3f3f3f">
          In the meantime — anything to add or change? Just reply to this email.
        </p>
        <p style="font-size:14px;line-height:1.6;color:#6b6b6b;margin-top:24px">
          — The Nizvio team
        </p>
      </div>
    `;

    const teamRes = await sendEmail({
      apiKey,
      from: fromEmail,
      to: toEmail,
      replyTo: r.email,
      subject: `New inquiry from ${r.name}${r.business_name ? ` — ${r.business_name}` : ""}`,
      html: teamHtml,
    });

    let ackOk: boolean | "skipped" = "skipped";
    if (sendAck) {
      const ackRes = await sendEmail({
        apiKey,
        from: fromEmail,
        to: r.email,
        replyTo: toEmail,
        subject: "We got your request — Nizvio",
        html: ackHtml,
      });
      ackOk = ackRes.ok;
      if (!ackRes.ok) {
        console.error("Ack email failed:", await ackRes.text());
      }
    }

    if (!teamRes.ok) {
      const text = await teamRes.text();
      console.error("Team email failed:", text);
      return new Response(
        JSON.stringify({ error: "team email failed", detail: text }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ ok: true, team: true, ack: ackOk }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("notify-inquiry error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
