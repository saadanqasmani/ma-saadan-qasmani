import { NextResponse } from "next/server";
import { z } from "zod";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { subscribe } from "@/lib/subscribe";

const schema = z.object({
  email: z.string().email(),
  // Sent by the form so the welcome letter arrives in the language the
  // reader was reading. An old cached form that omits it still works.
  locale: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const locale = isLocale(parsed.data.locale) ? parsed.data.locale : defaultLocale;
  const result = await subscribe(parsed.data.email, locale);

  if (!result.ok) {
    return result.reason === "not-connected"
      ? NextResponse.json(
          { error: "The newsletter isn't connected yet. Please check back soon." },
          { status: 503 }
        )
      : NextResponse.json(
          // The reader is told nothing useful to an attacker; the detail is
          // already in the host's log, and the dashboard has a check that
          // reproduces the same write and names the cause.
          { error: "Something went wrong. Please try again." },
          { status: 500 }
        );
  }

  // What became of the letter travels back with the success. A reader who
  // is told "check your inbox" when nothing was sent goes on waiting.
  return NextResponse.json({ ok: true, welcomed: result.welcomed, outcome: result.outcome });
}
