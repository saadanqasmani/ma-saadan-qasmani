/**
 * Outbound mail, over Resend's HTTP API.
 *
 * No SDK. One POST with a bearer token is the whole of it, and a dependency
 * that does only that is a dependency to keep updated for no reason.
 *
 * Nothing here throws. Mail is never the reason a form fails: a reader who
 * subscribed is subscribed whether or not the welcome note got out, so every
 * failure comes back as a value the caller can log and step past.
 */

const ENDPOINT = "https://api.resend.com/emails";

/** Long enough for a slow API, short enough that a form still feels quick. */
const TIMEOUT_MS = 8000;

export type Mail = {
  to: string;
  subject: string;
  html: string;
  text: string;
  /**
   * The one-click way out, per recipient. Sent as the List-Unsubscribe
   * headers mail clients read, so Gmail and the rest can show their own
   * Unsubscribe button next to the sender's name.
   */
  unsubscribeUrl?: string;
};

export type SendResult = { ok: true; id: string | null } | { ok: false; reason: string };

/** The JSON Resend wants for one message. */
function payload(mail: Mail) {
  const replyTo = replyToAddress();
  return {
    from: fromAddress(),
    to: [mail.to],
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    ...(replyTo ? { reply_to: replyTo } : {}),
    ...(mail.unsubscribeUrl
      ? {
          headers: {
            "List-Unsubscribe": `<${mail.unsubscribeUrl}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
        }
      : {}),
  };
}

/**
 * The key, without the whitespace a paste can carry. A trailing newline in
 * the hosting dashboard is invisible there and produces an Authorization
 * header the API rejects, which looks exactly like a wrong key.
 */
function apiKey(): string {
  return (process.env.RESEND_API_KEY ?? "").trim();
}

/**
 * What the key looks like, without being the key.
 *
 * A Resend key starts "re_" and is short. A Supabase key starts "eyJ" and
 * runs to hundreds of characters. Somebody who pasted the wrong value into
 * the box can see that at a glance here, and nothing secret is printed.
 */
export function keyShape(): string {
  const key = apiKey();
  if (!key) return "not set";
  const head = key.slice(0, 3);
  const raw = process.env.RESEND_API_KEY ?? "";
  const padded = raw !== raw.trim() ? ", and had spaces around it, which are now ignored" : "";
  return `starts "${head}", ${key.length} characters${padded}`;
}

/** False when no key is set, which is the normal state of a local checkout. */
export function mailIsConfigured(): boolean {
  return Boolean(apiKey());
}

/**
 * Who the letter is from.
 *
 * The default sits on the `send.` subdomain, which is the one verified with
 * Resend. The apex is left to the mailbox that already lives there, so the
 * two cannot break each other's SPF.
 */
export function fromAddress(): string {
  return process.env.MAIL_FROM || "Saadan Qasmani <hello@send.saadanqasmani.com>";
}

/** The bare domain a letter would be sent from, for checking against Resend. */
export function fromDomain(): string {
  const match = fromAddress().match(/<([^>]+)>/);
  const address = (match ? match[1] : fromAddress()).trim();
  return address.split("@")[1]?.toLowerCase() ?? "";
}

/**
 * Where a reply should land: a real mailbox someone reads, not the sending
 * subdomain, which nothing collects. Omitted when unset rather than guessed.
 */
function replyToAddress(): string | undefined {
  const value = process.env.MAIL_REPLY_TO?.trim();
  return value || undefined;
}

export async function sendMail(mail: Mail): Promise<SendResult> {
  const key = apiKey();
  if (!key) return { ok: false, reason: "no-key" };

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload(mail)),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });

    if (!res.ok) {
      // The body carries Resend's own explanation. Read it, but never let a
      // malformed one turn a bad response into a thrown error.
      const detail = await res.text().catch(() => "");
      return { ok: false, reason: `http-${res.status} ${detail.slice(0, 200)}`.trim() };
    }

    const data: unknown = await res.json().catch(() => null);
    const id =
      data && typeof data === "object" && "id" in data && typeof data.id === "string"
        ? data.id
        : null;
    return { ok: true, id };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.name : "unknown" };
  }
}

/** Resend takes up to this many messages in one call. */
const BATCH = 100;

export type BatchResult = { sent: number; failed: number; reasons: string[] };

/**
 * The same letter to many addresses, each with its own unsubscribe link.
 *
 * A hundred at a time, one call per hundred, in order. A failed call fails
 * only its hundred: the count that went out and the count that did not both
 * come back, so the record of the letter is honest about what happened.
 */
export async function sendMany(mails: Mail[]): Promise<BatchResult> {
  const key = apiKey();
  if (!key) return { sent: 0, failed: mails.length, reasons: ["no-key"] };

  const result: BatchResult = { sent: 0, failed: 0, reasons: [] };
  for (let i = 0; i < mails.length; i += BATCH) {
    const slice = mails.slice(i, i + BATCH);
    try {
      const res = await fetch(`${ENDPOINT}/batch`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(slice.map(payload)),
        signal: AbortSignal.timeout(TIMEOUT_MS * 2),
        cache: "no-store",
      });
      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        result.failed += slice.length;
        result.reasons.push(`http-${res.status} ${detail.slice(0, 200)}`.trim());
        continue;
      }
      result.sent += slice.length;
    } catch (error) {
      result.failed += slice.length;
      result.reasons.push(error instanceof Error ? error.name : "unknown");
    }
  }
  return result;
}

/* ---- is Resend going to take a letter from us? ------------------------ */

/**
 * Three answers, not two. Some things can be established from here, some
 * cannot, and reporting "cannot tell" as a failure sends someone off to fix
 * what was never broken.
 */
export type MailCheck = { state: "ok" | "bad" | "unknown"; detail: string };

/**
 * Asks Resend, rather than assuming.
 *
 * The domains endpoint is the one that can say whether the sending domain
 * is verified, but a key created with sending access only is forbidden to
 * read it and Resend answers 401. That is a healthy key doing exactly what
 * it should, so it must not be reported as a bad one: the only honest
 * answer then is that the domain cannot be checked from here, and that
 * sending a copy is the way to find out.
 */
export async function checkResend(): Promise<MailCheck> {
  const key = apiKey();
  if (!key) return { state: "bad", detail: "RESEND_API_KEY is not set, so nothing can be sent." };

  const domain = fromDomain();

  try {
    const res = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });

    if (res.status === 401 || res.status === 403) {
      const body = await res.text().catch(() => "");
      // Resend names this one: the key is valid, and allowed to send only.
      if (/restricted/i.test(body)) {
        return {
          state: "unknown",
          detail: `The key is valid and restricted to sending, which is the safer kind, so whether ${domain} is verified cannot be read from here. Press "Send me a copy" below: that is the real test.`,
        };
      }
      const said = body.replace(/\s+/g, " ").slice(0, 200) || "(no reason given)";
      return {
        state: "bad",
        detail: `Resend refused the key with ${res.status}. It said: ${said} The key here ${keyShape()}.`,
      };
    }
    if (!res.ok) {
      return { state: "unknown", detail: `Resend answered ${res.status}, so nothing could be established from here.` };
    }

    const body = (await res.json().catch(() => null)) as { data?: { name?: string; status?: string }[] } | null;
    const domains = body?.data ?? [];
    const mine = domains.find((d) => d.name?.toLowerCase() === domain);

    if (!mine) {
      const known = domains.map((d) => d.name).filter(Boolean).join(", ") || "none";
      return {
        state: "bad",
        detail: `Letters are sent from ${domain}, which is not a domain on this Resend account (it has: ${known}). Either add it there or set MAIL_FROM to an address on one of those.`,
      };
    }
    if (mine.status !== "verified") {
      return { state: "bad", detail: `${domain} is on the account but its status is "${mine.status}", not verified. Finish its DNS records in Resend.` };
    }
    return { state: "ok", detail: `${domain} is verified, and the key works.` };
  } catch (error) {
    return { state: "unknown", detail: `Could not reach Resend: ${error instanceof Error ? error.name : "unknown"}` };
  }
}
