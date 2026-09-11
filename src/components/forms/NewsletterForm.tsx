"use client";

import { useId, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { Dictionary } from "@/content/i18n/en";
import { en } from "@/content/i18n/en";

/**
 * That this browser has subscribed, remembered locally.
 *
 * Only the pop-up reads it, to decide whether to ask again or simply
 * remind. It is a convenience, not a claim: the list itself lives in the
 * database, and clearing it only means being asked once more.
 */
const SUBSCRIBED = "thb-subscribed";

export function markSubscribed() {
  try {
    window.localStorage.setItem(SUBSCRIBED, "1");
  } catch {
    // Storage blocked. They will be asked again, which is the safe way to
    // be wrong about this.
  }
}

export function hasSubscribed(): boolean {
  try {
    return window.localStorage.getItem(SUBSCRIBED) === "1";
  } catch {
    return false;
  }
}

export function NewsletterForm({
  copy = en.newsletter,
  /** Set where the form sits on a dark ground, as it does in the pop-up. */
  tone = "ink",
}: {
  copy?: Dictionary["newsletter"];
  tone?: "ink" | "light";
}) {
  // Unique per instance: the footer and the pop-up can both be mounted, and
  // two inputs sharing an id would send every label to the first one.
  const id = useId();
  // Sent along so the welcome letter arrives in the language on screen.
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? copy.failed);
        setStatus("error");
        return;
      }
      markSubscribed();
      setStatus("done");
    } catch {
      setError(copy.failed);
      setStatus("error");
    }
  }

  const light = tone === "light";

  if (status === "done") {
    return (
      <p className={`font-serif text-xl italic ${light ? "text-canvas-light" : "text-verdant"}`}>
        {copy.done}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      {/* One row on a wide screen, two on a phone.
          Side by side, a long button label leaves the address field a few
          characters wide, and a reader cannot see what they are typing. */}
      <div
        className={`flex flex-col gap-3 transition-colors sm:flex-row sm:items-end sm:gap-4 sm:border-b sm:pb-2 ${
          light
            ? "sm:border-canvas-light/50 sm:focus-within:border-canvas-light"
            : "sm:border-ink sm:focus-within:border-ember"
        }`}
      >
        <div
          className={`min-w-0 flex-1 border-b pb-2 transition-colors sm:border-b-0 sm:pb-0 ${
            light
              ? "border-canvas-light/50 focus-within:border-canvas-light"
              : "border-ink focus-within:border-ember"
          }`}
        >
          <label htmlFor={id} className="sr-only">
            {copy.emailLabel}
          </label>
          <input
            id={id}
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder={copy.placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full bg-transparent py-1 text-base focus:outline-none ${
              light
                ? "text-canvas-light placeholder:text-canvas-light/50"
                : "text-ink placeholder:text-ink-faint"
            }`}
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className={`t-label group inline-flex shrink-0 items-center self-start py-1 transition-colors disabled:opacity-50 sm:self-end ${
            light ? "text-canvas-light hover:text-ember-light" : "text-ink hover:text-ember"
          }`}
        >
          {status === "loading" ? copy.sending : copy.subscribe}
          <span className="ms-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>
      {error && (
        <p className={`mt-2 text-sm ${light ? "text-ember-light" : "text-ember"}`}>{error}</p>
      )}
    </form>
  );
}
