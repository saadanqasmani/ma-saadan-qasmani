import { NextResponse } from "next/server";
import { z } from "zod";
import { quoteFor } from "@/lib/book/pricing";
import { checkoutIsConfigured } from "@/lib/book/checkout";

/**
 * What this many copies cost, with the code the reader typed.
 *
 * The rule lives here rather than in the page because a discount worked out
 * in the browser is a discount anyone can read out of the page source and a
 * price anyone can edit before it is sent. The page asks; the server says.
 */

const schema = z.object({
  quantity: z.coerce.number().int().min(1).max(50).optional(),
  promo: z.string().max(64).optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body ?? {});
  if (!parsed.success) {
    return NextResponse.json({ error: "Check the quantity and try again." }, { status: 400 });
  }

  const quote = quoteFor(parsed.data.quantity ?? 1, parsed.data.promo);
  // The code itself never travels back, only whether it worked.
  return NextResponse.json({
    quantity: quote.quantity,
    unit: quote.unit,
    subtotal: quote.subtotal,
    discount: quote.discount,
    total: quote.total,
    promoApplied: quote.promoApplied,
    promoRejected: quote.promoRejected,
    percentOff: quote.percentOff,
    canPayOnline: checkoutIsConfigured(),
  });
}
