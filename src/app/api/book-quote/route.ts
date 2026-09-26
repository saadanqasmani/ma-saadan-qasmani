import { NextResponse } from "next/server";
import { z } from "zod";
import { quoteFor } from "@/lib/book/pricing";
import { checkoutIsConfigured } from "@/lib/book/checkout";
import { REGIONS } from "@/lib/book/regions";

/**
 * What this many copies cost where the reader is, with the code they typed.
 *
 * The rule lives here rather than in the page because a discount worked out
 * in the browser is a discount anyone can read out of the page source and a
 * price anyone can edit before it is sent. The page asks; the server says.
 */

const schema = z.object({
  region: z.enum(["pk", "tr"]),
  quantity: z.coerce.number().int().min(1).max(50).optional(),
  promo: z.string().max(64).optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body ?? {});
  if (!parsed.success) {
    return NextResponse.json({ error: "Check the order and try again." }, { status: 400 });
  }

  const { region } = parsed.data;
  const quote = quoteFor(region, parsed.data.quantity ?? 1, parsed.data.promo);
  // The code itself never travels back, only whether it worked.
  return NextResponse.json({
    ...quote,
    // Only Türkiye settles online, and only once a provider is configured.
    canPayOnline: REGIONS[region].settle === "online" && checkoutIsConfigured(),
  });
}
