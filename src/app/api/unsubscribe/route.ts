import { NextResponse } from "next/server";
import { unsubscribeTokenIsValid } from "@/lib/email/unsubscribe";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/siteUrl";

/**
 * The other end of the link in every letter.
 *
 * GET is what a person clicks: it does the job and shows one quiet page
 * saying so. POST is what a mail client sends when the reader presses its
 * own Unsubscribe button (RFC 8058), and it answers with nothing to show.
 *
 * An API route rather than a page so it sits outside the language layout:
 * an unsubscribe link should not depend on which site language a letter was
 * sent from.
 */

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function remove(email: string, token: string): Promise<"done" | "bad-link" | "not-connected"> {
  const address = email.trim().toLowerCase();
  if (!(await unsubscribeTokenIsValid(address, token))) return "bad-link";
  const db = getSupabaseServerClient();
  if (!db) return "not-connected";
  await db.from("subscribers").update({ status: "unsubscribed" }).eq("email", address);
  return "done";
}

function page(title: string, body: string): NextResponse {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;background:#f6f3ee;font:400 17px/1.65 Georgia,serif;color:#1b1a17;">
<div style="max-width:520px;margin:12vh auto;padding:36px 32px;background:#fffdf9;border:1px solid #e4ded3;">
<p style="margin:0 0 12px;font:400 11px/1 Helvetica,Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#9c3b1b;">saadanqasmani.com</p>
<h1 style="margin:0 0 16px;font:400 26px/1.25 Georgia,serif;">${escapeHtml(title)}</h1>
<p style="margin:0 0 22px;color:#3d3a34;">${body}</p>
<a href="${escapeHtml(siteUrl)}" style="font:400 12px/1 Helvetica,Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#9c3b1b;text-decoration:none;border-bottom:1px solid #9c3b1b;padding-bottom:3px;">Back to the site</a>
</div></body></html>`;
  return new NextResponse(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("e") ?? "";
  const token = url.searchParams.get("t") ?? "";
  const result = await remove(email, token);

  if (result === "done") {
    return page("You are off the list.", `No more letters will go to <strong>${escapeHtml(email.trim().toLowerCase())}</strong>. If that was a slip, leave the address on the site again and you are back on.`);
  }
  if (result === "bad-link") {
    return page("That link did not work.", "It may have been cut short by your mail client. Reply to any letter with the word <em>unsubscribe</em> and it will be done by hand.");
  }
  return page("Not right now.", "The list is not reachable at the moment. Reply to any letter with the word <em>unsubscribe</em> and it will be done by hand.");
}

/** One-click unsubscribe from the mail client itself. */
export async function POST(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("e") ?? "";
  const token = url.searchParams.get("t") ?? "";
  const result = await remove(email, token);
  return new NextResponse(null, { status: result === "done" ? 200 : result === "bad-link" ? 400 : 503 });
}
