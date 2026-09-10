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
          { error: "Something went wrong. Please try again." },
          { status: 500 }
        );
  }

  return NextResponse.json({ ok: true });
}
