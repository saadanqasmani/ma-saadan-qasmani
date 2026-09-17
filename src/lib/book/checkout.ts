import "server-only";
import { siteUrl } from "@/lib/siteUrl";
import { highestBranch } from "@/content/site";
import type { Quote } from "@/lib/book/pricing";

/**
 * Paying for a pre-order, without this site ever touching a card.
 *
 * Stripe's own hosted page takes the card; we only ask Stripe to open one
 * and send the reader there. Nothing about a card, a bank or a billing
 * address passes through this server or is stored in our database, which is
 * the whole reason for doing it this way rather than with a form of our own.
 *
 * No key in the environment means no online payment: `checkoutIsConfigured`
 * is false, the button never renders, and the manual route stands.
 */

const API = "https://api.stripe.com/v1/checkout/sessions";

function key(): string | null {
  const k = process.env.STRIPE_SECRET_KEY?.trim();
  return k ? k : null;
}

export function checkoutIsConfigured(): boolean {
  return key() !== null;
}

export type CheckoutOrder = {
  id: string;
  email: string;
  fullName: string;
  country: string;
  city: string;
  address: string;
  phone: string;
};

export type CheckoutResult =
  | { ok: true; url: string; sessionId: string }
  | { ok: false; reason: "not-configured" | "refused"; detail: string };

export async function createCheckout(order: CheckoutOrder, quote: Quote): Promise<CheckoutResult> {
  const secret = key();
  if (!secret) return { ok: false, reason: "not-configured", detail: "STRIPE_SECRET_KEY is not set." };

  const cents = Math.round(quote.total * 100);
  const each = Math.round(cents / quote.quantity);
  // Stripe prices a line, not a basket. Where the total divides evenly into
  // copies the reader sees "3 × $13.50", which is what they expect; where it
  // does not, one line for the lot is honest and still adds up.
  const divides = each * quote.quantity === cents;

  const form = new URLSearchParams({
    mode: "payment",
    customer_email: order.email,
    success_url: `${siteUrl}/the-highest-branch?preorder=paid&session={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/the-highest-branch?preorder=cancelled#purchase`,
    "line_items[0][quantity]": divides ? String(quote.quantity) : "1",
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][unit_amount]": String(divides ? each : cents),
    "line_items[0][price_data][product_data][name]": divides
      ? `${highestBranch.title} — pre-order`
      : `${highestBranch.title} — pre-order (${quote.quantity} copies)`,
    "line_items[0][price_data][product_data][description]":
      `Ships on publication, ${highestBranch.releaseDate}. ${order.country}.`,
    "metadata[order_id]": order.id,
    "metadata[quantity]": String(quote.quantity),
    "metadata[promo]": quote.promoApplied ? "yes" : "no",
    "payment_intent_data[metadata][order_id]": order.id,
  });

  let res: Response;
  try {
    res = await fetch(API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form,
    });
  } catch (error) {
    return { ok: false, reason: "refused", detail: error instanceof Error ? error.message : String(error) };
  }

  const data = (await res.json().catch(() => null)) as
    | { id?: string; url?: string; error?: { message?: string } }
    | null;

  if (!res.ok || !data?.url || !data.id) {
    return {
      ok: false,
      reason: "refused",
      detail: data?.error?.message ?? `Stripe answered ${res.status}.`,
    };
  }

  return { ok: true, url: data.url, sessionId: data.id };
}
