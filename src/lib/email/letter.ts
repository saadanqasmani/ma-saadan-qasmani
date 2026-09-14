/**
 * A letter to the list.
 *
 * Two shapes, one template. A hand-written letter is the subject and some
 * paragraphs. A letter about a journal note carries the note's title, its
 * opening, a link to the rest, and the code that opens it, under whatever
 * paragraphs Saadan wrote above. Both are set in the same cream sheet as
 * the welcome letter, so the inbox recognises the sender by sight.
 *
 * English only. The journal is written in English, and a broadcast is one
 * letter to everyone, not six.
 */

import { highestBranch, social, type BlogPost } from "@/content/site";
import { unsubscribeUrl } from "@/lib/email/unsubscribe";
import { absoluteUrl } from "@/lib/i18n/metadata";
import { journalCode } from "@/lib/journalGate";
import { siteUrl } from "@/lib/siteUrl";

export type LetterInput = {
  subject: string;
  /** Paragraphs separated by blank lines. Plain text; no markup. */
  body: string;
  post?: BlogPost | null;
};

export type Letter = { subject: string; html: string; text: string; unsubscribeUrl: string };

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const serif = "Georgia, 'Times New Roman', serif";
const sans = "Helvetica, Arial, sans-serif";

function paragraphs(body: string): string[] {
  return body
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** A paragraph, with single line breaks kept as breaks. */
function para(text: string, style = `font:400 17px/1.65 ${serif};color:#1b1a17;`, margin = "0 0 18px"): string {
  return `<p style="margin:${margin};${style}">${escapeHtml(text).replace(/\n/g, "<br>")}</p>`;
}

/** The first two paragraphs of a note, enough to want the rest. */
function opening(post: BlogPost): string[] {
  const ps = paragraphs(post.body);
  return ps.slice(0, 2);
}

export async function letterEmail(input: LetterInput, to: string): Promise<Letter> {
  const leave = await unsubscribeUrl(to);
  const ps = paragraphs(input.body);
  const post = input.post ?? null;
  const journal = absoluteUrl("/journal");
  const noteUrl = post ? absoluteUrl(`/journal/${post.slug}`) : null;
  const code = journalCode();
  const rule = `<div style="height:1px;background:#e4ded3;margin:30px 0;"></div>`;
  const links = [
    social.find((s) => s.label === "Instagram")?.url ? `<a href="${escapeHtml(social.find((s) => s.label === "Instagram")!.url)}" style="color:#6b655c;text-decoration:none;border-bottom:1px solid #d8d1c5;">Instagram</a>` : null,
    social.find((s) => s.label === "LinkedIn")?.url ? `<a href="${escapeHtml(social.find((s) => s.label === "LinkedIn")!.url)}" style="color:#6b655c;text-decoration:none;border-bottom:1px solid #d8d1c5;">LinkedIn</a>` : null,
  ]
    .filter(Boolean)
    .join(`<span style="color:#c9c2b6;padding:0 10px;">&middot;</span>`);

  const noteBlock = post
    ? `<tr><td style="padding:0 32px;">${rule}</td></tr>
<tr><td style="padding:0 32px;">
<p style="margin:0 0 10px;font:400 11px/1 ${sans};letter-spacing:.18em;text-transform:uppercase;color:#9c3b1b;">${escapeHtml(post.category || "From the journal")}${post.date ? ` &middot; ${escapeHtml(post.date)}` : ""}</p>
<p style="margin:0 0 6px;font:400 26px/1.25 ${serif};color:#1b1a17;">${escapeHtml(post.title)}</p>
${post.subtitle ? para(post.subtitle, `font:italic 400 16px/1.5 ${serif};color:#6b655c;`, "0 0 18px") : ""}
${opening(post).map((p) => para(p)).join("")}
<p style="margin:0 0 22px;"><a href="${escapeHtml(noteUrl!)}" style="font:400 12px/1 ${sans};letter-spacing:.16em;text-transform:uppercase;color:#9c3b1b;text-decoration:none;border-bottom:1px solid #9c3b1b;padding-bottom:3px;">Read the whole note</a></p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 6px;"><tr><td style="border:1px solid #1b1a17;padding:12px 18px;">
<div style="font:400 11px/1 ${sans};letter-spacing:.16em;text-transform:uppercase;color:#6b655c;">Your code, if the page asks</div>
<div style="margin-top:8px;font:700 20px/1 ${sans};letter-spacing:.1em;color:#1b1a17;">${escapeHtml(code)}</div>
</td></tr></table>
</td></tr>`
    : "";

  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(input.subject)}</title></head>
<body style="margin:0;padding:0;background:#f6f3ee;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml((ps[0] ?? post?.excerpt ?? "").slice(0, 140))}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f3ee;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fffdf9;border:1px solid #e4ded3;">

<tr><td style="padding:36px 32px 0;">
${ps.length ? ps.map((p, i) => para(p, undefined, i === ps.length - 1 ? "0" : "0 0 18px")).join("") : ""}
</td></tr>

${noteBlock}

<tr><td style="padding:0 32px;">${rule}</td></tr>

<tr><td style="padding:0 32px 32px;">
<a href="${escapeHtml(siteUrl)}" style="text-decoration:none;"><img src="${escapeHtml(siteUrl)}/logo.png" alt="Saadan Qasmani" width="38" style="display:inline-block;width:38px;height:auto;border:0;"></a>
<p style="margin:10px 0 0;font:400 17px/1.4 ${serif};color:#1b1a17;">${escapeHtml(highestBranch.coverByline)}</p>
<p style="margin:4px 0 14px;font:400 13px/1.5 ${sans};color:#8a8378;"><a href="${escapeHtml(journal)}" style="color:#8a8378;text-decoration:none;border-bottom:1px solid #d8d1c5;">The journal</a></p>
<p style="margin:0;font:400 13px/1.5 ${sans};">${links}</p>
</td></tr>

<tr><td style="padding:0 32px 28px;">
<p style="margin:0;padding-top:18px;border-top:1px solid #e4ded3;font:400 12px/1.6 ${sans};color:#a09889;">You are getting this because you left an address at saadanqasmani.com. <a href="${escapeHtml(leave)}" style="color:#a09889;text-decoration:underline;">Unsubscribe with one click.</a></p>
</td></tr>

</table>
</td></tr></table>
</body></html>`;

  const text = [
    ...ps.flatMap((p) => [p, ""]),
    ...(post
      ? [
          "---",
          `${post.category || "From the journal"}${post.date ? ` · ${post.date}` : ""}`,
          post.title,
          ...(post.subtitle ? [post.subtitle] : []),
          "",
          ...opening(post).flatMap((p) => [p, ""]),
          `Read the whole note: ${noteUrl}`,
          `Your code, if the page asks: ${code}`,
          "",
        ]
      : []),
    "---",
    highestBranch.coverByline,
    siteUrl,
    "",
    `You are getting this because you left an address at saadanqasmani.com. Unsubscribe with one click: ${leave}`,
  ].join("\n");

  return { subject: input.subject, html, text, unsubscribeUrl: leave };
}
