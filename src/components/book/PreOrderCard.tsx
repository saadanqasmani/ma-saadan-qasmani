"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { highestBranch } from "@/content/site";
import { Label, TextInput, TextArea, Select, FormNotice } from "@/components/forms/fields";
import type { Dictionary } from "@/content/i18n/en";
import { fill } from "@/lib/i18n/dictionary";

/**
 * Taking the book in advance.
 *
 * The figures are the server's. The page shows a cover price because that is
 * printed on the thing, but every subtotal, discount and total comes back
 * from /api/book-quote, and the order is priced again when it is placed. A
 * discount worked out in a browser is a discount anyone can award themselves.
 *
 * Two ways out of the same form: pay now on Stripe's own page, which this
 * site never sees the card for, or reserve the copies and settle by hand.
 * The second is always there, so a missing key or a refused card costs a
 * reader the payment, not the order.
 */

type Quote = {
  /** Whether a card can be taken. Comes back with every quote, so a key
   *  added to the host after this page was built still switches it on. */
  canPayOnline?: boolean;
  quantity: number;
  unit: number;
  subtotal: number;
  discount: number;
  total: number;
  promoApplied: boolean;
  promoRejected: boolean;
  percentOff: number;
};

const money = (n: number) => `$${n.toFixed(2)}`;

function makeSchema(copy: Dictionary["forms"]) {
  return z.object({
    full_name: z.string().min(1, copy.required),
    email: z.string().email(copy.invalidEmail),
    phone: z.string().min(1, copy.required),
    country: z.enum(["Türkiye", "Pakistan"]),
    city: z.string().min(1, copy.required),
    shipping_address: z.string().min(1, copy.required),
    message: z.string().optional(),
  });
}
type FormValues = z.infer<ReturnType<typeof makeSchema>>;

/** What Stripe sent us back with, read off the address bar. */
function useReturnFlag(): string {
  return useSyncExternalStore(
    (fn) => {
      window.addEventListener("popstate", fn);
      return () => window.removeEventListener("popstate", fn);
    },
    () => new URLSearchParams(window.location.search).get("preorder") ?? "",
    () => ""
  );
}

