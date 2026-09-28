import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { quoteFor, storedCode } from "@/lib/book/pricing";
import { recordAsMessage, recordOrder, REFUSAL_MEANS, type Recorded } from "@/lib/book/store";
import { confirmOrder, linesOf, localeOf } from "@/lib/book/confirm";

/**
 * A pre-order for Pakistan or Türkiye.
 *
 * The copies are put aside and settled by hand. The price is worked out here
 * from the quantity and the code, never read off the request, because a
 * total that arrives from a browser is a suggestion. No payment or banking
 * detail is collected or stored anywhere on this site.
 *
 * The order is written to the database, and if the database refuses it —
 * a migration nobody ran, a constraint from an older shape of the table, no
 * database configured at all — it is kept anyway: filed as a message, and
 * sent as two letters, one to the reader and one to Saadan marked as the
 * only copy. A reader standing there with their address typed in should not
 * be turned away because of a schema, and an order in two inboxes can be
 * typed into a table later. Only when none of that works do they see an
 * error.
 */

const schema = z.object({
  full_name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().min(1).max(50),
  country: z.enum(["Türkiye", "Pakistan"]),
  region: z.enum(["pk", "tr"]),
  city: z.string().min(1).max(200),
  shipping_address: z.string().min(1).max(2000),
  quantity: z.coerce.number().int().min(1).max(50),
  message: z.string().max(2000).optional(),
  promo: z.string().max(64).optional(),
  /** The language the reader was reading in, so the confirmation matches it. */
  locale: z.string().max(5).optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  const { promo, region, locale, ...order } = parsed.data;
  const quote = quoteFor(region, order.quantity, promo);

  const written: Recorded = supabase
    ? await recordOrder(supabase, order, {
        region,
        currency: quote.currency,
        unit_price_usd: quote.unit,
        shipping_amount: quote.shipping,
        quantity_priced: quote.quantity,
        promo_code: storedCode(quote),
        discount_usd: quote.discount,
        total_usd: quote.total,
        payment_status: "reserved",
      })
    : { ok: false, reason: "other", detail: "no database is configured" };

  if (!written.ok) {
    const why = REFUSAL_MEANS[written.reason];

    const filed = supabase
      ? await recordAsMessage(supabase, {
          name: order.full_name,
          email: order.email,
          subject: `PRE-ORDER not recorded — ${order.quantity} to ${order.city}, ${order.country}`,
          body: [
            `${order.quantity} cop${order.quantity === 1 ? "y" : "ies"} of The Highest Branch.`,
            `Quoted: ${quote.currency} ${quote.total}${quote.promoApplied ? " (code applied)" : ""}.`,
            `Phone: ${order.phone}`,
            `Address: ${order.shipping_address}, ${order.city}, ${order.country}`,
            order.message ? `Said: ${order.message}` : "",
            "",
            `The orders table refused this row: ${why}`,
          ]
            .filter(Boolean)
            .join("\n"),
        })
      : false;

    const sent = await confirmOrder({
      kind: "reserved",
      locale: localeOf(locale),
      id: null,
      name: order.full_name,
      email: order.email,
      country: order.country,
      city: order.city,
      address: order.shipping_address,
      quantity: order.quantity,
      lines: linesOf(quote),
      phone: order.phone,
      message: order.message,
      recorded: false,
      refusal: why,
    });

    if (filed || sent.alerted) {
      console.error(
        `[order] kept outside book_orders (${written.reason}): ${written.detail}. ` +
          `Filed as a message: ${filed}. Alert sent: ${sent.alerted}. ${why}`
      );
      return NextResponse.json({ ok: true, recorded: false });
    }

    console.error(`[order] LOST an order (${written.reason}): ${written.detail}. ${why}`);
    // No English sentence: the page has the reader's own words for this.
    return NextResponse.json({ code: "not-recorded" }, { status: 500 });
  }

  // The reader is told what they ordered before they close the tab and
  // forget what they typed, and Saadan is told he has one to answer.
  // Awaited rather than left to float: a serverless function that has
  // returned can be frozen mid-request, and a confirmation that only
  // sometimes arrives is worse than one that never does.
  await confirmOrder({
    kind: "reserved",
    locale: localeOf(locale),
    id: written.id,
    name: order.full_name,
    email: order.email,
    country: order.country,
    city: order.city,
    address: order.shipping_address,
    quantity: order.quantity,
    lines: linesOf(quote),
    phone: order.phone,
    message: order.message,
    degraded: written.degraded,
  });

  return NextResponse.json({ ok: true });
}
