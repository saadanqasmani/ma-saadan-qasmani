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
};

export type SendResult = { ok: true; id: string | null } | { ok: false; reason: string };

/** False when no key is set, which is the normal state of a local checkout. */
export function mailIsConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

/**
 * Who the letter is from.
 *
 * The default sits on the `send.` subdomain, which is the one verified with
 * Resend. The apex is left to the mailbox that already lives there, so the
 * two cannot break each other's SPF.
 */
function fromAddress(): string {
  return process.env.MAIL_FROM || "Saadan Qasmani <hello@send.saadanqasmani.com>";
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
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, reason: "no-key" };

  const replyTo = replyToAddress();

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress(),
        to: [mail.to],
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
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
