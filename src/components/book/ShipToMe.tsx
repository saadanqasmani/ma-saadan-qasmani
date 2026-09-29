"use client";

import { useEffect, useRef, useState } from "react";
import { Label, TextInput, TextArea, FormNotice } from "@/components/forms/fields";
import type { Dictionary } from "@/content/i18n/en";

/**
 * For a reader Amazon will not reach.
 *
 * No price is quoted here on purpose. Postage to somewhere Amazon does not
 * go cannot be guessed from a form, and a figure offered now and corrected
 * later is worse than no figure: this takes the address and promises an
 * answer, which is a promise that can be kept.
 */
export function ShipToMe({
  copy,
  forms,
  locale,
}: {
  copy: Dictionary["novel"]["purchase"];
  forms: Dictionary["forms"];
  /** Carried into the request so the acknowledgement arrives in this language. */
  locale: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/print-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(data), locale }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError((json.error as string) ?? forms.somethingWrong);
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setError(forms.tryAgain);
      setStatus("error");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="t-label block text-start leading-7 text-ink-faint underline decoration-dotted underline-offset-4 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
      >
        {copy.notShipped}
      </button>

      <dialog
        ref={dialog}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === dialog.current) setOpen(false);
        }}
        className="egg-dialog w-[min(34rem,calc(100vw-2rem))] border border-ink/15 bg-canvas-light p-0 backdrop:bg-ink/50"
      >
        <div className="max-h-[85vh] overflow-y-auto p-6 sm:p-8">
          <h3 className="font-display text-2xl leading-tight">{copy.notShippedTitle}</h3>

          {status === "done" ? (
            <>
              <FormNotice tone="success">{copy.notShippedDone}</FormNotice>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="t-label mt-6 text-ink-faint transition-colors hover:text-ink"
              >
                {forms.close}
              </button>
            </>
          ) : (
            <form onSubmit={submit} noValidate={false}>
              <p className="mt-3 font-serif text-lg leading-relaxed text-ink-soft">
                {copy.notShippedBody}
              </p>
              <fieldset disabled={status === "sending"} className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="s2m-name" required>{forms.fullName}</Label>
                  <TextInput id="s2m-name" name="full_name" required autoComplete="name" />
                </div>
                <div>
                  <Label htmlFor="s2m-email" required>{forms.email}</Label>
                  <TextInput id="s2m-email" name="email" type="email" required autoComplete="email" />
                </div>
                <div>
                  <Label htmlFor="s2m-phone" required>{forms.phoneNumber}</Label>
                  <TextInput id="s2m-phone" name="phone" required autoComplete="tel" />
                </div>
                <div>
                  <Label htmlFor="s2m-country" required>{forms.country}</Label>
                  <TextInput id="s2m-country" name="country" required autoComplete="country-name" />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="s2m-address" required>{forms.shippingAddress}</Label>
                  <TextArea id="s2m-address" name="shipping_address" rows={2} required autoComplete="street-address" />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="s2m-message">{forms.optionalMessage}</Label>
                  <TextArea id="s2m-message" name="message" rows={2} />
                </div>
              </fieldset>
              {error && <FormNotice tone="error">{error}</FormNotice>}
              <div className="mt-7 flex items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="t-label group relative overflow-hidden bg-ink px-7 py-3.5 text-canvas-light disabled:opacity-50"
                >
                  <span className="absolute inset-0 -translate-y-full bg-ember transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
                  <span className="relative">{status === "sending" ? forms.sending : copy.send}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="t-label text-ink-faint transition-colors hover:text-ink"
                >
                  {forms.cancel}
                </button>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