export function PreOrderCard({
  copy,
  forms,
  canPayOnline,
}: {
  copy: Dictionary["novel"]["purchase"];
  forms: Dictionary["forms"];
  canPayOnline: boolean;
}) {
  const returned = useReturnFlag();
  const [quantity, setQuantity] = useState(1);
  const [promo, setPromo] = useState("");
  const [quote, setQuote] = useState<Quote>({
    quantity: 1,
    unit: highestBranch.priceUsd,
    subtotal: highestBranch.priceUsd,
    discount: 0,
    total: highestBranch.priceUsd,
    promoApplied: false,
    promoRejected: false,
    percentOff: 10,
  });
  const [checking, setChecking] = useState(false);
  // The page is prerendered, so the flag baked in at build time is only the
  // opening guess; the first quote off the server is the truth.
  const [payOnline, setPayOnline] = useState(canPayOnline);
  const [status, setStatus] = useState<"idle" | "paying" | "reserving" | "done" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const seq = useRef(0);

  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(makeSchema(forms)),
    defaultValues: { country: "Türkiye" },
  });

  /** Ask the server what this costs. Late answers to old questions are dropped. */
  const price = useCallback(async (n: number, code: string) => {
    const mine = ++seq.current;
    setChecking(true);
    try {
      const res = await fetch("/api/book-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: n, promo: code }),
      });
      const data = (await res.json()) as Quote;
      if (res.ok && mine === seq.current) {
        setQuote(data);
        if (typeof data.canPayOnline === "boolean") setPayOnline(data.canPayOnline);
      }
    } catch {
      /* the cover price already on screen is the honest fallback */
    } finally {
      if (mine === seq.current) setChecking(false);
    }
  }, []);

  // One quote on arrival: it settles the price and says whether a card can
  // be taken, without the reader having to touch anything first. Written out
  // rather than calling `price`, which flips the checking flag as it starts
  // and so would set state in the body of an effect.
  useEffect(() => {
    const stop = new AbortController();
    fetch("/api/book-quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: 1 }),
      signal: stop.signal,
    })
      .then((res) => (res.ok ? (res.json() as Promise<Quote>) : null))
      .then((data) => {
        if (!data || seq.current !== 0) return;
        setQuote(data);
        if (typeof data.canPayOnline === "boolean") setPayOnline(data.canPayOnline);
      })
      .catch(() => {
        /* the cover price already on screen is the honest fallback */
      });
    return () => stop.abort();
  }, []);

  function setCopies(n: number) {
    const next = Math.min(50, Math.max(1, n));
    setQuantity(next);
    void price(next, quote.promoApplied ? promo : "");
  }

  async function send(mode: "card" | "reserve") {
    const ok = await trigger();
    if (!ok) return;
    const values = getValues();
    setStatus(mode === "card" ? "paying" : "reserving");
    setServerError(null);
    const payload = { ...values, quantity, promo: promo.trim() || undefined };

    try {
      const res = await fetch(mode === "card" ? "/api/book-checkout" : "/api/book-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (mode === "card" && res.ok && data.url) {
        window.location.assign(data.url as string);
        return;
      }
      if (!res.ok) {
        setServerError((data.error as string) ?? forms.somethingWrong);
        // A card that could not be taken still leaves a real pre-order behind.
        setStatus(data.recorded ? "done" : "error");
        return;
      }
      setStatus("done");
    } catch {
      setServerError(forms.tryAgain);
      setStatus("error");
    }
  }

  if (status === "done" || returned === "paid") {
    return (
      <div className="pop-card p-8 sm:p-10">
        <p className="eyebrow text-ember">{copy.preOrderEyebrow}</p>
        <h3 className="mt-4 font-display text-3xl leading-tight">
          {returned === "paid" ? copy.paidTitle : copy.reservedTitle}
        </h3>
        <p className="mt-4 font-serif text-lg leading-relaxed text-ink-soft">
          {returned === "paid" ? copy.paidBody : copy.reservedBody}
        </p>
        {serverError && <p className="mt-5 text-sm text-ink-faint">{serverError}</p>}
      </div>
    );
  }

  const busy = status === "paying" || status === "reserving";

  return (
    <div className="pop-card p-7 sm:p-10">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="eyebrow text-ember">{copy.preOrderEyebrow}</p>
        <p className="t-label text-ink-faint">{fill(copy.shipsOn, { date: highestBranch.releaseDate })}</p>
      </div>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <h3 className="font-display text-3xl leading-none sm:text-4xl">{highestBranch.title}</h3>
        <p className="flex items-baseline gap-2">
          <span className="tnum font-display text-4xl leading-none">{money(quote.unit)}</span>
          <span className="t-label text-ink-faint">{copy.perCopy}</span>
        </p>
      </div>
      <p className="mt-4 max-w-md font-serif text-lg leading-relaxed text-ink-soft">{copy.encourage}</p>

      {returned === "cancelled" && (
        <p className="mt-6 border-s-2 border-ember bg-canvas-light px-4 py-3 text-sm text-ink-soft">
          {copy.cancelledBody}
        </p>
      )}

      {/* the counter and the code */}
      <div className="mt-8 grid gap-6 border-t border-line pt-7 sm:grid-cols-2">
        <div>
          <span className="t-label mb-2 block font-medium text-ink-faint">{forms.quantity}</span>
          <div className="inline-flex items-stretch border border-line">
            <button
              type="button"
              onClick={() => setCopies(quantity - 1)}
              disabled={quantity <= 1}
              aria-label={copy.fewer}
              className="px-4 py-2 text-lg leading-none text-ink transition-colors hover:bg-canvas disabled:opacity-30"
            >
              −
            </button>
            <span className="tnum grid w-14 place-items-center border-x border-line text-lg">{quantity}</span>
            <button
              type="button"
              onClick={() => setCopies(quantity + 1)}
              disabled={quantity >= 50}
              aria-label={copy.more}
              className="px-4 py-2 text-lg leading-none text-ink transition-colors hover:bg-canvas disabled:opacity-30"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <Label htmlFor="promo">{copy.promoLabel}</Label>
          <div className="flex items-end gap-3">
            <TextInput
              id="promo"
              value={promo}
              autoComplete="off"
              spellCheck={false}
              placeholder={copy.promoPlaceholder}
              onChange={(e) => setPromo(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void price(quantity, promo);
                }
              }}
              className="uppercase"
            />
            <button
              type="button"
              onClick={() => void price(quantity, promo)}
              disabled={!promo.trim() || checking}
              className="t-label shrink-0 border border-ink px-4 py-2.5 transition-colors hover:bg-ink hover:text-canvas-light disabled:opacity-30"
            >
              {copy.apply}
            </button>
          </div>
          {quote.promoApplied && (
            <p className="mt-2 text-sm text-verdant">
              {fill(copy.promoOk, { percent: String(quote.percentOff) })}
            </p>
          )}
          {quote.promoRejected && <p className="mt-2 text-sm text-ember">{copy.promoBad}</p>}
        </div>
      </div>

      {/* what it comes to */}
      <dl className="mt-7 border-t border-line pt-6 text-base">
        <div className="flex items-baseline justify-between py-1">
          <dt className="text-ink-soft">
            {fill(copy.subtotalLine, { n: String(quantity), each: money(quote.unit) })}
          </dt>
          <dd className="tnum">{money(quote.subtotal)}</dd>
        </div>
        {quote.discount > 0 && (
          <div className="flex items-baseline justify-between py-1 text-verdant">
            <dt>{fill(copy.discountLine, { percent: String(quote.percentOff) })}</dt>
            <dd className="tnum">−{money(quote.discount)}</dd>
          </div>
        )}
        <div className="mt-3 flex items-baseline justify-between border-t border-ink/15 pt-3">
          <dt className="t-label font-medium">{copy.total}</dt>
          <dd className="tnum font-display text-3xl leading-none">{money(quote.total)}</dd>
        </div>
      </dl>

      {/* who it goes to */}
      <form onSubmit={handleSubmit(() => void send(payOnline ? "card" : "reserve"))} noValidate>
        <fieldset disabled={busy} className="mt-8 border-t border-line pt-7">
          <legend className="sr-only">{copy.yourDetails}</legend>
          <p className="t-label mb-5 font-medium text-ink-faint">{copy.yourDetails}</p>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="po-name" required>{forms.fullName}</Label>
              <TextInput id="po-name" autoComplete="name" {...register("full_name")} />
              {errors.full_name && <FormNotice tone="error">{errors.full_name.message}</FormNotice>}
            </div>
            <div>
              <Label htmlFor="po-email" required>{forms.email}</Label>
              <TextInput id="po-email" type="email" autoComplete="email" {...register("email")} />
              {errors.email && <FormNotice tone="error">{errors.email.message}</FormNotice>}
            </div>
            <div>
              <Label htmlFor="po-phone" required>{forms.phone}</Label>
              <TextInput id="po-phone" autoComplete="tel" {...register("phone")} />
              {errors.phone && <FormNotice tone="error">{errors.phone.message}</FormNotice>}
            </div>
            <div>
              <Label htmlFor="po-country" required>{forms.country}</Label>
              <Select id="po-country" {...register("country")}>
                <option value="Türkiye">Türkiye</option>
                <option value="Pakistan">Pakistan</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="po-city" required>{forms.city}</Label>
              <TextInput id="po-city" autoComplete="address-level2" {...register("city")} />
              {errors.city && <FormNotice tone="error">{errors.city.message}</FormNotice>}
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="po-address" required>{forms.shippingAddress}</Label>
              <TextArea id="po-address" rows={2} autoComplete="street-address" {...register("shipping_address")} />
              {errors.shipping_address && (
                <FormNotice tone="error">{errors.shipping_address.message}</FormNotice>
              )}
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="po-message">{forms.optionalMessage}</Label>
              <TextArea id="po-message" rows={2} {...register("message")} />
            </div>
          </div>

          <div className="mt-9 flex flex-col gap-4">
            {payOnline ? (
              <>
                <button
                  type="submit"
                  className="t-label group relative overflow-hidden bg-ink px-8 py-4 text-canvas-light transition-opacity disabled:opacity-50"
                >
                  <span className="absolute inset-0 -translate-y-full bg-ember transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                  <span className="relative">
                    {status === "paying"
                      ? forms.sending
                      : fill(copy.payByCard, { total: money(quote.total) })}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => void send("reserve")}
                  className="t-label text-ink-faint underline-offset-4 transition-colors hover:text-ink hover:underline"
                >
                  {status === "reserving" ? forms.sending : copy.reserveInstead}
                </button>
                <p className="text-sm leading-relaxed text-ink-faint">{copy.payNote}</p>
              </>
            ) : (
              <>
                <button
                  type="submit"
                  className="t-label group relative overflow-hidden bg-ink px-8 py-4 text-canvas-light transition-opacity disabled:opacity-50"
                >
                  <span className="absolute inset-0 -translate-y-full bg-ember transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                  <span className="relative">{busy ? forms.sending : copy.reserve}</span>
                </button>
                <p className="text-sm leading-relaxed text-ink-faint">{copy.reserveNote}</p>
              </>
            )}
            {serverError && <FormNotice tone="error">{serverError}</FormNotice>}
          </div>
        </fieldset>
      </form>
    </div>
  );
}
